# Vaish ERP — Backend Server

Simple Express + TypeScript backend with **in-memory seeded database** (no PostgreSQL needed).

---

## 📁 Structure

```
erp-server/
├── src/
│   ├── db/
│   │   └── seed.ts           ← 12 students + 3 users + finance records
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   └── finance.controller.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   └── index.ts
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup & Run

### 1. Replace your server folder

Copy this `erp-server/` folder into `apps/` and rename it to replace `apps/server/`:

```bash
# From the apps/ directory:
mv server server_old         # backup old
cp -r erp-server server      # use new one
```

Or just copy individual files from `erp-server/src/` into `apps/server/src/`.

### 2. Install dependencies

```bash
cd apps/server   # (or wherever you placed it)
npm install
```

### 3. Start the server

```bash
npm run dev
```

Server starts at **http://localhost:5000**

---

## 🔑 Default Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@vaish.edu        | admin123    |
| Faculty | faculty@vaish.edu      | faculty123  |
| Student | student@vaish.edu      | student123  |

You can also **Register** a new account from the Login page — it will work immediately.

---

## 🗄️ Seeded Data

### 12 Students across 4 departments:

| # | Name            | Dept              | Semester | CGPA | Fees   |
|---|-----------------|-------------------|----------|------|--------|
| 1 | Arjun Mehta     | Computer Science  | 6        | 8.7  | Paid   |
| 2 | Priya Sharma    | Electronics       | 6        | 9.1  | Paid   |
| 3 | Rahul Verma     | Mechanical        | 4        | 7.4  | Pending|
| 4 | Sneha Iyer      | Computer Science  | 4        | 8.9  | Paid   |
| 5 | Karan Patel     | Civil             | 6        | 6.8  | Overdue|
| 6 | Ananya Reddy    | Information Tech  | 2        | 9.4  | Paid   |
| 7 | Dev Kulkarni    | Computer Science  | 8        | 8.2  | Paid   |
| 8 | Meera Nair      | Electronics       | 4        | 7.9  | Paid   |
| 9 | Aditya Singh    | Mechanical        | 6        | 7.1  | Pending|
|10 | Riya Desai      | Computer Science  | 2        | 8.5  | Paid   |
|11 | Vikrant Joshi   | Civil             | 8        | 6.5  | Overdue|
|12 | Pooja Gupta     | Information Tech  | 4        | 9.0  | Paid   |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/login       { email, password } → { token, user }
POST /api/auth/register    { name, email, password, role } → { token, user }
POST /api/auth/logout      → { message }
GET  /api/auth/me          (🔒 auth required) → current user
```

### Students (🔒 auth required)
```
GET    /api/students         → all 12 students
GET    /api/students/stats   → { total, active, avgCgpa, deptBreakdown }
GET    /api/students/:id     → single student
POST   /api/students         → create student
PUT    /api/students/:id     → update student
DELETE /api/students/:id     → delete student
```

### Finance (🔒 auth required)
```
GET    /api/finance          → all finance records
GET    /api/finance/stats    → { total, collected, pending, overdue }
POST   /api/finance          → create record
PUT    /api/finance/:id      → update record
DELETE /api/finance/:id      → delete record
```

---

## ⚡ Important Notes

- **No database required** — all data lives in memory. On server restart, data resets to seed values.
- **Passwords are bcrypt-hashed** at startup — safe and secure.
- **JWT auth** — tokens expire in 24 hours.
- The client (`apps/client`) should already be configured with `VITE_API_URL=http://localhost:5000/api` or it defaults to that URL automatically.

---

## 🌐 CORS

The server allows requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`
- `http://localhost:5174`

To add more origins, edit `src/index.ts` → the `cors()` config.
