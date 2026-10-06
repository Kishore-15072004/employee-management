import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';
import { deleteDepartment, listDepartments } from '../services/departmentService.js';
import DepartmentFormModal from './DepartmentFormModal.jsx';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

export default function DepartmentsPage() {
  const { role } = useAuth();
  const { push } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(undefined);
  async function load() {
    setLoading(true); setError('');
    try { const { data } = await listDepartments(); setDepartments(toList(data)); }
    catch (problem) { setError(problem.message || 'Unable to load departments.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function remove(department) {
    if (!window.confirm(`Delete ${department.name}? Departments with employees cannot be deleted.`)) return;
    try { await deleteDepartment(department.id); push('Department deleted.', 'success'); await load(); }
    catch (problem) { push(problem.message || 'Unable to delete department.'); }
  }
  const columns = [
    { key: 'name', label: 'Department', render: (department) => <Link className="table-primary-link" to={`/departments/${department.id}`}>{department.name}</Link> },
    { key: 'description', label: 'Description', render: (department) => department.description || '—' },
    { key: 'actions', label: 'Actions', render: (department) => <div className="row-actions"><Link className="small-action" to={`/departments/${department.id}`}>Employees</Link><button className="small-action" onClick={() => setEditing(department)}>Edit</button>{role === 'ADMIN' && <button className="small-action danger-text" onClick={() => remove(department)}>Delete</button>}</div> },
  ];
  return <>
    <PageHeading eyebrow="PEOPLE / STRUCTURE" title="Departments" description="Manage organization teams and review their employee membership." action={<Button onClick={() => setEditing(null)}>+ New department</Button>} />
    <Card title="Department directory" eyebrow={`${departments.length} DEPARTMENTS`} className="table-panel"><DataTable columns={columns} rows={departments} loading={loading} error={error} emptyMessage="No departments have been created." /></Card>
    {editing !== undefined && <DepartmentFormModal department={editing || null} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); push('Department saved.', 'success'); load(); }} />}
  </>;
}