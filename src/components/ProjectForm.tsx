'use client';

import { useState } from 'react';
import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent } from 'react';
import StyledFormInput from './StyledFormInput';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

interface ProjectFormProps {
  contractId?: string;
  onProjectSaved?: (projectId: string) => void;
}

export default function ProjectForm({ contractId, onProjectSaved }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Novo');
  const [dailyTime, setDailyTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSelectChange = (value: string) => {
    setStatus(value);
  };

  const handleInputChange = (value: string) => {
    setTitle(value);
  };

  const handleDateChange = (value: string) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
  };

  const handleDailyTimeChange = (value: string) => {
    setDailyTime(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, preencha o nome do projeto');
      return;
    }
    if (!startDate.trim()) {
      setError('Por favor, selecione a data de início');
      return;
    }
    if (!endDate.trim()) {
      setError('Por favor, selecione a data de término');
      return;
    }
    if (!status.trim()) {
      setError('Por favor, selecione o status do projeto');
      return;
    }
    if (!dailyTime.trim()) {
      setError('Por favor, informe o horário do daily');
      return;
    }
    
    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      setError('A data de término deve ser posterior à data de início');
      return;
    }

    if (!window.confirm('Tem certeza que deseja salvar o projeto?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!contractId) {
        throw new Error('ID do contrato não fornecido');
      }
      
      const contractRef = doc(db, 'contratos', contractId);
      const docRef = await addDoc(collection(db, 'projetos'), {
        title,
        startDate,
        endDate,
        status,
        dailyTime,
        parent: contractRef,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'anonymous',
      });
      const projectId = docRef.id;
      if (onProjectSaved) {
        onProjectSaved(projectId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar projeto');
      console.error('Erro ao salvar projeto:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded">
              {error}
            </div>
          )}

          <div className="w-full">
            <StyledFormInput
              label="Nome do Projeto"
              type="text"
              value={title}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <StyledFormInput
              label="Data Início"
              type="date"
              value={startDate}
              onChange={handleDateChange}
              required
            />

            <StyledFormInput
              label="Data Fim"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <StyledFormInput
              label="Status"
              type="select"
              value={status}
              onChange={handleSelectChange}
              required
              options={[
                { value: 'em planejamento', label: 'Em Planejamento' },
                { value: 'em execução', label: 'Em Execução' },
                { value: 'em revisão', label: 'Em Revisão' },
                { value: 'concluído', label: 'Concluído' }
              ]}
            />

            <StyledFormInput
              label="Horário Daily"
              type="time"
              value={dailyTime}
              onChange={handleDailyTimeChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <PrimaryButton
            type="button"
            onClick={() => router.push(`/contrato/${contractId}`)}
          >
            Cancelar
          </PrimaryButton>
          <SecondaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
}
