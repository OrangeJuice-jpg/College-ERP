import express from 'express';
import cors from 'cors';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ─── Types ─── */
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: number;
  year: number;
  cgpa: number;
  phone: string;
  address: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  feesPaid: boolean;
  feesAmount: number;
  courses: string[];
  avatar: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
  userId?: number;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  markedBy: number;
  markedAt: string;
}

interface TimetableEntry {
  id: number;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  department: string;
  semester: number;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  type: 'exam' | 'assignment' | 'event' | 'general' | 'fee';
  postedBy: string;
  targetAudience: 'all' | 'students' | 'faculty' | 'specific_department';
  department?: string;
}

interface FinanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  type: 'tuition' | 'hostel' | 'library' | 'lab' | 'miscellaneous';
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  semester: number;
}

/* ─── Seed Data ─── */
const hashSync = (pw: string) => bcrypt.hashSync(pw, 10);

const users: User[] = [
  { id: 1, name: 'Admin User',    email: 'admin@vaish.edu',   password: hashSync('admin123'),   role: 'admin'   },
  { id: 2, name: 'Dr. Priya Rao', email: 'faculty@vaish.edu', password: hashSync('faculty123'), role: 'faculty' },
  { id: 3, name: 'Arjun Mehta',   email: 'arjun.mehta@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 4, name: 'Priya Sharma',  email: 'priya.sharma@vaish.edu',  password: hashSync('student123'), role: 'student' },
  { id: 5, name: 'Rahul Verma',   email: 'rahul.verma@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 6, name: 'Sneha Iyer',    email: 'sneha.iyer@vaish.edu',    password: hashSync('student123'), role: 'student' },
  { id: 7, name: 'Karan Patel',   email: 'karan.patel@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 8, name: 'Ananya Reddy',  email: 'ananya.reddy@vaish.edu',  password: hashSync('student123'), role: 'student' },
];
let nextUserId = 9;

const students: Student[] = [
  {
    id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@vaish.edu', rollNumber: 'CS2021001',
    department: 'Computer Science', semester: 6, year: 3, cgpa: 8.5, phone: '+91-9876543210',
    address: '123 MG Road, Bangalore', dateOfBirth: '2002-05-15', enrollmentDate: '2021-07-20',
    status: 'active', feesPaid: true, feesAmount: 85000, courses: ['Data Structures', 'DBMS', 'OS', 'CN'],
    avatar: 'AM', gender: 'Male', bloodGroup: 'O+', guardianName: 'Suresh Mehta', guardianPhone: '+91-9876543200', userId: 3,
  },
  {
    id: 2, name: 'Priya Sharma', email: 'priya.sharma@vaish.edu', rollNumber: 'CS2021002',
    department: 'Computer Science', semester: 6, year: 3, cgpa: 9.1, phone: '+91-9876543211',
    address: '456 Brigade Road, Bangalore', dateOfBirth: '2002-08-22', enrollmentDate: '2021-07-20',
    status: 'active', feesPaid: true, feesAmount: 85000, courses: ['Data Structures', 'DBMS', 'OS', 'CN'],
    avatar: 'PS', gender: 'Female', bloodGroup: 'A+', guardianName: 'Ramesh Sharma', guardianPhone: '+91-9876543201', userId: 4,
  },
  {
    id: 3, name: 'Rahul Verma', email: 'rahul.verma@vaish.edu', rollNumber: 'EC2022001',
    department: 'Electronics', semester: 4, year: 2, cgpa: 7.8, phone: '+91-9876543212',
    address: '789 Residency Road, Bangalore', dateOfBirth: '2003-01-10', enrollmentDate: '2022-07-18',
    status: 'active', feesPaid: false, feesAmount: 80000, courses: ['Signals & Systems', 'Digital Circuits', 'Microprocessors'],
    avatar: 'RV', gender: 'Male', bloodGroup: 'B+', guardianName: 'Vijay Verma', guardianPhone: '+91-9876543202', userId: 5,
  },
  {
    id: 4, name: 'Sneha Iyer', email: 'sneha.iyer@vaish.edu', rollNumber: 'ME2020001',
    department: 'Mechanical', semester: 8, year: 4, cgpa: 8.2, phone: '+91-9876543213',
    address: '321 Lavelle Road, Bangalore', dateOfBirth: '2001-11-30', enrollmentDate: '2020-07-22',
    status: 'active', feesPaid: true, feesAmount: 82000, courses: ['Thermodynamics', 'Fluid Mechanics', 'CAD/CAM'],
    avatar: 'SI', gender: 'Female', bloodGroup: 'AB+', guardianName: 'Krishnan Iyer', guardianPhone: '+91-9876543203', userId: 6,
  },
  {
    id: 5, name: 'Karan Patel', email: 'karan.patel@vaish.edu', rollNumber: 'CS2023001',
    department: 'Computer Science', semester: 2, year: 1, cgpa: 7.5, phone: '+91-9876543214',
    address: '654 Cunningham Road, Bangalore', dateOfBirth: '2004-03-25', enrollmentDate: '2023-07-20',
    status: 'active', feesPaid: true, feesAmount: 85000, courses: ['Programming Fundamentals', 'Mathematics', 'Physics'],
    avatar: 'KP', gender: 'Male', bloodGroup: 'O-', guardianName: 'Rajesh Patel', guardianPhone: '+91-9876543204', userId: 7,
  },
  {
    id: 6, name: 'Ananya Reddy', email: 'ananya.reddy@vaish.edu', rollNumber: 'CV2021001',
    department: 'Civil', semester: 6, year: 3, cgpa: 8.8, phone: '+91-9876543215',
    address: '987 Richmond Road, Bangalore', dateOfBirth: '2002-07-14', enrollmentDate: '2021-07-20',
    status: 'active', feesPaid: true, feesAmount: 78000, courses: ['Structural Analysis', 'Fluid Mechanics', 'Surveying'],
    avatar: 'AR', gender: 'Female', bloodGroup: 'A-', guardianName: 'Venkat Reddy', guardianPhone: '+91-9876543205', userId: 8,
  },
];
let nextStudentId = 7;

const attendanceRecords: AttendanceRecord[] = [
  { id: 1,  studentId: 1, studentName: 'Arjun Mehta',  rollNumber: 'CS2021001', date: '2024-04-01', status: 'present', subject: 'Data Structures', markedBy: 2, markedAt: '2024-04-01T09:00:00Z' },
  { id: 2,  studentId: 1, studentName: 'Arjun Mehta',  rollNumber: 'CS2021001', date: '2024-04-02', status: 'present', subject: 'DBMS',            markedBy: 2, markedAt: '2024-04-02T10:00:00Z' },
  { id: 3,  studentId: 1, studentName: 'Arjun Mehta',  rollNumber: 'CS2021001', date: '2024-04-03', status: 'absent',  subject: 'OS',              markedBy: 2, markedAt: '2024-04-03T11:00:00Z' },
  { id: 4,  studentId: 1, studentName: 'Arjun Mehta',  rollNumber: 'CS2021001', date: '2024-04-04', status: 'present', subject: 'CN',              markedBy: 2, markedAt: '2024-04-04T09:00:00Z' },
  { id: 5,  studentId: 1, studentName: 'Arjun Mehta',  rollNumber: 'CS2021001', date: '2024-04-05', status: 'late',    subject: 'Data Structures', markedBy: 2, markedAt: '2024-04-05T09:15:00Z' },
  { id: 6,  studentId: 2, studentName: 'Priya Sharma', rollNumber: 'CS2021002', date: '2024-04-01', status: 'present', subject: 'Data Structures', markedBy: 2, markedAt: '2024-04-01T09:00:00Z' },
  { id: 7,  studentId: 2, studentName: 'Priya Sharma', rollNumber: 'CS2021002', date: '2024-04-02', status: 'present', subject: 'DBMS',            markedBy: 2, markedAt: '2024-04-02T10:00:00Z' },
  { id: 8,  studentId: 2, studentName: 'Priya Sharma', rollNumber: 'CS2021002', date: '2024-04-03', status: 'present', subject: 'OS',              markedBy: 2, markedAt: '2024-04-03T11:00:00Z' },
  { id: 9,  studentId: 3, studentName: 'Rahul Verma',  rollNumber: 'EC2022001', date: '2024-04-01', status: 'present', subject: 'Signals & Systems', markedBy: 2, markedAt: '2024-04-01T09:00:00Z' },
  { id: 10, studentId: 3, studentName: 'Rahul Verma',  rollNumber: 'EC2022001', date: '2024-04-02', status: 'absent',  subject: 'Digital Circuits',  markedBy: 2, markedAt: '2024-04-02T10:00:00Z' },
];
let nextAttendanceId = 11;

const timetableEntries: TimetableEntry[] = [
  { id: 1, day: 'Monday',    time: '09:00-10:00', subject: 'Data Structures', faculty: 'Dr. Priya Rao',     room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 2, day: 'Monday',    time: '10:00-11:00', subject: 'DBMS',            faculty: 'Prof. Kumar Singh',  room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 3, day: 'Monday',    time: '11:00-12:00', subject: 'OS',              faculty: 'Dr. Amit Gupta',    room: 'Room 303', department: 'Computer Science', semester: 6 },
  { id: 4, day: 'Monday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 6 },
  { id: 5, day: 'Monday',    time: '02:00-03:00', subject: 'CN',              faculty: 'Prof. Nisha Bhat',  room: 'Room 304', department: 'Computer Science', semester: 6 },
  { id: 6, day: 'Tuesday',   time: '09:00-10:00', subject: 'DBMS',            faculty: 'Prof. Kumar Singh',  room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 7, day: 'Tuesday',   time: '10:00-11:00', subject: 'Data Structures', faculty: 'Dr. Priya Rao',     room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 8, day: 'Tuesday',   time: '11:00-12:00', subject: 'CN Lab',          faculty: 'Prof. Nisha Bhat',  room: 'Lab 101',  department: 'Computer Science', semester: 6 },
  { id: 9, day: 'Wednesday', time: '09:00-10:00', subject: 'OS',              faculty: 'Dr. Amit Gupta',    room: 'Room 303', department: 'Computer Science', semester: 6 },
  { id: 10,day: 'Wednesday', time: '10:00-11:00', subject: 'Data Structures', faculty: 'Dr. Priya Rao',     room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 11,day: 'Thursday',  time: '09:00-10:00', subject: 'CN',              faculty: 'Prof. Nisha Bhat',  room: 'Room 304', department: 'Computer Science', semester: 6 },
  { id: 12,day: 'Thursday',  time: '10:00-11:00', subject: 'DBMS Lab',        faculty: 'Prof. Kumar Singh',  room: 'Lab 102',  department: 'Computer Science', semester: 6 },
  { id: 13,day: 'Friday',    time: '09:00-10:00', subject: 'Data Structures', faculty: 'Dr. Priya Rao',     room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 14,day: 'Friday',    time: '10:00-11:00', subject: 'OS Lab',          faculty: 'Dr. Amit Gupta',    room: 'Lab 103',  department: 'Computer Science', semester: 6 },
  // Electronics
  { id: 20, day: 'Monday',    time: '09:00-10:00', subject: 'Signals & Systems', faculty: 'Dr. Ravi Kumar',   room: 'Room 401', department: 'Electronics', semester: 4 },
  { id: 21, day: 'Monday',    time: '10:00-11:00', subject: 'Digital Circuits',  faculty: 'Prof. Meena Nair', room: 'Room 402', department: 'Electronics', semester: 4 },
  { id: 22, day: 'Tuesday',   time: '09:00-10:00', subject: 'Microprocessors',   faculty: 'Dr. Sanjay Rao',   room: 'Room 403', department: 'Electronics', semester: 4 },
  { id: 23, day: 'Wednesday', time: '09:00-10:00', subject: 'Digital Circuits',  faculty: 'Prof. Meena Nair', room: 'Room 402', department: 'Electronics', semester: 4 },
  // Civil
  { id: 30, day: 'Monday',    time: '09:00-10:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 31, day: 'Monday',    time: '10:00-11:00', subject: 'Fluid Mechanics',     faculty: 'Dr. Anita Verma',    room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 32, day: 'Tuesday',   time: '09:00-10:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 33, day: 'Wednesday', time: '09:00-10:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  // Mechanical
  { id: 40, day: 'Monday',    time: '09:00-10:00', subject: 'Thermodynamics',  faculty: 'Prof. Suresh Babu', room: 'Room 601', department: 'Mechanical', semester: 8 },
  { id: 41, day: 'Monday',    time: '10:00-11:00', subject: 'Fluid Mechanics', faculty: 'Dr. Anita Verma',   room: 'Room 602', department: 'Mechanical', semester: 8 },
  { id: 42, day: 'Tuesday',   time: '09:00-10:00', subject: 'CAD/CAM',         faculty: 'Prof. Prakash M',   room: 'Lab 601',  department: 'Mechanical', semester: 8 },
];

const notices: Notice[] = [
  { id: 1, title: 'Mid-Semester Examination Schedule', content: 'Mid-semester examinations will be held from April 15-25, 2024. Students must collect their hall tickets from the examination cell by April 10.', date: '2024-04-01', priority: 'high', type: 'exam', postedBy: 'Exam Cell', targetAudience: 'all' },
  { id: 2, title: 'Fee Payment Deadline Extended', content: 'The deadline for semester fee payment has been extended to April 30, 2024. Late fee of ₹500 will be charged after the deadline.', date: '2024-04-02', priority: 'high', type: 'fee', postedBy: 'Finance Office', targetAudience: 'all' },
  { id: 3, title: 'Assignment 3 - Data Structures', content: 'Assignment 3 on Graph Algorithms and Dynamic Programming must be submitted by April 20, 2024. Submission through online portal only.', date: '2024-04-03', priority: 'medium', type: 'assignment', postedBy: 'Dr. Priya Rao', targetAudience: 'all' },
  { id: 4, title: 'Tech Fest 2024 - Registrations Open', content: 'Annual Tech Fest "Innovate 2024" will be held on May 5-6, 2024. Events include Hackathon, Robo War, Coding Contest, and Project Exhibition.', date: '2024-04-04', priority: 'medium', type: 'event', postedBy: 'Student Council', targetAudience: 'all' },
  { id: 5, title: 'Library Book Return Deadline', content: 'All students must return library books or renew them by April 15, 2024. Overdue fine: ₹1 per day.', date: '2024-04-05', priority: 'high', type: 'general', postedBy: 'Library', targetAudience: 'all' },
  { id: 6, title: 'Industrial Visit - Software Companies', content: 'Industrial visit to Infosys and TCS Pune on April 25, 2024. Limited seats (50 students). Registration fee: ₹300.', date: '2024-04-06', priority: 'medium', type: 'event', postedBy: 'Training & Placement', targetAudience: 'all' },
  { id: 7, title: 'Operating Systems Lab - New Schedule', content: 'Operating Systems Lab has been rescheduled to Tuesday 01:00-02:00 and Friday 01:00-02:00.', date: '2024-04-07', priority: 'low', type: 'general', postedBy: 'Prof. Kumar Singh', targetAudience: 'all' },
  { id: 8, title: 'Scholarship Applications Open', content: 'Merit-based scholarship applications for 2024-25 are now open. Students with CGPA > 8.0 can apply. Deadline: April 30, 2024.', date: '2024-04-08', priority: 'medium', type: 'general', postedBy: 'Admin Office', targetAudience: 'all' },
];
let nextNoticeId = 9;

const financeRecords: FinanceRecord[] = [
  { id: 1,  studentId: 1, studentName: 'Arjun Mehta',  type: 'tuition',      amount: 65000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-10', semester: 6 },
  { id: 2,  studentId: 1, studentName: 'Arjun Mehta',  type: 'hostel',       amount: 20000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-12', semester: 6 },
  { id: 3,  studentId: 2, studentName: 'Priya Sharma', type: 'tuition',      amount: 65000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-08', semester: 6 },
  { id: 4,  studentId: 3, studentName: 'Rahul Verma',  type: 'tuition',      amount: 60000, status: 'pending', dueDate: '2024-04-30', semester: 4 },
  { id: 5,  studentId: 3, studentName: 'Rahul Verma',  type: 'lab',          amount: 5000,  status: 'overdue', dueDate: '2024-03-15', semester: 4 },
  { id: 6,  studentId: 4, studentName: 'Sneha Iyer',   type: 'tuition',      amount: 62000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-14', semester: 8 },
  { id: 7,  studentId: 5, studentName: 'Karan Patel',  type: 'tuition',      amount: 65000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-09', semester: 2 },
  { id: 8,  studentId: 6, studentName: 'Ananya Reddy', type: 'tuition',      amount: 58000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-11', semester: 6 },
  { id: 9,  studentId: 6, studentName: 'Ananya Reddy', type: 'library',      amount: 2000,  status: 'pending', dueDate: '2024-04-15', semester: 6 },
  { id: 10, studentId: 1, studentName: 'Arjun Mehta',  type: 'miscellaneous',amount: 3000,  status: 'paid',    dueDate: '2024-02-28', paidDate: '2024-02-25', semester: 6 },
];
let nextFinanceId = 11;

/* ─── Auth Middleware ─── */
const SECRET = process.env.JWT_SECRET || 'vaish_erp_secret_2024';

const authenticate = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    (req as any).user = user;
    next();
  });
};

/* ─── Express App ─── */
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();

/* ─── Auth Routes ─── */
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '24h' });
    const studentData = user.role === 'student' ? students.find(s => s.userId === user.id) : null;
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }, student: studentData });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: nextUserId++, name, email, password: hashed, role: role || 'student' };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '24h' });
    const { password: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.post('/auth/logout', (_req: Request, res: Response) => res.status(200).json({ message: 'Logged out successfully' }));

router.get('/auth/me', authenticate, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user?.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.status(200).json(safeUser);
});

