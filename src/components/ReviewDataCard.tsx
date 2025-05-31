'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from './SecondaryButton';

interface ReviewData {
  dataRealizacao?: string;
  ambienteApresentado?: string;
  demandasFinalizadas?: string; // Stored as 'sim'/'nao' in Firestore
  consideracoesCliente?: string;
  observacoes?: string;
}

interface ReviewDataCardProps {
  reviewData: ReviewData;
  onEdit?: () => void;
}

export default function ReviewDataCard({ reviewData, onEdit }: ReviewDataCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('pt-BR');
      }
    } catch (e) {
      // If parsing fails, return original or N/A
    }
    return dateString;
  };

  const displayData = {
    dataRealizacao: formatDate(reviewData.dataRealizacao),
    ambienteApresentado: reviewData.ambienteApresentado || 'N/A',
    demandasFinalizadas: reviewData.demandasFinalizadas?.toLowerCase() === 'sim',
    consideracoesCliente: reviewData.consideracoesCliente || 'Nenhuma consideração.',
    observacoes: reviewData.observacoes || 'Nenhuma observação.',
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-8 mt-8">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Dados da Review</h2>
        <div className="flex items-center space-x-2">
          <SecondaryButton 
            onClick={onEdit}
            className="flex items-center gap-2"
            aria-label="Editar Review"
          >
            <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
            Editar
          </SecondaryButton>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isCollapsed ? 'Expandir' : 'Recolher'}
          >
            {isCollapsed ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronUpIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Card Body - Collapsible */}
      {!isCollapsed && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Realização</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 flex items-center min-h-[40px]">
              {displayData.dataRealizacao}
              {reviewData.dataRealizacao && <CalendarDaysIcon className="h-5 w-5 text-gray-400 ml-auto" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ambiente Apresentado</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[40px]">{displayData.ambienteApresentado}</div>
          </div>

          {/* Row 2 - Demandas DEV e QA Finalizadas (Spans 2 cols for layout consistency, but content is compact) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Demandas DEV e QA Finalizadas</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="demandasFinalizadasDisplay" checked={displayData.demandasFinalizadas} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="demandasFinalizadasDisplay" checked={!displayData.demandasFinalizadas} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Não</span>
              </label>
            </div>
          </div>

          {/* Row 3 - Considerações do Cliente (Spans 2 cols) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Considerações do Cliente</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.consideracoesCliente}</div>
          </div>

          {/* Row 4 - Observações (Spans 2 cols) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.observacoes}</div>
          </div>
        </div>
      )}
    </div>
  );
}
