/**
 * KDIA RE Park Portal — Database Seed Script
 * ==========================================
 * Populates the local SQLite database with demo data for development and testing.
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Safety:
 *   - Uses existence checks before every insert (idempotent — safe to run multiple times).
 *   - Does NOT modify the database schema.
 *   - Only targets the local server/database.sqlite file.
 */

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const path = require('path');

// ─── Database Path ────────────────────────────────────────────────────────────
// Points to the local development database in the /server directory
const DB_PATH = path.join(__dirname, '..', 'server', 'database.sqlite');

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function userExists(db, email) {
  const row = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  return row ? row.id : null;
}

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedUsers(db) {
  console.log('\n[1/5] Seeding users...');

  const users = [
    {
      fullName: 'Admin User',
      email: 'admin@kdia.in',
      password: 'Admin@1234',
      role: 'admin',
      consumerId: null,
      mobileNumber: '9800000001',
      city: 'Jaipur',
      state: 'Rajasthan',
      approval_status: 'APPROVED',
    },
    {
      fullName: 'Solar Vendor One',
      email: 'vendor@kdia.in',
      password: 'Vendor@1234',
      role: 'vendor',
      consumerId: null,
      mobileNumber: '9800000002',
      city: 'Jodhpur',
      state: 'Rajasthan',
      approval_status: 'APPROVED',
    },
    {
      fullName: 'Support Agent Rahul',
      email: 'support@kdia.in',
      password: 'Support@1234',
      role: 'support_agent',
      consumerId: null,
      mobileNumber: '9800000003',
      city: 'Jaipur',
      state: 'Rajasthan',
      approval_status: 'APPROVED',
    },
    {
      fullName: 'Demo Customer Priya',
      email: 'customer@kdia.in',
      password: 'Customer@1234',
      role: 'customer',
      consumerId: 'KDIA-CUST-001',
      mobileNumber: '9800000004',
      city: 'Bikaner',
      state: 'Rajasthan',
      approval_status: 'APPROVED',
    },
    {
      fullName: 'Amit Sharma',
      email: 'amit.sharma@kdia.in',
      password: 'Customer@1234',
      role: 'customer',
      consumerId: 'KDIA-CUST-002',
      mobileNumber: '9800000005',
      city: 'Jodhpur',
      state: 'Rajasthan',
      approval_status: 'APPROVED',
    },
    {
      fullName: 'Sneha Patel',
      email: 'sneha.patel@kdia.in',
      password: 'Customer@1234',
      role: 'customer',
      consumerId: 'KDIA-CUST-003',
      mobileNumber: '9800000006',
      city: 'Udaipur',
      state: 'Rajasthan',
      approval_status: 'PENDING',
    },
  ];

  const insertedIds = {};

  for (const user of users) {
    const existingId = await userExists(db, user.email);
    if (existingId) {
      console.log(`  ⚠ Skipping existing user: ${user.email} (id=${existingId})`);
      insertedIds[user.email] = existingId;
      continue;
    }

    const hashed = await hashPassword(user.password);
    const result = await db.run(
      `INSERT INTO users
         (fullName, email, password, role, consumerId, mobileNumber, city, state, approval_status, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        user.fullName,
        user.email,
        hashed,
        user.role,
        user.consumerId || null,
        user.mobileNumber,
        user.city,
        user.state,
        user.approval_status,
      ]
    );
    insertedIds[user.email] = result.lastID;
    console.log(`  ✓ Created user: ${user.email} [${user.role}] (id=${result.lastID})`);
  }

  return insertedIds;
}

async function seedSubscriptions(db, userIds) {
  console.log('\n[2/5] Seeding subscriptions...');

  const customerId1 = userIds['customer@kdia.in'];
  const customerId2 = userIds['amit.sharma@kdia.in'];

  const subscriptions = [
    {
      userId: customerId1,
      totalUnits: 500,
      startDate: '2025-01-01',
      allocation_name: 'Solar Alpha – Monthly Allocation',
      notes: 'Primary solar subscription for demo customer',
      status: 'ACTIVE',
      period: 'Monthly',
    },
    {
      userId: customerId2,
      totalUnits: 300,
      startDate: '2025-03-01',
      allocation_name: 'Solar Beta – Monthly Allocation',
      notes: 'Subscription for Amit Sharma',
      status: 'ACTIVE',
      period: 'Monthly',
    },
  ];

  for (const sub of subscriptions) {
    if (!sub.userId) {
      console.log(`  ⚠ Skipping subscription — user not found`);
      continue;
    }
    const existing = await db.get(
      'SELECT id FROM subscriptions WHERE userId = ? AND allocation_name = ?',
      [sub.userId, sub.allocation_name]
    );
    if (existing) {
      console.log(`  ⚠ Skipping existing subscription for userId=${sub.userId}`);
      continue;
    }
    await db.run(
      `INSERT INTO subscriptions (userId, totalUnits, startDate, allocation_name, notes, status, period)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sub.userId, sub.totalUnits, sub.startDate, sub.allocation_name, sub.notes, sub.status, sub.period]
    );
    console.log(`  ✓ Created subscription for userId=${sub.userId}: ${sub.allocation_name}`);
  }
}

