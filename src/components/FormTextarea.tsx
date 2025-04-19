'use client';

import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export default function FormTextarea({
  label,
  error,
  className = '',
  required = false,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-[var(--primary)]">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        className={`w-full rounded-sm border-2 ${error ? 'border-red-500' : 'border-[var(--primary)]'} bg-white py-2 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] ${className}`}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
