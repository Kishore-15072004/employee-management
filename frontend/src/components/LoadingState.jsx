export default function LoadingState({ label = 'Loading…' }) {
  return <div className="loading-state" role="status" aria-live="polite"><span className="spinner" />{label}</div>;
}