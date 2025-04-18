'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

export default function Toast({ message, type, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.remove();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      id="toast"
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
