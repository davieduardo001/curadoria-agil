'use client';

interface StyledFormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export default function StyledFormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  required = false, 
  className = '' 
}: StyledFormInputProps) {
  return (
    <div className="w-full">
      <label 
        className="block text-[#031617] font-lato font-bold text-sm mb-2"
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
      >
        {label}
      </label>
      <div 
        className={`w-full h-10 px-4 rounded-lg border border-[#EDEDED] bg-[#F4F4F4] ${className}`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-full bg-transparent outline-none text-[#031617] font-lato text-sm"
        />
      </div>
    </div>
  );
}
