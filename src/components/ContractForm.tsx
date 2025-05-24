'use client';

import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import SecondaryButton from './SecondaryButton';

interface ContractFormProps {
  onClose: () => void;
  refetchProjects: () => void;
  project?: any;
}

export default function ContractForm({ onClose, refetchProjects, project }: ContractFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setText(project.text);
      setColor(project.color || '#ffffff');
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (project) {
        // Update existing contract
        await updateDoc(doc(db, 'contratos', project.id), {
          title,
          text,
          color,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.email || 'anonymous',
        });
      } else {
        // Create new contract
        await addDoc(collection(db, 'contratos'), {
          title,
          text,
          color,
          createdAt: new Date().toISOString(),
          createdBy: user?.email || 'anonymous',
        });
      }
      onClose();
      refetchProjects();
    } catch (error) {
      setError('Erro ao salvar contrato');
      console.error('Error saving contract:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md px-1 py-1 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Cor</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md px-1 py-1 focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <SecondaryButton
          type="button"
          onClick={onClose}
        >
          Cancelar
        </SecondaryButton>
        <SecondaryButton
          type="submit"
          disabled={loading}
        >
          {loading ? 'Salvando...' : project ? 'Atualizar' : 'Criar'}
        </SecondaryButton>
      </div>
    </form>
  );
}
