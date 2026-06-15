const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

/**
 * E2E Workflow Verification - Controlled Test Data Setup
 * 
 * SAFETY RULES:
 * - Only creates clearly labeled TEST entities
 * - Does not modify or delete existing real data
 * - Does not affect production users
 * - All test data is prefixed with TEST_ or "Test Vendor QA"
 */

async function setupE2ETestData() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('\n🧪 E2E WORKFLOW VERIFICATION - TEST DATA SETUP');
    console.log('═══════════════════════════════════════════════\n');

    try {
        // ============================================================
        // PHASE 1: Create Test Vendor (APPROVED)
        // ============================================================
        console.log('📋 Phase 1: Creating Test Vendor QA...');

        const testVendor = {
            fullName: 'Test Vendor QA',
            email: 'test.vendor.qa@kdia.test',
            mobileNumber: '9999000001',
            consumerId: 'KDIA-VENDOR-QA-001',
            password: 'TestVendor@123',
            role: 'vendor',
            approval_status: 'APPROVED'
        };

        // Check if test vendor already exists
        let vendor = await db.get('SELECT * FROM users WHERE email = ?', [testVendor.email]);

        if (!vendor) {
            const hashedPassword = await bcrypt.hash(testVendor.password, 10);
            const result = await db.run(
                'INSERT INTO users (fullName, email, mobileNumber, consumerId, password, role, approval_status, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [testVendor.fullName, testVendor.email, testVendor.mobileNumber, testVendor.consumerId, hashedPassword, testVendor.role, testVendor.approval_status, 1]
            );
            vendor = { id: result.lastID, ...testVendor };
            console.log(`✅ Created Test Vendor QA (ID: ${vendor.id})`);
        } else {
            console.log(`ℹ️  Test Vendor QA already exists (ID: ${vendor.id})`);
        }

        // ============================================================
        // PHASE 2: Create Test Customers
        // ============================================================
        console.log('\n📋 Phase 2: Creating Test Customers...');

        const testCustomers = [
            {
                name: 'TEST_DRAFT_CUSTOMER',
                fullName: 'TEST_DRAFT_CUSTOMER',
                email: 'test.draft.customer@kdia.test',
                mobileNumber: '9999000002',
                consumerId: 'KDIA-TEST-DRAFT-001',
                addressLine1: '123 Test Street',
                city: 'Test City',
                state: 'Test State',
                pinCode: '110001',
                locationType: 'Residential',
                gender: 'Other',
                dob: '1990-01-01',
                approval_status: 'DRAFT',
                description: 'Draft customer - should be visible to vendor only'
            },
            {
                name: 'TEST_PENDING_CUSTOMER',
                fullName: 'TEST_PENDING_CUSTOMER',
                email: 'test.pending.customer@kdia.test',
                mobileNumber: '9999000003',
                consumerId: 'KDIA-TEST-PENDING-001',
                addressLine1: '456 Test Avenue',
                city: 'Test City',
                state: 'Test State',
                pinCode: '110002',
                locationType: 'Residential',
                gender: 'Other',
                dob: '1991-01-01',
                approval_status: 'PENDING',
                description: 'Pending customer - should be in approvals, not in directory'
            },
            {
                name: 'TEST_APPROVED_CUSTOMER',
                fullName: 'TEST_APPROVED_CUSTOMER',
                email: 'test.approved.customer@kdia.test',
                mobileNumber: '9999000004',
                consumerId: 'KDIA-TEST-APPROVED-001',
                addressLine1: '789 Test Boulevard',
                city: 'Test City',
                state: 'Test State',
                pinCode: '110003',
                locationType: 'Residential',
                gender: 'Other',
                dob: '1992-01-01',
                approval_status: 'APPROVED',
                description: 'Approved customer - should be in directory and can login'
            }
        ];

        const createdCustomers = [];

        for (const customer of testCustomers) {
            const existing = await db.get('SELECT * FROM users WHERE email = ?', [customer.email]);

            if (!existing) {
                // Generate random password (customers can't login until APPROVED anyway)
                const plainPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "A1!";
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                const result = await db.run(
                    `INSERT INTO users (
                        fullName, email, mobileNumber, consumerId, password, role,
                        address_line_1, city, state, pin_code, location_type,
                        gender, dob, vendor_id, onboarding_status, approval_status, isActive
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        customer.fullName, customer.email, customer.mobileNumber, customer.consumerId,
                        hashedPassword, 'customer',
                        customer.addressLine1, customer.city, customer.state, customer.pinCode, customer.locationType,
                        customer.gender, customer.dob,
                        vendor.id, customer.approval_status, customer.approval_status,
                        customer.approval_status === 'APPROVED' ? 1 : 0
                    ]
                );

                // Initialize subscription (empty for now)
                await db.run(
                    'INSERT INTO subscriptions (userId, totalUnits, startDate, status) VALUES (?, ?, ?, ?)',
                    [result.lastID, 0, new Date().toISOString().split('T')[0], 'INACTIVE']
                );

                createdCustomers.push({ id: result.lastID, ...customer });
                console.log(`✅ Created ${customer.name} (ID: ${result.lastID}, Status: ${customer.approval_status})`);
            } else {
                createdCustomers.push({ id: existing.id, ...customer });
                console.log(`ℹ️  ${customer.name} already exists (ID: ${existing.id})`);
            }
        }

        // ============================================================
        // PHASE 3: Create Audit Logs for Test Data Creation
        // ============================================================
        console.log('\n📋 Phase 3: Creating Audit Logs...');

        // Get admin user for audit logging
        const admin = await db.get("SELECT id FROM users WHERE role = 'admin' LIMIT 1");

        if (admin) {
            for (const customer of createdCustomers) {
                // Check if audit log already exists
                const existingLog = await db.get(
                    'SELECT * FROM audit_logs WHERE actionType = ? AND targetId = ?',
                    ['CUSTOMER_CREATED', customer.id]
                );

                if (!existingLog) {
                    await db.run(
                        'INSERT INTO audit_logs (adminId, actionType, targetId, details) VALUES (?, ?, ?, ?)',
                        [
                            vendor.id,
                            'CUSTOMER_CREATED',
                            customer.id,
                            JSON.stringify({
                                vendorId: vendor.id,
                                customerName: customer.fullName,
                                initialStatus: customer.approval_status
                            })
                        ]
                    );
                    console.log(`✅ Created CUSTOMER_CREATED audit log for ${customer.name}`);
                }
            }

            // Create submission audit log for PENDING customer
            const pendingCustomer = createdCustomers.find(c => c.name === 'TEST_PENDING_CUSTOMER');
            if (pendingCustomer) {
                const existingSubmitLog = await db.get(
                    'SELECT * FROM audit_logs WHERE actionType = ? AND targetId = ?',
                    ['CUSTOMER_SUBMITTED_FOR_APPROVAL', pendingCustomer.id]
                );

                if (!existingSubmitLog) {
                    await db.run(
                        'INSERT INTO audit_logs (adminId, actionType, targetId, details) VALUES (?, ?, ?, ?)',
                        [
                            vendor.id,
                            'CUSTOMER_SUBMITTED_FOR_APPROVAL',
                            pendingCustomer.id,
                            JSON.stringify({
                                vendorId: vendor.id,
                                customerName: pendingCustomer.fullName
                            })
                        ]
                    );
                    console.log(`✅ Created CUSTOMER_SUBMITTED_FOR_APPROVAL audit log for ${pendingCustomer.name}`);
                }
            }

            // Create approval audit log for APPROVED customer
            const approvedCustomer = createdCustomers.find(c => c.name === 'TEST_APPROVED_CUSTOMER');
            if (approvedCustomer && admin) {
                const existingApprovalLog = await db.get(
                    'SELECT * FROM audit_logs WHERE actionType = ? AND targetId = ?',
                    ['CUSTOMER_APPROVED', approvedCustomer.id]
                );

                if (!existingApprovalLog) {
                    await db.run(
                        'INSERT INTO audit_logs (adminId, actionType, targetId, details) VALUES (?, ?, ?, ?)',
                        [
                            admin.id,
                            'CUSTOMER_APPROVED',
                            approvedCustomer.id,
                            JSON.stringify({
                                status: 'APPROVED',
                                vendorId: vendor.id
                            })
                        ]
                    );
                    console.log(`✅ Created CUSTOMER_APPROVED audit log for ${approvedCustomer.name}`);
                }
            }
        }

        // ============================================================
        // SUMMARY
        // ============================================================
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ TEST DATA SETUP COMPLETE\n');
        console.log('📋 Test Credentials:');
        console.log('─────────────────────────────────────────────');
        console.log('\n👷 TEST VENDOR QA:');
        console.log(`   Email: ${testVendor.email}`);
        console.log(`   Password: ${testVendor.password}`);
        console.log(`   Status: ${testVendor.approval_status}`);
        console.log(`   ID: ${vendor.id}`);

        console.log('\n👥 TEST CUSTOMERS:');
        for (const customer of createdCustomers) {
            console.log(`\n   ${customer.name}:`);
            console.log(`   Email: ${customer.email}`);
            console.log(`   Consumer ID: ${customer.consumerId}`);
            console.log(`   Status: ${customer.approval_status}`);
            console.log(`   ID: ${customer.id}`);
            console.log(`   Description: ${customer.description}`);
        }

        console.log('\n─────────────────────────────────────────────');
        console.log('\n🔍 Next Steps:');
        console.log('   1. Login as Test Vendor QA to verify customer visibility');
        console.log('   2. Login as Admin to verify approval workflows');
        console.log('   3. Assign allocation to TEST_APPROVED_CUSTOMER');
        console.log('   4. Verify audit logs in Admin Portal');
        console.log('   5. Run verification tests');
        console.log('\n═══════════════════════════════════════════════\n');

        await db.close();

    } catch (err) {
        console.error('❌ Error setting up test data:', err);
        await db.close();
        process.exit(1);
    }
}

setupE2ETestData();
