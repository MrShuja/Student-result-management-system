# 📘 Project Best Practices

## 1. Project Purpose
Student Result Management System (SRMS) with a React (Vite + Tailwind) frontend and a Node.js/Express + MongoDB backend. The system manages students, faculty, departments, subjects, results, notices, and transcripts. It supports role-based access control (student, faculty, admin), CRUD operations, GPA calculation, and transcript generation/export.

## 2. Project Structure
- Root
  - client/ — React app (Vite)
    - src/
      - components/ — UI components (Dashboard, LoginPage, Manage* modules, etc.)
      - utils/ — API wrapper (api.js), transcript utilities
      - data/ — sample data used historically
      - styles/ — Tailwind style entrypoints
      - App.jsx, main.jsx — app bootstrap
    - vite.config.js, tailwind.config.cjs, postcss.config.cjs, jsconfig.json
    - index.html
  - server/ — Express API server
    - server.js — API entrypoint, route mounting, middleware
    - config/db.js — Mongo connection
    - controllers/ — Request handlers per domain (auth, students, faculty, departments, subjects, results, notices, transcripts)
    - routes/ — Express routers per domain
    - models/ — Mongoose models per domain (User, Student, Faculty, Department, Subject, Result, Transcript, Notice)
    - middleware/ — auth (JWT + RBAC), error handler
    - utils/helpers.js — ID generation and GPA calculation helpers
    - .env — environment variables (not committed)

