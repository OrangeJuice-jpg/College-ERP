import bcrypt from 'bcryptjs';

/* ─── Types ─── */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Student {
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
  userId?: number; // Linked user account ID
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  markedBy: number; // faculty user id
  markedAt: string;
}

export interface TimetableEntry {
  id: number;
  day: string; // Monday, Tuesday, etc.
  time: string; // "09:00-10:00"
  subject: string;
  faculty: string;
  room: string;
  department: string;
  semester: number;
}

export interface Notice {
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

export interface FinanceRecord {
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

/* ─── Seed Users (linked to students) ─── */
const hashSync = (pw: string) => bcrypt.hashSync(pw, 10);

export const users: User[] = [
  { id: 1, name: 'Admin User',    email: 'admin@vaish.edu',   password: hashSync('admin123'),   role: 'admin'   },
  { id: 2, name: 'Dr. Priya Rao', email: 'faculty@vaish.edu', password: hashSync('faculty123'), role: 'faculty' },
  // Student users - each linked to a student record
  { id: 3, name: 'Arjun Mehta',   email: 'arjun.mehta@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 4, name: 'Priya Sharma',  email: 'priya.sharma@vaish.edu',  password: hashSync('student123'), role: 'student' },
  { id: 5, name: 'Rahul Verma',   email: 'rahul.verma@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 6, name: 'Sneha Iyer',    email: 'sneha.iyer@vaish.edu',    password: hashSync('student123'), role: 'student' },
  { id: 7, name: 'Karan Patel',   email: 'karan.patel@vaish.edu',   password: hashSync('student123'), role: 'student' },
  { id: 8, name: 'Ananya Reddy',  email: 'ananya.reddy@vaish.edu',  password: hashSync('student123'), role: 'student' },
];
export let nextUserId = 9;

/* ─── Seed Students (6 students for demo) ─── */
export const students: Student[] = [
  {
    id: 1, name: 'Arjun Mehta', email: 'arjun.mehta@vaish.edu',
    rollNumber: 'VE2021001', department: 'Computer Science', semester: 6, year: 3,
    cgpa: 8.7, phone: '+91-9876543210', address: '12, Park Street, Mumbai, MH',
    dateOfBirth: '2002-03-15', enrollmentDate: '2021-08-01', status: 'active',
    feesPaid: true, feesAmount: 85000, courses: ['Data Structures', 'OS', 'DBMS'],
    avatar: 'AM', gender: 'Male', bloodGroup: 'O+',
    guardianName: 'Rajesh Mehta', guardianPhone: '+91-9811223344',
    userId: 3, // linked user account
  },
  {
    id: 2, name: 'Priya Sharma', email: 'priya.sharma@vaish.edu',
    rollNumber: 'VE2021002', department: 'Electronics', semester: 6, year: 3,
    cgpa: 9.1, phone: '+91-9123456789', address: '45, Lake View, Delhi, DL',
    dateOfBirth: '2002-07-22', enrollmentDate: '2021-08-01', status: 'active',
    feesPaid: true, feesAmount: 82000, courses: ['Analog Circuits', 'VLSI', 'Signals'],
    avatar: 'PS', gender: 'Female', bloodGroup: 'A+',
    guardianName: 'Suresh Sharma', guardianPhone: '+91-9800112233',
    userId: 4,
  },
  {
    id: 3, name: 'Rahul Verma', email: 'rahul.verma@vaish.edu',
    rollNumber: 'VE2022001', department: 'Mechanical', semester: 4, year: 2,
    cgpa: 7.4, phone: '+91-9988776655', address: '8, Green Park, Pune, MH',
    dateOfBirth: '2003-11-05', enrollmentDate: '2022-08-01', status: 'active',
    feesPaid: false, feesAmount: 78000, courses: ['Thermodynamics', 'Fluid Mechanics', 'CAD'],
    avatar: 'RV', gender: 'Male', bloodGroup: 'B+',
    guardianName: 'Anil Verma', guardianPhone: '+91-9922334455',
    userId: 5,
  },
  {
    id: 4, name: 'Sneha Iyer', email: 'sneha.iyer@vaish.edu',
    rollNumber: 'VE2022002', department: 'Computer Science', semester: 4, year: 2,
    cgpa: 8.9, phone: '+91-9765432109', address: '23, Gandhi Nagar, Chennai, TN',
    dateOfBirth: '2003-04-18', enrollmentDate: '2022-08-01', status: 'active',
    feesPaid: true, feesAmount: 85000, courses: ['Algorithms', 'ML', 'Web Dev'],
    avatar: 'SI', gender: 'Female', bloodGroup: 'AB+',
    guardianName: 'Venkat Iyer', guardianPhone: '+91-9955667788',
    userId: 6,
  },
  {
    id: 5, name: 'Karan Patel', email: 'karan.patel@vaish.edu',
    rollNumber: 'VE2021003', department: 'Civil', semester: 6, year: 3,
    cgpa: 6.8, phone: '+91-9654321098', address: '67, Shastri Nagar, Ahmedabad, GJ',
    dateOfBirth: '2002-09-30', enrollmentDate: '2021-08-01', status: 'active',
    feesPaid: false, feesAmount: 75000, courses: ['Structural Analysis', 'Surveying', 'Soil Mech'],
    avatar: 'KP', gender: 'Male', bloodGroup: 'O-',
    guardianName: 'Manish Patel', guardianPhone: '+91-9988001122',
    userId: 7,
  },
  {
    id: 6, name: 'Ananya Reddy', email: 'ananya.reddy@vaish.edu',
    rollNumber: 'VE2023001', department: 'Information Technology', semester: 2, year: 1,
    cgpa: 9.4, phone: '+91-9543210987', address: '3, Jubilee Hills, Hyderabad, TS',
    dateOfBirth: '2004-01-12', enrollmentDate: '2023-08-01', status: 'active',
    feesPaid: true, feesAmount: 87000, courses: ['Programming Fundamentals', 'Discrete Math'],
    avatar: 'AR', gender: 'Female', bloodGroup: 'A-',
    guardianName: 'Krishna Reddy', guardianPhone: '+91-9900112233',
    userId: 8,
  },
];
export let nextStudentId = 7;

/* ─── Seed Finance Records ─── */
export const financeRecords: FinanceRecord[] = [
  { id: 1,  studentId: 1, studentName: 'Arjun Mehta',  type: 'tuition', amount: 85000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-10', semester: 6 },
  { id: 2,  studentId: 2, studentName: 'Priya Sharma', type: 'tuition', amount: 82000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-12', semester: 6 },
  { id: 3,  studentId: 3, studentName: 'Rahul Verma',  type: 'tuition', amount: 78000, status: 'pending', dueDate: '2024-02-01', semester: 4 },
  { id: 4,  studentId: 4, studentName: 'Sneha Iyer',   type: 'hostel',  amount: 45000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-08', semester: 4 },
  { id: 5,  studentId: 5, studentName: 'Karan Patel',  type: 'tuition', amount: 75000, status: 'overdue', dueDate: '2023-12-31', semester: 6 },
  { id: 6,  studentId: 6, studentName: 'Ananya Reddy', type: 'tuition', amount: 87000, status: 'paid',    dueDate: '2024-01-15', paidDate: '2024-01-05', semester: 2 },
];
export let nextFinanceId = 7;

/* ─── Seed Attendance Records ─── */
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 1, studentId: 1, studentName: 'Arjun Mehta', rollNumber: 'VE2021001',
    date: '2024-04-01', status: 'present', subject: 'Data Structures',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
  {
    id: 2, studentId: 2, studentName: 'Priya Sharma', rollNumber: 'VE2021002',
    date: '2024-04-01', status: 'present', subject: 'Analog Circuits',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
  {
    id: 3, studentId: 3, studentName: 'Rahul Verma', rollNumber: 'VE2022001',
    date: '2024-04-01', status: 'absent', subject: 'Thermodynamics',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
  {
    id: 4, studentId: 4, studentName: 'Sneha Iyer', rollNumber: 'VE2022002',
    date: '2024-04-01', status: 'present', subject: 'Algorithms',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
  {
    id: 5, studentId: 5, studentName: 'Karan Patel', rollNumber: 'VE2021003',
    date: '2024-04-01', status: 'late', subject: 'Structural Analysis',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
  {
    id: 6, studentId: 6, studentName: 'Ananya Reddy', rollNumber: 'VE2023001',
    date: '2024-04-01', status: 'present', subject: 'Programming Fundamentals',
    markedBy: 2, markedAt: '2024-04-01T09:30:00Z',
  },
];
export let nextAttendanceId = 7;

/* ─── Seed Timetable (Updated) ─── */
export const timetableEntries: TimetableEntry[] = [
  // Monday
  { id: 1, day: 'Monday', time: '09:00-10:00', subject: 'DS Lab', faculty: 'Dr. Priya Rao', room: 'Lab 101', department: 'Computer Science', semester: 6 },
  { id: 2, day: 'Monday', time: '10:00-11:00', subject: 'OS', faculty: 'Prof. Kumar Singh', room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 3, day: 'Monday', time: '11:00-12:00', subject: 'DBMS', faculty: 'Dr. Sneha Patil', room: 'Room 303', department: 'Computer Science', semester: 6 },
  { id: 4, day: 'Monday', time: '12:00-01:00', subject: 'Lunch', faculty: '-', room: '-', department: 'Computer Science', semester: 6 },
  { id: 5, day: 'Monday', time: '02:00-03:00', subject: 'CN', faculty: 'Prof. Amit Joshi', room: 'Room 304', department: 'Computer Science', semester: 6 },
  { id: 6, day: 'Monday', time: '03:00-04:00', subject: 'SE', faculty: 'Prof. Meera Nair', room: 'Room 305', department: 'Computer Science', semester: 6 },
  
  // Tuesday
  { id: 7, day: 'Tuesday', time: '09:00-10:00', subject: 'OS', faculty: 'Prof. Kumar Singh', room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 8, day: 'Tuesday', time: '10:00-11:00', subject: 'DS', faculty: 'Dr. Priya Rao', room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 9, day: 'Tuesday', time: '11:00-12:00', subject: 'SE', faculty: 'Prof. Meera Nair', room: 'Room 305', department: 'Computer Science', semester: 6 },
  { id: 10, day: 'Tuesday', time: '12:00-01:00', subject: 'Lunch', faculty: '-', room: '-', department: 'Computer Science', semester: 6 },
  { id: 11, day: 'Tuesday', time: '02:00-03:00', subject: 'DBMS Lab', faculty: 'Dr. Sneha Patil', room: 'Lab 103', department: 'Computer Science', semester: 6 },
  { id: 12, day: 'Tuesday', time: '03:00-04:00', subject: 'CN', faculty: 'Prof. Amit Joshi', room: 'Room 304', department: 'Computer Science', semester: 6 },
  
  // Wednesday
  { id: 13, day: 'Wednesday', time: '09:00-10:00', subject: 'DBMS', faculty: 'Dr. Sneha Patil', room: 'Room 303', department: 'Computer Science', semester: 6 },
  { id: 14, day: 'Wednesday', time: '10:00-11:00', subject: 'DS', faculty: 'Dr. Priya Rao', room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 15, day: 'Wednesday', time: '11:00-12:00', subject: 'OS Lab', faculty: 'Prof. Kumar Singh', room: 'Lab 102', department: 'Computer Science', semester: 6 },
  { id: 16, day: 'Wednesday', time: '12:00-01:00', subject: 'Lunch', faculty: '-', room: '-', department: 'Computer Science', semester: 6 },
  { id: 17, day: 'Wednesday', time: '02:00-03:00', subject: 'SE', faculty: 'Prof. Meera Nair', room: 'Room 305', department: 'Computer Science', semester: 6 },
  { id: 18, day: 'Wednesday', time: '03:00-04:00', subject: 'DBMS', faculty: 'Dr. Sneha Patil', room: 'Room 303', department: 'Computer Science', semester: 6 },
  
  // Thursday
  { id: 19, day: 'Thursday', time: '09:00-10:00', subject: 'CN', faculty: 'Prof. Amit Joshi', room: 'Room 304', department: 'Computer Science', semester: 6 },
  { id: 20, day: 'Thursday', time: '10:00-11:00', subject: 'SE', faculty: 'Prof. Meera Nair', room: 'Room 305', department: 'Computer Science', semester: 6 },
  { id: 21, day: 'Thursday', time: '11:00-12:00', subject: 'DS', faculty: 'Dr. Priya Rao', room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 22, day: 'Thursday', time: '12:00-01:00', subject: 'Lunch', faculty: '-', room: '-', department: 'Computer Science', semester: 6 },
  { id: 23, day: 'Thursday', time: '02:00-03:00', subject: 'OS', faculty: 'Prof. Kumar Singh', room: 'Room 302', department: 'Computer Science', semester: 6 },
  { id: 24, day: 'Thursday', time: '03:00-04:00', subject: 'DBMS', faculty: 'Dr. Sneha Patil', room: 'Room 303', department: 'Computer Science', semester: 6 },
  
  // Friday
  { id: 25, day: 'Friday', time: '09:00-10:00', subject: 'SE', faculty: 'Prof. Meera Nair', room: 'Room 305', department: 'Computer Science', semester: 6 },
  { id: 26, day: 'Friday', time: '10:00-11:00', subject: 'CN', faculty: 'Prof. Amit Joshi', room: 'Room 304', department: 'Computer Science', semester: 6 },
  { id: 27, day: 'Friday', time: '11:00-12:00', subject: 'OS Lab', faculty: 'Prof. Kumar Singh', room: 'Lab 102', department: 'Computer Science', semester: 6 },
  { id: 28, day: 'Friday', time: '12:00-01:00', subject: 'Lunch', faculty: '-', room: '-', department: 'Computer Science', semester: 6 },
  { id: 29, day: 'Friday', time: '02:00-03:00', subject: 'DS', faculty: 'Dr. Priya Rao', room: 'Room 301', department: 'Computer Science', semester: 6 },
  { id: 30, day: 'Friday', time: '03:00-04:00', subject: 'OS', faculty: 'Prof. Kumar Singh', room: 'Room 302', department: 'Computer Science', semester: 6 },

  // ── Electronics Sem 6 ──
  { id: 31, day: 'Monday',    time: '09:00-10:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',   room: 'Room 201', department: 'Electronics', semester: 6 },
  { id: 32, day: 'Monday',    time: '10:00-11:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },
  { id: 33, day: 'Monday',    time: '11:00-12:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 34, day: 'Monday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Electronics', semester: 6 },
  { id: 35, day: 'Monday',    time: '02:00-03:00', subject: 'VLSI Lab',        faculty: 'Prof. Geeta Menon', room: 'Lab 201', department: 'Electronics', semester: 6 },
  { id: 36, day: 'Monday',    time: '03:00-04:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },

  { id: 37, day: 'Tuesday',   time: '09:00-10:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 38, day: 'Tuesday',   time: '10:00-11:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },
  { id: 39, day: 'Tuesday',   time: '11:00-12:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },
  { id: 40, day: 'Tuesday',   time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Electronics', semester: 6 },
  { id: 41, day: 'Tuesday',   time: '02:00-03:00', subject: 'Signals Lab',     faculty: 'Dr. Suresh Nair',  room: 'Lab 202', department: 'Electronics', semester: 6 },
  { id: 42, day: 'Tuesday',   time: '03:00-04:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },

  { id: 43, day: 'Wednesday', time: '09:00-10:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },
  { id: 44, day: 'Wednesday', time: '10:00-11:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 45, day: 'Wednesday', time: '11:00-12:00', subject: 'Analog Lab',      faculty: 'Dr. Ramesh Babu',  room: 'Lab 203', department: 'Electronics', semester: 6 },
  { id: 46, day: 'Wednesday', time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Electronics', semester: 6 },
  { id: 47, day: 'Wednesday', time: '02:00-03:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },
  { id: 48, day: 'Wednesday', time: '03:00-04:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },

  { id: 49, day: 'Thursday',  time: '09:00-10:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },
  { id: 50, day: 'Thursday',  time: '10:00-11:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 51, day: 'Thursday',  time: '11:00-12:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },
  { id: 52, day: 'Thursday',  time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Electronics', semester: 6 },
  { id: 53, day: 'Thursday',  time: '02:00-03:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 54, day: 'Thursday',  time: '03:00-04:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },

  { id: 55, day: 'Friday',    time: '09:00-10:00', subject: 'VLSI',            faculty: 'Prof. Geeta Menon', room: 'Room 202', department: 'Electronics', semester: 6 },
  { id: 56, day: 'Friday',    time: '10:00-11:00', subject: 'Analog Circuits', faculty: 'Dr. Ramesh Babu',  room: 'Room 201', department: 'Electronics', semester: 6 },
  { id: 57, day: 'Friday',    time: '11:00-12:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },
  { id: 58, day: 'Friday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Electronics', semester: 6 },
  { id: 59, day: 'Friday',    time: '02:00-03:00', subject: 'VLSI Lab',        faculty: 'Prof. Geeta Menon', room: 'Lab 201', department: 'Electronics', semester: 6 },
  { id: 60, day: 'Friday',    time: '03:00-04:00', subject: 'Signals',         faculty: 'Dr. Suresh Nair',  room: 'Room 203', department: 'Electronics', semester: 6 },

  // ── Mechanical Sem 4 ──
  { id: 61, day: 'Monday',    time: '09:00-10:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 62, day: 'Monday',    time: '10:00-11:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 63, day: 'Monday',    time: '11:00-12:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 64, day: 'Monday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Mechanical', semester: 4 },
  { id: 65, day: 'Monday',    time: '02:00-03:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 66, day: 'Monday',    time: '03:00-04:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },

  { id: 67, day: 'Tuesday',   time: '09:00-10:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 68, day: 'Tuesday',   time: '10:00-11:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 69, day: 'Tuesday',   time: '11:00-12:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 70, day: 'Tuesday',   time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Mechanical', semester: 4 },
  { id: 71, day: 'Tuesday',   time: '02:00-03:00', subject: 'Thermo Lab',      faculty: 'Prof. Anil Kapoor', room: 'Lab 402', department: 'Mechanical', semester: 4 },
  { id: 72, day: 'Tuesday',   time: '03:00-04:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },

  { id: 73, day: 'Wednesday', time: '09:00-10:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 74, day: 'Wednesday', time: '10:00-11:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 75, day: 'Wednesday', time: '11:00-12:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 76, day: 'Wednesday', time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Mechanical', semester: 4 },
  { id: 77, day: 'Wednesday', time: '02:00-03:00', subject: 'Fluid Lab',       faculty: 'Dr. Sunita Roy',    room: 'Lab 403', department: 'Mechanical', semester: 4 },
  { id: 78, day: 'Wednesday', time: '03:00-04:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },

  { id: 79, day: 'Thursday',  time: '09:00-10:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 80, day: 'Thursday',  time: '10:00-11:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 81, day: 'Thursday',  time: '11:00-12:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 82, day: 'Thursday',  time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Mechanical', semester: 4 },
  { id: 83, day: 'Thursday',  time: '02:00-03:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 84, day: 'Thursday',  time: '03:00-04:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },

  { id: 85, day: 'Friday',    time: '09:00-10:00', subject: 'CAD',             faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 86, day: 'Friday',    time: '10:00-11:00', subject: 'Thermodynamics',  faculty: 'Prof. Anil Kapoor', room: 'Room 401', department: 'Mechanical', semester: 4 },
  { id: 87, day: 'Friday',    time: '11:00-12:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },
  { id: 88, day: 'Friday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                room: '-',        department: 'Mechanical', semester: 4 },
  { id: 89, day: 'Friday',    time: '02:00-03:00', subject: 'CAD Lab',         faculty: 'Prof. Vikram Das',  room: 'Lab 401', department: 'Mechanical', semester: 4 },
  { id: 90, day: 'Friday',    time: '03:00-04:00', subject: 'Fluid Mechanics', faculty: 'Dr. Sunita Roy',    room: 'Room 402', department: 'Mechanical', semester: 4 },

  // ── Computer Science Sem 4 ──
  { id: 91,  day: 'Monday',    time: '09:00-10:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 92,  day: 'Monday',    time: '10:00-11:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 93,  day: 'Monday',    time: '11:00-12:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 94,  day: 'Monday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 4 },
  { id: 95,  day: 'Monday',    time: '02:00-03:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 96,  day: 'Monday',    time: '03:00-04:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },

  { id: 97,  day: 'Tuesday',   time: '09:00-10:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 98,  day: 'Tuesday',   time: '10:00-11:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 99,  day: 'Tuesday',   time: '11:00-12:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 100, day: 'Tuesday',   time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 4 },
  { id: 101, day: 'Tuesday',   time: '02:00-03:00', subject: 'ML Lab',          faculty: 'Dr. Pooja Bhat',     room: 'Lab 302', department: 'Computer Science', semester: 4 },
  { id: 102, day: 'Tuesday',   time: '03:00-04:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },

  { id: 103, day: 'Wednesday', time: '09:00-10:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 104, day: 'Wednesday', time: '10:00-11:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 105, day: 'Wednesday', time: '11:00-12:00', subject: 'Algo Lab',        faculty: 'Prof. Arjun Tiwari', room: 'Lab 303', department: 'Computer Science', semester: 4 },
  { id: 106, day: 'Wednesday', time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 4 },
  { id: 107, day: 'Wednesday', time: '02:00-03:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 108, day: 'Wednesday', time: '03:00-04:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },

  { id: 109, day: 'Thursday',  time: '09:00-10:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 110, day: 'Thursday',  time: '10:00-11:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 111, day: 'Thursday',  time: '11:00-12:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 112, day: 'Thursday',  time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 4 },
  { id: 113, day: 'Thursday',  time: '02:00-03:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 114, day: 'Thursday',  time: '03:00-04:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },

  { id: 115, day: 'Friday',    time: '09:00-10:00', subject: 'Web Development', faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 116, day: 'Friday',    time: '10:00-11:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },
  { id: 117, day: 'Friday',    time: '11:00-12:00', subject: 'Algorithms',      faculty: 'Prof. Arjun Tiwari', room: 'Room 301', department: 'Computer Science', semester: 4 },
  { id: 118, day: 'Friday',    time: '12:00-01:00', subject: 'Lunch',           faculty: '-',                 room: '-',        department: 'Computer Science', semester: 4 },
  { id: 119, day: 'Friday',    time: '02:00-03:00', subject: 'Web Dev Lab',     faculty: 'Prof. Rohit Sinha',  room: 'Lab 301', department: 'Computer Science', semester: 4 },
  { id: 120, day: 'Friday',    time: '03:00-04:00', subject: 'Machine Learning',faculty: 'Dr. Pooja Bhat',     room: 'Room 302', department: 'Computer Science', semester: 4 },

  // ── Civil Sem 6 ──
  { id: 121, day: 'Monday',    time: '09:00-10:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 122, day: 'Monday',    time: '10:00-11:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 123, day: 'Monday',    time: '11:00-12:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  { id: 124, day: 'Monday',    time: '12:00-01:00', subject: 'Lunch',               faculty: '-',                 room: '-',        department: 'Civil', semester: 6 },
  { id: 125, day: 'Monday',    time: '02:00-03:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 126, day: 'Monday',    time: '03:00-04:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },

  { id: 127, day: 'Tuesday',   time: '09:00-10:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  { id: 128, day: 'Tuesday',   time: '10:00-11:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 129, day: 'Tuesday',   time: '11:00-12:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 130, day: 'Tuesday',   time: '12:00-01:00', subject: 'Lunch',               faculty: '-',                 room: '-',        department: 'Civil', semester: 6 },
  { id: 131, day: 'Tuesday',   time: '02:00-03:00', subject: 'Soil Lab',            faculty: 'Prof. Harish Pillai',room: 'Lab 501', department: 'Civil', semester: 6 },
  { id: 132, day: 'Tuesday',   time: '03:00-04:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },

  { id: 133, day: 'Wednesday', time: '09:00-10:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 134, day: 'Wednesday', time: '10:00-11:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  { id: 135, day: 'Wednesday', time: '11:00-12:00', subject: 'Survey Lab',          faculty: 'Dr. Leela Krishnan', room: 'Field 01', department: 'Civil', semester: 6 },
  { id: 136, day: 'Wednesday', time: '12:00-01:00', subject: 'Lunch',               faculty: '-',                 room: '-',        department: 'Civil', semester: 6 },
  { id: 137, day: 'Wednesday', time: '02:00-03:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 138, day: 'Wednesday', time: '03:00-04:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },

  { id: 139, day: 'Thursday',  time: '09:00-10:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 140, day: 'Thursday',  time: '10:00-11:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 141, day: 'Thursday',  time: '11:00-12:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  { id: 142, day: 'Thursday',  time: '12:00-01:00', subject: 'Lunch',               faculty: '-',                 room: '-',        department: 'Civil', semester: 6 },
  { id: 143, day: 'Thursday',  time: '02:00-03:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 144, day: 'Thursday',  time: '03:00-04:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },

  { id: 145, day: 'Friday',    time: '09:00-10:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
  { id: 146, day: 'Friday',    time: '10:00-11:00', subject: 'Structural Analysis', faculty: 'Prof. Dinesh Rao',   room: 'Room 501', department: 'Civil', semester: 6 },
  { id: 147, day: 'Friday',    time: '11:00-12:00', subject: 'Surveying',           faculty: 'Dr. Leela Krishnan', room: 'Room 502', department: 'Civil', semester: 6 },
  { id: 148, day: 'Friday',    time: '12:00-01:00', subject: 'Lunch',               faculty: '-',                 room: '-',        department: 'Civil', semester: 6 },
  { id: 149, day: 'Friday',    time: '02:00-03:00', subject: 'Struct Lab',          faculty: 'Prof. Dinesh Rao',   room: 'Lab 502', department: 'Civil', semester: 6 },
  { id: 150, day: 'Friday',    time: '03:00-04:00', subject: 'Soil Mechanics',      faculty: 'Prof. Harish Pillai',room: 'Room 503', department: 'Civil', semester: 6 },
];
export let nextTimetableId = 151;

/* ─── Seed Notices ─── */
export const notices: Notice[] = [
  {
    id: 1, title: 'Mid-Semester Examination Schedule', content: 'Mid-semester examinations will be held from April 15-25, 2024. Students must collect their hall tickets from the examination cell by April 10. Detailed timetable will be published on April 5.',
    date: '2024-04-01', priority: 'high', type: 'exam', postedBy: 'Exam Cell', targetAudience: 'all',
  },
  {
    id: 2, title: 'Fee Payment Deadline Extended', content: 'The deadline for semester fee payment has been extended to April 30, 2024. Late fee of ₹500 will be charged after the deadline. Students can pay online or at the college office.',
    date: '2024-04-02', priority: 'high', type: 'fee', postedBy: 'Finance Office', targetAudience: 'all',
  },
  {
    id: 3, title: 'Assignment 3 - Data Structures', content: 'Assignment 3 on Graph Algorithms and Dynamic Programming must be submitted by April 20, 2024. Submission through online portal only. Late submissions will not be accepted.',
    date: '2024-04-03', priority: 'medium', type: 'assignment', postedBy: 'Dr. Priya Rao', targetAudience: 'all',
  },
  {
    id: 4, title: 'Tech Fest 2024 - Registrations Open', content: 'Annual Tech Fest "Innovate 2024" will be held on May 5-6, 2024. Events include Hackathon, Robo War, Coding Contest, and Project Exhibition. Registration fee: ₹200 per event. Last date: April 20.',
    date: '2024-04-04', priority: 'medium', type: 'event', postedBy: 'Student Council', targetAudience: 'all',
  },
  {
    id: 5, title: 'Library Book Return Deadline', content: 'All students must return library books or renew them by April 15, 2024. Overdue fine: ₹1 per day. Students with pending books will not be allowed for examinations.',
    date: '2024-04-05', priority: 'high', type: 'general', postedBy: 'Library', targetAudience: 'all',
  },
  {
    id: 6, title: 'Industrial Visit - Software Companies', content: 'Industrial visit to Infosys and TCS Pune on April 25, 2024. Limited seats (50 students). Registration fee: ₹300 (includes transport). Interested students register by April 18.',
    date: '2024-04-06', priority: 'medium', type: 'event', postedBy: 'Training & Placement', targetAudience: 'all',
  },
  {
    id: 7, title: 'Operating Systems Lab - New Schedule', content: 'Operating Systems Lab has been rescheduled to Tuesday 01:00-02:00 and Friday 01:00-02:00. Students must bring their lab manuals and college ID cards.',
    date: '2024-04-07', priority: 'low', type: 'general', postedBy: 'Prof. Kumar Singh', targetAudience: 'all',
  },
  {
    id: 8, title: 'Scholarship Applications Open', content: 'Merit-based scholarship applications for 2024-25 are now open. Students with CGPA > 8.0 can apply. Deadline: April 30, 2024. Required documents: Marksheets, income certificate.',
    date: '2024-04-08', priority: 'medium', type: 'general', postedBy: 'Admin Office', targetAudience: 'all',
  },
];
export let nextNoticeId = 9;
