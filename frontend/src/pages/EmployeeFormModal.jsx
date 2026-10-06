import { useState } from 'react';
import Button from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import Modal from '../components/Modal.jsx';
import { createEmployee, updateEmployee } from '../services/employeeService.js';

export default function EmployeeFormModal({ employee, departments, onClose, onSaved }) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(isEdit ? {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    departmentId: String(departments.find((department) => department.name === employee.department)?.id || ''),
    designation: employee.designation,
  } : { employeeCode: '', firstName: '', lastName: '', email: '', phone: '', departmentId: '', designation: '', salary: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function change(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    const body = { ...form, departmentId: Number(form.departmentId) };
    try {
      if (isEdit) await updateEmployee(employee.id, body);
      else {
        body.salary = Number(body.salary);
        await createEmployee(body);
      }
      onSaved();
    } catch (problem) { setError(problem.message || 'Unable to save employee.'); }
    finally { setBusy(false); }
  }

  return <Modal title={isEdit ? 'Edit employee' : 'Create employee'} onClose={onClose}>
    <Form className="modal-form" onSubmit={submit}>
      {!isEdit && <>
        <FormField label="Login username" hint="4 to 50 characters"><input minLength="4" maxLength="50" required value={form.username} onChange={(event) => change('username', event.target.value)} /></FormField>
        <FormField label="Temporary password" hint="At least 6 characters"><input type="password" minLength="6" required value={form.password} onChange={(event) => change('password', event.target.value)} /></FormField>
        <FormField label="Employee code"><input required value={form.employeeCode} onChange={(event) => change('employeeCode', event.target.value)} /></FormField>
      </>}
      <div className="form-two">
        <FormField label="First name"><input required value={form.firstName} onChange={(event) => change('firstName', event.target.value)} /></FormField>
        <FormField label="Last name"><input required value={form.lastName} onChange={(event) => change('lastName', event.target.value)} /></FormField>
      </div>
      <FormField label="Email"><input type="email" required value={form.email} onChange={(event) => change('email', event.target.value)} /></FormField>
      <FormField label="Phone"><input type="tel" required value={form.phone} onChange={(event) => change('phone', event.target.value)} /></FormField>
      <FormField label="Department"><select required value={form.departmentId} onChange={(event) => change('departmentId', event.target.value)}><option value="">Select department</option>{departments.map((department) => <option value={department.id} key={department.id}>{department.name}</option>)}</select></FormField>
      <FormField label="Designation"><input required value={form.designation} onChange={(event) => change('designation', event.target.value)} /></FormField>
      {!isEdit && <FormField label="Salary"><input type="number" min="0.01" step="0.01" required value={form.salary} onChange={(event) => change('salary', event.target.value)} /></FormField>}
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="modal-actions"><Button type="button" variant="quiet" onClick={onClose}>Cancel</Button><Button busy={busy}>{isEdit ? 'Save changes' : 'Create employee'}</Button></div>
    </Form>
  </Modal>;
}