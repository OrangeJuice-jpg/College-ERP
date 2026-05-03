import { Request, Response } from 'express';
import { students, nextStudentId } from '../db/seed';

let _nextId = nextStudentId;

class StudentController {
  getAllStudents(_req: Request, res: Response) {
    res.status(200).json(students);
  }

  getStudentById(req: Request, res: Response) {
    const student = students.find(s => s.id === Number(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  }

  createStudent(req: Request, res: Response) {
    const existing = students.find(s => s.email === req.body.email || s.rollNumber === req.body.rollNumber);
    if (existing) return res.status(409).json({ message: 'Student with this email or roll number already exists' });

    const student = {
      id: _nextId++,
      ...req.body,
      status: req.body.status || 'active',
      enrollmentDate: req.body.enrollmentDate || new Date().toISOString().split('T')[0],
      avatar: req.body.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
      courses: req.body.courses || [],
    };
    students.push(student);
    res.status(201).json(student);
  }

  updateStudent(req: Request, res: Response) {
    const idx = students.findIndex(s => s.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Student not found' });
    students[idx] = { ...students[idx], ...req.body };
    res.status(200).json(students[idx]);
  }

  deleteStudent(req: Request, res: Response) {
    const idx = students.findIndex(s => s.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Student not found' });
    students.splice(idx, 1);
    res.status(204).send();
  }

  // Stats endpoint
  getStats(_req: Request, res: Response) {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const deptBreakdown = students.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const avgCgpa = (students.reduce((sum, s) => sum + s.cgpa, 0) / total).toFixed(2);
    res.status(200).json({ total, active, avgCgpa: Number(avgCgpa), deptBreakdown });
  }
}

export default new StudentController();
