import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useAuth from '../hooks/useAuth.js';
import {
  getAdminDashboard,
  getDashboardUnreadCount,
  getDepartmentDirectory,
  getEmployeeDirectory,
  getMyDashboardAttendance,
  getMyDashboardLeaves,
  getOrganizationAttendance,
  getPayrollDirectory,
  getTeamLeaveQueue,
} from '../services/dashboardService.js';
import { formatRole } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function MetricTile({ label, value, note, tone = 'mint' }) {
  return <article className={`metric-card metric-${tone}`}><span className="metric-label">{label}</span><strong>{value ?? '—'}</strong><span className="metric-note">{note}</span></article>;
}

function DistributionList({ items, nameKey, countKey, emptyText }) {
  if (!items?.length) return <div className="empty-state"><span>—</span><p>{emptyText}</p></div>;
  const maximum = Math.max(1, ...items.map((item) => Number(item[countKey]) || 0));
  return <div className="dashboard-bar-list">{items.map((item, index) => <div className="dashboard-bar-row" key={item[nameKey]}><div><span>{item[nameKey]}</span><strong>{item[countKey]}</strong></div><div className="bar-track"><span className={`bar-fill bar-color-${index % 4}`} style={{ width: `${Math.max(3, (Number(item[countKey]) / maximum) * 100)}%` }} /></div></div>)}</div>;
}

function SummaryList({ values, labels }) {
  return <div className="summary-list">{labels.map(([key, label]) => <div key={key}><span>{label}</span><strong>{values?.[key] ?? 0}</strong></div>)}</div>;
}

function SummaryBars({ values, labels }) {
  const total = labels.reduce((sum, [key]) => sum + (Number(values?.[key]) || 0), 0);
  return <div className="summary-bars">{labels.map(([key, label], index) => {
    const value = Number(values?.[key]) || 0;
    const width = total ? (value / total) * 100 : 0;
    return <div className="summary-bar-row" key={key}><div><span>{label}</span><strong>{value}</strong></div><div className="bar-track"><span className={`bar-fill bar-color-${index % 4}`} style={{ width: `${width}%` }} /></div></div>;
  })}</div>;
}

function LoadingDashboard() {
  return <LoadingState label="Loading your dashboard…" />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const role = user?.role;

  useEffect(() => {
    let active = true;
    async function load() {
      setState({ data: null, loading: true, error: '' });
      try {
        let data;
        if (role === 'ADMIN') {
          const response = await getAdminDashboard();
          data = response.data;
        } else if (role === 'HR') {
          const [employeeResult, departmentResult, attendanceResult] = await Promise.all([
            getEmployeeDirectory(), getDepartmentDirectory(), getOrganizationAttendance(),
          ]);
          data = { employees: employeeResult.data, departments: departmentResult.data, attendance: attendanceResult.data };
        } else if (role === 'TEAM_MANAGER') {
          const [employeeResult, pendingResult, attendanceResult] = await Promise.all([
            getEmployeeDirectory(), getTeamLeaveQueue(), getMyDashboardAttendance(),
          ]);
          data = { team: employeeResult.data, pendingLeaves: pendingResult.data, attendance: attendanceResult.data };
        } else if (role === 'FINANCE') {
          const [payrollResult, unreadResult] = await Promise.all([getPayrollDirectory(), getDashboardUnreadCount()]);
          data = { payroll: payrollResult.data, unreadCount: unreadResult.data };
        } else {
          const [leaveResult, attendanceResult, unreadResult] = await Promise.all([
            getMyDashboardLeaves(), getMyDashboardAttendance(), getDashboardUnreadCount(),
          ]);
          data = { leaves: leaveResult.data, attendance: attendanceResult.data, unreadCount: unreadResult.data };
        }
        if (active) setState({ data, loading: false, error: '' });
      } catch (problem) {
        if (active) setState({ data: null, loading: false, error: problem.message || 'Unable to load dashboard data.' });
      }
    }
    load();
    return () => { active = false; };
  }, [role]);

  if (state.loading) return <LoadingDashboard />;
  if (state.error) return <><PageHeading eyebrow="OPERATIONS / OVERVIEW" title="Dashboard" description={`Your workspace overview as ${formatRole(role)}.`} /><div className="notice" role="alert">{state.error}</div></>;

  if (role === 'ADMIN') return <AdminDashboard data={state.data} user={user} />;
  if (role === 'HR') return <HrDashboard data={state.data} user={user} />;
  if (role === 'TEAM_MANAGER') return <ManagerDashboard data={state.data} user={user} />;
  if (role === 'FINANCE') return <FinanceDashboard data={state.data} user={user} />;
  return <EmployeeDashboard data={state.data} user={user} />;
}

