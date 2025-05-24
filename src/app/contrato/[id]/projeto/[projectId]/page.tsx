'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faPenToSquare, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export default function ProjectDetailsPage() {
  const { id: contractId, projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const [contratoNome, setContratoNome] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  // States for editable fields
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDailyTime, setEditDailyTime] = useState('');

  useEffect(() => {
    const fetchProjectAndContrato = async () => {
      try {
        const projectRef = doc(db, 'projetos', projectId as string);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          setProject(projectData);

          // Set edit fields when entering edit mode
          setEditTitle(projectData.title || '');
          setEditStatus(projectData.status || '');
          setEditStartDate(projectData.startDate || '');
          setEditEndDate(projectData.endDate || '');
          setEditDailyTime(projectData.dailyTime || '');

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
          <button className="bg-[#124E5B] hover:bg-[#18AAB0] text-white px-4 py-2 rounded-md shadow font-semibold transition-colors duration-200 whitespace-nowrap">
              Cadastro de Sprint
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Dados do Projeto</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-[#124E5B] hover:bg-[#18AAB0] text-white rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            {editMode ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!projectId) return;
                  
                  try {
                    // Only include fields that we're actually editing
                    const updatedData = {
                      title: editTitle,
                      status: editStatus,
                      startDate: editStartDate,
                      endDate: editEndDate,
                      dailyTime: editDailyTime
                    };

                    await updateDoc(doc(db, 'projetos', projectId as string), updatedData);
                    
                    // Update local state with the new values
                    setProject((prev: any) => ({
                      ...prev,
                      ...updatedData
                    }));
                    
                    setEditMode(false);
                  } catch (err) {
                    console.error('Error updating project:', err);
                    alert('Erro ao salvar alterações!');
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50"
                      placeholder="Digite o nome do projeto"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={e => setEditStartDate(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={e => setEditEndDate(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={contratoNome || ''}
                      disabled
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50 cursor-not-allowed"
                      placeholder="Cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50"
                      required
                    >
                      <option value="">Selecione um status</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Pausado">Pausado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Atual</label>
                    <input
                      type="text"
                      value={project?.sprintAtual || ''}
                      disabled
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50 cursor-not-allowed"
                      placeholder="Sprint atual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário Daily</label>
                    <input
                      type="time"
                      value={editDailyTime}
                      onChange={e => setEditDailyTime(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-[#124E5B] hover:bg-[#18AAB0] text-white rounded-md transition-colors duration-200">Salvar</button>
                  <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => setEditMode(false)}>Cancelar</button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                    <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                      {project.title || project.titulo || 'Xxxxxxxxxxxx'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {project.startDate || project.dataInicio || 'xx/xx/xxxx'}
                      </p>
                      <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {project.endDate || project.dataFim || 'xx/xx/xxxx'}
                      </p>
                      <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {contratoNome || 'Xxxxxxxxxxxx'}
                      </p>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {project.status || project.situacao || 'Xxxxxxxxxxxx'}
                      </p>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Atual</label>
                    <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                      {project.sprintAtual || 'Xxxxxxxxxxxx'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário Daily</label>
                    <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                      {project.dailyTime || project.horarioDaily || 'Xxxxxxxxxxxx'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
