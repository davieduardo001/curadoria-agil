'use client';

import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  error,
  className = '',
  required = false,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-[var(--primary)]">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-sm border-2 ${error ? 'border-red-500' : 'border-[var(--primary)]'} bg-white py-2.5 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${className}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
