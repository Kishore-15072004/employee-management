import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { applyLeave, approveLeave, cancelLeave, listMyLeaves, listPendingTeamLeaves, rejectLeave } from '../services/leaveService.js';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function Status({ value }) {
  return <span className={`status-pill status-${String(value || '').toLowerCase()}`}>{String(value || '').replaceAll('_', ' ')}</span>;
}

export default function LeavesPage() {
  const { role } = useAuth();
  const { push } = useToast();
  const [mine, setMine] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const isManager = role === 'TEAM_MANAGER';

  async function load() {
    setLoading(true); setError('');
    try {
      const responses = await Promise.all([listMyLeaves(), ...(isManager ? [listPendingTeamLeaves()] : [])]);
      setMine(toList(responses[0].data));
      setPending(toList(responses[1]?.data));
    } catch (problem) { setError(problem.message || 'Unable to load leave requests.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [role]);

  async function submit(event) {
    event.preventDefault(); setError('');
    if (form.endDate < form.startDate) { setError('End date must be on or after the start date.'); return; }
    setSubmitting(true);
    try {
      await applyLeave({ ...form, reason: form.reason.trim() });
      setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      push('Leave request submitted.', 'success');
      await load();
    } catch (problem) { setError(problem.message || 'Unable to submit this leave request.'); }
    finally { setSubmitting(false); }
  }

  async function decide(id, decision) {
    const request = decision === 'approve' ? approveLeave(id) : rejectLeave(id);
    try {
      await request;
      push(`Leave request ${decision === 'approve' ? 'approved' : 'rejected'}.`, 'success');
      await load();
    } catch (problem) { push(problem.message || `Unable to ${decision} leave request.`, 'error'); }
  }

  async function cancel(id) {
    if (!window.confirm('Cancel this pending leave request?')) return;
    try {
      await cancelLeave(id);
      push('Leave request cancelled.', 'success');
      await load();
    } catch (problem) { push(problem.message || 'Unable to cancel this leave request.', 'error'); }
  }

  const myColumns = [
    { key: 'leaveType', label: 'Type' }, { key: 'startDate', label: 'From' }, { key: 'endDate', label: 'To' },
    { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status', render: (leave) => <Status value={leave.status} /> },
    { key: 'actions', label: 'Actions', render: (leave) => leave.status === 'PENDING' ? <button className="small-action danger-text" onClick={() => cancel(leave.id)}>Cancel</button> : '—' },
  ];
  const pendingColumns = [
    { key: 'employeeName', label: 'Employee' }, { key: 'leaveType', label: 'Type' }, { key: 'startDate', label: 'From' },
    { key: 'endDate', label: 'To' }, { key: 'reason', label: 'Reason' },
    { key: 'actions', label: 'Decision', render: (leave) => <div className="row-actions"><button className="small-action" onClick={() => decide(leave.id, 'approve')}>Approve</button><button className="small-action danger-text" onClick={() => decide(leave.id, 'reject')}>Reject</button></div> },
  ];

  return <>
    <PageHeading eyebrow="TIME AWAY / REQUESTS" title="Leave" description="Submit time off, track your requests, and review team decisions when you manage a team." />
    <div className="content-grid leave-layout">
      <Card title="Request leave" eyebrow="NEW APPLICATION"><Form className="leave-form" onSubmit={submit}>
        <FormField label="Leave type"><select value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })}>{['CASUAL', 'SICK', 'EARNED', 'UNPAID'].map((type) => <option key={type}>{type}</option>)}</select></FormField>
        <div className="form-two"><FormField label="Start date"><input type="date" required min={localToday()} value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></FormField><FormField label="End date"><input type="date" required min={form.startDate || localToday()} value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></FormField></div>
        <FormField label="Reason"><textarea rows="4" required value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} /></FormField>
        {error && <div className="notice" role="alert">{error}</div>}
        <Button busy={submitting}>Submit request <span>↗</span></Button>
      </Form></Card>
      <Card title="My leave requests" eyebrow={`${mine.length} REQUESTS`} className="table-panel"><DataTable columns={myColumns} rows={mine} loading={loading} error={error} emptyMessage="No leave requests yet." /></Card>
    </div>
    {isManager && <Card title="Pending team requests" eyebrow={`${pending.length} AWAITING DECISION`} className="review-panel table-panel"><DataTable columns={pendingColumns} rows={pending} loading={loading} emptyMessage="No pending requests from your team." /></Card>}
    {['ADMIN', 'HR'].includes(role) && <Card title="Approval access" eyebrow="BACKEND SCOPE"><p className="foundation-copy">The API does not provide a general leave queue for this role. HR can decide on unassigned requests, and ADMIN can decide on any request, but the current API does not expose a list endpoint for those queues.</p></Card>}
  </>;
}