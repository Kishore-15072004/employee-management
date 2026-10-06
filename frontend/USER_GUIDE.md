# PeopleOS User Guide

This guide describes the current React frontend and its Spring Boot API permissions. Frontend role checks control navigation only; Spring Security and the backend services enforce access to data and actions.

## Start the application

1. Start the Spring Boot backend at `http://localhost:8080`.
2. Open a terminal in `frontend/` and run `npm install` once.
3. Run `npm run dev` and open the Vite URL printed in the terminal (normally `http://localhost:5173`).
4. Sign in at `/login`.

The frontend API URL is configured in `frontend/.env` as `VITE_API_BASE_URL=http://localhost:8080`. The backend currently allows CORS from localhost origins for development. Configure the deployed frontend origin deliberately before production deployment.

## First-time setup

There is no public registration. For a fresh database, run `ems.sql` to create the database, start Spring Boot once so Hibernate creates the tables, then run `bootstrap-admin.sql` to insert the first ADMIN as an Employee. `ems.sql` drops the existing `employee_management` database, so only run it when intentionally resetting all data. Replace the sample ADMIN employee profile values in `bootstrap-admin.sql` with real details before running it. Existing `/register` links redirect to sign-in.

For an existing installation, back up the database and migrate each account from the old User row into its matching Employee row before deploying this version. Copy the stored password hash, username, role, and enabled status, and remap notification ownership to the employee. User rows without a matching employee are intentionally not retained. Hibernate `ddl-auto=update` does not perform this data migration.

After the first ADMIN is available, ADMIN or HR creates each employee and login together:

1. Open **Employees** and choose **Add employee**.
2. Enter a login username and temporary password along with the employee code, contact details, department, designation, and salary.
3. Save the employee. The password is stored as a hash, and the new account starts with the `EMPLOYEE` role.

There is no standalone user account. Only a registered Employee row can authenticate. ADMIN and HR accounts are also employee records and need their own employee details and credentials.

## Sign in and session

- Sign in with the backend username and password. The app stores the returned JWT and username/role in the current browser session.
- The JWT is attached to API requests as `Authorization: Bearer <token>`.
- Sign out from the profile area in the sidebar. This clears the current session.
- An expired/invalid JWT clears the session and returns the browser to `/login`.
- Only ADMIN can change employee account roles or enabled status. Contact an administrator if you need access.

## Role access

| Area or action | ADMIN | HR | FINANCE | TEAM_MANAGER | EMPLOYEE |
|---|---|---|---|---|---|
| Dashboard | Organization aggregates | People, department, attendance data | Payroll and unread count | Direct reports, pending team leave, own attendance | Own leave, attendance, unread count |
| Employee directory | All employees; create/edit/delete | All employees; create/edit | Not available | Assigned team listing | Not available |
| Employee profile | Any profile; salary section | Any profile; no salary section | Not available in the profile UI | Assigned team members | Own profile only, if the employee ID is known |
| Create/edit employee | Yes | Yes | No | No | No |
| Delete employee | Yes | No | No | No | No |
| Assign a manager | Yes | Yes | No | No | No |
| Users and role/status administration | Yes | No | No | No | No |
| Departments | Create, read, update, delete | Create, read, update | No | No | No |
| Leave requests | Own requests; backend can decide any request | Own requests; backend can decide unassigned requests | Own requests | Own requests and direct-team pending queue/decisions | Own requests |
| Attendance | Own and organization-wide | Own and organization-wide | Own attendance | Own and direct-team attendance | Own attendance |
| Payroll | Yes | No | Yes | No | No |
| Notifications | Own account | Own account | Own account | Own account | Own account |

The frontend hides routes and controls outside these roles for usability. Direct API access remains governed by Spring Security and service-level checks.

## Employee management

### Directory

ADMIN, HR, and TEAM_MANAGER can open **Employees**. Search matches employee code, name, email, phone, department, designation, and manager. Use **Sort by** to order by name, department, or designation. Choose **View** to open a profile.

ADMIN and HR can create or edit an employee. Creation requires a unique username, password, employee code, email, department, and positive salary. New employee accounts start with the `EMPLOYEE` role. Editing changes personal/employment fields; the backend update contract does not accept employee code, salary, or login credentials. Only ADMIN can delete an employee. A delete may be rejected if the employee manages others.

### Manager assignment

ADMIN and HR can select an employee and enter the manager's **employee ID**. The backend verifies that the selected employee has the `TEAM_MANAGER` role and rejects self-assignment or an invalid manager.

