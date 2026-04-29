// src/hooks/useToast.js
import { useCallback } from 'react';

// Global toast callback (initialized by ToastContainer)
let toastCallback = null;

/**
 * Hook to show toast notifications
 * Usage: const { success, error, warning, info } = useToast();
 */
export function useToast() {
  return {
    success: useCallback(
      (message, duration = 4000) => {
        toastCallback?.({ type: 'success', message, duration });
      },
      []
    ),
    error: useCallback(
      (message, duration = 4000) => {
        toastCallback?.({ type: 'error', message, duration });
      },
      []
    ),
    warning: useCallback(
      (message, duration = 4000) => {
        toastCallback?.({ type: 'warning', message, duration });
      },
      []
    ),
    info: useCallback(
      (message, duration = 4000) => {
        toastCallback?.({ type: 'info', message, duration });
      },
      []
    ),
  };
}

/**
 * Called by ToastContainer to register the callback
 * @internal
 */
export function setToastCallback(callback) {
  toastCallback = callback;
}