function AdminDashboard({ data, user }) {
  const summary = data?.summary || {};
  const departments = data?.departmentEmployeeCounts || [];
  const attendance = data?.todayAttendance || {};
  const leaves = data?.leaveSummary || {};
  return <>
    <PageHeading eyebrow="OPERATIONS / OVERVIEW" title={<>Good morning, {user.username}<span className="heading-period">.</span></>} description="The organization at a glance, using today’s Spring Boot dashboard data." />
    <div className="metric-grid"><MetricTile label="TOTAL EMPLOYEES" value={summary.totalEmployees} note="Across the organization" tone="mint" /><MetricTile label="DEPARTMENTS" value={summary.totalDepartments} note="Active organization units" tone="coral" /><MetricTile label="PENDING LEAVE" value={summary.pendingLeaves} note="Current pending requests" tone="yellow" /><MetricTile label="PAYROLL RECORDS" value={summary.totalPayrollRecords} note="Recorded compensation" tone="blue" /></div>
    <div className="dashboard-section-grid">
      <Card title="Department distribution" eyebrow={`${departments.length} DEPARTMENTS`}><DistributionList items={departments} nameKey="departmentName" countKey="employeeCount" emptyText="No department counts returned." /></Card>
      <Card title="Attendance today" eyebrow={localToday()}><SummaryBars values={attendance} labels={ [['present', 'Present'], ['absent', 'Absent'], ['halfDay', 'Half day'], ['onLeave', 'On leave']] } /></Card>
      <Card title="Leave summary" eyebrow="ALL STATUSES"><SummaryBars values={leaves} labels={ [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['cancelled', 'Cancelled']] } /><Link className="panel-link" to="/leaves">Open leave workspace <span>↗</span></Link></Card>
    </div>
  </>;
}

function HrDashboard({ data, user }) {
  const today = localToday();
  const todayRecords = (data.attendance || []).filter((record) => record.attendanceDate === today);
  const present = todayRecords.filter((record) => record.status === 'PRESENT').length;
  const departments = data.departments || [];
  const distribution = departments.map((department) => ({ departmentName: department.name, employeeCount: (data.employees || []).filter((employee) => employee.department === department.name).length }));
  return <>
    <PageHeading eyebrow="PEOPLE / HR OVERVIEW" title={<>Welcome, {user.username}<span className="heading-period">.</span></>} description="People, departments, and today’s attendance from HR-authorized endpoints." />
    <div className="metric-grid metric-grid-three"><MetricTile label="EMPLOYEES" value={data.employees?.length ?? 0} note="Employee directory" tone="mint" /><MetricTile label="DEPARTMENTS" value={departments.length} note="Organization units" tone="coral" /><MetricTile label="PRESENT TODAY" value={present} note={`${todayRecords.length} attendance records today`} tone="yellow" /></div>
    <Card title="Department distribution" eyebrow="EMPLOYEE DIRECTORY"><DistributionList items={distribution} nameKey="departmentName" countKey="employeeCount" emptyText="No department data returned." /></Card>
    <p className="dashboard-scope-note">Leave queue totals are not available to HR through the current dashboard endpoints.</p>
  </>;
}

function ManagerDashboard({ data, user }) {
  const todayRecord = (data.attendance || []).find((record) => record.attendanceDate === localToday());
  const pending = data.pendingLeaves || [];
  return <>
    <PageHeading eyebrow="TEAM / OVERVIEW" title={<>Your team, {user.username}<span className="heading-period">.</span></>} description="Direct reports, pending decisions, and your own attendance." />
    <div className="metric-grid metric-grid-three"><MetricTile label="DIRECT REPORTS" value={data.team?.length ?? 0} note="Employees assigned to you" tone="mint" /><MetricTile label="PENDING LEAVE" value={pending.length} note="Team decisions needed" tone="yellow" /><MetricTile label="TODAY’S CHECK-IN" value={todayRecord?.checkInTime ? 'Recorded' : 'Not checked in'} note={todayRecord?.checkInTime || 'Your attendance record'} tone="coral" /></div>
    <Card title="Pending team leave" eyebrow={`${pending.length} REQUESTS`} className="table-panel"><div className="team-pending-list">{pending.slice(0, 5).map((leave) => <div key={leave.id} className="compact-row"><div><strong>{leave.employeeName} · {String(leave.leaveType).replaceAll('_', ' ')}</strong><span>{leave.startDate} → {leave.endDate}</span></div><span className="status-pill status-pending">PENDING</span></div>)}{pending.length === 0 && <div className="empty-state"><span>—</span><p>No pending leave requests.</p></div>}</div><Link className="panel-link" to="/leaves/pending">Review team requests <span>↗</span></Link></Card>
  </>;
}

