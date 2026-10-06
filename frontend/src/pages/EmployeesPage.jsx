import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { deleteEmployee, listEmployees, assignEmployeeManager } from '../services/employeeService.js';
import { listDepartments } from '../services/departmentService.js';
import { formatRole, toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';
import EmployeeFormModal from './EmployeeFormModal.jsx';

export default function EmployeesPage() {
  const { role } = useAuth();
  const { push } = useToast();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');
  const [modalEmployee, setModalEmployee] = useState(undefined);
  const [managerForm, setManagerForm] = useState({ employeeId: '', managerId: '' });
  const [managerBusy, setManagerBusy] = useState(false);
  const canEdit = ['ADMIN', 'HR'].includes(role);

  async function load() {
    setLoading(true); setError('');
    try {
      const requests = [listEmployees()];
      if (canEdit) requests.push(listDepartments());
      const [employeeResult, departmentResult] = await Promise.all(requests);
      setEmployees(toList(employeeResult.data));
      setDepartments(toList(departmentResult?.data));
    } catch (problem) { setError(problem.message || 'Unable to load employees.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => employees.filter((employee) => `${employee.employeeCode} ${employee.firstName} ${employee.lastName} ${employee.email} ${employee.phone} ${employee.department} ${employee.designation} ${employee.managerName || ''}`.toLowerCase().includes(query.toLowerCase())).sort((left, right) => {
    const leftValue = sort === 'department' ? left.department : sort === 'designation' ? left.designation : `${left.firstName} ${left.lastName}`;
    const rightValue = sort === 'department' ? right.department : sort === 'designation' ? right.designation : `${right.firstName} ${right.lastName}`;
    return (leftValue || '').localeCompare(rightValue || '');
  }), [employees, query, sort]);

  async function remove(employee) {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`)) return;
    try { await deleteEmployee(employee.id); push('Employee deleted.', 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to delete employee.', 'error'); }
  }

  async function assignManager(event) {
    event.preventDefault(); setManagerBusy(true);
    try {
      await assignEmployeeManager(managerForm.employeeId, managerForm.managerId);
      push('Manager assignment saved.', 'success');
      setManagerForm({ employeeId: '', managerId: '' });
      await load();
    } catch (problem) { push(problem.message || 'Unable to assign manager.', 'error'); }
    finally { setManagerBusy(false); }
  }

  const columns = [
    { key: 'employee', label: 'Employee', render: (employee) => <div className="person-cell"><span className="person-avatar">{`${employee.firstName[0] || ''}${employee.lastName[0] || ''}`.toUpperCase()}</span><span><strong>{employee.firstName} {employee.lastName}</strong><small>{employee.employeeCode} · {employee.email}</small></span></div> },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'managerName', label: 'Manager', render: (employee) => employee.managerName || 'Unassigned' },
    { key: 'actions', label: 'Actions', render: (employee) => <div className="row-actions"><Link className="small-action" to={`/employees/${employee.id}`}>View</Link>{canEdit && <button className="small-action" onClick={() => setModalEmployee(employee)}>Edit</button>}{role === 'ADMIN' && <button className="small-action danger-text" onClick={() => remove(employee)}>Delete</button>}</div> },
  ];

  return <>
    <PageHeading eyebrow="PEOPLE / DIRECTORY" title="Employees" description="Search the directory, review employee records, and manage reporting lines." action={canEdit && <Button onClick={() => setModalEmployee(null)}>+ Add employee</Button>} />
    <Card title="Employee directory" eyebrow={`${filtered.length} RECORDS`} className="table-panel">
      <div className="directory-toolbar"><input className="search-input" placeholder="Search name, code, email, department…" aria-label="Search employees" value={query} onChange={(event) => setQuery(event.target.value)} /><label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name</option><option value="department">Department</option><option value="designation">Designation</option></select></label></div>
      <DataTable columns={columns} rows={filtered} loading={loading} error={error} emptyMessage="No employees match this search." />
    </Card>
    {canEdit && <Card title="Manager assignment" eyebrow="REPORTING LINE" className="manager-panel"><p className="foundation-copy">Choose the employee and enter the employee ID of a user assigned the TEAM_MANAGER role. The backend validates the manager.</p><Form className="inline-form" onSubmit={assignManager}><FormField label="Employee"><select required value={managerForm.employeeId} onChange={(event) => setManagerForm({ ...managerForm, employeeId: event.target.value })}><option value="">Select employee</option>{employees.map((employee) => <option value={employee.id} key={employee.id}>{employee.firstName} {employee.lastName} · #{employee.id}</option>)}</select></FormField><FormField label="Team manager employee ID"><input type="number" min="1" required value={managerForm.managerId} onChange={(event) => setManagerForm({ ...managerForm, managerId: event.target.value })} /></FormField><Button busy={managerBusy}>Assign manager</Button></Form></Card>}
    {modalEmployee !== undefined && <EmployeeFormModal employee={modalEmployee || null} departments={departments} onClose={() => setModalEmployee(undefined)} onSaved={() => { setModalEmployee(undefined); push('Employee record saved.', 'success'); load(); }} />}
  </>;
}