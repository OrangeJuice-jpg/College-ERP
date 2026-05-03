import { Request, Response } from 'express';
import { financeRecords, nextFinanceId } from '../db/seed';

let _nextId = nextFinanceId;

class FinanceController {
  getFinanceData(_req: Request, res: Response) {
    res.status(200).json(financeRecords);
  }

  getStats(_req: Request, res: Response) {
    const total = financeRecords.reduce((sum, r) => sum + r.amount, 0);
    const collected = financeRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const pending = financeRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
    const overdue = financeRecords.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.amount, 0);
    res.status(200).json({ total, collected, pending, overdue });
  }

  createFinanceRecord(req: Request, res: Response) {
    const record = { id: _nextId++, ...req.body, date: new Date().toISOString() };
    financeRecords.push(record);
    res.status(201).json(record);
  }

  updateFinanceRecord(req: Request, res: Response) {
    const idx = financeRecords.findIndex(r => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Record not found' });
    financeRecords[idx] = { ...financeRecords[idx], ...req.body };
    res.status(200).json(financeRecords[idx]);
  }

  deleteFinanceRecord(req: Request, res: Response) {
    const idx = financeRecords.findIndex(r => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: 'Record not found' });
    financeRecords.splice(idx, 1);
    res.status(204).send();
  }
}

export default new FinanceController();
