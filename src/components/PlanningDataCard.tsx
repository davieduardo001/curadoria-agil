'use client';

import { useState } from 'react';
import { PencilIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons

interface PlanningData {
  dataRealizacao?: string;
  dataEnvioPO?: string;
  usMovimentadasAnterior?: number | string;
  quantidadeBugs?: number | string;
  quantidadeUs?: number | string;
  totalStoryPoints?: number | string;
  totalCapacity?: number | string;
  pontosFuncao?: number | string;
  usProximaSprint?: boolean;
  observacoes?: string;
}

interface PlanningDataCardProps {
  planningData: PlanningData;
  onEdit?: () => void;
}

export default function PlanningDataCard({ planningData, onEdit }: PlanningDataCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Default values for display if data is not provided
  const displayData = {
    realizationDate: planningData.dataRealizacao || 'N/A',
    emailPODate: planningData.dataEnvioPO || 'N/A',
    usMovedPreviousSprint: planningData.usMovimentadasAnterior?.toString() || 'N/A',
    bugsQuantity: planningData.quantidadeBugs?.toString() || 'N/A',
    usQuantity: planningData.quantidadeUs?.toString() || 'N/A',
    totalStoryPoints: planningData.totalStoryPoints?.toString() || 'N/A',
    totalCapacity: planningData.totalCapacity?.toString() || 'N/A',
    functionPoints: planningData.pontosFuncao?.toString() || 'N/A',
    usNextSprint: planningData.usProximaSprint === undefined ? false : planningData.usProximaSprint,
    observations: planningData.observacoes || 'Nenhuma observação.',
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Card Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Dados da Planning</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Editar Planning"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
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
