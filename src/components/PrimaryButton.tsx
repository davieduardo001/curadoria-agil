'use client';

import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 
        bg-gray-200 
        text-gray-700 
        rounded-lg 
        hover:bg-gray-300 
        transition-all 
        duration-300 
        focus:outline-none 
        focus:ring-2 
        focus:ring-gray-300 
        focus:ring-offset-2 
        ${className}
      `}
    >
      {children}
    </button>
  );
}
