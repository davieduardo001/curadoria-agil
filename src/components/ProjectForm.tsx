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
}

export default function ProjectForm({ contractId }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Novo');
  const [dailyTime, setDailyTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !startDate.trim() || !endDate.trim() || !status.trim() || !dailyTime.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'projects'), {
        title,
        startDate,
        endDate,
        status,
        dailyTime,
        contractId,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'anonymous',
      });

      router.push(`/contrato/${contractId}`);
    } catch (err) {
      setError('Erro ao salvar projeto');
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
              onChange={setTitle}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <StyledFormInput
              label="Status"
              type="select"
              value={status}
              onChange={setStatus}
              required
            />

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

            <StyledFormInput
              label="Horário Daily"
              type="time"
              value={dailyTime}
              onChange={setDailyTime}
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
