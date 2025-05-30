'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import SecondaryButton from './SecondaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface SprintPlanningFormProps {
  sprintId: string;
  initialData?: {
    dataRealizacao?: string;
    dataEnvioPO?: string;
    usMovimentadasAnterior?: number;
    quantidadeBugs?: number;
    quantidadeUs?: number;
    totalStoryPoints?: number;
    totalCapacity?: number;
    pontosFuncao?: number;
    usProximaSprint?: boolean;
    observacoes?: string;
  };
  onSave?: () => void;
}

export default function SprintPlanningForm({ sprintId, initialData, onSave }: SprintPlanningFormProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    dataRealizacao: initialData?.dataRealizacao || '',
    dataEnvioPO: initialData?.dataEnvioPO || '',
    usMovimentadasAnterior: initialData?.usMovimentadasAnterior || 0,
    quantidadeBugs: initialData?.quantidadeBugs || 0,
    quantidadeUs: initialData?.quantidadeUs || 0,
    totalStoryPoints: initialData?.totalStoryPoints || 0,
    totalCapacity: initialData?.totalCapacity || 0,
    pontosFuncao: initialData?.pontosFuncao || 0,
    usProximaSprint: initialData?.usProximaSprint || false,
    observacoes: initialData?.observacoes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sprintRef = doc(db, 'sprints', sprintId);
      await updateDoc(sprintRef, {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'anonymous'
      });
      onSave?.();
    } catch (error) {
      console.error('Error saving planning data:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Data de Realização */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Realização</label>
          <div className="relative">
            <input
              type="date"
              value={formData.dataRealizacao}
              onChange={(e) => setFormData(prev => ({ ...prev, dataRealizacao: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
            />
            <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Data Envio do E-mail PO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Envio do E-mail PO</label>
          <div className="relative">
            <input
              type="date"
              value={formData.dataEnvioPO}
              onChange={(e) => setFormData(prev => ({ ...prev, dataEnvioPO: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
            />
            <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Quantidade de U's Movimentadas Sprint Anterior */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de U's Movimentadas Sprint Anterior</label>
          <input
            type="number"
            value={formData.usMovimentadasAnterior}
            onChange={(e) => setFormData(prev => ({ ...prev, usMovimentadasAnterior: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* Quantidade BUG's */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade BUG's</label>
          <input
            type="number"
            value={formData.quantidadeBugs}
            onChange={(e) => setFormData(prev => ({ ...prev, quantidadeBugs: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* Quantidade de U's */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de U's</label>
          <input
            type="number"
            value={formData.quantidadeUs}
            onChange={(e) => setFormData(prev => ({ ...prev, quantidadeUs: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* Total Story Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Story Points</label>
          <input
            type="number"
            value={formData.totalStoryPoints}
            onChange={(e) => setFormData(prev => ({ ...prev, totalStoryPoints: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* Total Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
          <input
            type="number"
            value={formData.totalCapacity}
            onChange={(e) => setFormData(prev => ({ ...prev, totalCapacity: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* Quantidade Pontos de Função */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade Pontos de Função</label>
          <input
            type="number"
            value={formData.pontosFuncao}
            onChange={(e) => setFormData(prev => ({ ...prev, pontosFuncao: Number(e.target.value) }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>

        {/* U's Próxima Sprint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">U's Próxima Sprint</label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="usProximaSprintSim"
                checked={formData.usProximaSprint}
                onChange={() => setFormData(prev => ({ ...prev, usProximaSprint: true }))}
                className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
              />
              <label htmlFor="usProximaSprintSim" className="text-sm text-gray-700">Sim</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="usProximaSprintNao"
                checked={!formData.usProximaSprint}
                onChange={() => setFormData(prev => ({ ...prev, usProximaSprint: false }))}
                className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
              />
              <label htmlFor="usProximaSprintNao" className="text-sm text-gray-700">Não</label>
            </div>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-4">
        <SecondaryButton type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </SecondaryButton>
      </div>
    </form>
  );
}
