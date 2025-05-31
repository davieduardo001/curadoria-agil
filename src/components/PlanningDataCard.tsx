'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from './SecondaryButton'; // Assuming path is correct

interface PlanningData {
  dataRealizacao?: string;
  dataEnvioEmailPO?: string; // Corrected from dataEnvioPO
  usMovimentadasAnterior?: number | string;
  quantidadeBugs?: number | string;
  quantidadeUs?: number | string;
  totalStoryPoints?: number | string;
  totalCapacity?: number | string;
  quantidadePontosFuncao?: number | string; // Corrected from pontosFuncao
  usProximaSprint?: string; // Stored as 'sim'/'nao' in Firestore, will convert to boolean for display
  observacoes?: string;
}

interface PlanningDataCardProps {
  planningData: PlanningData;
  onEdit?: () => void;
}

export default function PlanningDataCard({ planningData, onEdit }: PlanningDataCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      // Fallback for other potential date string formats if necessary, or if it's already formatted
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('pt-BR');
      }
    } catch (e) {
      // If parsing fails, return original or N/A
    }
    return dateString; // Or 'N/A' if strict formatting is required
  };

  // Default values for display if data is not provided
  const displayData = {
    realizationDate: formatDate(planningData.dataRealizacao),
    emailPODate: formatDate(planningData.dataEnvioEmailPO), // Corrected field name
    usMovedPreviousSprint: planningData.usMovimentadasAnterior?.toString() || 'N/A',
    bugsQuantity: planningData.quantidadeBugs?.toString() || 'N/A',
    usQuantity: planningData.quantidadeUs?.toString() || 'N/A',
    totalStoryPoints: planningData.totalStoryPoints?.toString() || 'N/A',
    totalCapacity: planningData.totalCapacity?.toString() || 'N/A',
    functionPoints: planningData.quantidadePontosFuncao?.toString() || 'N/A', // Corrected field name
    // Convert 'sim' to true, otherwise false. Handles undefined/null safely.
    usNextSprint: planningData.usProximaSprint?.toLowerCase() === 'sim',
    observations: planningData.observacoes || 'Nenhuma observação.',
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Dados da Planning</h2>
        <div className="flex items-center space-x-2">
          <SecondaryButton 
            onClick={onEdit}
            className="flex items-center gap-2"
            aria-label="Editar Planning"
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
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.realizationDate}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Envio do E-mail PO</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.emailPODate}</div>
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade de U's Movimentadas Sprint Anterior</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.usMovedPreviousSprint}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade BUG's</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.bugsQuantity}</div>
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade de U's</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.usQuantity}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Story Points</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.totalStoryPoints}</div>
          </div>

          {/* Row 4 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Capacity</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.totalCapacity}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade Pontos de Função</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800">{displayData.functionPoints}</div>
          </div>
          
          {/* Row 5 - US Próxima Sprint (Spans 1 col, but placed in grid) */}
          <div className="md:col-span-2 flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-4">US Próxima Sprint</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="usNextSprintDisplay" checked={displayData.usNextSprint} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="usNextSprintDisplay" checked={!displayData.usNextSprint} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Não</span>
              </label>
            </div>
          </div>

          {/* Row 6 - Observações (Spans 2 cols) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.observations}</div>
          </div>
        </div>
      )}
    </div>
  );
}
