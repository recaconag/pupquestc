# PUPQuestC — Backend API Server

> Part of the **ADET Project** | BSIT — Polytechnic University of the Philippines QC  
> **Developer:** Reca Maelah Conag

This is the Express.js REST API that powers the PUPQuestC Lost & Found platform. It handles all data operations, authentication, AI search, and file uploads.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express.js | HTTP server and routing |
| TypeScript | Type-safe backend code |
| Prisma ORM | Database access layer |
| PostgreSQL | Relational database |
| JWT + Bcrypt | Authentication and password security |
| Google Gemini API | AI-powered item search |
| Nodemailer | Email OTP / 2FA |
| Multer | File and image upload handling |
| node-cron | Scheduled background jobs |

---

## How to Run

```bash
# Install dependencies
npm install

# Set up your .env file (see template below)

# Create database tables
npx prisma migrate dev --name init

# Start development server (hot reload)
npm run dev
```

Server runs at **http://localhost:5000**

---

## Environment Variables

Create a `.env` file in this folder:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pupquestc"
JWT_SECRET="your-secret-key"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
PORT=5000

GEMINI_API_KEY="your-google-gemini-api-key"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
```

---

## Useful Commands

```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript to dist/
npm run studio       # Open Prisma Studio (visual DB browser)
npm run migrate      # Run new database migrations
```

---

## API Base URL

All endpoints are prefixed with `/api/`. Example: `http://localhost:5000/api/found-items`

See the root `README.md` for the full API endpoint reference.

---

*Developed for PUPQC ADET Project by Reca Maelah Conag*