/* ─── Student Routes ─── */
router.get('/students/stats', authenticate, (_req: Request, res: Response) => {
  const total = students.length;
  const active = students.filter(s => s.status === 'active').length;
  const deptBreakdown = students.reduce((acc, s) => { acc[s.department] = (acc[s.department] || 0) + 1; return acc; }, {} as Record<string, number>);
  const avgCgpa = (students.reduce((sum, s) => sum + s.cgpa, 0) / total).toFixed(2);
  res.status(200).json({ total, active, avgCgpa: Number(avgCgpa), deptBreakdown });
});
router.get('/students', authenticate, (_req: Request, res: Response) => res.status(200).json(students));
router.get('/students/:id', authenticate, (req: Request, res: Response) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.status(200).json(student);
});
router.post('/students', authenticate, (req: Request, res: Response) => {
  const existing = students.find(s => s.email === req.body.email || s.rollNumber === req.body.rollNumber);
  if (existing) return res.status(409).json({ message: 'Student with this email or roll number already exists' });
  const student = { id: nextStudentId++, ...req.body, status: req.body.status || 'active', enrollmentDate: req.body.enrollmentDate || new Date().toISOString().split('T')[0], avatar: req.body.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST', courses: req.body.courses || [] };
  students.push(student);
  res.status(201).json(student);
});
router.put('/students/:id', authenticate, (req: Request, res: Response) => {
  const idx = students.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Student not found' });
  students[idx] = { ...students[idx], ...req.body };
  res.status(200).json(students[idx]);
});
router.delete('/students/:id', authenticate, (req: Request, res: Response) => {
  const idx = students.findIndex(s => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Student not found' });
  students.splice(idx, 1);
  res.status(204).send();
});

/* ─── Finance Routes ─── */
router.get('/finance/stats', authenticate, (_req: Request, res: Response) => {
  const total = financeRecords.reduce((sum, r) => sum + r.amount, 0);
  const collected = financeRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
  const pending = financeRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const overdue = financeRecords.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.amount, 0);
  res.status(200).json({ total, collected, pending, overdue });
});
router.get('/finance', authenticate, (_req: Request, res: Response) => res.status(200).json(financeRecords));
router.post('/finance', authenticate, (req: Request, res: Response) => {
  const record = { id: nextFinanceId++, ...req.body, date: new Date().toISOString() };
  financeRecords.push(record);
  res.status(201).json(record);
});
router.put('/finance/:id', authenticate, (req: Request, res: Response) => {
  const idx = financeRecords.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Record not found' });
  financeRecords[idx] = { ...financeRecords[idx], ...req.body };
  res.status(200).json(financeRecords[idx]);
});
router.delete('/finance/:id', authenticate, (req: Request, res: Response) => {
  const idx = financeRecords.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Record not found' });
  financeRecords.splice(idx, 1);
  res.status(204).send();
});

/* ─── Attendance Routes ─── */
router.get('/attendance/my', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const student = students.find(s => s.userId === userId);
  if (!student) return res.status(404).json({ message: 'No student record found for your account' });
  res.status(200).json(attendanceRecords.filter(r => r.studentId === student.id));
});
router.get('/attendance/my-stats', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const student = students.find(s => s.userId === userId);
  if (!student) return res.status(404).json({ message: 'No student record found for your account' });
  const myRecords = attendanceRecords.filter(r => r.studentId === student.id);
  const total = myRecords.length;
  const present = myRecords.filter(r => r.status === 'present').length;
  const absent = myRecords.filter(r => r.status === 'absent').length;
  const late = myRecords.filter(r => r.status === 'late').length;
  const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';
  res.status(200).json({ studentId: student.id, studentName: student.name, rollNumber: student.rollNumber, total, present, absent, late, attendancePercentage: Number(attendancePercentage) });
});
router.get('/attendance/class', authenticate, (req: Request, res: Response) => {
  const { date, subject } = req.query;
  let filtered = attendanceRecords;
  if (date) filtered = filtered.filter(r => r.date === date);
  if (subject) filtered = filtered.filter(r => r.subject === subject);
  res.status(200).json(filtered);
});
router.get('/attendance', authenticate, (_req: Request, res: Response) => res.status(200).json(attendanceRecords));
router.post('/attendance', authenticate, (req: Request, res: Response) => {
  const { studentId, date, status, subject } = req.body;
  if (!studentId || !date || !status || !subject) return res.status(400).json({ message: 'All fields are required' });
  const student = students.find(s => s.id === studentId);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const record = { id: nextAttendanceId++, studentId, studentName: student.name, rollNumber: student.rollNumber, date, status, subject, markedBy: (req as any).user?.id, markedAt: new Date().toISOString() };
  attendanceRecords.push(record);
  res.status(201).json(record);
});
router.put('/attendance/:id', authenticate, (req: Request, res: Response) => {
  const idx = attendanceRecords.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });
  attendanceRecords[idx] = { ...attendanceRecords[idx], ...req.body };
  res.status(200).json(attendanceRecords[idx]);
});
router.delete('/attendance/:id', authenticate, (req: Request, res: Response) => {
  const idx = attendanceRecords.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });
  attendanceRecords.splice(idx, 1);
  res.status(204).send();
});

