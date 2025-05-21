'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function ProjectDetailsPage() {
  const { id: contractId, projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, 'projetos', projectId as string);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          setProject(projectDoc.data());
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Carregando projeto...</h1>
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Projeto não encontrado</h1>
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">Visualizar Projeto</h1>
            <p className="mt-4 text-gray-600">Visualize os detalhes do seu projeto aqui para obter uma visão completa do progresso, recursos e próximos passos.</p>
          </div>
        </div>
        <div className="flex justify-end w-full mb-8">
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded shadow font-semibold hover:bg-[var(--primary-dark)] transition-colors whitespace-nowrap">
              Cadastro de Sprint
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Dados do Projeto</h2>
              <button
                onClick={() => {
                  // TODO: Implement edit functionality
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Editar dados do projeto"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="border-b border-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2">
                {project.title || project.titulo || 'Xxxxxxxxxxxx'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center">
                {project.startDate || project.dataInicio || 'xx/xx/xxxx'}
                <FontAwesomeIcon icon={faCalendar} className="ml-2 text-gray-400" />
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center">
                {project.endDate || project.dataFim || 'xx/xx/xxxx'}
                <FontAwesomeIcon icon={faCalendar} className="ml-2 text-gray-400" />
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2">
                {project.cliente || 'Xxxxxxxxxxxx'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2">
                {project.status || project.situacao || 'Xxxxxxxxxxxx'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Atual</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2">
                {project.sprintAtual || 'Xxxxxxxxxxxx'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário Daily</label>
              <p className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2">
                {project.dailyTime || project.horarioDaily || 'Xxxxxxxxxxxx'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
