'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faPenToSquare, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import SprintCard from '@/components/SprintCard';
import { Sprint } from '@/types/sprint';
import SprintFormModal from '@/components/SprintFormModal';
import SecondaryButton from '@/components/SecondaryButton';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const projectId = params.projectId as string;
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

  // Format date string from yyyy-mm-dd to mm/dd/yyyy for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  // Format date string from mm/dd/yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  const [editDailyTime, setEditDailyTime] = useState('');
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);

  // Fetch all sprints for this project
  const fetchProjectSprints = async (projectId: string) => {
    const sprintsRef = collection(db, 'sprints');
    const q = query(sprintsRef, where('projectId', '==', projectId));
    const sprintsSnapshot = await getDocs(q);
    const sprintsData = sprintsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sprint[];
    // Sort sprints by numero in descending order (newest first)
    sprintsData.sort((a, b) => b.numero - a.numero);
    setSprints(sprintsData);
  };

  const fetchCurrentSprint = async (projectId: string) => {
    console.log('Fetching sprint for projectId:', projectId);
    const sprintsRef = collection(db, 'sprints');
    const q = query(sprintsRef, 
      where('projectId', '==', projectId),
      where('sprintAtual', '==', true)
    );
    const sprintsSnapshot = await getDocs(q);
    console.log('Sprint query results:', sprintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    if (!sprintsSnapshot.empty) {
      const sprintData = sprintsSnapshot.docs[0].data();
      console.log('Found current sprint:', sprintData);
      setCurrentSprint(sprintData);
    } else {
      console.log('No current sprint found');
    }
  };

  useEffect(() => {
    const fetchProjectAndContrato = async () => {

      try {
        console.log('Current projectId from params:', projectId);
        const projectRef = doc(db, 'projetos', projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          setProject(projectData);

          // Set edit fields when entering edit mode
          setEditTitle(projectData.title || '');
          setEditStatus(projectData.status || '');
          setEditStartDate(formatDateForInput(projectData.startDate) || '');
          setEditEndDate(formatDateForInput(projectData.endDate) || '');
          setEditDailyTime(projectData.dailyTime || '');

          // Fetch sprints
          await fetchCurrentSprint(projectId);
          await fetchProjectSprints(projectId);

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
          <SecondaryButton 
            onClick={() => setIsSprintModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Cadastro de Sprint
          </SecondaryButton>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Dados do Projeto</h2>
              {!editMode && (
                <SecondaryButton
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  Editar
                </SecondaryButton>
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
                      value={currentSprint ? `Sprint ${currentSprint.numero}` : 'Nenhuma sprint ativa'}
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
                  <SecondaryButton type="submit">Salvar</SecondaryButton>
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
                        {formatDateForDisplay(project.startDate) || 'mm/dd/yyyy'}
                      </p>
                      <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {formatDateForDisplay(project.endDate) || 'mm/dd/yyyy'}
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
                    <div className="relative">
                      <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                        {currentSprint ? `Sprint ${currentSprint.numero}` : 'Nenhuma sprint ativa'}
                      </p>
                    </div>
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

        {/* Sprint List Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Sprints</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprintNumber={sprint.numero}
                meta={sprint.meta}
                onClick={() => router.push(`/contrato/${id}/projeto/${projectId}/sprint/${sprint.id}`)}
              />
            ))}
          </div>
        </div>
      </main>
      {/* Sprint Form Modal */}
      <SprintFormModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        projectId={projectId}
        onSprintSaved={() => {
          fetchProjectSprints(projectId);
          fetchCurrentSprint(projectId);
        }}
      />
    </div>
  );
}
