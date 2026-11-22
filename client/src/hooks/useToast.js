import { useContext } from 'react';
import { ToastContext } from '../context/toastContext.js';

/** Read the app-wide toast helper from a page or feature component. */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider.');
  return context.toast;
};
