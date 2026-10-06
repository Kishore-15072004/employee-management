import { useState } from 'react';
import Button from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import Modal from '../components/Modal.jsx';
import { updateMyProfile } from '../services/employeeService.js';

export default function SelfProfileModal({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const request = { ...form };
    if (!request.password) delete request.password;

    try {
      await updateMyProfile(request);
      onSaved();
    } catch (problem) {
      setError(problem.message || 'Unable to update your profile.');
    } finally {
      setBusy(false);
    }
  }

  return <Modal title="Update my profile" onClose={onClose}>
    <Form className="modal-form" onSubmit={submit}>
      <div className="form-two">
        <FormField label="First name"><input required value={form.firstName} onChange={(event) => change('firstName', event.target.value)} /></FormField>
        <FormField label="Last name"><input required value={form.lastName} onChange={(event) => change('lastName', event.target.value)} /></FormField>
      </div>
      <FormField label="Email"><input type="email" required value={form.email} onChange={(event) => change('email', event.target.value)} /></FormField>
      <FormField label="Phone"><input type="tel" required value={form.phone} onChange={(event) => change('phone', event.target.value)} /></FormField>
      <FormField label="New password" hint="Leave blank to keep your current password; minimum 6 characters">
        <input type="password" autoComplete="new-password" minLength="6" value={form.password} onChange={(event) => change('password', event.target.value)} />
      </FormField>
      {error && <div className="notice" role="alert">{error}</div>}
      <div className="modal-actions"><Button type="button" variant="quiet" onClick={onClose}>Cancel</Button><Button busy={busy}>Save changes</Button></div>
    </Form>
  </Modal>;
}