# 🚀 TeamTask: Premium Enterprise Task Management

TeamTask is a high-performance, visually stunning task management platform designed for modern teams. Built with a focus on speed, real-time collaboration, and executive-level analytics, it transforms complex project workflows into intuitive, interactive experiences.


## ✨ Core Features

### 🔍 Glassmorphic Command Palette
- **Global Control**: Access any task, page, or administrative action from anywhere using `Cmd + K`.
- **Fuzzy Search**: Immersive frosted-glass overlay with instant results for team members and project milestones.

### 📊 Executive Insights Dashboard
- **Real-Time Activity Feed**: Live polling feed showing task state changes, assignments, and completions as they happen.
- **Advanced Analytics**: Interactive charts for team productivity, task distribution, and project health monitoring.

### 🏗️ Advanced Kanban Workspace
- **Drag-and-Drop**: Fluid card movement powered by `@dnd-kit`.
- **Dynamic Feedback**: Visual "glow" effects and spring-like animations for a tactile project management experience.
- **Priority Intelligence**: Color-coded urgency indicators and automated overdue detection.

### 🛡️ Enterprise Security & RBAC
- **Role-Based Access**: Granular control (Admin vs. Member) over task creation, deletion, and team-wide statistics.
- **Secure Auth**: Powered by NextAuth.js with production-grade encryption.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion & CSS Micro-animations

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- A PostgreSQL database instance

### 2. Installation
```bash
git clone https://github.com/AnshPradhan14/Team-Task-Manager.git
cd Team-Task-Manager
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5403/teamtask"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
npx prisma db push
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```

---

## ☁️ Deployment

This project is pre-configured for **Railway**.

1. Connect your repository to Railway.
2. Add a **PostgreSQL** service.
3. Configure the environment variables in the Railway dashboard.
4. Railway will automatically execute the build pipeline defined in `railway.json`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


