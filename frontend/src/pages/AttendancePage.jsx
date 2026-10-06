import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { checkIn, checkOut, listAllAttendance, listEmployeeAttendance, listMyAttendance } from '../services/attendanceService.js';
import { listEmployees } from '../services/employeeService.js';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function displayTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
}

export default function AttendancePage() {
  const { role } = useAuth();
  const { push } = useToast();
  const isAdminOrHr = ['ADMIN', 'HR'].includes(role);
  const isManager = role === 'TEAM_MANAGER';
  const [ownRecords, setOwnRecords] = useState([]);
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [view, setView] = useState(isAdminOrHr ? 'all' : 'mine');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      if (isAdminOrHr) {
        const [allResult, ownResult] = await Promise.allSettled([listAllAttendance(), listMyAttendance()]);
        if (allResult.status === 'rejected') throw allResult.reason;
        setRows(toList(view === 'all' ? allResult.value.data : ownResult.status === 'fulfilled' ? ownResult.value.data : []));
        setOwnRecords(toList(ownResult.status === 'fulfilled' ? ownResult.value.data : []));
      } else if (isManager) {
        const [ownResult, employeeResult] = await Promise.all([listMyAttendance(), listEmployees()]);
        setOwnRecords(toList(ownResult.data));
        setRows(toList(ownResult.data));
        setEmployees(toList(employeeResult.data));
      } else {
        const { data } = await listMyAttendance();
        setOwnRecords(toList(data));
        setRows(toList(data));
      }
    } catch (problem) { setError(problem.message || 'Unable to load attendance.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (isManager && view === 'team') return;
    load();
  }, [role, view]);

  async function punch(direction) {
    setBusy(true); setError('');
    try {
      await (direction === 'in' ? checkIn() : checkOut());
      push(direction === 'in' ? 'Checked in.' : 'Checked out.', 'success');
      await load();
    } catch (problem) { setError(problem.message || `Unable to check ${direction}.`); }
    finally { setBusy(false); }
  }

  async function showTeamRecord(event) {
    event.preventDefault();
    if (!employeeId) return;
    setLoading(true); setError('');
    try { const { data } = await listEmployeeAttendance(employeeId); setRows(toList(data)); setView('team'); }
    catch (problem) { setError(problem.message || 'Unable to load this employee attendance.'); }
    finally { setLoading(false); }
  }

  const todayRecord = ownRecords.find((record) => record.attendanceDate === localToday());
  const columns = [
    ...(view === 'all' || view === 'team' ? [{ key: 'employee', label: 'Employee', render: (record) => <div className="person-cell"><span className="person-avatar">{record.employeeName?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{record.employeeName}</strong><small>{record.employeeCode}</small></span></div> }] : []),
    { key: 'attendanceDate', label: 'Date' }, { key: 'checkInTime', label: 'Check in', render: (record) => displayTime(record.checkInTime) },
    { key: 'checkOutTime', label: 'Check out', render: (record) => displayTime(record.checkOutTime) },
    { key: 'status', label: 'Status', render: (record) => <span className={`status-pill status-${String(record.status || '').toLowerCase().replaceAll('_', '-')}`}>{String(record.status || '').replaceAll('_', ' ')}</span> },
  ];

  return <>
    <PageHeading eyebrow="TIME / ATTENDANCE" title="Attendance" description="Check in or out and review recorded attendance." action={<div className="button-row"><Button variant="secondary" busy={busy} disabled={Boolean(todayRecord)} onClick={() => punch('in')}>Check in</Button><Button busy={busy} disabled={!todayRecord || Boolean(todayRecord.checkOutTime)} onClick={() => punch('out')}>Check out</Button></div>} />
    <div className="attendance-today"><span>TODAY / {localToday()}</span><strong>{todayRecord ? `${displayTime(todayRecord.checkInTime)}${todayRecord.checkOutTime ? ` – ${displayTime(todayRecord.checkOutTime)}` : ''}` : 'Not checked in'}</strong></div>
    {isAdminOrHr && <div className="filter-tabs" role="group" aria-label="Attendance scope"><button className={view === 'all' ? 'filter-active' : ''} onClick={() => setView('all')}>All employees</button><button className={view !== 'all' ? 'filter-active' : ''} onClick={() => setView('mine')}>My attendance</button></div>}
    {isManager && <Card title="Team attendance" eyebrow="DIRECT REPORTS"><Form className="inline-form" onSubmit={showTeamRecord}><FormField label="Employee"><select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}><option value="">Select a direct report</option>{employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.firstName} {employee.lastName} · {employee.employeeCode}</option>)}</select></FormField><Button variant="secondary" disabled={!employeeId}>View attendance</Button><Button type="button" variant="quiet" onClick={() => { setView('mine'); load(); }}>My attendance</Button></Form></Card>}
    <Card title={view === 'all' ? 'Organization records' : view === 'team' ? 'Team member records' : 'My records'} eyebrow={`${rows.length} RECORDS`} className="table-panel attendance-table"><DataTable columns={columns} rows={rows} loading={loading} error={error} emptyMessage="No attendance records found." /></Card>
  </>;
}