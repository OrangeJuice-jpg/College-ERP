import { Request, Response } from 'express';
import { notices, nextNoticeId } from '../db/seed';

let _nextId = nextNoticeId;

class NoticeController {
  // Get all notices
  getAllNotices(_req: Request, res: Response) {
    // Sort by date (newest first) and priority
    const sortedNotices = [...notices].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    res.status(200).json(sortedNotices);
  }

  // Get notice by ID
  getNoticeById(req: Request, res: Response) {
    const notice = notices.find(n => n.id === Number(req.params.id));
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.status(200).json(notice);
  }

  // Create notice (faculty/admin only)
  createNotice(req: Request, res: Response) {
    const notice = {
      id: _nextId++,
      ...req.body,
      date: new Date().toISOString().split('T')[0],
    };
    notices.push(notice);
    res.status(201).json(notice);
  }
}

export default new NoticeController();
