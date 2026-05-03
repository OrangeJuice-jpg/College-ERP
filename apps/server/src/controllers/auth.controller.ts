import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, nextUserId, students } from '../db/seed';

const SECRET = process.env.JWT_SECRET || 'vaish_erp_secret_2024';

let _nextId = nextUserId;

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: 'Name, email and password are required' });

      if (users.find(u => u.email === email))
        return res.status(409).json({ message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const user = { id: _nextId++, name, email, password: hashed, role: role || 'student' };
      users.push(user);

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '24h' });
      const { password: _, ...safeUser } = user;
      res.status(201).json({ token, user: safeUser });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });

      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '24h' });
      
      // Get student data if user is a student
      let studentData = null;
      if (user.role === 'student') {
        studentData = students.find(s => s.userId === user.id);
      }

      res.status(200).json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        student: studentData // Will be null for non-students
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  logout: (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Logged out successfully' });
  },

  me: (req: Request, res: Response) => {
    const user = users.find(u => u.id === (req as any).user?.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.status(200).json(safeUser);
  },
};

export default authController;
