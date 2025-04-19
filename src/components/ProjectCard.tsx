'use client';

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const startDate = new Date(project.startDate).toLocaleDateString('pt-BR');
  const endDate = new Date(project.endDate).toLocaleDateString('pt-BR');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{project.description}</p>
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-500">
            <span className="mr-4">Início: {startDate}</span>
            <span>Conclusão: {endDate}</span>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-500 hover:text-red-700"
              title="Excluir projeto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
