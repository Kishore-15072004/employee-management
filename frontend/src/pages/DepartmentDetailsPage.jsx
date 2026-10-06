import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getDepartment, listDepartmentEmployees } from '../services/departmentService.js';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([getDepartment(id), listDepartmentEmployees(id)])
      .then(([departmentResult, employeeResult]) => { setDepartment(departmentResult.data); setEmployees(toList(employeeResult.data)); })
      .catch((problem) => setError(problem.message || 'Unable to load department details.'))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <LoadingState label="Loading department…" />;
  if (error) return <Card title="Department details"><div className="notice" role="alert">{error}</div><Link className="panel-link" to="/departments">Back to departments</Link></Card>;
  return <>
    <PageHeading eyebrow="PEOPLE / STRUCTURE / DEPARTMENT" title={department.name} description={department.description || 'No department description.'} action={<Link className="button button-secondary" to="/departments">All departments</Link>} />
    <Card title="Employees" eyebrow={`${employees.length} MEMBERS`} className="table-panel"><DataTable columns={[{ key: 'employeeCode', label: 'Code' }, { key: 'name', label: 'Employee', render: (employee) => <Link className="table-primary-link" to={`/employees/${employee.id}`}>{employee.firstName} {employee.lastName}</Link> }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'designation', label: 'Designation' }, { key: 'managerName', label: 'Manager', render: (employee) => employee.managerName || 'Unassigned' }]} rows={employees} emptyMessage="There are no employees in this department." /></Card>
  </>;
}