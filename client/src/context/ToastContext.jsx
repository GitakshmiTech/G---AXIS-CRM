import { useCallback, useMemo, useState } from 'react';
import { ToastViewport } from '../components/common/toast/ToastViewport.jsx';
import { ToastContext } from './toastContext.js';

/** Share consistent, timed notifications across pages and features. */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const dismissToast = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((items) => [...items.slice(-3), { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4000);
    return id;
  }, [dismissToast]);
  const value = useMemo(() => ({ toast, dismissToast }), [toast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

