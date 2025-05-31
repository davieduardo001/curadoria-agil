'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface RetrospectiveFormProps {
  sprintId: string;
  initialData?: any;
  onSave: () => void;
  onClose: () => void;
}

export default function RetrospectiveForm({
  sprintId,
  initialData,
  onSave,
  onClose,
}: RetrospectiveFormProps) {
  const [formData, setFormData] = useState({
    dataRealizacao: '',
    licaoSprintAnterior: 'nao',
    emailPoResultadoSprint: 'nao',
    licaoAplicadaNestaSprint: '',
    acoesParaProximaSprint: '',
    observacoes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        dataRealizacao: initialData.dataRealizacao || '',
        licaoSprintAnterior: initialData.licaoSprintAnterior || 'nao',
        emailPoResultadoSprint: initialData.emailPoResultadoSprint || 'nao',
        licaoAplicadaNestaSprint: initialData.licaoAplicadaNestaSprint || '',
        acoesParaProximaSprint: initialData.acoesParaProximaSprint || '',
        observacoes: initialData.observacoes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const retrospectiveDocRef = doc(db, 'sprints', sprintId, 'retrospective', 'main');
      await setDoc(retrospectiveDocRef, {
        ...formData,
        updatedAt: serverTimestamp(),
        ...(initialData?.createdAt ? {} : { createdAt: serverTimestamp() }),
      }, { merge: true });
      onSave();
    } catch (error) {
      console.error('Error saving retrospective data:', error);
      // Consider adding user-facing error display
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="dataRealizacao" className="block text-sm font-medium text-gray-700">Data de Realização</label>
        <input
          type="date"
          name="dataRealizacao"
          id="dataRealizacao"
          value={formData.dataRealizacao}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lição Sprint Anterior</label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="licaoSprintAnterior" value="sim" checked={formData.licaoSprintAnterior === 'sim'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2 text-sm text-gray-700">Sim</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="licaoSprintAnterior" value="nao" checked={formData.licaoSprintAnterior === 'nao'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2 text-sm text-gray-700">Não</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail PO Resultado Sprint</label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="emailPoResultadoSprint" value="sim" checked={formData.emailPoResultadoSprint === 'sim'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2 text-sm text-gray-700">Sim</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="emailPoResultadoSprint" value="nao" checked={formData.emailPoResultadoSprint === 'nao'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
              <span className="ml-2 text-sm text-gray-700">Não</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="licaoAplicadaNestaSprint" className="block text-sm font-medium text-gray-700">Lição aplicada nesta sprint</label>
        <textarea
          name="licaoAplicadaNestaSprint"
          id="licaoAplicadaNestaSprint"
          rows={3}
          value={formData.licaoAplicadaNestaSprint}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="acoesParaProximaSprint" className="block text-sm font-medium text-gray-700">Ações para Próxima Sprint</label>
        <textarea
          name="acoesParaProximaSprint"
          id="acoesParaProximaSprint"
          rows={3}
          value={formData.acoesParaProximaSprint}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
        <textarea
          name="observacoes"
          id="observacoes"
          rows={3}
          value={formData.observacoes}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <PrimaryButton type="button" onClick={onClose} disabled={isSaving}>Cancelar</PrimaryButton>
        <SecondaryButton type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </SecondaryButton>
      </div>
    </form>
  );
}
