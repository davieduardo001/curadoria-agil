'use client';

import { ButtonHTMLAttributes } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function SecondaryButton({ children, className = '', ...props }: SecondaryButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 
        text-white 
        rounded-lg 
        border 
        border-[#3ECBD0] 
        bg-[#18AAB0] 
        hover:bg-[#18AAB0]/90 
        hover:rounded-none 
        transition-all 
        duration-300 
        focus:outline-none 
        focus:ring-2 
        focus:ring-[#3ECBD0] 
        focus:ring-offset-2 
        ${className}
      `}
    >
      {children}
    </button>
  );
}
