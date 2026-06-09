# 🗂️ Online Complaint Registration & Management System

A full-stack **MERN** web application that simplifies complaint handling and improves transparency between users, agents, and administrators. Users can register complaints, track progress in real time, and communicate with assigned agents, while admins get full oversight and analytics.

**🔗 Live Demo:**  
**💻 GitHub:** https://github.com/Kisan062/ONLINE-COMPLAINT-REGISTRATION

---

## 🚀 Features

- **JWT Authentication** with role-based access - User, Agent, Admin
- **Complaint Submission & Tracking** with real-time status updates
- **Agent Assignment** by Admin with workload management
- **User ↔ Agent Messaging** on each complaint thread
- **Admin Analytics Dashboard** - system stats and performance insights
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


---

## 🏗️ Architecture

The technical architecture of our **online complaint registration and management system** follows a **client-server model**:

- **Frontend**: React-based single-page application with Material UI & Bootstrap for a responsive, real-time user interface. Axios handles seamless REST API integration with the backend.
- **Backend**: Express.js server manages business logic, request routing, authentication, and communication with the database.
- **Database**: MongoDB provides efficient, scalable storage for user profiles, complaint records, agent assignments, messages, and feedback data, ensuring reliable and quick access to information.

**Data Flow:**
```
User (Frontend) --[Axios REST API]--> Express.js Server --[Mongoose]--> MongoDB
```

This architecture enables:
- Role-based access control (User, Agent, Admin)
- Real-time complaint tracking and status updates
- Seamless user-agent communication
- Admin analytics and oversight

---

## � Database Schema

### Entity Relationships

The system consists of the following key entities:

**1. User Schema**
- `user_id` (ObjectId) - Primary identifier
- `name` (String) - User's full name
- `email` (String, unique) - User's email address
- `password` (String) - Hashed password
- `ph_no` (String) - Phone number
- `user_type` (String, enum) - Role: "user", "agent", or "admin"

**2. Complaint Schema**
- `complaint_id` (ObjectId) - Primary identifier
- `user_id` (ObjectId) - Reference to User who filed the complaint
- `name` (String) - Complaint title/subject
- `address` (String) - Location address
- `city` (String) - City name
- `state` (String) - State name
- `pincode` (String) - Postal code
- `comment` (String) - Detailed complaint description
- `status` (String, enum) - "open", "in-progress", "resolved", "closed"

**3. Agent Schema**
- `agent` (String) - Agent identifier
- `user_id` (ObjectId) - Reference to User (agent role)
- `complaint_id` (ObjectId) - Reference to assigned Complaint
- `status` (String) - Assignment status
- `_id` (ObjectId) - Primary identifier

**4. Message Schema**
- `_id` (ObjectId) - Primary identifier
- `complaint_id` (ObjectId) - Reference to Complaint
- `name` (String) - Sender's name
- `message` (String) - Message content

**5. Feedback Schema**
- Links to Complaint after resolution
- Captures user satisfaction and comments

### Relationships

```
User (1) ──────────→ (Many) Complaint
  ↓
User (1) ──────────→ (Many) Agent Assignment
  ↓
Agent ──────────→ Complaint (Many-to-Many through assignment)
  ↓
Complaint (1) ──────────→ (Many) Message
  ↓
Complaint (1) ──────────→ (1) Feedback
```

---

## �📁 Project Structure

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
git clone https://github.com/Kisan062/ONLINE-COMPLAINT-REGISTRATION

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

