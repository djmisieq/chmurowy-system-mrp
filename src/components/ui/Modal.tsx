"use client";

import React, { Fragment, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

/**
 * Modal component for displaying content in a dialog overlay
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        {/* Modal container */}
        <div
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} mx-auto transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

// Default footer with cancel/confirm buttons
Modal.Footer = ({ 
  onClose, 
  onConfirm, 
  cancelText = 'Anuluj', 
  confirmText = 'Zatwierdź',
  confirmVariant = 'primary',
  isLoading = false,
  danger = false
}: { 
  onClose: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  danger?: boolean;
}) => (
  <>
    <Button
      variant="outline"
      onClick={onClose}
      disabled={isLoading}
    >
      {cancelText}
    </Button>
    {onConfirm && (
      <Button
        variant={danger ? 'danger' : confirmVariant}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {confirmText}
      </Button>
    )}
  </>
);

export default Modal;