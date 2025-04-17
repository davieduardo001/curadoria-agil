'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projetos'));
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">Curadoria Agil</h1>
            <p className="mt-4 text-gray-600">Gerencie e refine suas atividades com agilidade. Explore as opções e mantenha o fluxo de trabalho sempre otimizado!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
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
                    className="w-[452px] h-[247px] bg-white rounded-lg shadow-md p-6 relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-4">
                      <h2
                        className="text-[#031617] font-lato text-2xl font-bold leading-[32px]"
                      >
                        {project.title}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <p
                          className="text-[#031617] font-lato text-base leading-[20px]"
                        >
                          {project.text}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#031617] rounded-l-lg" />
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
