'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryButton from './SecondaryButton';

interface RetrospectiveData {
  dataRealizacao?: string;
  licaoSprintAnterior?: string; // 'sim'/'nao'
  emailPoResultadoSprint?: string; // 'sim'/'nao'
  licaoAplicadaNestaSprint?: string;
  acoesParaProximaSprint?: string;
  observacoes?: string;
}

interface RetrospectiveDataCardProps {
  retrospectiveData: RetrospectiveData;
  onEdit?: () => void;
}

export default function RetrospectiveDataCard({ retrospectiveData, onEdit }: RetrospectiveDataCardProps) {
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
    } catch (e) {}
    return dateString;
  };

  const displayData = {
    dataRealizacao: formatDate(retrospectiveData.dataRealizacao),
    licaoSprintAnterior: retrospectiveData.licaoSprintAnterior?.toLowerCase() === 'sim',
    emailPoResultadoSprint: retrospectiveData.emailPoResultadoSprint?.toLowerCase() === 'sim',
    licaoAplicadaNestaSprint: retrospectiveData.licaoAplicadaNestaSprint || 'Nenhuma.',
    acoesParaProximaSprint: retrospectiveData.acoesParaProximaSprint || 'Nenhuma.',
    observacoes: retrospectiveData.observacoes || 'Nenhuma.',
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Dados Retrospectiva</h2>
        <div className="flex items-center space-x-2">
          <SecondaryButton 
            onClick={onEdit}
            className="flex items-center gap-2"
            aria-label="Editar Retrospectiva"
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

      {!isCollapsed && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Realização</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 flex items-center min-h-[40px]">
              {displayData.dataRealizacao}
              {retrospectiveData.dataRealizacao && <CalendarDaysIcon className="h-5 w-5 text-gray-400 ml-auto" />}
            </div>
          </div>

          <div> {/* Placeholder for alignment, radios are below */}
            
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lição Sprint Anterior</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="licaoSprintAnteriorDisplay" checked={displayData.licaoSprintAnterior} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="licaoSprintAnteriorDisplay" checked={!displayData.licaoSprintAnterior} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Não</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail PO Resultado Sprint</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="emailPoResultadoSprintDisplay" checked={displayData.emailPoResultadoSprint} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="emailPoResultadoSprintDisplay" checked={!displayData.emailPoResultadoSprint} readOnly className="form-radio h-4 w-4 text-emerald-600" />
                <span className="ml-2 text-sm text-gray-700">Não</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Lição aplicada nesta sprint</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.licaoAplicadaNestaSprint}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Ações para Próxima Sprint</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.acoesParaProximaSprint}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-800 min-h-[60px]">{displayData.observacoes}</div>
          </div>
        </div>
      )}
    </div>
  );
}
