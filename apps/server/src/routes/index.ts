import { Router, Request, Response } from 'express';
import authController from '../controllers/auth.controller';
import studentController from '../controllers/student.controller';
import financeController from '../controllers/finance.controller';
import attendanceController from '../controllers/attendance.controller';
import timetableController from '../controllers/timetable.controller';
import noticeController from '../controllers/notice.controller';
import { authenticate } from '../middlewares/auth.middleware';

const notImplemented = (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
};

const router = Router();

/* ─── Auth ─── */
router.post('/auth/login',    authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/logout',   authController.logout);
router.get('/auth/me',        authenticate, authController.me);

/* ─── Students ─── */
// Removed .bind() calls. 
router.get('/students/stats', authenticate, studentController.getStats);
router.get('/students',       authenticate, studentController.getAllStudents);
router.get('/students/:id',   authenticate, studentController.getStudentById);
router.post('/students',      authenticate, studentController.createStudent);
router.put('/students/:id',   authenticate, studentController.updateStudent);
router.delete('/students/:id',authenticate, studentController.deleteStudent);

/* ─── Finance ─── */
router.get('/finance/stats',  authenticate, financeController.getStats);
router.get('/finance',        authenticate, financeController.getFinanceData);
router.post('/finance',       authenticate, financeController.createFinanceRecord);
router.put('/finance/:id',    authenticate, financeController.updateFinanceRecord);
router.delete('/finance/:id', authenticate, financeController.deleteFinanceRecord);

/* ─── Attendance ─── */
// For students - get their own attendance
router.get('/attendance/my',          authenticate, attendanceController.getMyAttendance);
router.get('/attendance/my-stats',    authenticate, attendanceController.getMyAttendanceStats);
// For faculty/admin - manage attendance
router.get('/attendance',             authenticate, attendanceController.getAllAttendance);
router.get('/attendance/class',       authenticate, attendanceController.getClassAttendance);
router.post('/attendance',            authenticate, attendanceController.markAttendance);
router.put('/attendance/:id',         authenticate, attendanceController.updateAttendance);
router.delete('/attendance/:id',      authenticate, attendanceController.deleteAttendance);

/* ─── Timetable ─── */
router.get('/timetable/my',           authenticate, timetableController.getMyTimetable);
router.get('/timetable',              authenticate, timetableController.getAllTimetable);

/* ─── Notices ─── */
router.get('/notices',                authenticate, noticeController.getAllNotices);
router.get('/notices/:id',            authenticate, noticeController.getNoticeById);
router.post('/notices',               authenticate, noticeController.createNotice);

export default router;