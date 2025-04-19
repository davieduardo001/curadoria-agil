'use client';

import { useState } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ContractFormProps {
  onClose: () => void;
  refetchProjects: () => void;
}

export default function ContractForm({ onClose, refetchProjects }: ContractFormProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contratos'), {
        title,
        text,
        color,
        createdAt: new Date().toISOString(),
      });
      onClose();
      refetchProjects();
    } catch (err) {
      setError('Erro ao criar contrato');
      console.error('Error creating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">Novo Contrato</h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <FormTextarea
            label="Descrição"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cor</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 rounded-full cursor-pointer"
              />
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }}></div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              type="button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#031617] text-white rounded hover:bg-[#031617]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
