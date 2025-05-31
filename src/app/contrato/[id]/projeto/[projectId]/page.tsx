'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  // Assuming dateString is in 'YYYY-MM-DD' format from Firestore
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(parts[2], 10);
    
    // Constructing the date this way interprets the components in the local timezone
    const date = new Date(year, month, day);

    // Basic validation for the constructed date
    if (isNaN(date.getTime())) {
        // Handle invalid date string, perhaps return original or an error message
        return dateString; 
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  // Fallback for unexpected date formats or if parsing fails
  return dateString;
};
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faPenToSquare, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import SprintCard from '@/components/SprintCard';
import { Sprint } from '@/types/sprint';
import SprintFormModal from '@/components/SprintFormModal';
import EditProjectFormModal from '@/components/EditProjectFormModal';
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
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
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
      const sprintDoc = sprintsSnapshot.docs[0]; // Get the DocumentSnapshot
      const sprintData = { id: sprintDoc.id, ...sprintDoc.data() } as Sprint; // Combine id and data, then cast
      console.log('Found current sprint:', sprintData);
      setCurrentSprint(sprintData);
    } else {
      console.log('No current sprint found');
    }
  };

  const fetchProjectAndContrato = async (currentProjectId: string) => {
    if (!currentProjectId) return;
    setLoading(true);
    try {
      console.log('Current projectId from params:', currentProjectId);
      const projectRef = doc(db, 'projetos', currentProjectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        setProject(projectData);

        // Fetch sprints
        await fetchCurrentSprint(currentProjectId);
        await fetchProjectSprints(currentProjectId);

        // Handle parent as string path or Firestore DocumentReference
        const parentField = projectData.parent;
        console.log('LOG LOG LOG -> parentField', parentField);

        if (typeof parentField === 'string' && parentField.startsWith('/contratos/')) {
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

  useEffect(() => {
    if (projectId) {
      fetchProjectAndContrato(projectId as string);
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
              <SecondaryButton
                onClick={() => setShowEditProjectModal(true)}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                Editar
              </SecondaryButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                  {project?.title || project?.titulo || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                <div className="relative">
                  <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                    {formatDate(project?.startDate) || 'dd/mm/yyyy'}
                  </p>
                  <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                <div className="relative">
                  <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                    {formatDate(project?.endDate) || 'dd/mm/yyyy'}
                  </p>
                  <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <div className="relative">
                  <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                    {contratoNome || 'N/A'}
                  </p>
                  {/* Optional: Dropdown icon if this becomes selectable later */}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                    {project?.status || 'N/A'}
                  </p>
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
                <div className="relative">
                  <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                    {project?.dailyTime || 'HH:MM'}
                  </p>
                </div>
              </div>
            </div>
          </div> {/* Closes <div class="mb-6"> (Dados do Projeto wrapper) */}
        </div> {/* Closes <div class="bg-white rounded-lg shadow p-6"> (Project Details Card) */}

          {/* Sprints Section */}
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
            fetchProjectSprints(projectId as string);
            fetchCurrentSprint(projectId as string);
          }}
        />
        {project && (
          <EditProjectFormModal
            isOpen={showEditProjectModal}
            onClose={() => setShowEditProjectModal(false)}
            projectId={projectId as string}
            initialData={project}
            onProjectSaved={() => {
              fetchProjectAndContrato(projectId as string);
              setShowEditProjectModal(false);
            }}
          />
        )}
      </div>
    );
  }
