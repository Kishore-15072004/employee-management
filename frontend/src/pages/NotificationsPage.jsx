import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useToast from '../hooks/useToast.js';
import { listNotifications, listUnreadNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

function displayDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function NotificationsPage() {
  const { push } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try { const { data } = await (unreadOnly ? listUnreadNotifications() : listNotifications()); setItems(toList(data)); }
    catch (problem) { setError(problem.message || 'Unable to load notifications.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [unreadOnly]);
  function changed() { window.dispatchEvent(new Event('peopleos:notifications-changed')); }
  async function markRead(id) {
    try { await markNotificationRead(id); changed(); push('Notification marked as read.', 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to mark notification as read.', 'error'); }
  }
  async function markAll() {
    try { await markAllNotificationsRead(); changed(); push('All notifications marked as read.', 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to mark notifications as read.', 'error'); }
  }
  return <>
    <PageHeading eyebrow="INBOX / UPDATES" title="Notifications" description="Updates sent to your account after leave decisions and other events." action={<Button variant="secondary" onClick={markAll}>Mark all as read</Button>} />
    <div className="filter-tabs" role="group" aria-label="Notification filter"><button className={!unreadOnly ? 'filter-active' : ''} onClick={() => setUnreadOnly(false)}>All</button><button className={unreadOnly ? 'filter-active' : ''} onClick={() => setUnreadOnly(true)}>Unread</button><span>{items.filter((item) => !item.read).length} unread</span></div>
    {error && <div className="notice" role="alert">{error}</div>}
    <Card className="notification-list">
      {loading ? <LoadingState label="Loading notifications…" /> : error ? null : items.length ? items.map((item) => <article className={`notification-item ${item.read ? '' : 'notification-unread'}`} key={item.id}><span className="notification-symbol">{item.type === 'GENERAL' ? 'i' : '!'}</span><div className="notification-copy"><div className="notification-title"><strong>{String(item.type).replaceAll('_', ' ')}</strong>{!item.read && <span className="unread-indicator">UNREAD</span>}</div><p>{item.message}</p><time>{displayDate(item.createdAt)}</time></div>{!item.read && <button className="small-action" onClick={() => markRead(item.id)}>Mark read</button>}</article>) : <div className="empty-state"><span>—</span><p>You’re all caught up.</p></div>}
    </Card>
  </>;
}