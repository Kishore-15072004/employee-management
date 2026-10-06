import useToast from '../hooks/useToast.js';

export default function ToastHost() {
  const { items, dismiss } = useToast();
  return <div className="toast-host" aria-live="polite" aria-relevant="additions">{items.map((item) => <div className={`toast toast-${item.kind}`} role="status" key={item.id}><span>{item.message}</span><button type="button" aria-label="Dismiss notification" onClick={() => dismiss(item.id)}>×</button></div>)}</div>;
}