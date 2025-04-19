'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProjectForm from '@/components/ProjectForm';
import { useParams } from 'next/navigation';

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
          <ProjectForm contractId={contractId} />
        </div>
      </main>
    </div>
  );
}
