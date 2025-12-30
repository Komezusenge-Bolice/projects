# Marks Management (Demo)

Simple demo web app for teachers to record marks and students to view them.

Features

- Teacher CRUD for marks (create/read/update/delete)
- Student dashboard with analysis and reports
- Simple signup/login pages for schools, teachers, and students
- Backend: Node.js + Express with file-based persistence (`data.json`)
- Frontend falls back to `localStorage` when backend is unavailable

Prerequisites

- Node.js (14+)

Install & Run

1. Install dependencies

```bash
cd /home/voidghost/Documents/projects/javascript
npm install
```

2. Start the server

```bash
npm start
```

3. Open the app in your browser:

http://localhost:3000/

Files of interest

- `server.js` — Express API and static server
- `data.json` — persistent data file (created on server start)
- `teacher-dashboard.html`, `student-dashboard.html` — main UIs
- `teacher-login.html`, `student-login.html` — login pages
- `teacher-signup.html`, `student-signup.html`, `school-register.html` — signup pages

API (examples)

- Register school

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"My School"}' http://localhost:3000/api/schools
```

- Create teacher

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@x.com","password":"pass"}' http://localhost:3000/api/teachers
```

- Create student

```bash
curl -X POST -H "Content-Type: application/json" -d '{"id":"S1","name":"Bob"}' http://localhost:3000/api/students
```

- Add mark

```bash
curl -X POST -H "Content-Type: application/json" -d '{"studentId":"S1","studentName":"Bob","subject":"Math","marks":85}' http://localhost:3000/api/marks
```

Notes & next steps

- This is a demo: passwords are stored in plain text in `data.json` — do not use in production.
- Recommended improvements: password hashing, proper auth tokens/sessions, input validation, and a real database.

If you want, I can run the server locally now and exercise a few endpoints. Tell me to `start server` and I'll run `npm install` + `npm start` and report results.
