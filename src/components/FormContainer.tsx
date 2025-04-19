'use client';

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function FormContainer({ children, title, description }: FormContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
