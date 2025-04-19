'use client';

import { useState } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import { collection, addDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  onClose?: () => void;
  contractId?: string;
}

export default function ProjectForm({ onClose, contractId }: ProjectFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startDate.trim() || !endDate.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!contractId) {
      setError('Não foi possível identificar o contrato associado');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'projetos'), {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        parent: doc(db, 'contratos', contractId),
        userId: user?.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      if (contractId) {
        router.push(`/contrato/${contractId}`);
      } else if (onClose) {
        onClose();
      }
    } catch (error) {
      setError('Erro ao salvar projeto');
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        <FormInput
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <FormTextarea
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Data Início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          
          <FormInput
            label="Data Fim"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              type="button"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#18AAB0] text-white rounded-lg border border-[#3ECBD0] hover:bg-[#18AAB0]/90 transition-all duration-300 hover:rounded-none focus:outline-none focus:ring-2 focus:ring-[#3ECBD0] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
