import { Request, Response } from 'express';
import { timetableEntries, students } from '../db/seed';

class TimetableController {
  // Get timetable for logged-in student
  getMyTimetable(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    
    // Find student linked to this user
    const student = students.find(s => s.userId === userId);
    if (!student) {
      return res.status(404).json({ message: 'No student record found for your account' });
    }

    // Get timetable for student's department and semester
    const myTimetable = timetableEntries.filter(
      e => e.department === student.department && e.semester === student.semester
    );

    // Group by day
    const timetableByDay: Record<string, typeof timetableEntries> = {};
    myTimetable.forEach(entry => {
      if (!timetableByDay[entry.day]) {
        timetableByDay[entry.day] = [];
      }
      timetableByDay[entry.day].push(entry);
    });

    res.status(200).json(timetableByDay);
  }

  // Get all timetable entries (for faculty/admin)
  getAllTimetable(_req: Request, res: Response) {
    const timetableByDay: Record<string, typeof timetableEntries> = {};
    timetableEntries.forEach(entry => {
      if (!timetableByDay[entry.day]) {
        timetableByDay[entry.day] = [];
      }
      timetableByDay[entry.day].push(entry);
    });
    res.status(200).json(timetableByDay);
  }
}

export default new TimetableController();
