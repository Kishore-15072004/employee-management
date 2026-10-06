import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import LoadingState from './LoadingState.jsx';
import useToast from '../hooks/useToast.js';
import { listUnreadNotifications, markNotificationRead } from '../services/notificationService.js';

export default function NotificationPanel({ onClose, onChanged }) {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    listUnreadNotifications().then(({ data }) => setItems(data)).catch((problem) => setError(problem.message || 'Unable to load notifications.')).finally(() => setLoading(false));
  }, [push]);

  async function markRead(id) {
    try { await markNotificationRead(id); setItems((current) => current.filter((item) => item.id !== id)); onChanged(); }
    catch (problem) { push(problem.message || 'Unable to mark notification as read.', 'error'); }
  }

  return <section className="notification-popover" aria-label="Unread notifications">
    <header><strong>Inbox</strong><button className="small-action" onClick={onClose}>Close</button></header>
    {loading ? <LoadingState label="Loading inbox…" /> : error ? <p className="notification-error" role="alert">{error}</p> : items.length ? <div className="notification-popover-list">{items.slice(0, 5).map((item) => <article key={item.id}><span className="notification-type">{String(item.type).replaceAll('_', ' ')}</span><p>{item.message}</p><button className="small-action" onClick={() => markRead(item.id)}>Mark read</button></article>)}</div> : <p className="notification-empty">You’re all caught up.</p>}
    <Link className="notification-popover-link" to="/notifications" onClick={onClose}>Open all notifications <span>↗</span></Link>
  </section>;
}