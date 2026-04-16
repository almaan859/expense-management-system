# Expense Management System

A full-stack expense approval application with local OCR receipt processing, manager review, and AI-powered expense summaries.

## Overview

This repository contains:
- `backend/` - Node.js + Express API with MySQL storage, OCR receipt analysis, and manager approval workflows.
- `frontend/` - React app for admin, manager, and employee dashboards.

## Key Features

- Employee receipt submission with optional image upload
- Local OCR extraction using `tesseract.js`
- Auto-approval of small receipts based on administrator rule settings
- Manager review for pending or flagged expenses
- Admin rule management and user/team creation
- AI summary generation for expense records
- Searchable manager expense queue

## Tech Stack

- Backend: Node.js, Express, MySQL, bcryptjs, jsonwebtoken, multer, tesseract.js
- Frontend: React, React Router, Axios, react-scripts

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a MySQL database named `expense_mvp` and ensure the database user matches `backend/src/db.js`:
- host: `localhost`
- user: `expense_user`
- password: `Expense@123`
- database: `expense_mvp`

Load the schema from `expense_mvp.sql` if the database is not already seeded.

Optional environment variables:
- `OPENAI_API_KEY` - enable OpenAI summary generation if configured.

Start the backend:

```bash
npm start
```

Or, for development with auto-reload:

```bash
npm run dev
```

The backend listens on `http://localhost:4000`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The React app runs on `http://localhost:3000` by default.

## Usage

- Login at `/login`.
- Admin can update auto-approval rules, create users, and view team members.
- Managers can review pending expenses, search expense queues, and approve or reject claims.
- Employees can submit expenses, upload receipts, and view their expense history.

## API Endpoints

### Auth
- `POST /login` - user login

### Admin
- `GET /rules` - fetch auto-approval rules
- `POST /rules` - save approval rules
- `POST /users` - create manager/employee user
- `GET /users` - list users

### Employee
- `POST /employee/submit-expense` - submit expense with optional receipt image
- `GET /employee/expenses` - list current user expenses

### Manager
- `GET /expenses/pending` - list pending/flagged expenses
- `GET /expenses/search?query=...` - search pending expenses
- `POST /expenses/:id/approve` - approve expense
- `POST /expenses/:id/reject` - reject expense

## Notes

- The backend currently uses a hard-coded JWT secret: `secret123`.
- Receipt images are served from the `backend/uploads/` directory.
- If you want OpenAI summaries, set `OPENAI_API_KEY` in a `.env` file in `backend/`.

## Project Structure

- `backend/server.js` - API and routing
- `backend/src/db.js` - MySQL connection config
- `backend/src/services/ocrService.js` - receipt OCR and amount extraction
- `backend/src/services/aiService.js` - expense summarization
- `frontend/src/pages/` - React pages for login, admin, manager, employee dashboards

## Troubleshooting

- If the frontend fails to start because port `3000` is busy, either stop the process using that port or choose another port when prompted.
- Ensure the MySQL service is running and credentials in `backend/src/db.js` are correct.
- If OCR results appear wrong, check the receipt image and backend logs for `OCR Debug` output.

---

Built for rapid expense management with AI-assisted OCR and review workflows.
