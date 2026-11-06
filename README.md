# TeamFlow – Enterprise Task Management System

A full-stack task management application built with **Next.js, React, TypeScript, Node.js, Express, and MongoDB**. TeamFlow provides secure authentication and task management with a responsive dashboard.

## 🚀 Live Demo

- **Frontend:** https://team-flow-mtduhfsvc-team-flow9.vercel.app/dashboard
- **Backend API:** https://teamflow-backend-w7g8.onrender.com
- **Health Check:** https://teamflow-backend-w7g8.onrender.com/api/health

## ✨ Features

### Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes

### Task Management
- Create and view tasks
- Update task status
- Delete tasks
- Task priorities: Low, Medium, High
- Task statuses: Todo, In Progress, Completed
- Due dates and task descriptions
- Search and filter tasks

### Dashboard
- Task statistics
- Task progress overview
- Responsive dashboard interface

### Security
- JWT authentication middleware
- Password hashing
- Request rate limiting
- Helmet security headers
- CORS configuration
- Request validation using Zod
- Task ownership validation

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | Zod |
| Security | Helmet, express-rate-limit |
| Deployment | Vercel, Render |

## 🏗️ Project Architecture

```text
TeamFlow/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── dashboard/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   │
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── validators/
    │   ├── app.ts
    │   └── server.ts
    │
    └── package.json
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/FaizanAhmadFazzu/TeamFlow/
cd TeamFlow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env.local` inside the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:3000`

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Login a user | Public |

### Tasks

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/tasks` | Fetch tasks | Protected |
| POST | `/api/tasks` | Create a task | Protected |
| PUT | `/api/tasks/:id` | Update a task | Protected |
| DELETE | `/api/tasks/:id` | Delete a task | Protected |

All protected endpoints require a JWT bearer token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🌐 Deployment

- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Render
- **Database:** MongoDB Atlas

Production environment variables must be configured in the respective deployment dashboards. Never commit `.env` or `.env.local` files.

## 🔮 Future Enhancements

- Edit task functionality
- Admin and team management
- Task assignment to team members
- Real-time task updates
- Pagination and advanced filtering
- Unit and integration testing

## 👨‍💻 Author

**Faizan Ahmad Khan**

Frontend Software Engineer

Technologies: React.js | Next.js | TypeScript | JavaScript | Node.js

