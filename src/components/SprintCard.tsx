'use client';

interface SprintCardProps {
  sprintNumber: number;
  meta: string;
  onClick?: () => void;
}

export default function SprintCard({ sprintNumber, meta, onClick }: SprintCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-lg" />
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Sprint {sprintNumber}</h3>
        <p className="text-gray-600 text-sm">{meta}</p>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <svg 
          className="h-6 w-6 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>
    </div>
  );
}