function FinanceDashboard({ data, user }) {
  const payroll = data.payroll || [];
  const netTotal = payroll.reduce((total, record) => total + (Number(record.netSalary) || 0), 0);
  return <>
    <PageHeading eyebrow="FINANCE / OVERVIEW" title={<>Hello, {user.username}<span className="heading-period">.</span></>} description="Payroll and your account notifications, from finance-authorized endpoints." />
    <div className="metric-grid metric-grid-three"><MetricTile label="PAYROLL RECORDS" value={payroll.length} note="Current records returned by payroll API" tone="mint" /><MetricTile label="NET PAYROLL TOTAL" value={netTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} note="Sum of backend net salary values" tone="coral" /><MetricTile label="UNREAD NOTIFICATIONS" value={data.unreadCount ?? 0} note="Account updates" tone="yellow" /></div>
    <Card title="Payroll snapshot" eyebrow="RECENT RECORDS" className="table-panel"><div className="table-scroll"><table><thead><tr><th>Employee</th><th>Employee code</th><th>Net salary</th><th>Effective from</th></tr></thead><tbody>{payroll.slice(0, 6).map((record) => <tr key={record.id}><td>{record.employeeName}</td><td>{record.employeeCode}</td><td>{Number(record.netSalary).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td><td>{record.effectiveFrom}</td></tr>)}</tbody></table>{payroll.length === 0 && <div className="empty-state"><span>—</span><p>No payroll records returned.</p></div>}</div><Link className="panel-link" to="/payroll">Open payroll <span>↗</span></Link></Card>
  </>;
}

function EmployeeDashboard({ data, user }) {
  const leaves = data.leaves || [];
  const attendance = data.attendance || [];
  const pendingLeave = leaves.filter((leave) => leave.status === 'PENDING').length;
  const today = attendance.find((record) => record.attendanceDate === localToday());
  return <>
    <PageHeading eyebrow="YOUR WORKSPACE / OVERVIEW" title={<>Hello, {user.username}<span className="heading-period">.</span></>} description="Your leave requests, attendance, and account updates." action={<Link className="button button-primary" to="/leaves">Request leave <span>↗</span></Link>} />
    <div className="metric-grid metric-grid-three"><MetricTile label="LEAVE REQUESTS" value={leaves.length} note={`${pendingLeave} pending`} tone="mint" /><MetricTile label="ATTENDANCE RECORDS" value={attendance.length} note={today?.checkInTime ? `Checked in at ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(today.checkInTime))}` : 'No check-in today'} tone="coral" /><MetricTile label="UNREAD NOTIFICATIONS" value={data.unreadCount ?? 0} note="Account updates" tone="yellow" /></div>
    <div className="dashboard-section-grid"><Card title="Recent leave requests" eyebrow="YOUR HISTORY">{leaves.slice(0, 5).map((leave) => <div className="compact-row" key={leave.id}><div><strong>{String(leave.leaveType).replaceAll('_', ' ')} leave</strong><span>{leave.startDate} → {leave.endDate}</span></div><span className={`status-pill status-${String(leave.status).toLowerCase()}`}>{leave.status}</span></div>)}{leaves.length === 0 && <div className="empty-state"><span>—</span><p>No leave requests yet.</p></div>}<Link className="panel-link" to="/leaves">Open leave requests <span>↗</span></Link></Card><Card title="Attendance today" eyebrow={localToday()}><SummaryList values={{ checkIn: today?.checkInTime ? '✓' : 0, checkOut: today?.checkOutTime ? '✓' : 0, status: today?.status || '—' }} labels={ [['checkIn', 'Check in'], ['checkOut', 'Check out'], ['status', 'Status']] } /><Link className="panel-link" to="/attendance">Open attendance <span>↗</span></Link></Card></div>
  </>;
}