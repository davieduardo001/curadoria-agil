'use client';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex justify-center w-full mx-auto max-w-xl">
      <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base">

      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex md:w-full items-center${
            index !== steps.length - 1
              ? " sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8"
              : ''
          } ${
            currentStep >= index + 1
              ? 'text-[var(--primary)]'
              : 'text-gray-600'
          }`}

        >
          <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
            <span
              className={`w-6 h-6 ${
                currentStep >= index + 1
                  ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-500'
              } border rounded-full flex justify-center items-center mr-3 lg:w-10 lg:h-10`}
            >
              {index + 1}
            </span>
            <span className="whitespace-nowrap">
              {step.title}
              {step.description && (
                <span className="block text-xs mt-1 text-gray-400">{step.description}</span>
              )}
            </span>
          </div>
        </li>
      ))}
    </ol>
    </div>
  );
}

