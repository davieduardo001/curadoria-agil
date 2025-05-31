'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ContractFormModal from '@/components/ContractFormModal';
import { collection, query, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from '@/components/SecondaryButton';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'contratos'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCreateContract = () => {
    setShowForm(true);
    setSelectedProject(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleEditContract = (project: any) => {
    setShowForm(true);
    setSelectedProject(project);
  };

  const handleRefetchProjects = () => {
    fetchProjects();
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <ContractFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        refetchProjects={handleRefetchProjects}
        project={selectedProject}
      />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-1 py-6 sm:px-0">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">Curadoria Agil</h1>
            <p className="mt-4 mb-8 text-gray-600">Gerencie e refine suas atividades com agilidade. Explore as opções e mantenha o fluxo de trabalho sempre otimizado!</p>

            <SecondaryButton onClick={handleCreateContract}>
              Novo Contrato
            </SecondaryButton>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full">
              {loadingProjects ? (
                <div key="loading" className="w-[452px] h-[247px] bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[#031617] font-lato text-2xl font-bold leading-[32px]">
                      Carregando...
                    </h2>
                  </div>
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#031617] rounded-l-lg" />
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="w-[452px] h-[247px] bg-white rounded-lg shadow-md p-6 relative overflow-hidden hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-[#031617] font-lato text-2xl font-bold leading-[32px]">
                          {project.title}
                        </h2>
                        <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditContract(project);
                          }}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4 text-[#031617]" />
                        </button>
                        <Link
                          href={`/contrato/${project.id}`}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-[#031617]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <p className="text-[#031617] font-lato text-base leading-[20px]">
                          {project.text}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 h-full w-2 rounded-l-lg" style={{ backgroundColor: project.color || '#031617' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
