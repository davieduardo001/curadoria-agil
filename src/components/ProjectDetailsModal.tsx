'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

interface ProjectDetailsModalProps {
  project: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    dailyTime: string;
    status: string;
  };
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Dados do Projeto</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Visualizar projeto</h3>
            <p className="text-gray-600">
              Visualize os detalhes do seu projeto aqui para obter uma visão completa do progresso, recursos e próximos passos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Título</h3>
              <p className="text-gray-900">{project.title}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Data Inicial</h3>
              <p className="text-gray-900">{project.startDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Data Final</h3>
              <p className="text-gray-900">{project.endDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Horário Daily</h3>
              <p className="text-gray-900">{project.dailyTime}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
              <p className="text-gray-900">{project.status}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Descrição</h3>
              <p className="text-gray-900">{project.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
