'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Navbar from '@/components/Navbar';
import { Sprint } from '@/types/sprint';

export default function SprintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprint = async () => {
      try {
        const sprintRef = doc(db, 'sprints', params.sprintId as string);
        const sprintDoc = await getDoc(sprintRef);
        
        if (sprintDoc.exists()) {
          setSprint({
            id: sprintDoc.id,
            ...sprintDoc.data()
          } as Sprint);
        }
      } catch (error) {
        console.error('Error fetching sprint:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSprint();
  }, [params.sprintId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!sprint) {
    return <div>Sprint não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Sprint Phases */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#18AAB0] cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Planning</h3>
            <p className="text-sm text-gray-600">
              Na Planning, definimos e organizamos as atividades da próxima sprint, alinhando metas e prioridades.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Review</h3>
            <p className="text-sm text-gray-600">
              Na Review, avaliamos o progresso da sprint e apresentamos os resultados alcançados para feedback e ajustes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Retrospectiva</h3>
            <p className="text-sm text-gray-600">
              Na Retro, refletimos sobre o desempenho da sprint, discutindo o que funcionou bem e o que pode ser melhorado para aprimorar o processo.
            </p>
          </div>
        </div>

        {/* Sprint Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Dados da Sprint</h2>
            <button className="text-gray-600 hover:text-gray-800">
              <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta da Sprint</label>
              <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                {sprint.meta}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número da Sprint</label>
              <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                {sprint.numero}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                {sprint.dataInicial}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <p className="w-full bg-gray-50 rounded-md px-3 py-2">
                {sprint.dataFinal}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <p className="w-full bg-gray-50 rounded-md px-3 py-2 min-h-[100px]">
                {sprint.observacoes || 'Nenhuma observação'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
