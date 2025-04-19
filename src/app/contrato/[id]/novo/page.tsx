'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProjectForm from '@/components/ProjectForm';
import Stepper from '@/components/Stepper';

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
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Sprint',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ]}
              currentStep={1}
            />
          </div>

          <div className="mt-8">
            <ProjectForm contractId={contractId} />
          </div>
        </div>
      </main>
    </div>
  );
}
