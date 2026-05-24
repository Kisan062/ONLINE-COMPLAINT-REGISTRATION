# Complaint Management System (MERN)

A full-stack MERN application that simplifies complaint handling and provides role-based dashboards for users, agents, and admins.

## Features

- JWT authentication with role-based access
- Complaint creation, tracking, assignment, and resolution
- Agent workflow and message exchange
- Admin analytics and user/agent management
- Feedback collection after resolution

## Setup

1. Install Node.js 18+ and MongoDB.
2. Copy `backend/.env.example` to `backend/.env` and fill in your values.
3. From `backend`, run:
   ```bash
   npm install
   npm run dev
   ```
4. From `frontend`, run:
   ```bash
   npm install
   npm start
   ```

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `PUT /api/complaints/:id`
- `POST /api/complaints/:id/messages`
- `GET /api/agents/assigned`
- `PUT /api/agents/complaints/:id/progress`
- `GET /api/admin/stats`
- `PUT /api/admin/assign`
- `POST /api/feedback/submit`

## Notes

- Use Postman or Insomnia to test protected routes with Bearer tokens.
- Add `REACT_APP_API_URL=http://localhost:5000` to `frontend/.env`.
 
## Demo & Repository

- **Live Demo:** https://your-demo-url.example.com
- **GitHub Repository:** https://github.com/your-username/your-repo-name

Replace the URLs above with your actual demo and GitHub links so your mentor can access the project.
