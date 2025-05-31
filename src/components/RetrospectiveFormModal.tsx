'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import RetrospectiveForm from './RetrospectiveForm';

interface RetrospectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  initialData?: any;
  onRetrospectiveSaved: () => void;
}

export default function RetrospectiveFormModal({
  isOpen,
  onClose,
  sprintId,
  initialData,
  onRetrospectiveSaved,
}: RetrospectiveFormModalProps) {
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Editar Dados da Retrospectiva
                </Dialog.Title>
                <RetrospectiveForm
                  sprintId={sprintId}
                  initialData={initialData}
                  onSave={() => {
                    onRetrospectiveSaved();
                    onClose();
                  }}
                  onClose={onClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
