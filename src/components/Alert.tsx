'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  message: string;
}

export default function Alert({ isOpen, onClose, onSave, message }: AlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Confirmação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#18AAB0] text-white rounded-md hover:bg-[#158d93] focus:outline-none focus:ring-2 focus:ring-[#18AAB0] focus:ring-offset-2"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
