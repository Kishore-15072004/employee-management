import { useEffect } from 'react';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><div><span className="eyebrow">PEOPLEOS / WORKSPACE</span><h2>{title}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button></header>{children}</section></div>;
}