# ExamMaster

A monorepo for the ExamMaster examination platform.

## Structure

- **apps/web**: Next.js frontend (Port 3000)
- **apps/server**: NestJS backend (Port 3001)
- **packages/database**: Shared Prisma client and schema.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Database**
   Ensure Docker is running, then:
   ```bash
   docker-compose up -d
   ```

3. **Generate Database Client**
   ```bash
   turbo run db:generate
   ```
   Or manually:
   ```bash
   cd packages/database
   npx prisma generate
   ```

4. **Run Development Server**
   ```bash
   turbo dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Technologies
- Turborepo
- Next.js 14
- NestJS
- PostgreSQL & Prisma
- Tailwind CSS & Framer Motion
