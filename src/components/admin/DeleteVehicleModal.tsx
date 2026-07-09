'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  vehicleName: string;
}

export default function DeleteVehicleModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleName,
}: DeleteVehicleModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isDeleting]);

  if (!mounted || !isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div 
        className="w-full max-w-md bg-[#121212] border border-[#242424] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        tabIndex={-1}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-950/30 border border-red-500/20 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h2 id="delete-modal-title" className="text-xl font-semibold text-white mb-2">
            Delete Vehicle
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Are you sure you want to delete <span className="font-semibold text-white">{vehicleName}</span>? This action cannot be undone and will remove the vehicle permanently.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
