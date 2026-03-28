# 🚀 GreenClub

A modern, full‑stack **membership + charity + gamified draws** platform with **admin controls**, **secure authentication**, and a polished React dashboard experience.

---

## 📌 Overview

**GreenClub** is a full-stack web application built with a **React (Vite)** frontend and an **Express** backend powered by **Supabase** (Postgres + Auth).

It’s designed for scenarios where:

- Users **register/login**, manage account actions (like **subscribing** and **selecting a charity**).
- Users can **submit scores** and view score history.
- Admins can **manage users/charities** and **run draws** that produce winnings/history.

---

## ✨ Features

### 🔐 Authentication & Accounts

- User **register / login / logout**
- Fetch **current user** for session hydration
- Protected routes on both **frontend** and **backend**

### 👤 User Workflows

- Subscribe user (membership/subscription flow)
- Select a charity
- Fetch user details by ID (protected)

### 🏆 Scores

- Add a score
- View “my scores”
- Delete a score entry

### 🎲 Draws & Winnings

- Run a draw (**admin-only**)
- View draw history (authenticated)
- View winnings (authenticated)

### 🛡 Admin

- List all users (**admin-only**)
- Delete user (**admin-only**)
- Create charity (**admin-only**)
- Delete charity (**admin-only**)

### ⚡ Production-minded Backend

- Security headers via **Helmet**
- **Compression** enabled
- **Rate limiting** enabled
- Health check endpoint (`/health`)
- Centralized global error handling

---

## 🛠 Tech Stack

### Frontend

- **React** (Vite)
- **React Router**
- **TanStack React Query**
- **Tailwind CSS**
- **React Hook Form**
- **Axios**
- **Framer Motion**
- **react-hot-toast**

### Backend

- **Node.js** + **Express**
- **Supabase JS**
- **dotenv**
- **Helmet**
- **CORS**
- **compression**
- **express-rate-limit**

### Database / Auth Platform

- **Supabase** (Postgres + Auth)

### Dev Tools

- ESLint
- Nodemon (server dev)

### Hosting / Deployment

- Frontend includes a `vercel.json` rewrite config for SPA routing

---

## 🏗 Architecture

GreenClub follows a clean split between frontend and backend:

- `client/` — React SPA (Vite) with routing, contexts, and API clients
- `server/` — Express API server with route modules, controllers, middleware, and utilities

### High-level request flow

1. React UI calls the backend using the API modules in `client/src/api`.
2. Express exposes REST endpoints under `/api/*`.
3. Auth middleware verifies **user** or **admin** access before protected operations.
4. Supabase is used for authentication and persistence.

---

## ⚙️ Installation & Setup

### ✅ Prerequisites

- **Node.js** (recommended: latest LTS)
- A **Supabase project** with:
  - Auth enabled
  - Required tables configured (see **Database Schema** section)

---

### 📥 Clone Repo

```bash
git clone https://github.com/lagdhir-parth/GreenClub.git
cd GreenClub
```

---

### 📦 Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

---

### 🔧 Environment Variables (Backend)

Create a `.env` file inside `server/`.

The backend requires these variables to start:

| Variable               | Required | Description                                                                 |
| ---------------------- | -------: | --------------------------------------------------------------------------- |
| `PORT`                 |       ✅ | Port the API server listens on                                              |
| `SUPABASE_URL`         |       ✅ | Supabase project URL                                                        |
| `SUPABASE_SERVICE_KEY` |       ✅ | Supabase **service role key** (backend-only secret)                         |
| `ALLOWED_ORIGINS`      |       ✅ | Comma-separated list of allowed CORS origins (e.g. `http://localhost:5173`) |

Example:

```bash
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
ALLOWED_ORIGINS=http://localhost:5173
```

> Note: `ALLOWED_ORIGINS` is parsed as a comma-separated list.

---

### ▶️ Run Project

#### Start Backend (API)

```bash
cd server
npm run dev
```

#### Start Frontend (Vite)

```bash
cd client
npm run dev
```

---

## 🔐 Authentication & Security

### Backend auth middleware

The API protects routes using middleware:

