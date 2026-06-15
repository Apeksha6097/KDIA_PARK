# KDIA Re-Park Portal

> **🚨 PARKED DEMO MODE** - This deployment is running in **read-only demonstration mode**. All data mutation operations (POST/PUT/PATCH/DELETE) are disabled.

## 🌟 Overview

KDIA Re-Park Portal is a comprehensive renewable energy management platform featuring three distinct portals:
- **Customer Portal**: Energy consumption tracking and support
- **Admin Portal**: Customer management and allocations
- **Vendor Portal**: Lead management and customer onboarding

---

## 🚀 Quick Start

### Demo Access (Vercel Deployment)

Visit the live parked demo: **[https://kdia-portal.vercel.app](https://kdia-portal.vercel.app)**

**Login Credentials**:
| Portal | Email | Password |
|--------|-------|----------|
| Customer | customer@test.com | Test@123 |
| Admin | admin@test.com | Test@123 |
| Vendor | vendor@test.com | Test@123 |

### Local Development

```bash
# Backend Server
cd server
npm install
npm run dev

# Frontend Client
cd client
npm install
npm run dev
```

Access locally:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📁 Project Structure

```
KDIA Portal/
├── api/              # Serverless backend (Vercel deployment)
├── client/           # React frontend (Vite)
├── server/           # Original backend (local development)
├── vercel.json       # Vercel deployment configuration
└── DEPLOYMENT.md     # Detailed deployment guide
```

---

## 🔒 Parked Mode Features

When deployed on Vercel, the portal runs in **read-only demonstration mode**:

✅ **Allowed**:
- Browse all portals
- View customer data
- Check energy consumption
- Review support tickets
- Explore leads and reports

❌ **Blocked**:
- Creating new users
- Updating customer profiles
- Submitting support tickets
- Modifying allocations
- Any write operations

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF**: jsPDF

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT + bcrypt
- **Deployment**: Vercel Serverless

---

## 🎯 Key Features

### Customer Portal
- Real-time energy consumption tracking
- Monthly allocation management
- Support ticket system
- Bill generation and download
- Profile management

### Admin Portal
- Customer approval workflows
- Energy allocation assignments
- Support ticket management
- Vendor approval system
- Comprehensive audit logs

### Vendor Portal
- Lead management dashboard
- Customer onboarding workflow
- Status tracking and updates
- Multi-step registration process

---

## 📦 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

---

## 🔧 Configuration

### Environment Variables
No sensitive environment variables required for the parked demo mode.

For local development:
```env
JWT_SECRET=kdia-secret-key-123
PORT=5000
```

---

## 📊 Sample Data

The parked demo includes:
- 13 customers (10 approved, 2 pending, 1 draft)
- 4 vendors (3 approved, 1 pending)
- 10 active subscriptions
- 40 consumption logs
- 7support tickets
- 15 vendor leads
- 10 audit log entries

---

## 🛠️ Development

### Build Frontend
```bash
cd client
npm run build
```

### Test Serverless Locally
```bash
# Install Vercel CLI
npm install -g vercel

# Run local serverless environment
vercel dev
```

---

## 🔄 Reverting to Local Mode

To switch back from parked demo to local development:

1. Use `server/` folder instead of `api/`
2. Run backend with `npm run dev` (in server directory)
3. Frontend needs no changes (already uses relative paths)

---

## 📝 API Documentation

### Health Check
```
GET /api/health
```

Returns deployment status and mode information.

### Authentication
All routes except login/register require JWT authentication via `Authorization` header.

---

## 🚨 Limitations

### SQLite on Vercel
- **Read-Only**: Serverless filesystem prevents writes
- **Bundled**: Database includedat deploy time
- **No Persistence**: Cannot modify data after deployment
- **Demo Only**: Not suitable for production use

### For Production
Consider migrating to:
- PostgreSQL (Vercel Postgres, Supabase)
- MySQL (PlanetScale, Railway)
- MongoDB (MongoDB Atlas)

---

## 📞 Support

For questions or issues:
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides
- Check Vercel deployment logs
- Test locally with `vercel dev`

---

## 📄 License

This project is a demonstration of the KDIA Re-Park Portal platform.

---

## 🎉 Features Showcase

This parked demo showcases:
- ✅ Multi-portal architecture
- ✅ Role-based access control
- ✅ Real-time data visualization
- ✅ Serverless deployment
- ✅ Modern React patterns
- ✅ Responsive design
- ✅ Secure authentication

---

**Built with ❤️ for renewable energy management**
