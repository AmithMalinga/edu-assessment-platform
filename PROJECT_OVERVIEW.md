# ExamMaster Project Overview

## 1. Project Architecture: Monorepo

This project is built as a **Monorepo** (Mono-repository). Multiple distinct projects (applications and libraries) are stored in a single Git repository.

We use **npm workspaces** to manage dependencies and link these projects together.

### Directory Structure

```
├── apps/
│   ├── web/                    # Next.js Frontend (User Interface)
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Student registration page
│   │   │   ├── contact/        # Contact form page
│   │   │   └── dashboard/      # Student dashboard
│   │   │       └── profile/    # Authenticated profile page
│   │   ├── components/
│   │   │   └── landing/        # Landing page sections (Header, Hero, Features, Stats, Testimonials, Footer)
│   │   └── lib/
│   │       └── services/       # API client services (student.service.ts, landing.service.ts)
│   │
│   └── server/                 # NestJS Backend (API & Business Logic)
│       └── src/
│           ├── app.module.ts   # Root module
│           ├── main.ts         # Bootstrap (port 3001, CORS, validation pipe)
│           ├── auth/           # JWT authentication module
│           ├── students/       # Students module
│           ├── questions/      # Questions module
│           ├── assessments/    # Assessments module (stub)
│           ├── submissions/    # Submissions module (stub)
│           ├── results/        # Results & analytics module
│           ├── subjects/       # Subjects module (stub)
│           ├── testimonials/   # Testimonials module
│           └── prisma/         # Shared PrismaModule
│
├── packages/
│   └── database/               # Prisma Client & Schema (Database Access Layer)
│       └── prisma/
│           └── schema.prisma   # PostgreSQL schema definition
│
├── docker-compose.yml          # PostgreSQL container configuration
├── turbo.json                  # Turborepo build pipeline configuration
└── package.json                # Root configuration defining workspaces
```

---

## 2. How Components Are Linked

The magic happens via **Workspaces**.

### The `@repo/database` Package
Instead of writing database code twice (once for the server, once for scripts), we put it in `packages/database`.
*   **Definition**: `packages/database/package.json` names this package `@repo/database`.
*   **Export**: It exports the `PrismaClient` and types from `src/index.ts`.

### Consuming Shared Code
Both `apps/web` and `apps/server` can "import" this package as if it were a library from npm Registry.

*   In `apps/server/package.json`, you will see:
    ```json
    "dependencies": {
        "@repo/database": "*"
    }
    ```
*   When you run `npm install`, npm sees `*` and realizes `@repo/database` is inside this repository. It creates a **symbolic link** (symlink) to the local folder instead of downloading it.

**Flow of Data:**
1.  **Frontend (`apps/web`)**: User interacts with the UI. The web app makes HTTP requests (e.g., `POST /auth/login`) to the backend.
2.  **Backend (`apps/server`)**: The NestJS server receives the request. It validates the DTO, applies business logic in the service, and uses `PrismaService` (which extends `PrismaClient` from `@repo/database`).
3.  **Database Layer (`packages/database`)**: The Prisma Client communicates with the **PostgreSQL** database running in Docker.

---

## 3. What is Turborepo?

**Turborepo** is a high-performance build system for JavaScript/TypeScript monorepos. It makes running tasks (like `build`, `lint`, `dev`) extremely fast and efficient.

### Key Features Used Here:
1.  **Orchestration**: When you run `npm run dev` in the root, Turbo looks at `turbo.json`. It runs `apps/web` (Next.js on port 3000) and `apps/server` (NestJS on port 3001) **in parallel**.
2.  **Caching**: If you run `npm run build`, Turbo caches the output. If you try to build again without changing code, Turbo restores from cache almost instantly.
3.  **Dependency Ordering**: `"dependsOn": ["^build"]` ensures shared packages are built before dependent apps.

---

## 4. Backend Modules (apps/server)

The NestJS server uses a modular architecture. Each feature is encapsulated in its own Module + Controller + Service.

### AuthModule (`/auth`)
Handles registration, login, and JWT-based authentication.

*   **Strategy**: `passport-local` for credential validation, `passport-jwt` for protected routes.
*   **Password hashing**: `bcrypt` with 10 salt rounds.
*   **JWT**: Tokens expire after 60 minutes. Secret read from `JWT_SECRET` environment variable.
*   **Endpoints**:
    *   `POST /auth/register` — Creates a new `STUDENT` user. Validates uniqueness of email + phone.
    *   `POST /auth/login` — Returns `{ access_token, user }`.
    *   `GET /auth/profile` — Protected by `JwtAuthGuard`; returns the authenticated user.

### StudentsModule (`/students`)
Read-only access to user records filtered by `role = STUDENT`.

*   `GET /students` — List all students.
*   `GET /students/:id` — Get a single student by UUID.

### QuestionsModule (`/questions`)
Full CRUD for the `Question` model, plus a random-set query endpoint.

