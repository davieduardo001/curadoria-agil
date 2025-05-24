'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from '@/components/SecondaryButton';
import Navbar from '@/components/Navbar';
import { Sprint } from '@/types/sprint';

export default function SprintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editMeta, setEditMeta] = useState('');
  const [editSprintAtual, setEditSprintAtual] = useState(false);
  const [editDataInicial, setEditDataInicial] = useState('');
  const [editDataFinal, setEditDataFinal] = useState('');
  const [editObservacoes, setEditObservacoes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sprint) {
      setEditMeta(sprint.meta);
      setEditSprintAtual(sprint.sprintAtual);
      setEditDataInicial(sprint.dataInicial);
      setEditDataFinal(sprint.dataFinal);
      setEditObservacoes(sprint.observacoes || '');
    }
  }, [sprint]);

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Dados da Sprint</h2>
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
            <form onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                const sprintRef = doc(db, 'sprints', params.sprintId as string);
                await updateDoc(sprintRef, {
                  meta: editMeta,
                  sprintAtual: editSprintAtual,
                  dataInicial: editDataInicial,
                  dataFinal: editDataFinal,
                  observacoes: editObservacoes,
                });
                
                // Update local state
                setSprint({
                  ...sprint!,
                  meta: editMeta,
                  sprintAtual: editSprintAtual,
                  dataInicial: editDataInicial,
                  dataFinal: editDataFinal,
                  observacoes: editObservacoes,
                });
                setEditMode(false);
              } catch (error) {
                console.error('Error updating sprint:', error);
              } finally {
                setSaving(false);
              }
            }} className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta da Sprint</label>
                <input
                  type="text"
                  value={editMeta}
                  onChange={(e) => setEditMeta(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Atual</label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="sprintAtualSim"
                      name="sprintAtual"
                      checked={editSprintAtual}
                      onChange={() => setEditSprintAtual(true)}
                      className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
                    />
                    <label htmlFor="sprintAtualSim" className="text-sm text-gray-700">Sim</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="sprintAtualNao"
                      name="sprintAtual"
                      checked={!editSprintAtual}
                      onChange={() => setEditSprintAtual(false)}
                      className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
                    />
                    <label htmlFor="sprintAtualNao" className="text-sm text-gray-700">Não</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={editDataInicial}
                  onChange={(e) => setEditDataInicial(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                <input
                  type="date"
                  value={editDataFinal}
                  onChange={(e) => setEditDataFinal(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={editObservacoes}
                  onChange={(e) => setEditObservacoes(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent min-h-[100px]"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-4">
                <SecondaryButton
                  type="button"
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </SecondaryButton>
                <SecondaryButton
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </SecondaryButton>
              </div>
            </form>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}
