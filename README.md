# 🗂️ Online Complaint Registration & Management System

A full-stack **MERN** web application that simplifies complaint handling and improves transparency between users, agents, and administrators. Users can register complaints, track progress in real time, and communicate with assigned agents — while admins get full oversight and analytics.

**🔗 Live Demo:** [Add your demo link here]  
**💻 GitHub:** [Add your repo link here]

---

## 🚀 Features

- **JWT Authentication** with role-based access — User, Agent, Admin
- **Complaint Submission & Tracking** with real-time status updates
- **Agent Assignment** by Admin with workload management
- **User ↔ Agent Messaging** on each complaint thread
- **Admin Analytics Dashboard** — system stats and performance insights
- **Feedback Collection** after complaint resolution
- **Email Notifications** for key events via Nodemailer
- Fully **responsive UI** with alert notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Context API, Axios, Bootstrap / Material UI |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt.js |
| Security | Helmet, CORS, express-validator |
| Email | Nodemailer |
| Deploy | Render (`render.yaml` included) |

---

## 📁 Project Structure

```
├── backend/
│   ├── server.js            # App entry point
│   ├── config/db.js         # MongoDB connection
│   ├── routes/              # auth, complaints, agents, feedback, admin
│   ├── models/              # User, Agent, Complaint, Feedback
│   └── middleware/          # Auth, role-based access, error handling
└── frontend/
    └── src/
        ├── pages/           # Home, Login, Dashboard, Complaint, Feedback
        ├── components/
        └── context/         # Auth & Complaint global state
```

---

## ⚙️ Getting Started

**Prerequisites:** Node.js v18+, MongoDB (local or Atlas), npm

```bash
# 1. Clone the repo
git clone <your-repo-url>

# 2. Backend setup
cd backend
npm install
cp .env.example .env      # fill in your values
npm run dev

# 3. Frontend setup
cd ../frontend
npm install
npm start
```

Backend runs on `http://localhost:5000` by default.  
Set `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`.

---

## 🔐 Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret

# Email (optional)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

---

## 📡 API Overview

All protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/complaints` | Submit a complaint |
| GET | `/api/complaints` | List complaints (role-filtered) |
| GET | `/api/complaints/:id` | Complaint details |
| PUT | `/api/complaints/:id` | Update status / assignment |
| POST | `/api/complaints/:id/messages` | Add message to thread |
| PUT | `/api/agents/complaints/:id/progress` | Agent updates progress |
| PUT | `/api/admin/assign` | Admin assigns complaints to agents |
| POST | `/api/feedback/submit` | Submit post-resolution feedback |

---

## 👥 Roles & Permissions

| Role | Permissions |
|------|-------------|
| **User** | Submit & track complaints, chat with agent, give feedback |
| **Agent** | View assigned complaints, update progress, reply to messages |
| **Admin** | Assign agents, manage users, view system analytics |

---

## 🎯 Design Decisions

- Role enforcement via middleware keeps controllers clean and single-responsibility
- Complaint messages stored as sub-documents for simplicity; can be moved to a separate collection at scale
- Email notifications are optional and config-driven to avoid hard runtime dependencies
- MongoDB indexing on `status` and `email` fields for query performance

