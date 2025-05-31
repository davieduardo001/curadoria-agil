'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import StyledFormInput from './StyledFormInput'; // Assuming this is a shared styled input

interface EditProjectFormProps {
  projectId: string;
  initialData: any; // Should be a more specific type if available
  onSave: () => void;
  onClose: () => void;
}

export default function EditProjectForm({
  projectId,
  initialData,
  onSave,
  onClose,
}: EditProjectFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyTime, setDailyTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setStatus(initialData.status || 'em planejamento'); // Default if not set
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
      setDailyTime(initialData.dailyTime || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome do projeto é obrigatório.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('A data de término deve ser posterior à data de início.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const projectRef = doc(db, 'projetos', projectId);
      await updateDoc(projectRef, {
        title,
        status,
        startDate,
        endDate,
        dailyTime,
        updatedAt: serverTimestamp(),
      });
      onSave();
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Erro ao atualizar o projeto. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <StyledFormInput
        label="Nome do Projeto"
        type="text"
        value={title}
        onChange={setTitle}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StyledFormInput
          label="Data Início"
          type="date"
          value={startDate}
          onChange={setStartDate}
          required
        />
        <StyledFormInput
          label="Data Fim"
          type="date"
          value={endDate}
          onChange={setEndDate}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StyledFormInput
          label="Status"
          type="select"
          value={status}
          onChange={setStatus}
          required
          options={[
            { value: 'em planejamento', label: 'Em Planejamento' },
            { value: 'em execução', label: 'Em Execução' },
            { value: 'em revisão', label: 'Em Revisão' },
            { value: 'concluído', label: 'Concluído' },
            { value: 'pausado', label: 'Pausado' }, // Added Pausado as an option
          ]}
        />
        <StyledFormInput
          label="Horário Daily"
          type="time"
          value={dailyTime}
          onChange={setDailyTime}
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <PrimaryButton type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </PrimaryButton>
        <SecondaryButton type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </SecondaryButton>
      </div>
    </form>
  );
}
