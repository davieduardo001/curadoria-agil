'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface ProjectTableProps {
  projects: Array<{
    id: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
    updatedAt?: string;
    titulo?: string;
    dataInicio?: string;
    dataFim?: string;
    sprintAtual?: string;
    horarioDaily?: string;
    status?: string;
    dailyTime?: string;
  }>;
  onDelete: (id: string) => void;
}

function getProjectData(project: ProjectTableProps['projects'][0]) {
  return {
    title: project.title || project.titulo || 'Sem título',
    startDate: project.startDate || project.dataInicio || 'Não definida',
    endDate: project.endDate || project.dataFim || 'Não definida',
    dailyTime: project.dailyTime || 'Não definido',
    status: project.status || 'Em andamento'
  };
}

export default function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg">
        <thead>
          <tr className="bg-[#265864] rounded-lg">
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Título
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Data Inicial
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Data Final
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Horário Daily
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Status
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr 
              key={index} 
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {getProjectData(project).title}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {getProjectData(project).startDate}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {getProjectData(project).endDate}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {getProjectData(project).dailyTime}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {getProjectData(project).status}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
                      onDelete(project.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Excluir projeto"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
