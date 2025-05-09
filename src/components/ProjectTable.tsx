'use client';

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

export default function ProjectTable({ projects }: ProjectTableProps) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