/* ─── Timetable Routes ─── */
router.get('/timetable/my', authenticate, (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const student = students.find(s => s.userId === userId);
  if (!student) return res.status(404).json({ message: 'No student record found for your account' });
  const myTimetable = timetableEntries.filter(e => e.department === student.department && e.semester === student.semester);
  const timetableByDay: Record<string, typeof timetableEntries> = {};
  myTimetable.forEach(entry => { if (!timetableByDay[entry.day]) timetableByDay[entry.day] = []; timetableByDay[entry.day].push(entry); });
  res.status(200).json(timetableByDay);
});
router.get('/timetable', authenticate, (_req: Request, res: Response) => {
  const timetableByDay: Record<string, typeof timetableEntries> = {};
  timetableEntries.forEach(entry => { if (!timetableByDay[entry.day]) timetableByDay[entry.day] = []; timetableByDay[entry.day].push(entry); });
  res.status(200).json(timetableByDay);
});

/* ─── Notice Routes ─── */
router.get('/notices', authenticate, (_req: Request, res: Response) => {
  const sortedNotices = [...notices].sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) return priorityOrder[a.priority] - priorityOrder[b.priority];
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  res.status(200).json(sortedNotices);
});
router.get('/notices/:id', authenticate, (req: Request, res: Response) => {
  const notice = notices.find(n => n.id === Number(req.params.id));
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  res.status(200).json(notice);
});
router.post('/notices', authenticate, (req: Request, res: Response) => {
  const notice = { id: nextNoticeId++, ...req.body, date: new Date().toISOString().split('T')[0] };
  notices.push(notice);
  res.status(201).json(notice);
});

/* ─── Health ─── */
app.get('/health', (_req, res) => res.json({ status: 'ok', message: 'Vaish ERP Server running' }));

app.use('/api', router);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

export default app;
