'use client';

import { ChangeEvent } from 'react';

interface StyledFormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

export default function StyledFormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  required = false, 
  className = '', 
  options 
}: StyledFormInputProps) {
  return (
    <div className="w-full">
      <label 
        className="block text-[#031617] font-lato font-bold text-sm mb-2 flex items-center gap-1"
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`w-full ${className}`}
      >
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="mt-1 block w-full h-10 rounded-lg border border-[#EDEDED] bg-[#F4F4F4] focus:border-[#18AAB0] focus:ring-[#18AAB0]"
          >
            <option value="">Selecione...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full h-10 px-4 rounded-lg border border-[#EDEDED] bg-[#F4F4F4] focus:border-[#18AAB0] focus:ring-[#18AAB0]"
          />
        )}
      </div>
    </div>
  );
}
