const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function createTestUsers() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    const password = 'Test@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Create Test Customer
        await db.run(`
      INSERT INTO users (
        fullName, email, password, consumerId, mobileNumber, role, isActive, 
        approval_status, loginAttempts, lockUntil,
        address_line_1, city, state, pin_code, location_type, dob, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            'Test Customer',
            'customer@test.com',
            hashedPassword,
            'KDIA-TEST-001',
            '9876543210',
            'customer',
            1, // isActive
            'APPROVED',
            0, // loginAttempts
            0, // lockUntil
            '123 Solar Heights',
            'Clean City',
            'Sustainable State',
            '560001',
            'Residential',
            '1990-05-15',
            'Male'
        ]);
        console.log('✅ Created customer@test.com');

        // Create Test Admin
        await db.run(`
      INSERT INTO users (
        fullName, email, password, consumerId, mobileNumber, role, isActive, 
        approval_status, loginAttempts, lockUntil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            'Test Admin',
            'admin@test.com',
            hashedPassword,
            'KDIA-ADMIN-001',
            '9876543211',
            'admin',
            1,
            'APPROVED',
            0,
            0
        ]);
        console.log('✅ Created admin@test.com');

        // Create Test Vendor
        await db.run(`
      INSERT INTO users (
        fullName, email, password, consumerId, mobileNumber, role, isActive, 
        approval_status, loginAttempts, lockUntil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            'Test Vendor',
            'vendor@test.com',
            hashedPassword,
            'KDIA-VEND-001',
            '9876543212',
            'vendor',
            1,
            'APPROVED',
            0,
            0
        ]);
        console.log('✅ Created vendor@test.com');

        // Get the customer ID and create subscription
        const customer = await db.get('SELECT id FROM users WHERE email = ?', ['customer@test.com']);

        await db.run(
            'INSERT INTO subscriptions (userId, totalUnits, startDate, status) VALUES (?, ?, ?, ?)',
            [customer.id, 1500, '2026-01-01', 'ACTIVE']
        );
        console.log('✅ Created subscription for customer');

        await db.run(
            'INSERT INTO consumption_logs (userId, unitsConsumed, month) VALUES (?, ?, ?)',
            [customer.id, 200, '2026-01']
        );
        console.log('✅ Created consumption log for customer');

        console.log('\n✅ All test users created successfully!');
        console.log('\n📋 LOGIN CREDENTIALS:');
        console.log('  Customer: customer@test.com / Test@123');
        console.log('  Admin: admin@test.com / Test@123');
        console.log('  Vendor: vendor@test.com / Test@123');

    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log('ℹ️ Users already exist, skipping creation');
        } else {
            console.error('Error:', err);
        }
    } finally {
        await db.close();
    }
}

createTestUsers();
