'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface ReviewFormProps {
  sprintId: string;
  initialData?: any;
  onSave: () => void;
  onClose: () => void;
}

export default function ReviewForm({ sprintId, initialData, onSave, onClose }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    dataRealizacao: '',
    ambienteApresentado: '',
    demandasFinalizadas: 'nao', // Default to 'nao'
    consideracoesCliente: '',
    observacoes: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        dataRealizacao: initialData.dataRealizacao || '',
        ambienteApresentado: initialData.ambienteApresentado || '',
        demandasFinalizadas: initialData.demandasFinalizadas || 'nao',
        consideracoesCliente: initialData.consideracoesCliente || '',
        observacoes: initialData.observacoes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      // Assuming 'demandasFinalizadas' is the only checkbox for 'sim'/'nao' string values
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked ? 'sim' : 'nao' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Special handler for radio buttons if 'demandasFinalizadas' is implemented as radio
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const reviewDocRef = doc(db, 'sprints', sprintId, 'review', 'main');
      await setDoc(reviewDocRef, {
        ...formData,
        updatedAt: serverTimestamp(),
        ...(initialData?.createdAt ? {} : { createdAt: serverTimestamp() }) // Add createdAt only if new
      }, { merge: true });
      onSave();
    } catch (error) {
      console.error('Error saving review data:', error);
      // Handle error (e.g., show a notification to the user)
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

      <div>
        <label htmlFor="ambienteApresentado" className="block text-sm font-medium text-gray-700">Ambiente Apresentado</label>
        <input
          type="text"
          name="ambienteApresentado"
          id="ambienteApresentado"
          value={formData.ambienteApresentado}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Demandas DEV e QA Finalizadas</label>
        <div className="mt-2 flex items-center space-x-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="demandasFinalizadas" 
              value="sim" 
              checked={formData.demandasFinalizadas === 'sim'}
              onChange={handleRadioChange}
              className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="demandasFinalizadas" 
              value="nao" 
              checked={formData.demandasFinalizadas === 'nao'}
              onChange={handleRadioChange}
              className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm text-gray-700">Não</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="consideracoesCliente" className="block text-sm font-medium text-gray-700">Considerações do Cliente</label>
        <textarea
          name="consideracoesCliente"
          id="consideracoesCliente"
          rows={3}
          value={formData.consideracoesCliente}
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
