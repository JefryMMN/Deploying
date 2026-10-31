# TechFest 2026 — MERN Stack Application

A full-stack MERN application for the TechFest 2026 Portal.

## Project Structure

```
techfest-mern/
├── client/          # React frontend (Vite)
└── server/          # Node.js + Express backend
```

## Local Development

### Prerequisites
- Node.js LTS
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd server
cp .env.example .env      # Fill in your MONGO_URI and JWT_SECRET
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd client
cp .env.example .env      # VITE_API_URL=http://localhost:5000
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/signup` | — | Register user |
| POST | `/api/auth/login` | — | Login + get JWT |
| GET | `/api/events` | — | List all events |
| GET | `/api/events/:id` | — | Get single event |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| POST | `/api/registrations` | User | Register for event |
| GET | `/api/registrations/my` | User | My registrations |
| DELETE | `/api/registrations/:id` | User/Admin | Cancel registration |

## Deployment

- **Backend** → [Render](https://render.com) (Root Directory: `server`, Start: `npm start`)
- **Frontend** → [Netlify](https://netlify.com) (Base Directory: `client`, Build: `npm run build`, Publish: `dist`)

### Environment Variables

**Render (server):**
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Random secret (32+ chars)
- `CLIENT_ORIGIN` — Your Netlify URL (e.g. `https://techfest2026.netlify.app`)
- `NODE_ENV` = `production`

**Netlify (client):**
- `VITE_API_URL` — Your Render URL (e.g. `https://techfest-api.onrender.com`)
