# Deploying Vaish ERP to Vercel

## What changed

| File | What it does |
|------|-------------|
| `vercel.json` | Tells Vercel: build the client, serve it as static, route `/api/*` to the serverless function |
| `api/index.ts` | Single serverless function with ALL routes + in-memory seed data (no DB needed) |
| `apps/client/vite.config.ts` | Added proxy so local dev forwards `/api` → `localhost:5000` |
| `apps/client/src/api.ts` | Changed base URL from hardcoded `localhost:5000` to `/api` (works on same domain) |
| `package.json` | Added `bcryptjs`, `express`, `cors`, `jsonwebtoken` as root dependencies for the serverless function |

## Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment config"
git push
```

### 2. Import on Vercel
- Go to https://vercel.com/new
- Import your GitHub repo
- **Root Directory**: leave as `.` (repo root — do NOT set it to apps/client or apps/server)
- **Framework Preset**: Other (Vercel will use vercel.json)
- Click **Deploy**

### 3. No environment variables required
The app uses in-memory seed data, so no database URL is needed.
If you want a custom JWT secret, add `JWT_SECRET=your_secret` in Vercel → Settings → Environment Variables.

## Default Login Credentials
| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@vaish.edu          | admin123    |
| Faculty | faculty@vaish.edu        | faculty123  |
| Student | arjun.mehta@vaish.edu    | student123  |
| Student | priya.sharma@vaish.edu   | student123  |

## Local Development (unchanged)
```bash
# Terminal 1 — backend
cd apps/server
npm install
npm run dev

# Terminal 2 — frontend  
cd apps/client
npm install
npm run dev
```

> Note: In-memory data resets on every Vercel cold start. This is fine for a demo.
> For persistent data, replace the seed arrays in `api/index.ts` with a hosted DB like Neon (Postgres) or PlanetScale (MySQL).
