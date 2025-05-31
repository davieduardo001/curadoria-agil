'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import EditProjectForm from './EditProjectForm';

interface EditProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialData: any; // Consider using a more specific type
  onProjectSaved: () => void;
}

export default function EditProjectFormModal({
  isOpen,
  onClose,
  projectId,
  initialData,
  onProjectSaved,
}: EditProjectFormModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Editar Detalhes do Projeto
                </Dialog.Title>
                <EditProjectForm
                  projectId={projectId}
                  initialData={initialData}
                  onSave={() => {
                    onProjectSaved();
                    onClose(); // Close modal after save
                  }}
                  onClose={onClose} // Pass onClose to the form for the cancel button
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
