import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';

const app = express();

/* ─── Middleware ─── */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─── Routes ─── */
app.use('/api', routes);

/* ─── Health check ─── */
app.get('/health', (_req, res) => res.json({ status: 'ok', message: 'Vaish ERP Server running' }));

/* ─── 404 ─── */
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

/* ─── Start ─── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅  Vaish ERP Server running on http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/health`);
  console.log(`\n🔑  Default Login Credentials:`);
  console.log(`    Admin:   admin@vaish.edu    / admin123`);
  console.log(`    Faculty: faculty@vaish.edu  / faculty123`);
  console.log(`    Student: student@vaish.edu  / student123\n`);
});
