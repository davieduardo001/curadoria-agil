'use client';

interface Step {
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center mb-8">
      <div className="flex items-center gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= index + 1 ? 'bg-[#18AAB0] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <span className="text-sm">{index + 1}</span>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${currentStep >= index + 1 ? 'text-[#18AAB0]' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
