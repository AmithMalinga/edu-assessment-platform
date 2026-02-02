# ExamMaster Project Overview

## 1. Project Architecture: Monorepo

This project is built as a **Monorepo** (Mono-repository). This means multiple distinct projects (applications and libraries) are stored in a single Git repository.

We use **npm workspaces** to manage dependencies and link these projects together.

### Directory Structure

```
├── apps/               # Deployable applications
│   ├── web/            # Next.js Frontend (User Interface)
│   └── server/         # NestJS Backend (API & Business Logic)
│
├── packages/           # Shared libraries used by apps
│   └── database/       # Prisma Client & Schema (Database Access Layer)
│
├── docker-compose.yml  # Database container configuration
├── turbo.json          # Turborepo build pipeline configuration
└── package.json        # Root configuration defining the workspaces
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
1.  **Frontend (`apps/web`)**: User interacts with the UI. The web app makes HTTP requests (e.g., `GET /users`) to the backend.
2.  **Backend (`apps/server`)**: The NestJS server receives the request. It imports `PrismaService` which extends `PrismaClient` from `@repo/database`.
3.  **Database Layer (`packages/database`)**: The Prisma Client communicates with the **PostgreSQL** database running in Docker.

---

## 3. What is Turborepo?

**Turborepo** is a high-performance build system for JavaScript/TypeScript monorepos. It makes running tasks (like build, lint, dev) extremely fast and efficient.

### Key Features Used Here:
1.  **Orchestration**:
    *   When you run `npm run dev` in the root, Turbo looks at `turbo.json`.
    *   It sees that `dev` task needs to run in all workspaces.
    *   It runs `apps/web` (Next.js) and `apps/server` (NestJS) **in parallel**.

2.  **Caching**:
    *   If you run `npm run build`, Turbo caches the output.
    *   If you try to build again without changing code, Turbo restores the files from cache almost instantly (in milliseconds) instead of rebuilding.

3.  **Dependency Visualization**:
    *   Turbo understands that if `apps/server` depends on `packages/database`, it might need to build the database package first (if configured in the pipeline).

### The `turbo.json` File
This file defines the "Pipeline".
*   `"dependsOn": ["^build"]`: Means "before building this app, build all its dependencies first".

---

## 4. Summary of Tech Stack

*   **Next.js (`apps/web`)**: A React framework for building the user interface. It handles routing and rendering.
*   **NestJS (`apps/server`)**: A progressive Node.js framework for building efficient and scalable server-side applications. It organizes code into Modules, Controllers, and Services.
*   **Prisma (`packages/database`)**: An ORM (Object-Relational Mapper). It lets us interact with the database using TypeScript code instead of writing raw SQL.
*   **PostgreSQL**: The relational database management system storing your data.
*   **Docker**: Runs the PostgreSQL database in an isolated container, so you don't have to install Postgres manually on your machine.
