import { useState } from 'react';
import Button from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import Modal from '../components/Modal.jsx';
import { createPayroll, updatePayroll } from '../services/payrollService.js';

export default function PayrollFormModal({ payroll, onClose, onSaved }) {
  const [employeeId, setEmployeeId] = useState(String(payroll?.employeeId || ''));
  const [form, setForm] = useState({ baseSalary: payroll?.baseSalary ?? '', allowances: payroll?.allowances ?? '0', deductions: payroll?.deductions ?? '0', effectiveFrom: payroll?.effectiveFrom || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function change(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const body = { baseSalary: Number(form.baseSalary), allowances: Number(form.allowances), deductions: Number(form.deductions), effectiveFrom: form.effectiveFrom };
    try {
      if (payroll) await updatePayroll(payroll.employeeId, body);
      else await createPayroll(employeeId, body);
      onSaved();
    } catch (problem) { setError(problem.message || 'Unable to save payroll record.'); }
    finally { setBusy(false); }
  }
  return <Modal title={payroll ? `Update payroll / ${payroll.employeeName}` : 'Create payroll record'} onClose={onClose}><Form className="modal-form" onSubmit={submit}>
    {!payroll && <FormField label="Employee ID"><input type="number" min="1" required value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} /><small className="field-hint">The payroll API accepts an employee ID; employee listing is not available to FINANCE.</small></FormField>}
    <FormField label="Base salary"><input type="number" min="0.01" step="0.01" required value={form.baseSalary} onChange={(event) => change('baseSalary', event.target.value)} /></FormField>
    <div className="form-two"><FormField label="Allowances"><input type="number" min="0" step="0.01" required value={form.allowances} onChange={(event) => change('allowances', event.target.value)} /></FormField><FormField label="Deductions"><input type="number" min="0" step="0.01" required value={form.deductions} onChange={(event) => change('deductions', event.target.value)} /></FormField></div>
    <FormField label="Effective from"><input type="date" required value={form.effectiveFrom} onChange={(event) => change('effectiveFrom', event.target.value)} /></FormField>
    {error && <div className="notice" role="alert">{error}</div>}
    <div className="modal-actions"><Button type="button" variant="quiet" onClick={onClose}>Cancel</Button><Button busy={busy}>{payroll ? 'Save changes' : 'Create record'}</Button></div>
  </Form></Modal>;
}