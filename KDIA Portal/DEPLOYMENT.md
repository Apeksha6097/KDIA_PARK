# KDIA Re-Park Portal - Vercel Deployment Guide

## 🚀 Deployment Overview

This project is deployed on **Vercel** as a **parked, read-only demo**. The deployment combines the React frontend and Node.js backend into a single serverless platform.

### Deployment Architecture

- **Frontend**: Static build served from `/client/dist`
- **Backend**: Serverless functions in `/api`
- **Database**: SQLite bundled with deployment (read-only)
- **Mode**: Read-only demo (all mutations blocked)

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Project ready**: Ensure database is seeded with demo data

---

## 🔧 Quick Deploy

### Option 1: Deploy via Vercel CLI

```bash
# 1. Navigate to project root
cd "d:\Kshitiz\KDIA Portal"

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect `vercel.json` configuration
4. Click "Deploy"

---

## 🏗️ Build Configuration

The project uses custom Vercel configuration in `vercel.json`:

### Frontend Build
- **Source**: `client/package.json`
- **Builder**: `@vercel/static-build`
- **Output**: `client/dist`
- **Build command**: `npm run build` (from client directory)

### Backend Build
- **Source**: `api/index.js`
- **Builder**: `@vercel/node`
- **Includes**: `api/database.sqlite`
- **Memory**: 1024 MB
- **Max Duration**: 10 seconds

---

## 🔒 Read-Only Mode

### What is Blocked?
All data mutation operations are disabled:
- ✅ **Allowed**: GET requests (read data)
- ❌ **Blocked**: POST, PUT, PATCH, DELETE (write/modify/delete data)

### Why Read-Only?
1. **Vercel Serverless**: Read-only filesystem
2. **Demo Purpose**: Prevents data corruption
3. **Security**: Safe for public deployment

### Error Response
When attempting mutations:
```json
{
  "error": "This project is parked and running in demo mode.",
  "message": "Data mutations are disabled for this deployment.",
  "hint": "This is a read-only showcase..."
}
```

---

## 📁 Project Structure

```
KDIA Portal/
├── api/                      # Serverless backend
│   ├── index.js             # Main Express app (serverless)
│   ├── database.js          # SQLite database module
│   ├── database.sqlite      # Bundled database file
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   └── package.json         # API dependencies
├── client/                   # React frontend
│   ├── src/                 # Source code
│   ├── dist/                # Build output (generated)
│   └── package.json         # Frontend dependencies
├── server/                   # Original backend (preserved)
├── vercel.json              # Vercel configuration
└── .vercelignore            # Deployment exclusions
```

---

## 🔍 Health Check

The API includes a health check endpoint:

```bash
GET /api/health
```

Response:
```json
{
  "status": "KDIA Re-Park Portal is live (parked mode)",
  "mode": "READ-ONLY",
  "deployment": "Vercel Serverless",
  "database": "SQLite (bundled, read-only)",
  "timestamp": "2026-02-03T11:00:00.000Z"
}
```

---

## ⚠️ SQLite Limitations on Vercel

### Important Notes:
1. **Read-Only Filesystem**: Vercel serverless functions run in a read-only environment
2. **Bundled Database**: Database is bundled at deploy time
3. **No Persistence**: Any write attempts will fail (perfect for demo)
4. **Data Updates**: To update data, modify locally and redeploy

### For Production Use:
If you need a writable database:
- Migrate to PostgreSQL/MySQL (hosted on Railway, Supabase, PlanetScale)
- Use Vercel Postgres
- Configure external database connection

---

## 🔄 Rollback to Local Development

If you need to revert to original setup:

1. **Backend**: Use `server/` folder instead of `api/`
2. **Frontend**: No changes needed (already uses relative paths)
3. **Remove**: Delete `api/` folder and `vercel.json`

### Local Development Commands
```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

---

## 🛠️ Environment Variables

For local testing with Vercel CLI:

Create `.env` file:
```
NODE_ENV=production
```

No sensitive secrets required for this read-only demo.

---

## 📝 Update Data

To update the demo data:

1. Modify `server/database.sqlite` locally
2. Copy to `api/database.sqlite`:
   ```bash
   Copy-Item "server/database.sqlite" "api/database.sqlite"
   ```
3. Redeploy to Vercel:
   ```bash
   vercel --prod
   ```

---

## 🚨 Troubleshooting

### Build Fails
- **Check**: `client/package.json` has build script
- **Verify**: Dependencies are installed
- **Test**: Run `npm run build` locally

### API Routes Not Working
- **Check**: `/api` prefix in frontend requests
- **Verify**: `vercel.json` routes configuration
- **Test**: Health endpoint `/api/health`

### Database Errors
- **Check**: `api/database.sqlite` exists
- **Verify**: File size > 0 bytes
- **Test**: Local serverless with `vercel dev`

---

## 📞 Support

For issues or questions:
- Check Vercel deployment logs
- Test locally with `vercel dev`
- Review `vercel.json` configuration

---

## 🎯 Summary

- ✅ **One-click deployment** to Vercel
- ✅ **Read-only demo mode** for safety
- ✅ **Single public URL** for frontend + backend
- ✅ **Fully reversible** to local development
- ✅ **No database hosting** needed (SQLite bundled)
