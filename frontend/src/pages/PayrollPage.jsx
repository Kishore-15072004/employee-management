import { useEffect, useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import DataTable from '../components/DataTable.jsx';
import useToast from '../hooks/useToast.js';
import { getEmployeePayroll, listPayroll } from '../services/payrollService.js';
import PayrollFormModal from './PayrollFormModal.jsx';
import { toList } from '../utils/format.js';
import PageHeading from './PageHeading.jsx';

function amount(value) { return value == null ? '—' : Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }); }

export default function PayrollPage() {
  const { push } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(undefined);
  async function load() {
    setLoading(true); setError('');
    try { const { data } = await listPayroll(); setRows(toList(data)); }
    catch (problem) { setError(problem.message || 'Unable to load payroll.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function refreshRecord(record) {
    try {
      const { data } = await getEmployeePayroll(record.employeeId);
      push(`Payroll record refreshed for ${data.employeeName}.`, 'success');
      await load();
    } catch (problem) { push(problem.message || 'Unable to retrieve this payroll record.', 'error'); }
  }
  const columns = [
    { key: 'employee', label: 'Employee', render: (record) => <div className="person-cell"><span className="person-avatar">{record.employeeName?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{record.employeeName}</strong><small>{record.employeeCode} · ID {record.employeeId}</small></span></div> },
    { key: 'baseSalary', label: 'Base salary', render: (record) => amount(record.baseSalary) },
    { key: 'allowances', label: 'Allowances', render: (record) => amount(record.allowances) },
    { key: 'deductions', label: 'Deductions', render: (record) => amount(record.deductions) },
    { key: 'netSalary', label: 'Net salary', render: (record) => <strong>{amount(record.netSalary)}</strong> },
    { key: 'effectiveFrom', label: 'Effective from' },
    { key: 'actions', label: 'Actions', render: (record) => <div className="row-actions"><button className="small-action" onClick={() => setEditing(record)}>Edit</button><button className="small-action" onClick={() => refreshRecord(record)}>Refresh</button></div> },
  ];
  return <>
    <PageHeading eyebrow="COMPENSATION / PAYROLL" title="Payroll" description="Manage effective compensation records. Net salary is displayed from the backend response." action={<Button onClick={() => setEditing(null)}>+ Add payroll</Button>} />
    <Card title="Payroll records" eyebrow={`${rows.length} RECORDS`} className="table-panel"><DataTable columns={columns} rows={rows} loading={loading} error={error} emptyMessage="No payroll records found." /></Card>
    {editing !== undefined && <PayrollFormModal payroll={editing || null} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); push('Payroll record saved.', 'success'); load(); }} />}
  </>;
}