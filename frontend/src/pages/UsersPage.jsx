import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import useToast from '../hooks/useToast.js';
import { listUsers, setUserEnabled, updateUserRole } from '../services/userService.js';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

const roles = ['ADMIN', 'HR', 'FINANCE', 'TEAM_MANAGER', 'EMPLOYEE'];

export default function UsersPage() {
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try { const { data } = await listUsers(); setUsers(toList(data)); }
    catch (problem) { setError(problem.message || 'Unable to load users.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function changeRole(user, role) {
    try { await updateUserRole(user.id, role); push(`Role updated for ${user.username}.`, 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to update user role.', 'error'); }
  }
  async function toggleStatus(user) {
    const verb = user.enabled ? 'disable' : 'enable';
    if (!window.confirm(`${verb[0].toUpperCase()}${verb.slice(1)} ${user.username}'s account?`)) return;
    try { await setUserEnabled(user.id, !user.enabled); push(`Account ${user.enabled ? 'disabled' : 'enabled'}.`, 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to update account status.', 'error'); }
  }

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role', render: (user) => <select className="compact-select" aria-label={`Role for ${user.username}`} value={user.role} onChange={(event) => changeRole(user, event.target.value)}>{roles.map((role) => <option key={role}>{role}</option>)}</select> },
    { key: 'enabled', label: 'Status', render: (user) => <span className={`status-pill ${user.enabled ? 'status-active' : 'status-disabled'}`}>{user.enabled ? 'Enabled' : 'Disabled'}</span> },
    { key: 'actions', label: 'Actions', render: (user) => <button className={`small-action ${user.enabled ? 'danger-text' : ''}`} onClick={() => toggleStatus(user)}>{user.enabled ? 'Disable account' : 'Enable account'}</button> },
  ];

  return <>
    <PageHeading eyebrow="ACCESS / ADMINISTRATION" title="Employee access" description="Manage login roles and account status for registered employees." />
    <Card title="Employee accounts" eyebrow={`${users.length} ACCOUNTS`} className="table-panel"><DataTable columns={columns} rows={users} loading={loading} error={error} emptyMessage="No employee accounts found." /></Card>
  </>;
}