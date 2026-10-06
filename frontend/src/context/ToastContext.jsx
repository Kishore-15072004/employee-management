import { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((message, kind = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setItems((current) => [...current, { id, message, kind }].slice(-4));
    timers.current.set(id, window.setTimeout(() => dismiss(id), 4500));
  }, [dismiss]);

  useEffect(() => {
    const handleToast = (event) => push(event.detail.message, event.detail.kind);
    window.addEventListener('peopleos:toast', handleToast);
    return () => {
      window.removeEventListener('peopleos:toast', handleToast);
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, [push]);

  return <ToastContext.Provider value={{ items, push, dismiss }}>{children}</ToastContext.Provider>;
}