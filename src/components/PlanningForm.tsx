import { useState } from 'react';
import { doc, setDoc, collection, getDocs, query, where, addDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PlanningFormProps {
  sprintId: string;
  initialData?: any;
  onSave: () => void;
  onClose: () => void;
}

export default function PlanningForm({ sprintId, initialData, onSave, onClose }: PlanningFormProps) {
  const [dataRealizacao, setDataRealizacao] = useState(initialData?.dataRealizacao || '');
  const [dataEnvioEmailPO, setDataEnvioEmailPO] = useState(initialData?.dataEnvioEmailPO || '');
  const [usMovimentadosAnterior, setUsMovimentadosAnterior] = useState(initialData?.usMovimentadosAnterior || '');
  const [quantidadeBugs, setQuantidadeBugs] = useState(initialData?.quantidadeBugs || '');
  const [quantidadeUs, setQuantidadeUs] = useState(initialData?.quantidadeUs || '');
  const [totalStoryPoints, setTotalStoryPoints] = useState(initialData?.totalStoryPoints || '');
  const [totalCapacity, setTotalCapacity] = useState(initialData?.totalCapacity || '');
  const [quantidadePontosFuncao, setQuantidadePontosFuncao] = useState(initialData?.quantidadePontosFuncao || '');
  const [usProximaSprint, setUsProximaSprint] = useState(initialData?.usProximaSprint ?? '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Only one planning doc per sprint, use sprintId as docId for simplicity
      const planningRef = doc(db, 'sprints', sprintId, 'planning', 'main');
      await setDoc(planningRef, {
        dataRealizacao,
        dataEnvioEmailPO,
        usMovimentadosAnterior,
        quantidadeBugs,
        quantidadeUs,
        totalStoryPoints,
        totalCapacity,
        quantidadePontosFuncao,
        usProximaSprint,
        observacoes,
        updatedAt: new Date().toISOString(),
      });
      onSave();
    } catch (err) {
      setError('Erro ao salvar dados da planning.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Data de Realização</label>
          <input type="date" className="form-input w-full" value={dataRealizacao} onChange={e => setDataRealizacao(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Data Envio de E-mail PO</label>
          <input type="date" className="form-input w-full" value={dataEnvioEmailPO} onChange={e => setDataEnvioEmailPO(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade de U's Movimentados Sprint Anterior</label>
          <input type="number" className="form-input w-full" value={usMovimentadosAnterior} onChange={e => setUsMovimentadosAnterior(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade BUGs</label>
          <input type="number" className="form-input w-full" value={quantidadeBugs} onChange={e => setQuantidadeBugs(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade de U's</label>
          <input type="number" className="form-input w-full" value={quantidadeUs} onChange={e => setQuantidadeUs(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Total Story Points</label>
          <input type="number" className="form-input w-full" value={totalStoryPoints} onChange={e => setTotalStoryPoints(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Total Capacity</label>
          <input type="number" className="form-input w-full" value={totalCapacity} onChange={e => setTotalCapacity(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade Pontos de Função</label>
          <input type="number" className="form-input w-full" value={quantidadePontosFuncao} onChange={e => setQuantidadePontosFuncao(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">US Próxima Sprint</label>
          <div className="flex gap-4 mt-1">
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio text-emerald-600" value="sim" checked={usProximaSprint === 'sim'} onChange={() => setUsProximaSprint('sim')} />
              <span className="ml-2">Sim</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio text-emerald-600" value="nao" checked={usProximaSprint === 'nao'} onChange={() => setUsProximaSprint('nao')} />
              <span className="ml-2">Não</span>
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
          <textarea className="form-textarea w-full min-h-[56px]" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={onClose} disabled={loading}>Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  );
}
