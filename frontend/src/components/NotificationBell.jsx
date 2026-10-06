import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotificationPanel from './NotificationPanel.jsx';
import { getUnreadNotificationCount } from '../services/notificationService.js';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  async function refresh() {
    try { const { data } = await getUnreadNotificationCount(); setCount(Number(data) || 0); }
    catch { setCount(0); }
  }
  useEffect(() => {
    refresh();
    window.addEventListener('peopleos:notifications-changed', refresh);
    return () => window.removeEventListener('peopleos:notifications-changed', refresh);
  }, [location.pathname]);
  return <div className="notification-bell-wrap">
    <button className="notification-shortcut" type="button" aria-expanded={open} aria-label={`Notifications, ${count} unread`} onClick={() => setOpen((value) => !value)}>INBOX <span>{count}</span></button>
    {open && <NotificationPanel onClose={() => setOpen(false)} onChanged={refresh} />}
  </div>;
}