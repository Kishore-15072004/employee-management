import { useLocation, useParams } from 'react-router-dom';
import Card from '../components/Card.jsx';
import PageHeading from './PageHeading.jsx';

const content = {
  employees: ['Employees', 'Employee directory and profile routes.'],
  users: ['Users', 'Administrative account management.'],
  departments: ['Departments', 'Department records and team membership.'],
  leaves: ['Leaves', 'Leave requests and request history.'],
  pending: ['Pending team leaves', 'Manager review queue.'],
  payroll: ['Payroll', 'Compensation records for authorized finance roles.'],
  attendance: ['Attendance', 'Check-in and attendance records.'],
  notifications: ['Notifications', 'Updates for your account.'],
  login: ['Sign in', 'Authentication will be implemented in Phase 2.'],
};

export default function ModulePlaceholder() {
  const location = useLocation();
  const { id } = useParams();
  const key = location.pathname === '/leaves/pending' ? 'pending' : location.pathname.split('/')[1];
  const [title, description] = content[key] || ['Page not found', 'This route is not recognized.'];
  return <><PageHeading eyebrow="PEOPLE OPERATIONS / PHASE 1" title={id ? `${title} #${id}` : title} description={description} /><Card title="Route is ready" eyebrow="FEATURE SCREEN / NEXT PHASE"><p className="foundation-copy">The navigation and application architecture are in place. This module remains a placeholder until its phase begins.</p></Card></>;
}