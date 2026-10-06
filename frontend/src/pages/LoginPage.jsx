import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import Form from '../components/Form.jsx';
import FormField from '../components/FormField.jsx';
import useAuth from '../hooks/useAuth.js';
import useToast from '../hooks/useToast.js';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login({ username: form.username.trim(), password: form.password });
      push('Welcome back.', 'success');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (problem) {
      setError([401, 403].includes(problem.response?.status)
        ? 'Sign-in was rejected. Check your username and password, or contact an administrator about your account.'
        : problem.message || 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return <AuthLayout>
    <div className="auth-kicker">PEOPLEOS / SECURE SIGN IN</div>
    <h1>Welcome<br /><em>back.</em></h1>
    <p className="auth-copy">Sign in with your organization-issued credentials.</p>
    <Form onSubmit={submit}>
      <FormField label="Username"><input autoComplete="username" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></FormField>
      <FormField label="Password"><input type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></FormField>
      {error && <div className="notice" role="alert">{error}</div>}
      <Button busy={busy} className="button-wide">Sign in <span>↗</span></Button>
    </Form>
    <div className="auth-access-note"><strong>Need access?</strong><span>Contact your administrator. Employee accounts are issued by your organization.</span></div>
  </AuthLayout>;
}