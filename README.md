# PUPQuestC — Lost & Found Management System

> **ADET Project** | Bachelor of Science in Information Technology  
> Polytechnic University of the Philippines – Quezon City Campus

PUPQuestC is a campus-wide web application that helps PUPQC students and staff **report lost items, register found items, and connect finders with owners** — all in one centralized, intelligent platform.

---

## Project Team

| Role | Name |
|---|---|
| **Full-Stack Developer** | Reca Maelah Conag |

---

## Tech Stack

| Layer | Technology | What It Does |
|---|---|---|
| **Frontend UI** | React 18 + TypeScript | Builds all the web pages the user sees |
| **Styling** | Tailwind CSS + Flowbite React | Makes everything look dark, modern, and PUP-branded |
| **State & API Calls** | Redux Toolkit (RTK Query) | Talks to the backend server and stores data |
| **Form Validation** | React Hook Form + Zod | Validates inputs (e.g. required fields, email format) |
| **Animations** | Framer Motion | Smooth page transitions and modal effects |
| **Backend Server** | Node.js + Express.js + TypeScript | Handles all API requests from the frontend |
| **Database** | PostgreSQL + Prisma ORM | Stores users, items, and claims in a structured database |
| **Authentication** | JWT + Bcrypt | Secure login sessions and encrypted passwords |
| **AI Search** | Google Gemini API | Natural language search — finds items by description |
| **Image Upload** | Multer | Handles photo uploads for items and profiles |

---

## Key Features

- **User Authentication** — Register with PUP Webmail, login with JWT tokens, optional 2FA
- **Report Lost Items** — Submit a description, date, and location of a missing item
- **Register Found Items** — Report something you found on campus so the owner can claim it
- **AI-Powered Search** — Describe your lost item in plain words and Gemini AI finds matches
- **Claim System** — Submit a claim on a found item; admins approve or reject it
- **Admin Dashboard** — Manage all users, items, claims, and categories
- **Categories** — Items are organized by type (Electronics, Bags, IDs, etc.)
- **Responsive Design** — Works on phone, tablet, and desktop

---

## Project Structure

```
lost-and-found/
│
├── frontend/                   ← Everything the user sees (React app)
│   └── src/
│       ├── pages/              ← One folder per page (Home, Login, FoundItems, etc.)
│       ├── components/         ← Reusable parts (Navbar, Footer, Banner, Modals)
│       ├── dashboard/          ← Admin & user dashboard pages
│       ├── redux/              ← API call definitions using RTK Query
│       ├── auth/               ← Login state management (JWT decode & hooks)
│       ├── ui/                 ← Shared input, button, and form components
│       └── i18n/               ← Language files (English & Filipino)
│
├── server/                     ← Everything the server does (Express API)
│   ├── src/
│   │   └── app/
│   │       ├── modules/        ← Features: user, foundItems, lostItem, claim, aiSearch
│   │       ├── auth/           ← Login & password services
│   │       ├── middlewares/    ← Auth guard, error handler, file upload
│   │       ├── routes/         ← All API endpoint definitions
│   │       └── config/         ← Server configuration (port, keys, etc.)
│   └── prisma/
│       ├── schema.prisma       ← Database table definitions
│       └── migrations/         ← Database version history
│
├── .vscode/                    ← VS Code workspace settings
├── README.md                   ← You are here
└── DEVELOPMENT_UI_GUIDE.md     ← Design system rules for the frontend
```

---

## How to Run the Project Locally (Step-by-Step)

### Prerequisites

Install these on your computer first:
- [Node.js v18+](https://nodejs.org/)
- [PostgreSQL v14+](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/recaconag/pupquestc.git
cd pupquestc
```

---

### Step 2 — Set Up the Backend (Server)

```bash
cd server
npm install
```

Create a file named **`.env`** inside the `server/` folder and fill it in:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/pupquestc"
JWT_SECRET="any-long-random-string-here"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
PORT=5000

# Get this free from https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your-google-gemini-api-key"

# Gmail SMTP for OTP emails (use an App Password, not your real password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
```

```bash
# Create all the database tables
npx prisma migrate dev --name init

# Start the backend (runs on port 5000)
npm run dev
```

---

### Step 3 — Set Up the Frontend

Open a **new terminal window**, then:

```bash
cd frontend
npm install
```

Create a file named **`.env`** inside the `frontend/` folder:

```env
VITE_SERVER_URL="http://localhost:5000"
VITE_NODE_ENV="development"
```

```bash
# Start the frontend (runs on port 5173)
npm run dev
```

---

### Step 4 — Open the App

Go to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## User Roles

| Role | What They Can Do |
|---|---|
| **Guest (not logged in)** | Browse lost & found items, use AI Search |
| **User (logged in)** | All of the above + report items, submit claims, manage own items |
| **Admin** | Full access — manage all users, approve/reject claims, control categories |

---

## API Overview

The backend exposes a REST API at `http://localhost:5000/api/`. Key endpoint groups:

| Group | Base Route | Description |
|---|---|---|
| Auth | `/api/register`, `/api/login` | Registration and login |
| Found Items | `/api/found-items` | Report and browse found items |
| Lost Items | `/api/lostItem` | Report and browse lost items |
| Claims | `/api/claims` | Submit and manage claims |
| AI Search | `/api/ai-search` | Natural language search via Gemini |
| Admin | `/api/admin/stats` | Dashboard statistics |

All routes that modify data require a valid **JWT token** in the `Authorization` header.

---

## Security Highlights

- Passwords are hashed with **Bcrypt** before storing
- All sensitive routes require a valid **JWT token** (verified on every request)
- Optional **Two-Factor Authentication (2FA)** via email OTP
- Input is validated on both frontend (Zod) and backend (Zod) before any database write
- **Soft delete** — no data is permanently removed; deleted records are just flagged

---

*PUPQuestC — Reconnecting the PUPQC community, one item at a time.*
