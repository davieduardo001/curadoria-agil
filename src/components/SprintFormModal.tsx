'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import SprintForm from './SprintForm';

interface SprintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sprintId?: string;
  initialData?: any;
  onSprintSaved: () => void;
}

export default function SprintFormModal({ isOpen, onClose, projectId, sprintId, initialData, onSprintSaved }: SprintFormModalProps) {
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Nova Sprint
                </Dialog.Title>
                
                <SprintForm 
                  projectId={projectId}
                  sprintId={sprintId}
                  initialData={initialData}
                  onSave={() => {
                    onSprintSaved();
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
