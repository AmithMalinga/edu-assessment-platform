# Edu Assessment Platform - Admin Dashboard

This is a premium, glassmorphic admin dashboard built for managing the **Edu Assessment Platform**. It allows administrators to manage students, grades, subjects, and the question bank.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- The **NestJS Server** running on `http://localhost:3001`

### Running the App
1. Navigate to the root of the project:
   ```bash
   cd apps/admin
   ```
2. Install dependencies (if not already done via the monorepo):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:3002`**.

---

## 🔑 Admin Registration

To register a new admin account, follow these steps:

### 1. Configure the Server
Ensure you have an `ADMIN_REGISTRATION_SECRET` defined in your **`apps/server/.env`** file:
```env
ADMIN_REGISTRATION_SECRET="your-secret-key"
```

### 2. Register via API
Send a **POST** request to `http://localhost:3001/auth/register-admin` with the following:

**Headers:**
`x-admin-registration-secret: your-secret-key`

**Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "phone": "0771234567",
  "age": 30,
  "educationalLevel": "Grade 13",
  "password": "Password123"
}
```

---

## 🛠 Features
- **Secure Login**: Role-based access for admins only.
- **Student Management**: View and search all registered students.
- **Grades & Subjects**: CRUD operations for academic levels and subjects.
- **Question Bank**: Comprehensive tool for creating MCQs and structured questions.

## 🎨 UI Design
Built with:
- **Vite + React**
- **Vanilla CSS** (Premium Glassmorphism)
- **Framer Motion** (Smooth Animations)
- **Lucide Icons**