Conventions
- RESTful routes mounted under /api/*
- Role checks via middleware (protect, admin, faculty)
- Models use timestamps and references; controllers use populate for rich responses
- Client communicates with server via a centralized fetch wrapper (utils/api.js)

## 3. Test Strategy
Current state: No tests present. Adopt the following approach.

Backend (server)
- Frameworks: Jest + Supertest
- Structure: server/tests or co-located __tests__ next to files
- Unit tests
  - utils/helpers.js (generate IDs, calculateGPA)
  - middleware (auth role gates, error handler)
  - controllers with mocked models (jest.mock for Mongoose model methods)
- Integration tests
  - Route tests with Supertest; use mongodb-memory-server for isolated DB
  - Cover authentication (token issuance, protected routes), RBAC (admin/faculty only endpoints)
- Guidelines
  - Use a dedicated test .env (MONGODB_URI for memory server, JWT_SECRET)
  - Seed small fixtures for results/students/subjects
  - Aim for 80%+ coverage on controllers and middleware

Frontend (client)
- Frameworks: Vitest or Jest + React Testing Library
- Structure: client/src/__tests__ or co-located *.test.jsx next to components
- Unit tests
  - Render Manage* components; assert form validation and table rendering
  - Mock utils/api.js; use MSW for network mocking where appropriate
- Integration tests
  - Critical flows: login, role-based UI visibility, CRUD dialogs (add/edit/delete)
- Guidelines
  - Prefer queries by role or accessible name; avoid fragile testids unless necessary
  - Keep fixtures in a test/fixtures folder

## 4. Code Style
General
- ES Modules throughout ("type": "module")
- Prefer async/await; handle errors consistently
- Enforce formatting/linting with Prettier + ESLint (recommend adding configs)
- Return immediately after res.status(...).json(...) when ending responses

Naming
- React components: PascalCase (e.g., ManageStudents.jsx)
- Mongoose models: PascalCase files and model names (Subject, Result)
- Variables/functions: camelCase
- Files: PascalCase for components/models, kebab-case or camelCase for utility files

Frontend (React)
- Functional components + hooks
- Keep API calls centralized in utils/api.js
- Use environment-based API base URL (VITE_API_BASE_URL) instead of hardcoded http://localhost:5000
- Manage app-wide auth/user with React Context or a state library when complexity increases
- Validate form inputs (HTML validation + custom constraints)
- Handle network errors gracefully via non-blocking UI (toasts/banners) instead of alert

Backend (Express/Mongoose)
- Route/controller/model separation; keep controllers thin; consider adding a services layer for complex logic
- Use centralized error handling: replace inline try/catch res.json with next(err) and rely on error middleware to format responses
- Input validation for all write endpoints (e.g., zod, joi, express-validator)
- Security
  - Never use hardcoded default passwords; enforce invite/reset flow or temporary tokens
  - Sanitize inputs; limit fields updated via whitelists
  - Do not expose stack traces in production (already handled in errorMiddleware by NODE_ENV)
  - Consider httpOnly cookies for JWT in production; if using localStorage, enforce strong CSP and avoid inline scripts (XSS)
- Mongoose patterns
  - Use lean() for read endpoints when you don’t need document methods
  - Avoid ID generation via countDocuments due to race conditions; prefer unique indexes + collision-resistant strategies
  - Ensure pre('save') hooks short-circuit correctly (see Do’s/Don’ts)

Error/Exception Handling
- Consistent error shape: { message } for client consumption
- Map domain errors to appropriate status codes (400, 401, 403, 404, 409, 422, 500)
- Surface validation errors with details; avoid generic 500 where possible

## 5. Common Patterns
- RESTful endpoints: CRUD per entity (students, faculty, departments, subjects, results, notices, transcripts)
- Role-based access: protect + admin or faculty middleware
- Population: populate user/department/subject to provide enriched responses
- Derived data: calculateGPA in helpers; transcript generation assembles results and aggregates
- Client data loading: use Promise.all and dedicated refresh* functions per entity
- UI avatars: default URLs via ui-avatars.com

Recommended Extensions
- Async handler: wrap controllers with a generic asyncHandler(fn) to eliminate repetitive try/catch
- Validation: schemas per endpoint (e.g., zod) + centralized middleware
- Logging: add morgan or pino-http for HTTP access logs
- Pagination/filtering: support query params (page, limit, search) for list endpoints
- Caching: consider ETag/Last-Modified or in-memory caching for static lists (departments/subjects)

## 6. Do’s and Don’ts
Do
- Use environment variables for secrets and configuration (JWT_SECRET, MONGODB_URI, PORT, VITE_API_BASE_URL)
- Protect all sensitive endpoints and enforce RBAC in routes
- Validate and sanitize all inputs at route boundaries
- Import every model you reference in a controller
- Return after sending a response to avoid double sends
- Use populate thoughtfully; prefer lean() when read-only and no virtuals are needed
- Handle deletions with referential integrity checks (e.g., deny deleting Students with Results)
- Keep error messages user-friendly and actionable

Don’t
- Don’t use hardcoded default passwords (e.g., 'defaultPassword123') for created users
- Don’t generate IDs via countDocuments; it’s not concurrency-safe
- Don’t leave base URLs hardcoded in client code; use env configs
- Don’t forget to return next() in Mongoose pre hooks when skipping work
- Don’t reference models (e.g., Department in facultyController.delete) without importing them
- Don’t leak stack traces or internal errors to clients in production
- Don’t block the UI with alert for error reporting; prefer non-blocking notifications

## 7. Tools & Dependencies
Backend
- express — web framework
- mongoose — MongoDB ODM
- bcryptjs — password hashing
- jsonwebtoken — JWT auth
- cors — CORS handling
- dotenv — env loading
- nodemon — dev reloader

Frontend
- react, react-dom — UI framework
- react-icons — icon set
- tailwindcss, postcss, autoprefixer — styling
- vite — build tool
- html2canvas, jspdf — transcript/preview export to images/PDFs

Setup
- Backend
  - cd server && npm install
  - Create server/.env with:
    - MONGODB_URI=mongodb+srv://...
    - JWT_SECRET=change_me
    - PORT=5000 (optional)
  - npm run dev (nodemon) or npm start
- Frontend
  - cd client && npm install
  - Create client/.env with:
    - VITE_API_BASE_URL=http://localhost:5000
  - npm run dev

## 8. Other Notes
Guidelines for extending the repo (LLM-aware)
- New entity flow (example: Courses)
  1) Define Mongoose model in server/models with indexes/validation
  2) Create controller with CRUD using async/await and next(err) on failure
  3) Create routes with protect + proper role middleware; mount in server/server.js under /api/courses
  4) On client, add API calls via utils/api.js and build a ManageCourses component following Manage* patterns
  5) Register the view in MainContent and Sidebar if needed; add refresh* function in App
- Maintain referential integrity rules similar to existing ones:
  - Students cannot be deleted if results exist
  - Departments cannot be deleted if faculty assigned
  - Faculty cannot be deleted if head of a department
- For transcripts and GPA calculations
  - Use calculateGPA; ensure results include credits and valid grade enums
  - Consider caching transcript snapshots; regenerate on result changes
- Security improvements to prefer
  - Replace localStorage token storage with httpOnly cookies in production
  - Add rate limiting (e.g., express-rate-limit) to auth endpoints
  - Add helmet for common HTTP headers
- Known alignment gaps to fix when modifying code
  - helpers.generateStudentId currently expects departmentCode; ensure callers pass it or refactor helper to compute IDs without it
  - userSchema.pre('save') should return next() when password unchanged to avoid re-hashing
  - facultyController.delete references Department but does not import it; import and handle dependency
- Prefer configuration-driven base URLs; in client utils/api.js, read from import.meta.env.VITE_API_BASE_URL and default to current origin in development
