import { Request, Response } from 'express';
import { attendanceRecords, nextAttendanceId, students } from '../db/seed';

let _nextId = nextAttendanceId;

class AttendanceController {
  // Get all attendance records (for faculty/admin)
  getAllAttendance(_req: Request, res: Response) {
    res.status(200).json(attendanceRecords);
  }

  // Get attendance for logged-in student
  getMyAttendance(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    
    // Find student linked to this user
    const student = students.find(s => s.userId === userId);
    if (!student) {
      return res.status(404).json({ message: 'No student record found for your account' });
    }

    const myRecords = attendanceRecords.filter(r => r.studentId === student.id);
    res.status(200).json(myRecords);
  }

  // Get attendance stats for logged-in student
  getMyAttendanceStats(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    
    const student = students.find(s => s.userId === userId);
    if (!student) {
      return res.status(404).json({ message: 'No student record found for your account' });
    }

    const myRecords = attendanceRecords.filter(r => r.studentId === student.id);
    const total = myRecords.length;
    const present = myRecords.filter(r => r.status === 'present').length;
    const absent = myRecords.filter(r => r.status === 'absent').length;
    const late = myRecords.filter(r => r.status === 'late').length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(2) : '0.00';

    res.status(200).json({
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      total,
      present,
      absent,
      late,
      attendancePercentage: Number(attendancePercentage),
    });
  }

  // Mark attendance (faculty only)
  markAttendance(req: Request, res: Response) {
    const { studentId, date, status, subject } = req.body;
    
    if (!studentId || !date || !status || !subject) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const record = {
      id: _nextId++,
      studentId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      date,
      status,
      subject,
      markedBy: (req as any).user?.id,
      markedAt: new Date().toISOString(),
    };

    attendanceRecords.push(record);
    res.status(201).json(record);
  }

  // Update attendance record
  updateAttendance(req: Request, res: Response) {
    const idx = attendanceRecords.findIndex(r => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });
    
    attendanceRecords[idx] = { ...attendanceRecords[idx], ...req.body };
    res.status(200).json(attendanceRecords[idx]);
  }

  // Delete attendance record
  deleteAttendance(req: Request, res: Response) {
    const idx = attendanceRecords.findIndex(r => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });
    
    attendanceRecords.splice(idx, 1);
    res.status(204).send();
  }

  // Get class attendance by date and subject
  getClassAttendance(req: Request, res: Response) {
    const { date, subject } = req.query;
    
    let filtered = attendanceRecords;
    if (date) filtered = filtered.filter(r => r.date === date);
    if (subject) filtered = filtered.filter(r => r.subject === subject);
    
    res.status(200).json(filtered);
  }
}

export default new AttendanceController();
