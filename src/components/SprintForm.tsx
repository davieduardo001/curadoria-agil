'use client';

import { useState } from 'react';
import { collection, addDoc, doc, getDoc, query, where, getDocs, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent } from 'react';
import StyledFormInput from './StyledFormInput';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

interface SprintFormProps {
  projectId?: string;
  onClose: () => void;
  onSave?: () => void;
  sprintId?: string;
  initialData?: {
    meta: string;
    sprintAtual: boolean;
    dataInicial: string;
    dataFinal: string;
    observacoes?: string;
    numero: number;
  };
}

export default function SprintForm({ projectId, onClose, onSave, sprintId, initialData }: SprintFormProps) {
  const [meta, setMeta] = useState(initialData?.meta || '');
  const [sprintAtual, setSprintAtual] = useState(initialData?.sprintAtual || false);
  const [dataInicial, setDataInicial] = useState(initialData?.dataInicial || '');
  const [dataFinal, setDataFinal] = useState(initialData?.dataFinal || '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meta.trim() || !dataInicial.trim() || !dataFinal.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (sprintId) {
        // Update existing sprint
        const sprintRef = doc(db, 'sprints', sprintId);
        await updateDoc(sprintRef, {
          meta,
          sprintAtual,
          dataInicial,
          dataFinal,
          observacoes,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || 'anonymous',
        });
      } else if (projectId) {
        // Verify project exists
        const projectRef = doc(db, 'projetos', projectId);
        const projectDoc = await getDoc(projectRef);
        
        if (!projectDoc.exists()) {
          throw new Error('O projeto não existe. Não é possível criar uma sprint.');
        }

        // Get all sprints for this project and find the highest number
        const sprintsRef = collection(db, 'sprints');
        const q = query(sprintsRef, where('projectId', '==', projectId));
        const sprintsSnapshot = await getDocs(q);
        const lastSprintNumber = sprintsSnapshot.empty ? -1 :
          Math.max(...sprintsSnapshot.docs.map(doc => doc.data().numero));

        // Create new sprint with next number in sequence
        await addDoc(collection(db, 'sprints'), {
          meta,
          sprintAtual,
          dataInicial,
          dataFinal,
          observacoes,
          projectId,
          numero: lastSprintNumber + 1,
          createdAt: new Date().toISOString(),
          createdBy: user?.email || 'anonymous',
        });
      }

      if (onSave) {
        onSave();
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar sprint');
      console.error('Erro ao salvar sprint:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-[80%_20%] gap-6 w-full">
            <StyledFormInput
              label="Meta da Sprint"
              type="text"
              value={meta}
              onChange={setMeta}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sprint Atual
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sprintAtualSim"
                    name="sprintAtual"
                    value="true"
                    checked={sprintAtual}
                    onChange={(e) => setSprintAtual(true)}
                    className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
                  />
                  <label htmlFor="sprintAtualSim" className="text-sm text-gray-700">Sim</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sprintAtualNao"
                    name="sprintAtual"
                    value="false"
                    checked={!sprintAtual}
                    onChange={(e) => setSprintAtual(false)}
                    className="h-4 w-4 text-[#18AAB0] focus:ring-[#18AAB0]"
                  />
                  <label htmlFor="sprintAtualNao" className="text-sm text-gray-700">Não</label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full">
            <StyledFormInput
              label="Data Inicial"
              type="date"
              value={dataInicial}
              onChange={setDataInicial}
              required
            />
            <StyledFormInput
              label="Data Final"
              type="date"
              value={dataFinal}
              onChange={setDataFinal}
              required
            />
          </div>

          <StyledFormInput
            label="Observações"
            type="text"
            value={observacoes}
            onChange={setObservacoes}
            className="col-span-2"
          />
        </div>

        <div className="flex justify-end gap-4">
          <PrimaryButton
            type="button"
            onClick={onClose}
          >
            Voltar
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
