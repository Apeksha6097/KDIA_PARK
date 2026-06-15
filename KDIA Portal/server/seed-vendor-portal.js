const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

async function seedVendorPortal() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    try {
        console.log('--- Starting Vendor Portal Mock Data Seed ---');

        // 1. Find the test vendor
        const vendor = await db.get("SELECT id FROM users WHERE email = 'vendor@test.com'");
        if (!vendor) {
            console.error('❌ Vendor not found! Run create-test-user.js first.');
            return;
        }
        const vendorId = vendor.id;
        console.log(`Using Vendor ID: ${vendorId}`);

        // 2. Clear existing leads for this vendor (Optional, but good for clean demo)
        await db.run("DELETE FROM leads WHERE vendorId = ?", [vendorId]);
        console.log('Cleared existing leads.');

        // 3. Seed Mock Leads (Various statuses)
        const mockLeads = [
            ['Karan Malhotra', '9811000001 | karan.m@test.com', 'Cyber Hub, Gurgaon', '2026-01-20', 'New'],
            ['Sanya Gupta', '9811000002 | sanya.g@test.com', 'Hauz Khas, Delhi', '2026-01-22', 'New'],
            ['Rohan Mehra', '9811000003 | rohan.m@test.com', 'MG Road, Gurgaon', '2026-01-24', 'Contacted'],
            ['Sneha Kapoor', '9811000004 | sneha.k@test.com', 'Greater Kailash, Delhi', '2026-01-25', 'Meeting Scheduled'],
            ['Arjun Verma', '9811000005 | arjun.v@test.com', 'Vasant Vihar, Delhi', '2026-01-26', 'Meeting Scheduled'],
            ['Deepika Joshi', '9811000006 | deepika.j@test.com', 'Sector 50, Noida', '2026-01-27', 'Contacted'],
            ['Vikram Singh', '9811000007 | vikram.s@test.com', 'Banjara Hills, Hyderabad', '2026-01-28', 'New']
        ];

        const leadStmt = await db.prepare("INSERT INTO leads (vendorId, name, contact, location, assignedDate, status) VALUES (?, ?, ?, ?, ?, ?)");
        for (const lead of mockLeads) {
            await leadStmt.run(vendorId, ...lead);
        }
        await leadStmt.finalize();
        console.log(`Seeded ${mockLeads.length} mock leads.`);

        // 4. Seed Mock Customers (Draft and Approved)
        // Clear existing customers for this vendor to avoid unique constraint errors
        // NOTE: In a real system we wouldn't just delete users, but for mock demo it's fine.
        await db.run("DELETE FROM users WHERE vendor_id = ?", [vendorId]);
        console.log('Cleared existing vendor customers.');

        const hashedPassword = await bcrypt.hash('Customer@123', 10);

        const mockCustomers = [
            // DRAFT Customers
            ['Ananya Iyer', 'ananya.i@test.com', '9822000001', 'KDIA-CUST-DRF-01', 'DRAFT', 'DRAFT'],
            ['Kabir Batra', 'kabir.b@test.com', '9822000002', 'KDIA-CUST-DRF-02', 'DRAFT', 'DRAFT'],

            // APPROVED Customers (Onboarded)
            ['Meera Nair', 'meera.n@test.com', '9822000003', 'KDIA-CUST-APP-01', 'APPROVED', 'ONBOARDED'],
            ['Siddharth Bose', 'siddhartha.b@test.com', '9822000004', 'KDIA-CUST-APP-02', 'APPROVED', 'ONBOARDED'],
            ['Zoya Khan', 'zoya.k@test.com', '9822000005', 'KDIA-CUST-APP-03', 'APPROVED', 'ONBOARDED']
        ];

        const custStmt = await db.prepare(`
            INSERT INTO users (
                fullName, email, mobileNumber, consumerId, password, role, 
                vendor_id, approval_status, onboarding_status, address_line_1, city, state, pin_code
            ) VALUES (?, ?, ?, ?, ?, 'customer', ?, ?, ?, '123 clean energy way', 'New Delhi', 'Delhi', '110001')
        `);

        for (const cust of mockCustomers) {
            const result = await custStmt.run(cust[0], cust[1], cust[2], cust[3], hashedPassword, vendorId, cust[4], cust[5]);

            // If approved, add subscription data
            if (cust[4] === 'APPROVED') {
                await db.run(
                    'INSERT INTO subscriptions (userId, totalUnits, startDate) VALUES (?, ?, ?)',
                    [result.lastID, 1200, '2026-01-01']
                );
            }
        }
        await custStmt.finalize();
        console.log(`Seeded ${mockCustomers.length} mock customers.`);

        console.log('✅ Vendor Portal Mock Data seeded successfully!');

    } catch (err) {
        console.error('❌ Error seeding vendor portal:', err);
    } finally {
        await db.close();
    }
}

seedVendorPortal();
