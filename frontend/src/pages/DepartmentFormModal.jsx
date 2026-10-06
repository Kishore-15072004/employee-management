import { useState } from 'react';
import Button from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import Modal from '../components/Modal.jsx';
import { createDepartment, updateDepartment } from '../services/departmentService.js';

export default function DepartmentFormModal({ department, onClose, onSaved }) {
  const [form, setForm] = useState({ name: department?.name || '', description: department?.description || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const body = { name: form.name.trim(), description: form.description.trim() };
      if (department) await updateDepartment(department.id, body);
      else await createDepartment(body);
      onSaved();
    } catch (problem) { setError(problem.message || 'Unable to save department.'); }
    finally { setBusy(false); }
  }
  return <Modal title={department ? 'Edit department' : 'Create department'} onClose={onClose}><Form className="modal-form" onSubmit={submit}>
    <FormField label="Department name"><input maxLength="100" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
    <FormField label="Description"><textarea maxLength="255" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></FormField>
    {error && <div className="notice" role="alert">{error}</div>}
    <div className="modal-actions"><Button type="button" variant="quiet" onClick={onClose}>Cancel</Button><Button busy={busy}>{department ? 'Save changes' : 'Create department'}</Button></div>
  </Form></Modal>;
}