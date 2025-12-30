const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

async function readData() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (err) {
    return { schools: [], teachers: [], students: [], marks: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Register a school
app.post('/api/schools', async (req, res) => {
  const payload = req.body;
  if (!payload.name) return res.status(400).json({ error: 'Missing school name' });
  const db = await readData();
  const id = `SCH${Date.now()}`;
  const school = { id, name: payload.name, createdAt: new Date().toISOString() };
  db.schools.push(school);
  await writeData(db);
  res.json(school);
});

// Teacher signup
app.post('/api/teachers', async (req, res) => {
  const { name, email, password, schoolId } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const db = await readData();
  if (db.teachers.find(t => t.email === email)) return res.status(400).json({ error: 'Teacher exists' });
  const hashed = await bcrypt.hash(password, 8);
  const teacher = { id: `T${Date.now()}`, name, email, password: hashed, schoolId: schoolId || null, createdAt: new Date().toISOString() };
  db.teachers.push(teacher);
  await writeData(db);
  res.json({ id: teacher.id, name: teacher.name, email: teacher.email, schoolId: teacher.schoolId });
});

// Student signup
app.post('/api/students', async (req, res) => {
  const { id, name, email, password, className } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'Missing student id or name' });
  const db = await readData();
  if (db.students.find(s => s.id === id)) return res.status(200).json(db.students.find(s => s.id === id));
  const hashed = password ? await bcrypt.hash(password, 8) : '';
  const student = { id, name, email: email || `${id}@school.local`, password: hashed, class: className || '', createdAt: new Date().toISOString() };
  db.students.push(student);
  await writeData(db);
  res.json(student);
});

// Simple auth (teacher or student)
// Auth: verifies credentials and returns JWT
app.post('/api/auth', async (req, res) => {
  const { role, username, password } = req.body;
  const db = await readData();
  if (role === 'teacher') {
    const t = db.teachers.find(x => x.email === username || x.id === username);
    if (!t) return res.status(401).json({ error: 'Invalid credentials' });
    let ok = false;
    try { ok = await bcrypt.compare(password || '', t.password || ''); } catch(e) { ok = false; }
    // legacy: if stored password is plain text and matches, re-hash and persist
    if (!ok && t.password && t.password === password) {
      ok = true;
      t.password = await bcrypt.hash(password, 8);
      await writeData(db);
    }
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ role: 'teacher', id: t.id, name: t.name }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ role: 'teacher', id: t.id, name: t.name, token });
  } else if (role === 'student') {
    const s = db.students.find(x => x.id === username || x.email === username);
    if (!s) return res.status(401).json({ error: 'Invalid credentials' });
    // allow empty password in demo if student has no password (fallback behavior)
    let ok = false;
    if (!s.password || s.password.length === 0) {
      ok = (password === undefined || password === '');
    } else {
      try { ok = await bcrypt.compare(password || '', s.password || ''); } catch(e) { ok = false; }
    }
    // legacy plaintext migration for students
    if (!ok && s.password && s.password === password) {
      ok = true;
      s.password = await bcrypt.hash(password, 8);
      await writeData(db);
    }
    const s = db.students.find(x => x.id === username || x.email === username);
    if (!s) return res.status(401).json({ error: 'Invalid credentials' });
    // allow empty password in demo if student has no password (fallback behavior)
    const ok = (!s.password || s.password.length === 0) ? (password === undefined || password === '') : await bcrypt.compare(password || '', s.password || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ role: 'student', id: s.id, name: s.name }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ role: 'student', id: s.id, name: s.name, token });
  }
  res.status(400).json({ error: 'Invalid role' });
});

// Middleware: verify token and attach user
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireTeacher = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Teacher role required' });
  next();
};

// Get marks (optionally filter by studentId)
// Get marks (optionally filter by studentId) - allow teachers or owner student
app.get('/api/marks', authenticate, async (req, res) => {
  const { studentId } = req.query;
  const db = await readData();
  let marks = db.marks || [];
  if (studentId) marks = marks.filter(m => m.studentId === studentId);
  // if requester is a student, ensure they only access their own records
  if (req.user.role === 'student' && studentId && req.user.id !== studentId) return res.status(403).json({ error: 'Forbidden' });
  // if no studentId provided and student requests, filter to their id
  if (req.user.role === 'student' && !studentId) marks = marks.filter(m => m.studentId === req.user.id);
  res.json(marks);
});

// Create mark
// Create mark - teacher only
app.post('/api/marks', authenticate, requireTeacher, async (req, res) => {
  const body = req.body;
  if (!body.studentId || !body.studentName || !body.subject) return res.status(400).json({ error: 'Missing fields' });
  const db = await readData();
  const mark = {
    id: Date.now(),
    studentId: body.studentId,
    studentName: body.studentName,
    subject: body.subject,
    marks: Number(body.marks),
    maxMarks: Number(body.maxMarks) || 100,
    examType: body.examType || 'Unknown',
    remarks: body.remarks || '',
    date: new Date().toISOString()
  };
  db.marks.push(mark);

  // ensure student exists
  if (!db.students.find(s => s.id === mark.studentId)) {
    db.students.push({ id: mark.studentId, name: mark.studentName, email: `${mark.studentId}@school.local`, class: '', createdAt: new Date().toISOString() });
  }

  await writeData(db);
  res.json(mark);
});

// Update mark
// Update mark - teacher only
app.put('/api/marks/:id', authenticate, requireTeacher, async (req, res) => {
  const id = Number(req.params.id);
  const db = await readData();
  const idx = db.marks.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const updated = Object.assign(db.marks[idx], req.body);
  db.marks[idx] = updated;
  await writeData(db);
  res.json(updated);
});

// Delete mark
// Delete mark - teacher only
app.delete('/api/marks/:id', authenticate, requireTeacher, async (req, res) => {
  const id = Number(req.params.id);
  const db = await readData();
  db.marks = (db.marks || []).filter(m => m.id !== id);
  await writeData(db);
  res.json({ ok: true });
});

// Students
app.get('/api/students', authenticate, async (req, res) => {
  const db = await readData();
  // teachers can see all students; students get only their own record
  if (req.user.role === 'teacher') return res.json(db.students || []);
  const student = (db.students || []).find(s => s.id === req.user.id);
  res.json(student ? [student] : []);
});

app.get('/api/students/:id/marks', authenticate, async (req, res) => {
  const id = req.params.id;
  const db = await readData();
  const marks = (db.marks || []).filter(m => m.studentId === id);
  // only allow if teacher or owner
  if (req.user.role === 'teacher' || (req.user.role === 'student' && req.user.id === id)) return res.json(marks);
  return res.status(403).json({ error: 'Forbidden' });
});

// start
app.listen(PORT, async () => {
  // ensure data file exists
  try {
    await fs.access(DATA_FILE);
  } catch (e) {
    await writeData({ schools: [], teachers: [], students: [], marks: [] });
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
