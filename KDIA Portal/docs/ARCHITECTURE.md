# KDIA RE Park Portal — System Architecture

## Project Overview

The **KDIA RE Park Portal** is a multi-portal web platform for managing renewable energy (solar) park allocations, subscriptions, customer onboarding, vendor operations, admin management, and support ticketing. The system serves four distinct user roles: **Customer**, **Vendor**, **Admin**, and **Support Agent**, each with a dedicated portal interface.

A companion **Mobile Application** (React Native + Expo) provides customers with on-the-go access to their solar allocation and billing data.

---

## Component Map

```
┌─────────────────────────────────────────────────────┐
│                   KDIA RE Park Portal                │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │          Frontend (React + Vite)            │    │
│  │  /client                                    │    │
│  │  ┌──────────┐ ┌────────┐ ┌───────┐ ┌─────┐ │    │
│  │  │ Customer │ │ Vendor │ │ Admin │ │Supp.│ │    │
│  │  │  Portal  │ │ Portal │ │ Portal│ │Port.│ │    │
│  │  └────┬─────┘ └───┬────┘ └──┬────┘ └──┬──┘ │    │
│  └───────┼───────────┼─────────┼──────────┼───┘    │
│          │           │         │          │         │
│  ┌───────▼───────────▼─────────▼──────────▼───┐    │
│  │           REST API Layer                    │    │
│  │  /api/index.js  (Vercel Serverless)         │    │
│  │  /server/server.js  (Local Development)     │    │
│  └───────────────────┬─────────────────────────┘    │
│                      │                              │
│  ┌───────────────────▼─────────────────────────┐    │
│  │           Database Layer                    │    │
│  │  SQLite  — database.sqlite                  │    │
│  │  Initialized via api/database.js            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │        Mobile App (React Native + Expo)     │    │
│  │  /mobile  — Connects to same REST API       │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Frontend

| Property   | Detail                                                      |
|------------|-------------------------------------------------------------|
| Framework  | React + Vite                                                |
| Location   | `/client`                                                   |
| Portals    | Customer, Vendor, Admin, Support                            |
| Auth Flow  | JWT tokens stored in `localStorage`; role-based routing     |
| API Calls  | All requests go to `/api/*` endpoints on the same origin (Vercel) or `http://localhost:5000` (local dev) |

### Portal Breakdown

| Portal          | Role           | Key Features                                                   |
|-----------------|----------------|----------------------------------------------------------------|
| Customer Portal | `customer`     | Dashboard, energy billing, subscription info, support tickets  |
| Vendor Portal   | `vendor`       | Customer management, lead tracking, onboarding workflows       |
| Admin Portal    | `admin`        | User management, approvals, audit logs, system reports         |
| Support Portal  | `support_agent`| Ticket queue, assignment, internal notes, response management  |

---

## Backend

### Local Development Server

| Property   | Detail                                    |
|------------|-------------------------------------------|
| File       | `/server/server.js`                       |
| Framework  | Node.js + Express                         |
| Port       | `5000` (default, configurable via `PORT`) |
| Database   | SQLite via `./server/database.js`         |
| Middleware | CORS, JSON body parser, input sanitizer   |

### Production Serverless Backend

| Property   | Detail                                    |
|------------|-------------------------------------------|
| File       | `/api/index.js`                           |
| Platform   | Vercel Serverless Functions               |
| Mode       | **Read-Only / Parked Demo** — all `POST`, `PUT`, `PATCH`, `DELETE` requests are blocked |
| Database   | SQLite bundled at deploy time (`api/kdia_database.sqlite`) opened in `OPEN_READONLY` mode |
| Middleware | CORS, JSON body parser, input sanitizer, parked-mode enforcer |

### API Routes

| Route Prefix            | File                              | Description                          |
|-------------------------|-----------------------------------|--------------------------------------|
| `/api/auth`             | `routes/auth.js`                  | Login, registration, JWT issuance    |
| `/api/dashboard`        | `routes/dashboard.js`             | Role-specific dashboard data         |
| `/api/profile`          | `routes/profile.js`               | User profile read/update             |
| `/api/energy`           | `routes/energy.js`                | Solar consumption & billing data     |
| `/api/admin`            | `routes/admin.js`                 | Admin user management & approvals    |
| `/api/vendor-customers` | `routes/vendor_customers.js`      | Vendor's customer list & onboarding  |
| `/api/support`          | `routes/support.js`               | Support ticket CRUD & assignment     |
| `/api/activity`         | `routes/activity.js`              | Audit / activity log access          |
| `/api/leads`            | `routes/leads.js`                 | Lead management for vendors          |
| `/api/health`           | `api/index.js` (inline)           | Health check endpoint (Vercel)       |

---

## Database

| Property          | Detail                                                      |
|-------------------|-------------------------------------------------------------|
| Engine            | SQLite 3                                                    |
| Local file        | `database.sqlite` (root), `server/database.sqlite`         |
| Production file   | `api/kdia_database.sqlite` (bundled, read-only on Vercel)  |
| Init & migration  | `server/database.js`, `api/database.js`                     |

### Database Schema Summary

| Table                  | Purpose                                              |
|------------------------|------------------------------------------------------|
| `users`                | All users — customers, vendors, admins, support agents |
| `subscriptions`        | Solar allocation subscriptions per customer          |
| `consumption_logs`     | Monthly solar unit consumption per customer          |
| `audit_logs`           | Admin action audit trail                             |
| `support_tickets`      | Support ticket records with status and priority      |
| `ticket_responses`     | Threaded responses to support tickets                |
| `ticket_internal_notes`| Internal agent-only notes on tickets                 |
| `leads`                | Vendor lead records and contact tracking             |

---

## Authentication

| Property      | Detail                                                         |
|---------------|----------------------------------------------------------------|
| Mechanism     | JWT (JSON Web Tokens) via `jsonwebtoken`                       |
| Password hash | `bcrypt`                                                       |
| Token storage | `localStorage` on the frontend                                 |
| Roles         | `customer`, `vendor`, `admin`, `support_agent`                 |
| Lock policy   | Accounts lock after repeated failed login attempts (`loginAttempts`, `lockUntil` fields) |

---

## Mobile Application

| Property      | Detail                                                   |
|---------------|----------------------------------------------------------|
| Framework     | React Native + Expo                                      |
| Location      | `/mobile`                                                |
| Target users  | Customers                                                |
| Backend       | Connects to the same REST API (`/api/*` endpoints)       |
| Features      | Dashboard, billing, ticket submission, profile           |
| Distribution  | Expo builds (EAS Build) for Android / iOS                |

---

## Deployment

| Layer           | Platform              | Details                                              |
|-----------------|-----------------------|------------------------------------------------------|
| Frontend        | Vercel                | Static React + Vite build (`/client`)               |
| Backend API     | Vercel Serverless     | `/api/index.js` exported as Express app              |
| Database        | SQLite (bundled)      | Bundled at deploy time into Vercel function payload  |
| Mobile          | Expo / EAS Build      | `.apk` / `.ipa` built and distributed via Expo       |
| CI/CD           | Vercel Git Integration| Push to main branch triggers automatic deployment    |

### Vercel Routing (`vercel.json`)

All requests to `/api/**` are routed to the serverless function at `api/index.js`. All other routes are served from the static frontend build.

---

## Component Interaction Flow

```
[Browser / Mobile App]
        │
        │  HTTPS  REST API calls  (/api/*)
        ▼
[Vercel Serverless Function]  → api/index.js
        │
        │  Middleware chain:
        │  1. DB Initialization (lazy, per cold start)
        │  2. CORS
        │  3. JSON Body Parser
        │  4. Input Sanitizer
        │  5. Parked-Mode Guard (blocks mutations in production)
        │  6. Morgan HTTP Logger
        │  7. Route Handlers (auth, dashboard, profile, ...)
        ▼
[SQLite Database]  (api/kdia_database.sqlite — read-only on Vercel)
```

For **local development**, the flow is identical but uses `server/server.js` and `server/database.sqlite` with full read-write access and no parked-mode guard.

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable        | Used In         | Purpose                                  |
|-----------------|-----------------|------------------------------------------|
| `JWT_SECRET`    | Backend          | Secret key for signing JWT tokens        |
| `PORT`          | `server.js`      | Local server port (default: 5000)        |
| `NODE_ENV`      | `database.js`    | Skip schema creation in production       |
| `VERCEL`        | `database.js`    | Detect Vercel environment                |
| `VITE_API_URL`  | Frontend         | Base URL for API calls from the client   |

---

*Last updated: March 2026*