async function seedConsumptionLogs(db, userIds) {
  console.log('\n[3/5] Seeding consumption logs...');

  const customerId1 = userIds['customer@kdia.in'];
  const customerId2 = userIds['amit.sharma@kdia.in'];

  const logs = [
    { userId: customerId1, unitsConsumed: 480, month: '2025-01' },
    { userId: customerId1, unitsConsumed: 495, month: '2025-02' },
    { userId: customerId1, unitsConsumed: 460, month: '2025-03' },
    { userId: customerId1, unitsConsumed: 510, month: '2025-04' },
    { userId: customerId2, unitsConsumed: 290, month: '2025-03' },
    { userId: customerId2, unitsConsumed: 305, month: '2025-04' },
  ];

  for (const log of logs) {
    if (!log.userId) {
      console.log(`  ⚠ Skipping log — user not found`);
      continue;
    }
    const existing = await db.get(
      'SELECT id FROM consumption_logs WHERE userId = ? AND month = ?',
      [log.userId, log.month]
    );
    if (existing) {
      console.log(`  ⚠ Skipping existing log for userId=${log.userId}, month=${log.month}`);
      continue;
    }
    await db.run(
      'INSERT INTO consumption_logs (userId, unitsConsumed, month) VALUES (?, ?, ?)',
      [log.userId, log.unitsConsumed, log.month]
    );
    console.log(`  ✓ Logged ${log.unitsConsumed} units for userId=${log.userId} (${log.month})`);
  }
}

