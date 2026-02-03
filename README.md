# ExamMaster

A monorepo for the ExamMaster examination platform.

## Prerequisites

- **Node.js**: Version 20.19+, 22.12+, or 24.0+ (required for Prisma)
- **Docker Desktop**: Running for database services
- **npm**: Version 11.5.1 or higher

## Structure

- **apps/web**: Next.js frontend (Port 3000, or next available if in use)
- **apps/server**: NestJS backend (Port 3001)
- **packages/database**: Shared Prisma client and schema.

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

## Technologies
- Turborepo
- Next.js 14.2.3 ⚠️ (has security vulnerability - upgrade recommended)
- NestJS
- PostgreSQL & Prisma
- Tailwind CSS & Framer Motion

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
