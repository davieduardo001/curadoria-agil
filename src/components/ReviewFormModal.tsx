'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ReviewForm from './ReviewForm'; // Import the newly created ReviewForm

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  initialData?: any; // Data to pre-fill the form
  onReviewSaved: () => void; // Callback after successful save
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  sprintId,
  initialData,
  onReviewSaved,
}: ReviewFormModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
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

        {/* Modal Panel */}
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
                  Editar Dados da Review
                </Dialog.Title>
                <ReviewForm
                  sprintId={sprintId}
                  initialData={initialData}
                  onSave={() => {
                    onReviewSaved(); // Call the callback to refresh data on the page
                    onClose(); // Close the modal
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
