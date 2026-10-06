import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useAuth from '../hooks/useAuth.js';
import { getEmployee, getEmployeeAttendance, getEmployeeSalary, getMyAttendance, getMyProfile } from '../services/employeeService.js';
import { listDepartments } from '../services/departmentService.js';
import { listMyLeaves } from '../services/leaveService.js';
import EmployeeFormModal from './EmployeeFormModal.jsx';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';
import SelfProfileModal from './SelfProfileModal.jsx';

function formatTime(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? value : new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(parsed);
}

export default function EmployeeDetailsPage({ selfProfile = false }) {
  const { id } = useParams();
  const { role } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [salary, setSalary] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const { data } = selfProfile ? await getMyProfile() : await getEmployee(id);
      setEmployee(data);
      const requests = [];
      if (role === 'ADMIN') requests.push(getEmployeeSalary(data.id).then((result) => setSalary(result.data)));
      const attendanceRequest = selfProfile || role === 'EMPLOYEE' ? getMyAttendance() : getEmployeeAttendance(data.id);
      requests.push(attendanceRequest.then((result) => setAttendance(toList(result.data))));
      if (selfProfile || role === 'EMPLOYEE') requests.push(listMyLeaves().then((result) => {
        setLeaveSummary(toList(result.data).reduce((summary, leave) => ({ ...summary, [leave.status]: (summary[leave.status] || 0) + 1 }), {}));
      }));
      if (!selfProfile && ['ADMIN', 'HR'].includes(role)) requests.push(listDepartments().then((result) => setDepartments(toList(result.data))));
      await Promise.allSettled(requests);
    } catch (problem) { setError(problem.message || 'Unable to load this employee profile.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id, role, selfProfile]);

  if (loading) return <LoadingState label="Loading employee profile…" />;
  if (error) return <Card title="Employee profile"><div className="notice" role="alert">{error}</div><Link className="panel-link" to={selfProfile ? '/dashboard' : '/employees'}>{selfProfile ? 'Back to dashboard' : 'Back to directory'}</Link></Card>;

  const canEdit = selfProfile || ['ADMIN', 'HR'].includes(role);
  const attendanceRows = [...attendance].sort((left, right) => (right.attendanceDate || '').localeCompare(left.attendanceDate || '')).slice(0, 6);
  return <>
    <PageHeading eyebrow={`PEOPLE / PROFILE / ${employee.employeeCode}`} title={`${employee.firstName} ${employee.lastName}`} description={`${employee.designation} · ${employee.department || 'No department assigned'}`} action={<div className="button-row">{!selfProfile && <Link className="button button-secondary" to="/employees">Directory</Link>}{canEdit && <Button onClick={() => setEditOpen(true)}>{selfProfile ? 'Update my profile' : 'Edit profile'}</Button>}</div>} />
    <div className="profile-grid">
      <Card title="Personal information" eyebrow="EMPLOYEE RECORD"><dl className="detail-list"><div><dt>Employee code</dt><dd>{employee.employeeCode}</dd></div><div><dt>Email</dt><dd>{employee.email}</dd></div><div><dt>Phone</dt><dd>{employee.phone}</dd></div></dl></Card>
      <Card title="Employment information" eyebrow="ORGANIZATION"><dl className="detail-list"><div><dt>Designation</dt><dd>{employee.designation}</dd></div><div><dt>Department</dt><dd>{employee.department || '—'}</dd></div><div><dt>Manager</dt><dd>{employee.managerName || 'Unassigned'}</dd></div></dl></Card>
      {role === 'ADMIN' && <Card title="Salary" eyebrow="RESTRICTED / ADMIN"><strong className="profile-salary">{salary?.salary == null ? 'Not available' : Number(salary.salary).toLocaleString()}</strong><p className="metric-note">Value returned by the employee salary endpoint.</p></Card>}
      {(selfProfile || role === 'EMPLOYEE') && <Card title="Leave summary" eyebrow="YOUR REQUEST HISTORY"><div className="mini-stat-grid">{['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => <div key={status}><strong>{leaveSummary?.[status] || 0}</strong><span>{status}</span></div>)}</div></Card>}
      <Card title="Attendance history" eyebrow="LATEST RECORDS" className="profile-attendance"><DataTable columns={[{ key: 'attendanceDate', label: 'Date' }, { key: 'checkInTime', label: 'Check in', render: (row) => formatTime(row.checkInTime) }, { key: 'checkOutTime', label: 'Check out', render: (row) => formatTime(row.checkOutTime) }, { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${String(row.status || '').toLowerCase().replaceAll('_', '-')}`}>{row.status || '—'}</span> }]} rows={attendanceRows} emptyMessage="No attendance records available for this employee." /></Card>
    </div>
    {editOpen && (selfProfile
      ? <SelfProfileModal employee={employee} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); load(); }} />
      : <EmployeeFormModal employee={employee} departments={departments} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); load(); }} />)}
  </>;
}