async function seedSupportTickets(db, userIds) {
  console.log('\n[4/5] Seeding support tickets...');

  const customerId1 = userIds['customer@kdia.in'];
  const customerId2 = userIds['amit.sharma@kdia.in'];
  const supportId   = userIds['support@kdia.in'];

  const tickets = [
    {
      customerId: customerId1,
      subject: 'Billing discrepancy in January invoice',
      category: 'Billing',
      description: 'My January 2025 bill shows 520 units but I consumed only 480 units. Please verify.',
      status: 'OPEN',
      priority: 'HIGH',
      discom: 'Jodhpur',
      park_district: 'Phalodi',
      assigned_support_id: supportId || null,
    },
    {
      customerId: customerId1,
      subject: 'Unable to download PPA document',
      category: 'Technical',
      description: 'The PPA Document link on the portal returns a 404 error.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      discom: 'Jodhpur',
      park_district: 'Phalodi',
      assigned_support_id: supportId || null,
      admin_reply: 'The document link has been updated. Please try again.',
    },
    {
      customerId: customerId2,
      subject: 'Solar allocation status not updated',
      category: 'Allocation',
      description: 'My allocation status still shows "Under Execution" even though commissioning was done.',
      status: 'PENDING',
      priority: 'LOW',
      discom: 'Bikaner',
      park_district: 'Bikaner East',
      assigned_support_id: null,
    },
  ];

  for (const ticket of tickets) {
    if (!ticket.customerId) {
      console.log(`  ⚠ Skipping ticket — customer not found`);
      continue;
    }
    const existing = await db.get(
      'SELECT id FROM support_tickets WHERE customerId = ? AND subject = ?',
      [ticket.customerId, ticket.subject]
    );
    if (existing) {
      console.log(`  ⚠ Skipping existing ticket: "${ticket.subject}"`);
      continue;
    }
    await db.run(
      `INSERT INTO support_tickets
         (customerId, subject, category, description, status, priority, discom, park_district,
          assigned_support_id, admin_reply, reply_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ticket.customerId,
        ticket.subject,
        ticket.category,
        ticket.description,
        ticket.status,
        ticket.priority,
        ticket.discom,
        ticket.park_district,
        ticket.assigned_support_id || null,
        ticket.admin_reply || null,
        ticket.admin_reply ? new Date().toISOString() : null,
      ]
    );
    console.log(`  ✓ Created ticket: "${ticket.subject}" [${ticket.status}]`);
  }
}

async function seedLeads(db, userIds) {
  console.log('\n[5/5] Seeding leads...');

  const vendorId = userIds['vendor@kdia.in'];
  if (!vendorId) {
    console.log('  ⚠ Skipping leads — vendor not found');
    return;
  }

  const leads = [
    {
      vendorId,
      name: 'Rohit Mehta',
      contact: '9812300001 | rohit.m@example.com',
      location: 'Sector 14, Bikaner',
      assignedDate: '2025-02-10',
      status: 'New',
    },
    {
      vendorId,
      name: 'Kavita Joshi',
      contact: '9812300002 | kavita.j@example.com',
      location: 'Shastri Nagar, Jaipur',
      assignedDate: '2025-02-12',
      status: 'Contacted',
    },
    {
      vendorId,
      name: 'Deepak Ranga',
      contact: '9812300003 | deepak.r@example.com',
      location: 'MIA, Alwar',
      assignedDate: '2025-02-14',
      status: 'Meeting Scheduled',
    },
    {
      vendorId,
      name: 'Sunita Yadav',
      contact: '9812300004 | sunita.y@example.com',
      location: 'Pali, Rajasthan',
      assignedDate: '2025-02-18',
      status: 'Converted',
    },
  ];

  for (const lead of leads) {
    const existing = await db.get(
      'SELECT id FROM leads WHERE vendorId = ? AND contact = ?',
      [lead.vendorId, lead.contact]
    );
    if (existing) {
      console.log(`  ⚠ Skipping existing lead: ${lead.name}`);
      continue;
    }
    await db.run(
      'INSERT INTO leads (vendorId, name, contact, location, assignedDate, status) VALUES (?, ?, ?, ?, ?, ?)',
      [lead.vendorId, lead.name, lead.contact, lead.location, lead.assignedDate, lead.status]
    );
    console.log(`  ✓ Created lead: ${lead.name} [${lead.status}]`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  KDIA RE Park Portal — Database Seeder   ');
  console.log('═══════════════════════════════════════════');
  console.log(`  Database: ${DB_PATH}`);

  let db;
  try {
    db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  } catch (err) {
    console.error('\n✗ Could not open database:', err.message);
    console.error('  Make sure the server has been started at least once to create the database.');
    process.exit(1);
  }

  try {
    const userIds = await seedUsers(db);
    await seedSubscriptions(db, userIds);
    await seedConsumptionLogs(db, userIds);
    await seedSupportTickets(db, userIds);
    await seedLeads(db, userIds);

    console.log('\n═══════════════════════════════════════════');
    console.log('  ✓ Seed complete!                         ');
    console.log('═══════════════════════════════════════════');
    console.log('\n  Demo credentials:');
    console.log('  Role       | Email                  | Password');
    console.log('  -----------|------------------------|------------------');
    console.log('  Admin      | admin@kdia.in          | Admin@1234');
    console.log('  Vendor     | vendor@kdia.in         | Vendor@1234');
    console.log('  Support    | support@kdia.in        | Support@1234');
    console.log('  Customer   | customer@kdia.in       | Customer@1234');
    console.log('  Customer   | amit.sharma@kdia.in    | Customer@1234');
    console.log('');
  } catch (err) {
    console.error('\n✗ Seed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main();
