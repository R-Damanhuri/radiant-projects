'use client';

import { Toaster, toast } from 'sonner';

// Toast Provider Component
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #374151',
        },
      }}
    />
  );
}

// Toast helper functions
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};

// Copy to clipboard with toast
export async function copyToClipboard(text: string, successMessage = 'Copied to clipboard!'): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    showToast.success(successMessage);
    return true;
  } catch {
    showToast.error('Failed to copy');
    return false;
  }
}
