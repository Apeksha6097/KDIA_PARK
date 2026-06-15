// VERCEL SERVERLESS DEPLOYMENT - Database Module
// This file is adapted from server/database.js for serverless compatibility
// SQLite database is bundled at deploy time and runs in READ-ONLY mode on Vercel

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function initDB() {
  const fs = require('fs');
  // Use process.cwd() for project root consistency in Vercel
  let dbPath = path.join(process.cwd(), 'api', 'kdia_database.sqlite');

  // Fallback to __dirname if not found (for local testing/alternate bundles)
  if (!fs.existsSync(dbPath)) {
    console.log('Path from process.cwd() not found, trying __dirname:', dbPath);
    dbPath = path.join(__dirname, 'kdia_database.sqlite');
  }

  console.log(`Initializing database at: ${dbPath}`);

  if (!fs.existsSync(dbPath)) {
    console.error(`DATABASE FILE NOT FOUND at ${dbPath}`);
    throw new Error(`SQLite database file not found. Ensure "includeFiles" in vercel.json includes "api/database.sqlite". Checked: ${dbPath}`);
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
    mode: sqlite3.OPEN_READONLY // Explicitly open as READ-ONLY for Vercel
  });

  // Only run schema creation locally, never on Vercel (Read-Only)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          consumerId TEXT UNIQUE,
          mobileNumber TEXT,
          address_line_1 TEXT,
          address_line_2 TEXT,
          city TEXT,
          state TEXT,
          pin_code TEXT,
          location_type TEXT,
          dob TEXT,
          gender TEXT,
          alternate_mobile TEXT,
          preferred_comm TEXT,
          occupancy_type TEXT,
          role TEXT DEFAULT 'customer',
          isActive INTEGER DEFAULT 1,
          loginAttempts INTEGER DEFAULT 0,
          lockUntil INTEGER DEFAULT 0,
          approval_status TEXT DEFAULT 'PENDING',
          vendor_id INTEGER,
          onboarding_status TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          totalUnits INTEGER NOT NULL,
          startDate TEXT NOT NULL,
          allocation_name TEXT DEFAULT 'Monthly Solar Allocation',
          notes TEXT,
          status TEXT DEFAULT 'ACTIVE',
          period TEXT DEFAULT 'Monthly',
          FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS consumption_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          unitsConsumed INTEGER NOT NULL,
          month TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          adminId INTEGER NOT NULL,
          actionType TEXT NOT NULL,
          targetId INTEGER,
          details TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (adminId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS support_tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customerId INTEGER NOT NULL,
          subject TEXT NOT NULL,
          category TEXT,
          description TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          admin_reply TEXT,
          reply_at DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          revokedAt DATETIME,
          FOREIGN KEY (customerId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS ticket_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ticketId INTEGER NOT NULL,
          senderId INTEGER NOT NULL,
          message TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ticketId) REFERENCES support_tickets(id),
          FOREIGN KEY (senderId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          vendorId INTEGER NOT NULL,
          name TEXT NOT NULL,
          contact TEXT NOT NULL,
          location TEXT NOT NULL,
          assignedDate DATE NOT NULL,
          status TEXT DEFAULT 'New',
          FOREIGN KEY (vendorId) REFERENCES users(id)
        );
      `);
  }

  console.log('Database initialized (Vercel serverless mode)');
  return db;
}

module.exports = { initDB };