- `verifyUser` — ensures the request is authenticated
- `verifyAdmin` — ensures the authenticated user has `role = "admin"` in the `users` table

### Security layers included

- **CORS** allowlist (`ALLOWED_ORIGINS`)
- **Helmet** secure headers
- **Rate limiting** (15 min window, max 100 requests)
- **Compression**
- Consistent error responses via global error handler

> Important: The server uses the Supabase **service role key**. Keep it secret and never expose it to the client.

---

## 📡 API Documentation

Base URL (backend):

- Local: `http://localhost:<PORT>`

### ❤️ Health

- `GET /health` — server health check

### 🔐 Auth (`/api/auth`)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/current-user` ✅ (protected)

### 👤 User (`/api/user`) ✅ protected

- `POST /api/user/select-charity`
- `POST /api/user/subscribe`
- `GET /api/user/:id`

### 🎗 Charities (`/api/charities`)

- `GET /api/charities/all`

### 🏆 Scores (`/api/scores`) ✅ protected

- `POST /api/scores/add-score`
- `GET /api/scores/my-scores`
- `DELETE /api/scores/delete-score/:id`

### 🎲 Draw (`/api/draw`)

- `POST /api/draw/run` ✅ admin-only
- `GET /api/draw/` ✅ protected

### 💰 Winnings (`/api/winnings`) ✅ protected

- `GET /api/winnings/`

### 🛡 Admin (`/api/admin`) ✅ admin-only

- `GET /api/admin/users`
- `DELETE /api/admin/delete-user/:id`
- `POST /api/admin/create-charity`
- `DELETE /api/admin/delete-charity/:id`

---

## 🗄 Database Schema

GreenClub uses Supabase (Postgres). Based on backend queries, you should have at least:

### Core tables (inferred from code)

- `users`
  - `id` (matches Supabase Auth user id)
  - `role` (used for admin authorization, e.g. `"admin"`)

### Additional entities (implied by API)

Depending on your implementation, you will likely have tables for:

- `charities`
- `scores`
- `draws` (draw history)
- `winnings`

> If your schema differs, update the controller queries and middleware accordingly.

---

## 🎯 Usage

Typical user journey:

1. User registers and logs in.
2. User selects a charity and subscribes.
3. User adds scores and reviews score history.
4. Admin manages users/charities and runs draws.
5. Users view winnings and draw history (based on permissions).

---

## 🚀 Deployment

### Frontend (Vercel)

The frontend includes `client/vercel.json` configured for SPA routing (rewrites all routes to `index.html`).

Suggested steps:

1. Deploy the `client/` directory as a Vite project
2. Ensure your frontend knows where the backend API is hosted (configure in your API client layer if needed)
3. Add your production domain to `ALLOWED_ORIGINS` on the backend

### Backend

Deploy `server/` to any Node.js hosting (Render, Railway, Fly.io, VPS, etc.) and set:

- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ALLOWED_ORIGINS` (include your deployed frontend domain)

---

## 🧪 Testing

The backend currently has a placeholder test script:

```bash
cd server
npm test
```

> No automated tests are implemented yet. Contributions welcome.

---

## 📁 Folder Structure

```text
GreenClub/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ providers/
│  │  └─ routes/
│  ├─ index.html
│  ├─ vite.config.js
│  └─ vercel.json
└─ server/
   ├─ config/
   ├─ controllers/
   ├─ middleware/
   ├─ routes/
   ├─ utils/
   ├─ app.js
   └─ server.js
```

---

## 🤝 Contributing

Contributions are welcome!

### Suggested workflow

1. Fork the repo
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
3. Commit with clear messages
4. Open a PR describing:
   - What changed
   - Why it changed
   - How to test it

### Guidelines

- Keep PRs focused and small when possible
- Follow the structure: `server/routes` → `server/controllers`
- Prefer consistent API responses and centralized error handling

---

## 📜 License

The server `package.json` specifies `ISC`. To make the repository clearly licensed, add a top-level `LICENSE` file.

---

## 👨‍💻 Author

GitHub: **@lagdhir-parth**
