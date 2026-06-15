const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

async function createTestUser() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Test user credentials
    const testUser = {
        fullName: 'Test Customer',
        email: 'customer@test.com',
        mobileNumber: '9876543210',
        consumerId: 'KDIA-TEST-001',
        password: 'Test@123',
        role: 'customer'
    };

    const testAdmin = {
        fullName: 'Test Admin',
        email: 'admin@test.com',
        mobileNumber: '9876543211',
        consumerId: 'KDIA-ADMIN-001',
        password: 'Admin@123',
        role: 'admin'
    };

    const testVendor = {
        fullName: 'Test Vendor',
        email: 'vendor@test.com',
        mobileNumber: '9876543212',
        consumerId: 'KDIA-VEND-001',
        password: 'Vendor@123',
        role: 'vendor',
        approval_status: 'APPROVED'
    };

    const testVendorPending = {
        fullName: 'Pending Vendor',
        email: 'pending@test.com',
        mobileNumber: '9876543213',
        consumerId: 'KDIA-VEND-002',
        password: 'Vendor@123',
        role: 'vendor',
        approval_status: 'PENDING'
    };

    try {
        // Hash passwords
        const customerHashedPassword = await bcrypt.hash(testUser.password, 10);
        const adminHashedPassword = await bcrypt.hash(testAdmin.password, 10);

        // Check if users already exist
        const existingCustomer = await db.get('SELECT * FROM users WHERE email = ?', [testUser.email]);
        const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [testAdmin.email]);

        // Insert customer if doesn't exist
        if (!existingCustomer) {
            const customerResult = await db.run(
                'INSERT INTO users (fullName, email, mobileNumber, consumerId, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                [testUser.fullName, testUser.email, testUser.mobileNumber, testUser.consumerId, customerHashedPassword, testUser.role]
            );

            // Add subscription data
            await db.run(
                'INSERT INTO subscriptions (userId, totalUnits, startDate) VALUES (?, ?, ?)',
                [customerResult.lastID, 1500, '2026-01-01']
            );

            // Add consumption logs
            await db.run(
                'INSERT INTO consumption_logs (userId, unitsConsumed, month) VALUES (?, ?, ?)',
                [customerResult.lastID, 200, '2026-01']
            );

            console.log('✅ Test Customer created successfully!');
        } else {
            console.log('ℹ️  Test Customer already exists');
        }

        // Insert admin if doesn't exist
        if (!existingAdmin) {
            await db.run(
                'INSERT INTO users (fullName, email, mobileNumber, consumerId, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                [testAdmin.fullName, testAdmin.email, testAdmin.mobileNumber, testAdmin.consumerId, adminHashedPassword, testAdmin.role]
            );
            console.log('✅ Test Admin created successfully!');
        } else {
            console.log('ℹ️  Test Admin already exists');
        }

        // Check and Insert Vendor (Approved)
        const existingVendor = await db.get('SELECT * FROM users WHERE email = ?', [testVendor.email]);
        if (!existingVendor) {
            const vendorHashedPassword = await bcrypt.hash(testVendor.password, 10);
            await db.run(
                'INSERT INTO users (fullName, email, mobileNumber, consumerId, password, role, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [testVendor.fullName, testVendor.email, testVendor.mobileNumber, testVendor.consumerId, vendorHashedPassword, testVendor.role, testVendor.approval_status]
            );
            console.log('✅ Test Vendor (Approved) created successfully!');
        } else {
            console.log('ℹ️  Test Vendor already exists');
        }

        // Check and Insert Vendor (Pending)
        const existingVendorPending = await db.get('SELECT * FROM users WHERE email = ?', [testVendorPending.email]);
        if (!existingVendorPending) {
            const vendorPendingHashedPassword = await bcrypt.hash(testVendorPending.password, 10);
            await db.run(
                'INSERT INTO users (fullName, email, mobileNumber, consumerId, password, role, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [testVendorPending.fullName, testVendorPending.email, testVendorPending.mobileNumber, testVendorPending.consumerId, vendorPendingHashedPassword, testVendorPending.role, testVendorPending.approval_status]
            );
            console.log('✅ Test Vendor (Pending) created successfully!');
        } else {
            console.log('ℹ️  Test Vendor (Pending) already exists');
        }

        console.log('\n📋 Test User Credentials:');
        console.log('─────────────────────────────────────────');
        console.log('\n👤 CUSTOMER ACCOUNT:');
        console.log('   Email: customer@test.com');
        console.log('   Mobile: 9876543210');
        console.log('   Consumer ID: KDIA-TEST-001');
        console.log('   Password: Test@123');
        console.log('\n👨‍💼 ADMIN ACCOUNT:');
        console.log('   Email: admin@test.com');
        console.log('   Mobile: 9876543211');
        console.log('   Consumer ID: KDIA-ADMIN-001');
        console.log('   Password: Admin@123');
        console.log('\n👷 VENDOR ACCOUNT (Approved):');
        console.log('   Email: vendor@test.com');
        console.log('   Password: Vendor@123');
        console.log('   Status: APPROVED');
        console.log('\n⏳ VENDOR ACCOUNT (Pending):');
        console.log('   Email: pending@test.com');
        console.log('   Password: Vendor@123');
        console.log('   Status: PENDING');
        console.log('\n─────────────────────────────────────────');

        await db.close();
    } catch (err) {
        console.error('❌ Error creating test users:', err);
    }
}

createTestUser();
