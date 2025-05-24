'use client';

interface Step {
  title: string;
  subtitle?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full flex justify-center">
      <ol className="inline-flex items-center p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-xs sm:text-base sm:p-4 sm:space-x-4 rtl:space-x-reverse">

      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center ${
            currentStep >= index + 1
              ? 'text-[var(--primary)]'
              : 'text-gray-600'
          }`}

        >
          <span
            className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
              currentStep >= index + 1
                ? 'text-blue-600 border-blue-600'
                : 'border-gray-500'
            }`}
          >
            {index + 1}
          </span>
          {step.title} <span className="hidden sm:inline-flex sm:ms-2">{step.subtitle}</span>
          {index !== steps.length - 1 && (
            <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
            </svg>
          )}
        </li>
      ))}
    </ol>
    </div>
  );
}

