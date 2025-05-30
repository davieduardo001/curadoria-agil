export interface Sprint {
  id: string;
  numero: number;
  meta: string;
  sprintAtual: boolean;
  dataInicial: string;
  dataFinal: string;
  observacoes: string;
  projectId: string;
  createdAt: string;
  createdBy: string;
  // Planning fields
  dataRealizacao?: string;
  dataEnvioPO?: string;
  usMovimentadasAnterior?: number;
  quantidadeBugs?: number;
  quantidadeUs?: number;
  totalStoryPoints?: number;
  totalCapacity?: number;
  pontosFuncao?: number;
  usProximaSprint?: boolean;
}
