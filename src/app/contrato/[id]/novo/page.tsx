'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar';
import ProjectForm from '@/components/ProjectForm';
import Stepper from '@/components/Stepper';
import FormContainer from '@/components/FormContainer';

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const contractId = params.id as string;

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
              steps={[
                {
                  title: 'Projeto',
                  icon: <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                },
                {
                  title: 'Sprint',
                  icon: <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                }
              ]}
              currentStep={1}
            />
          </div>

          <div className="mt-8">
            <FormContainer
              title="Dados do Projeto"
            >
              <div className="border-b border-gray-300 mb-6"></div>
              <ProjectForm contractId={contractId} />
            </FormContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