### Employee profile

Every signed-in role can open **My profile** to view their own record and update their first name, last name, email, phone, or password. Self-service updates do not change salary, department, designation, employee code, role, or account status. The password field is optional; leaving it blank keeps the existing password.

ADMIN and HR can view any employee; TEAM_MANAGER can view assigned team members; EMPLOYEE can view only their own profile. The page shows personal details, employment/department/manager details, attendance history, and an ADMIN-only salary section. The signed-in employee also sees a summary of their own leave history.

The backend has no `/employees/me` endpoint. An EMPLOYEE profile route requires an employee ID, and the employee directory endpoint is not available to EMPLOYEE, so the employee ID must be supplied by an administrator or HR.

## User administration

Only ADMIN sees **Employee access**. From this page:

- Change an existing employee's role in the role selector. On subsequent API requests the backend reloads the employee's current role from the database. The target employee's open frontend session caches its navigation role, so they may need to sign out and back in (or reload) to refresh visible navigation.
- Use **Disable account** or **Enable account** to change the account status. Disabling blocks authentication at the backend.

## Departments

ADMIN and HR can create, view, and edit departments. Open a department name or choose **Employees** to see its members. Only ADMIN can delete. The backend returns a conflict if the department name already exists or if employees are still assigned; move those employees first, then retry deletion.

## Leave

All roles can apply for leave and view their own request history from **Leaves**.

1. Choose `CASUAL`, `SICK`, `EARNED`, or `UNPAID`.
2. Select start/end dates and enter a reason.
3. Submit. The backend creates the request as `PENDING` and rejects invalid date ranges, overlapping pending/approved leave, and invalid values.
4. Cancel is available only for your own `PENDING` requests.

TEAM_MANAGER sees **Pending leaves** for direct reports and can approve or reject a pending request. These actions generate notifications for the employee.

The backend has no general endpoint to list approval queues for ADMIN or HR. ADMIN can decide any leave request and HR can decide requests without a manager if they have the request ID, but the frontend cannot offer those queues without an API list endpoint. The current ADMIN/HR page calls out this limitation rather than showing invented data.

## Attendance

Every role can check in/out and view their own records. Check in is available once per day; check out is available after a check-in and only once. Backend rules decide whether an operation is valid.

- ADMIN/HR can switch between their own records and organization-wide attendance.
- TEAM_MANAGER can choose a direct report and view that employee's attendance, or return to their own records.
- FINANCE and EMPLOYEE can view their own records only.

Records show date, check-in/out time, and status (`PRESENT`, `ABSENT`, `HALF_DAY`, or `ON_LEAVE`).

## Payroll

Only ADMIN and FINANCE can open **Payroll**. Create a record with employee ID, base salary, allowances, deductions, and effective date. The backend validates positive base salary and nonnegative allowances/deductions. Edit an existing employee's payroll record from the table. The table displays the backend's `netSalary`; the frontend does not use its own calculation as the source of truth.

FINANCE cannot call the employee directory endpoint, so the create form asks for an employee ID rather than a name selector. Use an employee ID supplied by ADMIN/HR.

## Notifications

All signed-in users can open the inbox or the top-navigation bell. The bell shows the unread count and a short unread list. In **Notifications**, switch between all and unread items, mark one as read, or mark all as read. Notification content is always scoped to the signed-in account.

## Errors and limitations

- `400`: check required fields, date ranges, and numeric constraints.
- `401`: session expired/invalid; sign in again.
- `403`: the backend rejected the role, ownership, or team relationship.
- `404`: the requested employee, department, leave, or payroll record was not found.
- `409`: duplicate/in-use data or another conflicting state; follow the message and retry.
- `500`: server error; retry later or ask the backend administrator.

The frontend uses inline errors and toast messages where appropriate. It does not provide pagination, backend-side sorting, bulk actions, employee-wide leave summaries, or approval queues the API does not expose.

## Troubleshooting

- **Sign-in rejected:** verify credentials, account enabled state, and that the backend is running.
- **Employee record not found:** ADMIN/HR must create an Employee record linked to the user's username.
- **403 after an action:** the backend may restrict the request to an owner, direct manager, or particular role; frontend visibility does not override this.
- **Browser CORS error:** confirm the backend permits the Vite origin and `Authorization`/`Content-Type` headers. Development currently allows localhost origins only.
- **Conflicting department/employee change:** read the API error message; existing assignments may need to be changed before deletion.