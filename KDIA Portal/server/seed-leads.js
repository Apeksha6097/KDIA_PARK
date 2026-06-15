const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function seedLeads() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    try {
        console.log('Checking database...');

        // Find vendor
        const vendor = await db.get("SELECT id FROM users WHERE email = 'vendor@test.com'");
        if (!vendor) {
            console.error('❌ Vendor not found! Please run create-test-user.js first.');
            return;
        }

        console.log(`Found vendor ID: ${vendor.id}`);

        // Check if leads table exists
        try {
            await db.get("SELECT count(*) FROM leads");
        } catch (e) {
            console.log('⚠️ Leads table missing. Initializing...');
            await db.exec(`
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

        // Check seed data
        const leads = await db.all("SELECT * FROM leads WHERE vendorId = ?", [vendor.id]);

        if (leads.length === 0) {
            console.log('Seeding leads...');
            await db.run(`INSERT INTO leads (vendorId, name, contact, location, assignedDate, status) VALUES 
                  (?, 'Amit Sharma', '9876500001 | amit.s@example.com', 'Sector 62, Noida', '2025-01-15', 'New'),
                  (?, 'Priya Verma', '9876500002 | priya.v@example.com', 'Indirapuram, Ghaziabad', '2025-01-14', 'Contacted'),
                  (?, 'Rahul Singh', '9876500003 | rahul.s@example.com', 'Vasant Kunj, Delhi', '2025-01-12', 'Meeting Scheduled')
              `, [vendor.id, vendor.id, vendor.id]);
            console.log('✅ Leads seeded successfully!');
        } else {
            console.log(`ℹ️  Found ${leads.length} existing leads for vendor.`);
            leads.forEach(l => console.log(`   - ${l.name} (${l.status})`));
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await db.close();
    }
}

seedLeads();
