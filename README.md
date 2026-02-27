# Life-OS — Full Stack Productivity & Automation System

A production-grade personal productivity system built with a distributed job queue architecture, AI-powered weekly reporting, and automated habit, task, and expense tracking — all running as a fully async, fault-tolerant backend.

**Live Demo:** [life-os-efficency-booster.vercel.app](https://life-os-efficency-booster.vercel.app)  
**Backend:** Hosted on Render | **Frontend:** Hosted on Vercel

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, BullMQ, Redis, Gemini API, Nodemailer, Zod, Clerk  
**Frontend:** React.js, Tailwind CSS, Clerk (Authentication)  
**Infrastructure:** BullMQ job queues, Redis, Cron jobs, Worker processes

---

## Key Features

- **Authentication** — Secure user auth via Clerk on both frontend and backend
- **Task Management** — Create, update, archive, and track tasks with full CRUD and status lifecycle
- **Habit Tracking** — Daily and weekly habits with completion logging and consistency scoring
- **Expense Tracking** — Categorized expense management with archiving and monthly aggregation
- **Automated Weekly Reports** — AI-generated productivity reports combining task completion rate, habit consistency, and expense data
- **Daily Reminders** — Automated email reminders via scheduled background jobs
- **Dashboard** — Unified summary aggregating data across all modules in a single API call

---

## Architecture

The backend follows a **module-based architecture** where each feature domain (tasks, habits, expenses, dashboard, reports) is fully self-contained with its own controller, service, model, routes, and Zod validation schema. This mirrors production monorepo patterns and keeps concerns cleanly separated.

Background automation runs as a **separate worker process** backed by BullMQ and Redis. The API server enqueues jobs to Redis and the worker process picks them up independently — meaning report generation, email delivery, and scheduled tasks never block API response times and survive server restarts without data loss.

```
API Server  →  Redis Queue  →  Worker Process  →  MongoDB  →  Email / Report
```

### Why BullMQ over plain Cron

Plain cron runs inside the main process — if the server crashes mid-execution, the job is lost permanently with no recovery. BullMQ stores jobs in Redis, supports automatic retries with exponential backoff, and allows horizontal scaling by running multiple workers. For a system that generates AI reports and sends emails, this reliability was non-negotiable.

### Race Condition Fix

An early implementation used a find-then-create pattern for weekly report generation. Under concurrent workers, two workers could both find no existing report and both attempt to create one — causing a MongoDB duplicate key error. This was fixed using an atomic `findOneAndUpdate` with `$setOnInsert` and `upsert: true`, making the operation thread-safe and worker-safe.

---

## Folder Structure

```
src/
├── automation/
│   ├── jobs/          # weeklyReport.job.js, dailyReminder.job.js
│   ├── queues/        # BullMQ queue initialization (singleton pattern)
│   └── workers/       # Worker process entry point
├── config/            # DB connection, environment config
├── lib/
│   └── ai/            # Gemini client abstraction
├── middlewares/       # Auth, error handler, asyncHandler
├── modules/
│   ├── dashboard/     # controller, routes, service
│   ├── expenses/      # controller, model, routes, service, validation
│   ├── habits/        # controller, model, routes, service, validation
│   ├── reports/       # Weekly and expense report modules
│   ├── tasks/         # controller, model, routes, service, validation
│   └── users/         # controller, model, routes, service, validation
└── utils/             # ApiError, ApiResponse, logger, zodError
```

---

## API Overview

| Module | Endpoints |
|--------|-----------|
| Users | GET /me, PATCH /me |
| Tasks | CRUD + archive/unarchive |
| Habits | CRUD + log completion |
| Expenses | CRUD + archive/unarchive |
| Reports | Weekly latest/history, Expense summary/categories/trend |
| Dashboard | Unified summary |
| Automation | Trigger weekly report, daily reminder |

~30 REST endpoints total.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Redis instance
- Gemini API key
- Clerk account

### Backend Setup

```bash
git clone https://github.com/SudhanvaKalghatgi/LifeOS.git
cd LifeOS/backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongoDB_url
CORS_ORIGIN=https://life-os-efficency-booster.vercel.app,http://localhost:3000
ENABLE_AUTOMATION=true
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

```bash
# Start API server
npm run dev

# Start worker process (separate terminal)
npm run worker
```

### Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=https://lifeos-utk8.onrender.com/api/v1
```

```bash
npm run dev
```

---

## Author

**Sudhanva Kalghatgi**  
[LinkedIn](https://linkedin.com/in/sudhanvak4680) | [GitHub](https://github.com/SudhanvaKalghatgi)
