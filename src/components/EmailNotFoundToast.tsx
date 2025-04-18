'use client';

import { useEffect } from 'react';

interface EmailNotFoundToastProps {
  email: string;
  duration?: number;
}

export default function EmailNotFoundToast({ email, duration = 5000 }: EmailNotFoundToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById('emailNotFoundToast');
      if (toast) {
        toast.remove();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      id="emailNotFoundToast"
      className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 bg-red-500 text-white"
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="font-medium">E-mail não encontrado</p>
          <p className="text-sm mt-1">O e-mail <span className="font-medium">{email}</span> não está cadastrado em nosso sistema.</p>
          <p className="text-sm mt-1">Por favor, verifique o e-mail digitado ou cadastre-se.</p>
        </div>
      </div>
    </div>
  );
}
