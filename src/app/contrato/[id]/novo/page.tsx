'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar';
import ProjectForm from '@/components/ProjectForm';
import Stepper from '@/components/Stepper';
import FormContainer from '@/components/FormContainer';
import SprintForm from '@/components/SprintForm';

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  const handleProjectSaved = (id: string) => {
    setProjectId(id);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const steps = [
    {
      title: 'Projeto'
    },
    {
      title: 'Sprint'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">Cadastro Projeto</h1>
            <p className="mt-4 text-gray-600">Cadastre seu projeto aqui para iniciar o gerenciamento e acompanhamento detalhado das suas atividades e recursos.</p>
          </div>
          
          <div className="mt-8">
            <Stepper
              steps={steps}
              currentStep={currentStep}
            />
          </div>

          <div className="mt-8">
            <FormContainer
              title={currentStep === 1 ? "Dados do Projeto" : "Dados da Sprint"}
            >
              <div className="border-b border-gray-300 mb-6"></div>
              {currentStep === 1 ? (
              <ProjectForm 
                contractId={contractId} 
                onProjectSaved={handleProjectSaved}
              />
            ) : (
              <SprintForm 
                projectId={projectId!} 
                onBack={handleBack}
                onSprintSaved={() => router.push(`/contrato/${contractId}`)}
              />
            )}
            </FormContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
