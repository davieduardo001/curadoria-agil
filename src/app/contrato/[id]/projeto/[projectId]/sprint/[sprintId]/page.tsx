'use client';

import Navbar from '@/components/Navbar';
import { ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'; // Added for card icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from '@/components/SecondaryButton';
import SprintFormModal from '@/components/SprintFormModal';
import PlanningDataCard from '@/components/PlanningDataCard';
import PlanningFormModal from '@/components/PlanningFormModal';
import ReviewDataCard from '@/components/ReviewDataCard';
import ReviewFormModal from '@/components/ReviewFormModal';
import RetrospectiveDataCard from '@/components/RetrospectiveDataCard';
import RetrospectiveFormModal from '@/components/RetrospectiveFormModal';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        return dateString; 
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  return dateString;
};

export default function SprintPlanningPage() {
  const { sprintId, projectId } = useParams();
  const [sprintData, setSprintData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [planningData, setPlanningData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false); // For Sprint Edit Modal
  const [showPlanningEditModal, setShowPlanningEditModal] = useState(false); // For Planning Edit Modal
  const [reviewData, setReviewData] = useState<any>(null);
  const [showReviewEditModal, setShowReviewEditModal] = useState(false);
  const [retrospectiveData, setRetrospectiveData] = useState<any>(null);
  const [showRetrospectiveEditModal, setShowRetrospectiveEditModal] = useState(false);

  const fetchSprint = async () => {
    if (!sprintId) {
      setError('Sprint ID is not available.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const sprintRef = doc(db, 'sprints', sprintId as string);
      const sprintSnap = await getDoc(sprintRef);
      if (sprintSnap.exists()) {
        setSprintData(sprintSnap.data());
      } else {
        setError('Sprint não encontrada.');
      }
    } catch (err) {
      console.error('Error fetching sprint data:', err);
      setError('Erro ao buscar dados da sprint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sprintId) {
      fetchSprint();
      fetchPlanning();
      fetchReview();
      fetchRetrospective();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId]);

  const fetchReview = async () => {
    if (!sprintId) return;
    try {
      const reviewRef = doc(db, 'sprints', sprintId as string, 'review', 'main');
      const reviewSnap = await getDoc(reviewRef);
      if (reviewSnap.exists()) {
        setReviewData(reviewSnap.data());
      } else {
        setReviewData(null); // No review data found
      }
    } catch (err) {
      console.error('Error fetching review data:', err);
      setError(prevError => prevError + ' Erro ao buscar dados da review.');
    }
  };

  const fetchRetrospective = async () => {
    if (!sprintId) return;
    try {
      const retrospectiveRef = doc(db, 'sprints', sprintId as string, 'retrospective', 'main');
      const retrospectiveSnap = await getDoc(retrospectiveRef);
      if (retrospectiveSnap.exists()) {
        setRetrospectiveData(retrospectiveSnap.data());
      } else {
        setRetrospectiveData(null);
      }
    } catch (err) {
      console.error('Error fetching retrospective data:', err);
      setError(prevError => prevError + ' Erro ao buscar dados da retrospectiva.');
    }
  };

  const fetchPlanning = async () => {
    if (!sprintId) {
      return;
    }
    try {
      const planningRef = doc(db, 'sprints', sprintId as string, 'planning', 'main');
      const planningSnap = await getDoc(planningRef);
      if (planningSnap.exists()) {
        setPlanningData(planningSnap.data());
      } else {
        setPlanningData(null);
      }
    } catch (err) {
      console.error('Error fetching planning data:', err);
    }
  };

  useEffect(() => {
    fetchPlanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto py-8 px-4 md:px-8">
          <p className="text-center text-gray-500">Carregando dados da sprint...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto py-8 px-4 md:px-8">
          <p className="text-center text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SprintFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        projectId={projectId as string}
        sprintId={sprintId as string}
        initialData={sprintData}
        onSprintSaved={() => {
          setShowEditModal(false);
          fetchSprint(); // Re-fetch sprint data after save
        }}
      />
      <PlanningFormModal
        isOpen={showPlanningEditModal}
        onClose={() => setShowPlanningEditModal(false)}
        sprintId={sprintId as string}
        initialData={planningData}
        onPlanningSaved={() => {
          fetchPlanning(); // Only re-fetch planning data
          setShowPlanningEditModal(false);
        }}
      />
      <ReviewFormModal
        isOpen={showReviewEditModal}
        onClose={() => setShowReviewEditModal(false)}
        sprintId={sprintId as string}
        initialData={reviewData}
        onReviewSaved={() => {
          fetchReview(); // Re-fetch review data after save
          setShowReviewEditModal(false);
        }}
      />
      <RetrospectiveFormModal
        isOpen={showRetrospectiveEditModal}
        onClose={() => setShowRetrospectiveEditModal(false)}
        sprintId={sprintId as string}
        initialData={retrospectiveData}
        onRetrospectiveSaved={() => {
          fetchRetrospective(); 
          setShowRetrospectiveEditModal(false);
        }}
      />
      <Navbar />
      <main className="max-w-5xl mx-auto py-8 px-4 md:px-8">
        {/* Header from image */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Visualizar Sprint</h1>
          <p className="text-sm text-gray-500">Visualize os detalhes da sprint aqui para acompanhar o progresso, as tarefas e os objetivos alcançados.</p>
        </div>

        {/* Step Navigation Cards */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Planning Card */}
          <div className="flex-1 bg-white border-2 border-emerald-400 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-700">Planning</span>
              <ChevronRightIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-500">Na Planning, definimos e organizamos as atividades da próxima sprint, alinhando metas e prioridades.</p>
          </div>

          {/* Review Card */}
          <div className="flex-1 bg-white border-2 border-emerald-200 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-700">Review</span>
              <ChevronRightIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500">Na Review, avaliamos o progresso da sprint e apresentamos os resultados alcançados para feedback e ajustes.</p>
          </div>

          {/* Retrospectiva Card */}
          <div className="flex-1 bg-white border-2 border-emerald-200 rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-700">Retrospectiva</span>
              <ChevronRightIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500">Na Retro, refletimos sobre o desempenho da sprint, discutindo o que funcionou bem e o que pode ser melhorado para aprimorar o processo.</p>
          </div>
        </div>

        {/* Dados da Sprint Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dados da Sprint</h2>
            <SecondaryButton 
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
              Editar
            </SecondaryButton>
          </div>
          {/* Display Sprint Data */}
          {sprintData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <span className="block text-gray-500 text-xs mb-1">Meta da Sprint</span>
                <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">{sprintData.meta || '-'}</div>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1">Número da Sprint</span>
                <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">{sprintData.numero ?? '-'}</div>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1">Data Inicial</span>
                <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">
                  {formatDate(sprintData.dataInicial) || '-'}
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1">Data Final</span>
                <div className="flex items-center font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[40px]">
                  {formatDate(sprintData.dataFinal) || '-'}
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 ml-auto" />
                </div>
              </div>
              <div className="md:col-span-2">
                <span className="block text-gray-500 text-xs mb-1">Observações</span>
                <div className="font-medium text-gray-800 bg-gray-50 rounded px-3 py-2 min-h-[56px]">{sprintData.observacoes || '-'}</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum dado da sprint para exibir.</p>
          )}
        </div>

        {/* Planning Data Card */}
        <PlanningDataCard 
          planningData={planningData || {}} 
          onEdit={() => setShowPlanningEditModal(true)} 
        />

        {/* Review Data Card */}
        <ReviewDataCard 
          reviewData={reviewData || {}} 
          onEdit={() => setShowReviewEditModal(true)} 
        />

        {/* Retrospective Data Card */}
        <RetrospectiveDataCard 
          retrospectiveData={retrospectiveData || {}} 
          onEdit={() => setShowRetrospectiveEditModal(true)} 
        />
      </main>
    </div>
  );
}
