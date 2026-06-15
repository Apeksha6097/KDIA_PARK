const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function setupQAData() {
    const password = await bcrypt.hash('TestPass123!', 10);

    // 1. Create Test Vendor
    db.run(`INSERT INTO users (fullName, email, password, role, approval_status, isActive, consumerId) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Test Vendor QA', 'vendor_qa@test.com', password, 'vendor', 'APPROVED', 1, 'QA-VND-001'],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    console.log('Test vendor already exists.');
                } else {
                    console.error('Error creating test vendor:', err.message);
                }
            } else {
                console.log('Test Vendor QA created with ID:', this.lastID);
            }

            setupCustomers(this.lastID || null);
        }
    );
}

function setupCustomers(vendorId) {
    if (!vendorId) {
        // Find the vendor ID if it already existed
        db.get("SELECT id FROM users WHERE email = 'vendor_qa@test.com'", (err, row) => {
            if (row) createCustomers(row.id);
        });
    } else {
        createCustomers(vendorId);
    }
}

async function createCustomers(vendorId) {
    const password = await bcrypt.hash('TestPass123!', 10);

    const customers = [
        { name: 'TEST_DRAFT_CUSTOMER', email: 'draft_qa@test.com', status: 'DRAFT', cid: 'QA-CID-DRF' },
        { name: 'TEST_PENDING_CUSTOMER', email: 'pending_qa@test.com', status: 'PENDING', cid: 'QA-CID-PND' },
        { name: 'TEST_APPROVED_CUSTOMER', email: 'approved_qa@test.com', status: 'APPROVED', cid: 'QA-CID-APP' }
    ];

    customers.forEach(c => {
        db.run(`INSERT INTO users (fullName, email, password, role, approval_status, isActive, vendor_id, consumerId, onboarding_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [c.name, c.email, password, 'customer', c.status, c.status === 'APPROVED' ? 1 : 0, vendorId, c.cid, 'COMPLETED'],
            (err) => {
                if (err && err.message.includes('UNIQUE constraint failed')) {
                    console.log(`${c.name} already exists.`);
                } else if (err) {
                    console.error(`Error creating ${c.name}:`, err.message);
                } else {
                    console.log(`${c.name} created.`);
                }
            }
        );
    });
}

setupQAData();
