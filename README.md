# ExamMaster

A monorepo for the ExamMaster examination platform — an online assessment system supporting Sri Lankan O/L and A/L students with multilingual exam delivery, real-time analytics, and progress tracking.

## Prerequisites

- **Node.js**: Version 20.19+, 22.12+, or 24.0+ (required for Prisma)
- **Docker Desktop**: Running for database services
- **npm**: Version 11.5.1 or higher

## Structure

- **apps/web**: Next.js frontend (Port 3000, or next available if in use)
- **apps/server**: NestJS backend (Port 3001)
- **packages/database**: Shared Prisma client and schema

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Database**
   Ensure Docker Desktop is running, then:
   ```bash
   docker-compose up -d
   ```

3. **Generate Database Client**
   ```bash
   npm run db:generate
   ```
   Or manually:
   ```bash
   cd packages/database
   npx prisma generate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in `apps/server/` with the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/exammaster
JWT_SECRET=your_jwt_secret_here
```

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`).

## API Reference

The NestJS server runs on **port 3001**. All endpoints are prefixed as shown below.

### Authentication — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register a new student account |
| POST | `/auth/login` | — | Login and receive a JWT |
| GET | `/auth/profile` | JWT | Get the authenticated user's profile |

**Register body:** `name`, `email`, `phone`, `age`, `educationalLevel` (e.g. `"Grade 10"`), `password`  
**Login body:** `email`, `password`  
**Returns:** `{ access_token, user }`

### Students — `/students`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/students` | — | List all students |
| GET | `/students/:id` | — | Get a student by ID |

### Questions — `/questions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/questions` | — | List all questions |
| GET | `/questions/:id` | — | Get a question by ID |
| POST | `/questions` | — | Create a new question |
| PUT | `/questions/:id` | — | Update a question |
| DELETE | `/questions/:id` | — | Delete a question |
| GET | `/questions/random-set` | — | Get a random set of questions |

**Random set query params:** `grade` (required), `subjectId` (required), `questionType` (required: `MCQ` \| `STRUCTURED` \| `ESSAY`), `noOfQuestions` (default: 10)

### Results — `/results`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/results` | — | List all attempt results |
| GET | `/results/:id` | — | Get a result by ID |
| DELETE | `/results/:id` | — | Delete a result |
| GET | `/results/recent` | — | Get recent attempts (`?limit=20`) |
| GET | `/results/top-performers` | — | Get top scorers (`?limit=10`) |
| GET | `/results/student/:userId` | — | Get all results for a student |
| GET | `/results/student/:userId/stats` | — | Aggregated stats for a student |
| GET | `/results/exam/:examId` | — | Get all results for an exam |
| GET | `/results/exam/:examId/stats` | — | Aggregated stats for an exam |
| GET | `/results/exam/:examId/leaderboard` | — | Leaderboard for an exam (`?limit=10`) |
| GET | `/results/exam/:examId/passed` | — | Passed attempts for an exam |
| GET | `/results/exam/:examId/failed` | — | Failed attempts for an exam |

### Testimonials — `/testimonials`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/testimonials` | — | List all testimonials |

### Assessments — `/assessments` *(stub)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assessments` | List assessments (TODO) |
| GET | `/assessments/:id` | Get assessment by ID (TODO) |
| POST | `/assessments` | Create assessment (TODO) |
| PUT | `/assessments/:id` | Update assessment (TODO) |
| DELETE | `/assessments/:id` | Delete assessment (TODO) |

### Submissions — `/submissions` *(stub)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/submissions` | List submissions (TODO) |
| GET | `/submissions/:id` | Get submission by ID (TODO) |
| POST | `/submissions` | Create submission (TODO) |

### Subjects — `/subjects` *(stub)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subjects` | List subjects (TODO) |

## Database Schema

Managed via Prisma in `packages/database/prisma/schema.prisma`.

| Model | Key Fields |
|-------|-----------|
| `User` | `id`, `name`, `email` (unique), `phone` (unique), `age`, `educationalLevel`, `password` (hashed), `role` (`STUDENT` \| `ADMIN`) |
| `Exam` | `id`, `title`, `description`, `duration` (minutes), `passingScore` |
| `Attempt` | `id`, `userId`, `examId`, `score`, `timeTaken` (seconds), `completedAt` |
| `Grade` | `id` (Int), `name` |
| `Subject` | `id`, `name`, `gradeId` |
| `Question` | `id`, `content`, `type` (`MCQ` \| `STRUCTURED` \| `ESSAY`), `images[]`, `choices[]`, `correctAnswer`, `subjectId` |
| `Testimonial` | `id`, `name`, `role`, `content`, `rating`, `avatar` |

## Frontend Pages

The Next.js app (`apps/web`) exposes the following routes:

| Route | Description |
|-------|-------------|
| `/` | Landing page (Header, Hero, Features, Stats, Testimonials, Footer) |
| `/login` | Login form |
| `/register` | Student registration form |
| `/dashboard` | Student dashboard with analytics (performance chart, skill breakdown, exam catalog) |
| `/dashboard/profile` | Authenticated student profile view |
| `/contact` | Contact form |

## Technologies

- **Turborepo** — monorepo build orchestration
- **Next.js 14.2.3** ⚠️ (has security vulnerability — upgrade recommended)
- **NestJS 10** — backend REST API
- **PostgreSQL** — relational database
- **Prisma** — ORM and schema management
- **Passport.js + JWT** — authentication (bcrypt password hashing, 60-minute token expiry)
- **class-validator** — request DTO validation
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations
- **Lucide React** — icons

## Troubleshooting

### Port Conflicts
If ports 3000-3002 are in use, the web app will automatically use the next available port (e.g., 3003).

### Node.js Version Issues
If you encounter Prisma-related errors, ensure your Node.js version meets the requirements:
```bash
node --version
```

### Docker Issues
Make sure Docker Desktop is running before starting the database.

### Permission Errors
On Windows, you may encounter permission errors with `.next/trace` files. These are non-critical and don't affect functionality.

### Swagger UI
Swagger is integrated (`@nestjs/swagger`) but temporarily disabled in `apps/server/src/main.ts` due to type conflicts. Uncomment the Swagger block in `main.ts` to re-enable it at `/api`.
