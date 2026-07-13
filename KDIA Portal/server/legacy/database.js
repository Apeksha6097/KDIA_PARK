const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initDB() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

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

  // Migration: Add address columns if they don't exist
  const tableInfo = await db.all("PRAGMA table_info(users)");
  const columns = tableInfo.map(c => c.name);

  const newColumns = [
    { name: 'address_line_1', type: 'TEXT' },
    { name: 'address_line_2', type: 'TEXT' },
    { name: 'city', type: 'TEXT' },
    { name: 'state', type: 'TEXT' },
    { name: 'pin_code', type: 'TEXT' },
    { name: 'location_type', type: 'TEXT' },
    { name: 'dob', type: 'TEXT' },
    { name: 'gender', type: 'TEXT' },
    { name: 'alternate_mobile', type: 'TEXT' },
    { name: 'preferred_comm', type: 'TEXT' },
    { name: 'occupancy_type', type: 'TEXT' },
    { name: 'vendor_id', type: 'INTEGER' },
    { name: 'onboarding_status', type: 'TEXT' },
    { name: 'createdAt', type: 'DATETIME' },
    { name: 'rejection_reason', type: 'TEXT' }
  ];

  for (const col of newColumns) {
    if (!columns.includes(col.name)) {
      await db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Migration: Added column ${col.name} to users table`);
    }
  }

  // Ensure createdAt is populated for existing users
  await db.exec("UPDATE users SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL");

  // Migration: Add approval_status column
  if (!columns.includes('approval_status')) {
    await db.exec("ALTER TABLE users ADD COLUMN approval_status TEXT DEFAULT 'PENDING'");
    console.log("Migration: Added column approval_status to users table");
  }

  // Ensure ALL existing customers/admins/vendors have a status
  // Specifically, ensure existing active users are APPROVED if they don't have a status
  await db.exec("UPDATE users SET approval_status = 'APPROVED' WHERE approval_status IS NULL OR approval_status = ''");

  // Migration: Add columns to subscriptions table
  const subInfo = await db.all("PRAGMA table_info(subscriptions)");
  const subColumns = subInfo.map(c => c.name);
  const newSubColumns = [
    { name: 'allocation_name', type: 'TEXT DEFAULT "Monthly Solar Allocation"' },
    { name: 'notes', type: 'TEXT' },
    { name: 'status', type: 'TEXT DEFAULT "ACTIVE"' },
    { name: 'period', type: 'TEXT DEFAULT "Monthly"' }
  ];

  for (const col of newSubColumns) {
    if (!subColumns.includes(col.name)) {
      await db.exec(`ALTER TABLE subscriptions ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Migration: Added column ${col.name} to subscriptions table`);
    }
  }

  // Support Tickets Migrations
  const ticketInfo = await db.all("PRAGMA table_info(support_tickets)");
  const ticketColumns = ticketInfo.map(c => c.name);

  if (!ticketColumns.includes('category')) {
    await db.exec("ALTER TABLE support_tickets ADD COLUMN category TEXT");
    await db.exec("UPDATE support_tickets SET category = subject WHERE category IS NULL");
    console.log("Migration: Added category column to support_tickets");
  }

  if (!ticketColumns.includes('admin_reply')) {
    await db.exec("ALTER TABLE support_tickets ADD COLUMN admin_reply TEXT");
    await db.exec("ALTER TABLE support_tickets ADD COLUMN reply_at DATETIME");
    console.log("Migration: Added admin response columns to support_tickets");
  }

  // Seed Test Leads
  try {
    const vendor = await db.get("SELECT id FROM users WHERE email = 'vendor@test.com'");
    if (vendor) {
      const leadCount = await db.get("SELECT COUNT(*) as count FROM leads WHERE vendorId = ?", [vendor.id]);
      if (leadCount.count === 0) {
        await db.run(`INSERT INTO leads (vendorId, name, contact, location, assignedDate, status) VALUES 
                  (?, 'Amit Sharma', '9876500001 | amit.s@example.com', 'Sector 62, Noida', '2025-01-15', 'New'),
                  (?, 'Priya Verma', '9876500002 | priya.v@example.com', 'Indirapuram, Ghaziabad', '2025-01-14', 'Contacted'),
                  (?, 'Rahul Singh', '9876500003 | rahul.s@example.com', 'Vasant Kunj, Delhi', '2025-01-12', 'Meeting Scheduled')
              `, [vendor.id, vendor.id, vendor.id]);
        console.log("Seeded test leads for vendor@test.com");
      }
    }
  } catch (error) {
    console.error("Error seeding leads:", error);
  }

  console.log('Database initialized');
  return db;
}

module.exports = { initDB };