*   **Question types**: `MCQ`, `STRUCTURED`, `ESSAY`
*   `GET /questions/random-set?grade=&subjectId=&questionType=&noOfQuestions=` — Returns a shuffled random subset filtered by grade, subject, and question type.
*   `GET /questions` — List all questions.
*   `GET /questions/:id` — Get one question.
*   `POST /questions` — Create a question (fields: `content`, `type`, `images`, `choices`, `correctAnswer`, `subjectId`).
*   `PUT /questions/:id` — Update a question.
*   `DELETE /questions/:id` — Delete a question.

### ResultsModule (`/results`)
Query and analyze exam `Attempt` records.

*   `GET /results` — All attempts, ordered by `completedAt` desc, with user and exam included.
*   `GET /results/recent?limit=` — Most recent attempts.
*   `GET /results/top-performers?limit=` — Highest scoring attempts.
*   `GET /results/student/:userId` — All attempts for a student.
*   `GET /results/student/:userId/stats` — Aggregated stats: `totalAttempts`, `avgScore`, `avgTimeTaken`, `passRate`, `highestScore`, `lowestScore`.
*   `GET /results/exam/:examId` — All attempts for an exam.
*   `GET /results/exam/:examId/stats` — Aggregated stats: `avgScore`, `maxScore`, `minScore`, `passRate`, `passCount`, `failCount`.
*   `GET /results/exam/:examId/leaderboard?limit=` — Top scorers for an exam.
*   `GET /results/exam/:examId/passed` / `/failed` — Filter attempts by pass/fail.
*   `DELETE /results/:id` — Delete an attempt record.

### TestimonialsModule (`/testimonials`)
*   `GET /testimonials` — Returns all `Testimonial` records (consumed by the landing page).

### Stub Modules (planned)
*   **AssessmentsModule** (`/assessments`) — CRUD for `Exam` records. Controller exists; service TBD.
*   **SubmissionsModule** (`/submissions`) — Record and process student exam submissions. Controller exists; service TBD.
*   **SubjectModule** (`/subjects`) — List `Subject` records. Controller exists; service TBD.

---

## 5. Database Schema

Defined in `packages/database/prisma/schema.prisma` targeting **PostgreSQL**.

| Model | Purpose | Key Relations |
|-------|---------|---------------|
| `User` | Stores student and admin accounts | Has many `Attempt` |
| `Exam` | An exam definition | Has many `Attempt` |
| `Attempt` | A student's sit of an exam | Belongs to `User`, `Exam` |
| `Grade` | School grade level (1–13) | Has many `Subject` |
| `Subject` | A subject within a grade | Belongs to `Grade`; has many `Question` |
| `Question` | Exam question with type, choices, answer | Belongs to `Subject` |
| `Testimonial` | User testimonial for landing page | — |

**Enums:**  
`Role` — `STUDENT`, `ADMIN`  
`QuestionType` — `MCQ`, `STRUCTURED`, `ESSAY`

---

## 6. Frontend Pages & Services (apps/web)

Built with **Next.js 14** (App Router), **Tailwind CSS**, and **Framer Motion**.

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` | Public landing page with Header, Hero, Features, Stats, Testimonials, Footer sections |
| `/login` | `LoginPage` | Email + password login form with client-side validation |
| `/register` | `RegisterPage` | Full registration form (name, email, phone, age, educationalLevel, password) |
| `/dashboard` | `DashboardPage` | Student dashboard with two tabs: **Analytics** (performance chart, skill breakdown, schedule) and **Exams** (exam catalog with enroll action) |
| `/dashboard/profile` | `StudentProfilePage` | Shows authenticated user's profile; redirects to `/login` if no token is found |
| `/contact` | `ContactPage` | Contact form (UI only; API integration pending) |

### API Client Services (`lib/services/`)

**`student.service.ts`**
*   `getAllStudents()` — `GET /students`
*   `register(data)` — `POST /auth/register`
*   `login(data)` — `POST /auth/login` — stores the returned `access_token` in `localStorage`
*   `getProfile(token)` — `GET /auth/profile` with `Authorization: Bearer <token>`

**`landing.service.ts`**
*   `getTestimonials()` — `GET /testimonials` — used by the `Testimonials` landing section

---

## 7. Summary of Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | UI, routing, SSR |
| Styling | Tailwind CSS + Framer Motion | Utility CSS + animations |
| Icons | Lucide React | SVG icon library |
| Backend | NestJS 10 | REST API, dependency injection, modules |
| Auth | Passport.js + JWT + bcrypt | Stateless authentication |
| Validation | class-validator + class-transformer | DTO validation |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL | Relational data storage |
| Dev Container | Docker | Local PostgreSQL instance |
| Monorepo | Turborepo + npm workspaces | Build orchestration and package linking |
| API Docs | @nestjs/swagger (disabled) | Swagger/OpenAPI (re-enable in `main.ts`) |
