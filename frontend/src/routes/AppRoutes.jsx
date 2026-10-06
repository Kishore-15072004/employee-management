import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import DepartmentDetailsPage from '../pages/DepartmentDetailsPage.jsx';
import DepartmentsPage from '../pages/DepartmentsPage.jsx';
import AttendancePage from '../pages/AttendancePage.jsx';
import EmployeeDetailsPage from '../pages/EmployeeDetailsPage.jsx';
import EmployeesPage from '../pages/EmployeesPage.jsx';
import LeavesPage from '../pages/LeavesPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ModulePlaceholder from '../pages/ModulePlaceholder.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import PayrollPage from '../pages/PayrollPage.jsx';
import UsersPage from '../pages/UsersPage.jsx';
import GuestRoute from './GuestRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleBasedRoute from './RoleBasedRoute.jsx';

export default function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register" element={<Navigate to="/login" replace />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<EmployeeDetailsPage selfProfile />} />
      <Route element={<RoleBasedRoute roles={['ADMIN', 'HR', 'TEAM_MANAGER']} />}><Route path="/employees" element={<EmployeesPage />} /></Route>
      <Route element={<RoleBasedRoute roles={['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE']} />}><Route path="/employees/:id" element={<EmployeeDetailsPage />} /></Route>
      <Route element={<RoleBasedRoute roles={['ADMIN']} />}><Route path="/users" element={<UsersPage />} /></Route>
      <Route element={<RoleBasedRoute roles={['ADMIN', 'HR']} />}><Route path="/departments" element={<DepartmentsPage />} /><Route path="/departments/:id" element={<DepartmentDetailsPage />} /></Route>
      <Route path="/leaves" element={<LeavesPage />} />
      <Route element={<RoleBasedRoute roles={['TEAM_MANAGER']} />}><Route path="/leaves/pending" element={<LeavesPage />} /></Route>
      <Route element={<RoleBasedRoute roles={['ADMIN', 'FINANCE']} />}><Route path="/payroll" element={<PayrollPage />} /></Route>
      <Route element={<RoleBasedRoute roles={['ADMIN', 'HR', 'FINANCE', 'TEAM_MANAGER', 'EMPLOYEE']} />}><Route path="/attendance" element={<AttendancePage />} /></Route>
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="*" element={<ModulePlaceholder />} />
    </Route></Route>
  </Routes>;
}