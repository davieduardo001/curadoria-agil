'use client';

interface ProjectTableProps {
  projects: Array<{
    titulo: string;
    dataInicio: string;
    dataFim: string;
    sprintAtual: string;
    horarioDaily: string;
    status: string;
  }>;
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg">
        <thead>
          <tr className="bg-[#265864] rounded-lg">
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Título do Projeto
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Data Início
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Data Fim
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Sprint Atual
            </th>
            <th className="px-6 py-4 text-white text-center font-lato font-extrabold text-sm leading-[32px]">
              Horário das Daily's
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
                {project.titulo}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {project.dataInicio}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {project.dataFim}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {project.sprintAtual}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {project.horarioDaily}
              </td>
              <td className="px-6 py-4 text-center font-lato text-sm font-medium">
                {project.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
