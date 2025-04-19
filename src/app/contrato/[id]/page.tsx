'use client';

import { useParams } from 'next/navigation';
import SecondaryButton from '@/components/SecondaryButton';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ProjectTable from '@/components/ProjectTable';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContractPage() {
  const { id } = useParams();
  const [contract, setContract] = useState<any>(null);
  const [loadingContract, setLoadingContract] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const contractRef = doc(db, 'contratos', id as string);
        const contractSnap = await getDoc(contractRef);
        setContract(contractSnap.data());
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setLoadingContract(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const contractRef = doc(db, 'contratos', id as string);
        const q = query(
          collection(db, 'projetos'),
          where('parent', '==', contractRef)
        );
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
        });
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchContract();
    fetchProjects();
  }, [id]);

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
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">Projetos {loadingContract ? 'Carregando...' : contract?.title}</h1>
              <p className="mt-4 text-gray-600">Consulte a listagem de demandas da {loadingContract ? 'Carregando...' : contract?.title} para visualizar e acompanhar os projetos e atividades em desenvolvimento.</p>
              <div className="flex justify-end">
                <SecondaryButton onClick={() => window.location.href = `/contrato/${id}/novo`}>
                  Cadastrar Projeto
                </SecondaryButton>
              </div>
            </div>

            {loadingProjects ? (
              <div className="mt-8 text-center">Carregando projetos...</div>
            ) : (
              <div className="mt-8">
                {projects.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhum projeto cadastrado ainda
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ProjectTable
                      projects={projects.map(project => ({
                        titulo: project.title,
                        dataInicio: project.startDate,
                        dataFim: project.endDate,
                        sprintAtual: 'Sprint 1',
                        horarioDaily: '10:00',
                        status: 'Em andamento'
                      }))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
