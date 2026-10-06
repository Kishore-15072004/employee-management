# Employee Management Frontend

React + Vite frontend for the existing Spring Boot API. The application uses React Router, Axios, and the browser Context API. Authentication, all business workflows, and role-specific dashboards are implemented.

## Run

1. Start Spring Boot on `http://localhost:8080`.
2. From this directory, run `npm install` and `npm run dev`.
3. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

`VITE_API_BASE_URL` is set in `.env`. Spring Security permits localhost CORS origins so browser requests, including JWT preflights, can reach the API. Production origins should be configured deliberately.

Sign-in uses `POST /auth/login`. Accounts are provisioned by an administrator; employees cannot register themselves. The returned JWT and username/role are kept in `sessionStorage` and the JWT is attached to API requests. A `401` clears the session and routes back to sign-in. Users must still be authorized by Spring Security; frontend role routing is for navigation only.

Employee directory includes search and sorting, create/edit/delete controls, manager assignment, and profile details. Salary is shown only to ADMIN; the backend has no endpoint for an admin/HR leave summary of another employee, so leave counts are shown only for the signed-in employee using `/leaves/my`. User management is ADMIN-only; department management is ADMIN/HR with delete restricted to ADMIN.

Leave screens support own requests and cancellation plus the TEAM_MANAGER pending queue. ADMIN/HR do not have a list endpoint for unassigned leave requests, so the interface does not invent one. Attendance supports self records, ADMIN/HR organization records, and manager direct-report records. Payroll is ADMIN/FINANCE-only and displays backend-provided net salary. Notification inbox and read actions are scoped to the signed-in account. Dashboards use the ADMIN dashboard aggregate or endpoints authorized to each other role; values are not seeded or hardcoded.

Run `npm run build` for the production compile. Live end-to-end checks for each role require valid accounts and representative employee/payroll/leave records in the backend database.