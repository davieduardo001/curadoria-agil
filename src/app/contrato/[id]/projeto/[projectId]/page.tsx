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
  const [contratoNome, setContratoNome] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectAndContrato = async () => {
      try {
        const projectRef = doc(db, 'projetos', projectId as string);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          setProject(projectData);

          // Handle parent as string path or Firestore DocumentReference
          const parentField = projectData.parent;
          console.log('LOG LOG LOG -> parentField', parentField);

          if (typeof parentField === 'string' && parentField.startsWith('/contratos/')) {
            // If parent is a path string
            const contratoId = parentField.replace('/contratos/', '');
            if (contratoId) {
              const contratoRef = doc(db, 'contratos', contratoId);
              const contratoDoc = await getDoc(contratoRef);
              if (contratoDoc.exists()) {
                setContratoNome(contratoDoc.data().title || contratoDoc.data().nome || contratoDoc.data().name || 'Cliente não encontrado');
              } else {
                setContratoNome('Cliente não encontrado');
              }
            } else {
              setContratoNome('Cliente não encontrado');
            }
          } else if (parentField && typeof parentField === 'object' && parentField._key && parentField._key.path && Array.isArray(parentField._key.path.segments)) {
            // If parent is a Firestore DocumentReference (raw object)
            const segments = parentField._key.path.segments;
            const contratoId = segments[segments.length - 1];
            if (contratoId) {
              const contratoRef = doc(db, 'contratos', contratoId);
              const contratoDoc = await getDoc(contratoRef);
              if (contratoDoc.exists()) {
                setContratoNome(contratoDoc.data().title || contratoDoc.data().nome || contratoDoc.data().name || 'Cliente não encontrado');
              } else {
                setContratoNome('Cliente não encontrado');
              }
            } else {
              setContratoNome('Cliente não encontrado');
            }
          } else {
            setContratoNome('Cliente não encontrado');
          }
        }
      } catch (error) {
        console.error('Error fetching project or contrato:', error);
        setContratoNome('Erro ao buscar cliente');
      } finally {
        setLoading(false);
      }
    };
    if (projectId) {
      fetchProjectAndContrato();
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
                {contratoNome || 'Xxxxxxxxxxxx'}
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
