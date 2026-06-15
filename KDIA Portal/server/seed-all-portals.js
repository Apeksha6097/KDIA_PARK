const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { initDB } = require('./database');

async function seedDatabase() {
    // Initialize schema first
    await initDB();

    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    const password = 'Test@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        console.log('🌱 Starting database seeding...\n');

        // ========== CUSTOMERS ==========
        console.log('👥 Creating customers...');
        const customers = [
            { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', consumerId: 'KDIA-2024-001', mobile: '9876543201', city: 'Mumbai', state: 'Maharashtra', status: 'APPROVED' },
            { name: 'Priya Sharma', email: 'priya.sharma@example.com', consumerId: 'KDIA-2024-002', mobile: '9876543202', city: 'Delhi', state: 'Delhi', status: 'APPROVED' },
            { name: 'Amit Patel', email: 'amit.patel@example.com', consumerId: 'KDIA-2024-003', mobile: '9876543203', city: 'Ahmedabad', state: 'Gujarat', status: 'APPROVED' },
            { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', consumerId: 'KDIA-2024-004', mobile: '9876543204', city: 'Hyderabad', state: 'Telangana', status: 'APPROVED' },
            { name: 'Vikram Singh', email: 'vikram.singh@example.com', consumerId: 'KDIA-2024-005', mobile: '9876543205', city: 'Jaipur', state: 'Rajasthan', status: 'APPROVED' },
            { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', consumerId: 'KDIA-2024-006', mobile: '9876543206', city: 'Bangalore', state: 'Karnataka', status: 'APPROVED' },
            { name: 'Rahul Verma', email: 'rahul.verma@example.com', consumerId: 'KDIA-2024-007', mobile: '9876543207', city: 'Pune', state: 'Maharashtra', status: 'APPROVED' },
            { name: 'Meera Gupta', email: 'meera.gupta@example.com', consumerId: 'KDIA-2024-008', mobile: '9876543208', city: 'Chennai', state: 'Tamil Nadu', status: 'APPROVED' },
            { name: 'Arjun Malhotra', email: 'arjun.malhotra@example.com', consumerId: 'KDIA-2024-009', mobile: '9876543209', city: 'Kolkata', state: 'West Bengal', status: 'APPROVED' },
            { name: 'Kavya Nair', email: 'kavya.nair@example.com', consumerId: 'KDIA-2024-010', mobile: '9876543210', city: 'Kochi', state: 'Kerala', status: 'APPROVED' },
            { name: 'Pending User 1', email: 'pending1@example.com', consumerId: 'KDIA-2024-P01', mobile: '9876543211', city: 'Noida', state: 'Uttar Pradesh', status: 'PENDING' },
            { name: 'Pending User 2', email: 'pending2@example.com', consumerId: 'KDIA-2024-P02', mobile: '9876543212', city: 'Gurgaon', state: 'Haryana', status: 'PENDING' },
            { name: 'Draft User 1', email: 'draft1@example.com', consumerId: 'KDIA-2024-D01', mobile: '9876543213', city: 'Chandigarh', state: 'Chandigarh', status: 'DRAFT' },
        ];

        const customerIds = [];
        for (const customer of customers) {
            const result = await db.run(`
        INSERT INTO users (
          fullName, email, password, consumerId, mobileNumber, role, isActive, 
          approval_status, loginAttempts, lockUntil,
          address_line_1, city, state, pin_code, location_type, dob, gender
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                customer.name, customer.email, hashedPassword, customer.consumerId, customer.mobile,
                'customer', customer.status === 'APPROVED' ? 1 : 0, customer.status, 0, 0,
                `${Math.floor(Math.random() * 500) + 1} Green Energy Street`,
                customer.city, customer.state, `${Math.floor(Math.random() * 900000) + 100000}`,
                'Residential', '1985-06-15', Math.random() > 0.5 ? 'Male' : 'Female'
            ]);
            customerIds.push({ id: result.lastID, status: customer.status });
            console.log(`  ✅ Created ${customer.name} (${customer.status})`);
        }

        // ========== VENDORS ==========
        console.log('\n🏢 Creating vendors...');
        const vendors = [
            { name: 'GreenTech Solutions', email: 'greentech@vendor.com', consumerId: 'VEND-2024-001', mobile: '9876540001', status: 'APPROVED' },
            { name: 'Solar Energy Co', email: 'solar@vendor.com', consumerId: 'VEND-2024-002', mobile: '9876540002', status: 'APPROVED' },
            { name: 'EcoFriendly Services', email: 'eco@vendor.com', consumerId: 'VEND-2024-003', mobile: '9876540003', status: 'APPROVED' },
            { name: 'Pending Vendor', email: 'pending.vendor@vendor.com', consumerId: 'VEND-2024-P01', mobile: '9876540004', status: 'PENDING' },
        ];

        const vendorIds = [];
        for (const vendor of vendors) {
            const result = await db.run(`
        INSERT INTO users (
          fullName, email, password, consumerId, mobileNumber, role, isActive, 
          approval_status, loginAttempts, lockUntil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                vendor.name, vendor.email, hashedPassword, vendor.consumerId, vendor.mobile,
                'vendor', vendor.status === 'APPROVED' ? 1 : 0, vendor.status, 0, 0
            ]);
            vendorIds.push({ id: result.lastID, status: vendor.status });
            console.log(`  ✅ Created ${vendor.name} (${vendor.status})`);
        }

        // ========== ADMINS ==========
        console.log('\n👨‍💼 Creating admins...');
        const adminEmail = 'admin@test.com';
        const existingAdmin = await db.get('SELECT id FROM users WHERE email = ?', [adminEmail]);

        if (!existingAdmin) {
            await db.run(`
                INSERT INTO users (
                    fullName, email, password, consumerId, mobileNumber, role, isActive, 
                    approval_status, loginAttempts, lockUntil
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                'Admin User', adminEmail, hashedPassword, 'KDIA-ADMIN-001', '9876540100',
                'admin', 1, 'APPROVED', 0, 0
            ]);
            console.log('  ✅ Created Admin User (admin@test.com)');
        }

        await db.run(`
      INSERT INTO users (
        fullName, email, password, consumerId, mobileNumber, role, isActive, 
        approval_status, loginAttempts, lockUntil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            'Super Admin', 'superadmin@test.com', hashedPassword, 'KDIA-SUPER-001', '9876540101',
            'admin', 1, 'APPROVED', 0, 0
        ]);
        console.log('  ✅ Created Super Admin');

        // ========== SUBSCRIPTIONS ==========
        console.log('\n⚡ Creating subscriptions...');
        const approvedCustomers = customerIds.filter(c => c.status === 'APPROVED');
        for (const customer of approvedCustomers) {
            const units = [1000, 1500, 2000, 2500, 3000][Math.floor(Math.random() * 5)];
            await db.run(`
        INSERT INTO subscriptions (userId, totalUnits, startDate, status, allocation_name, period)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
                customer.id, units, '2026-01-01', 'ACTIVE', 'Monthly Solar Allocation', 'Monthly'
            ]);
            console.log(`  ✅ Created subscription for customer ID ${customer.id} (${units} units)`);
        }

        // ========== CONSUMPTION LOGS ==========
        console.log('\n📊 Creating consumption logs...');
        const months = ['2025-10', '2025-11', '2025-12', '2026-01'];
        for (const customer of approvedCustomers) {
            for (const month of months) {
                const consumption = Math.floor(Math.random() * 300) + 100;
                await db.run(`
          INSERT INTO consumption_logs (userId, unitsConsumed, month)
          VALUES (?, ?, ?)
        `, [customer.id, consumption, month]);
            }
            console.log(`  ✅ Created consumption logs for customer ID ${customer.id}`);
        }

        // ========== SUPPORT TICKETS ==========
        console.log('\n🎫 Creating support tickets...');
        const ticketSubjects = [
            { subject: 'Billing Query', category: 'Billing', desc: 'I have a question about my recent bill.', status: 'PENDING' },
            { subject: 'Connection Issue', category: 'Technical', desc: 'My solar connection is not working properly.', status: 'IN_PROGRESS' },
            { subject: 'Allocation Request', category: 'Allocation', desc: 'I would like to increase my monthly allocation.', status: 'PENDING' },
            { subject: 'General Inquiry', category: 'General Question', desc: 'How can I track my energy consumption?', status: 'RESOLVED' },
            { subject: 'Service Update', category: 'Service', desc: 'When will the new solar panels be installed?', status: 'IN_PROGRESS' },
            { subject: 'Account Access', category: 'Technical', desc: 'I cannot access my account dashboard.', status: 'RESOLVED' },
            { subject: 'Payment Confirmation', category: 'Billing', desc: 'Need confirmation of my last payment.', status: 'PENDING' },
        ];

        const ticketIds = [];
        for (let i = 0; i < ticketSubjects.length; i++) {
            const customer = approvedCustomers[i % approvedCustomers.length];
            const ticket = ticketSubjects[i];
            const result = await db.run(`
        INSERT INTO support_tickets (customerId, subject, category, description, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
                customer.id, ticket.subject, ticket.category, ticket.desc, ticket.status,
                new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            ]);
            ticketIds.push(result.lastID);
            console.log(`  ✅ Created ticket: ${ticket.subject} (${ticket.status})`);
        }

        // ========== TICKET RESPONSES ==========
        console.log('\n💬 Creating ticket responses...');
        const adminUser = await db.get('SELECT id FROM users WHERE email = ?', ['admin@test.com']);
        for (const ticketId of ticketIds.slice(0, 4)) {
            await db.run(`
        INSERT INTO ticket_responses (ticketId, senderId, message, createdAt)
        VALUES (?, ?, ?, ?)
      `, [
                ticketId, adminUser.id, 'Thank you for reaching out. We are looking into this.',
                new Date().toISOString()
            ]);
        }
        console.log('  ✅ Created responses for resolved/in-progress tickets');

        // ========== LEADS ==========
        console.log('\n🎯 Creating vendor leads...');
        const approvedVendors = vendorIds.filter(v => v.status === 'APPROVED');
        const leadTemplates = [
            { name: 'Ravi Shankar', contact: '9811000011 | ravi.s@lead.com', location: 'Sector 18, Noida', status: 'New' },
            { name: 'Deepika Roy', contact: '9811000012 | deepika.r@lead.com', location: 'Dwarka, Delhi', status: 'Contacted' },
            { name: 'Suresh Babu', contact: '9811000013 | suresh.b@lead.com', location: 'Anna Nagar, Chennai', status: 'Meeting Scheduled' },
            { name: 'Neha Agarwal', contact: '9811000014 | neha.a@lead.com', location: 'Banjara Hills, Hyderabad', status: 'Proposal Sent' },
            { name: 'Karthik Menon', contact: '9811000015 | karthik.m@lead.com', location: 'Indiranagar, Bangalore', status: 'New' },
            { name: 'Pooja Desai', contact: '9811000016 | pooja.d@lead.com', location: 'Satellite, Ahmedabad', status: 'Contacted' },
            { name: 'Manish Joshi', contact: '9811000017 | manish.j@lead.com', location: 'Civil Lines, Jaipur', status: 'New' },
            { name: 'Swati Kulkarni', contact: '9811000018 | swati.k@lead.com', location: 'Koramangala, Bangalore', status: 'Meeting Scheduled' },
        ];

        for (const vendor of approvedVendors) {
            for (let i = 0; i < 5; i++) {
                const lead = leadTemplates[Math.floor(Math.random() * leadTemplates.length)];
                await db.run(`
          INSERT INTO leads (vendorId, name, contact, location, assignedDate, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
                    vendor.id, lead.name, lead.contact, lead.location,
                    new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    lead.status
                ]);
            }
            console.log(`  ✅ Created leads for vendor ID ${vendor.id}`);
        }

        // ========== AUDIT LOGS ==========
        console.log('\n📝 Creating audit logs...');
        const auditActions = [
            { action: 'CUSTOMER_STATUS_CHANGE', details: '{"previous":"Pending","new":"Approved"}' },
            { action: 'ALLOCATION_CHANGE', details: '{"previous":1000,"new":1500}' },
            { action: 'TICKET_REPLY', details: '{"ticketId":1,"message":"Issue resolved"}' },
            { action: 'VENDOR_APPROVED', details: '{"vendorId":2}' },
            { action: 'CUSTOMER_CREATED', details: '{"customerId":5}' },
        ];

        for (let i = 0; i < 10; i++) {
            const action = auditActions[Math.floor(Math.random() * auditActions.length)];
            await db.run(`
        INSERT INTO audit_logs (adminId, actionType, targetId, details, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `, [
                adminUser.id, action.action, Math.floor(Math.random() * 10) + 1, action.details,
                new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            ]);
        }
        console.log('  ✅ Created 10 audit log entries');

        console.log('\n✅ Database seeding completed!\n');
        console.log('📊 SUMMARY:');
        console.log(`   - Customers: ${customers.length} (${approvedCustomers.length} approved)`);
        console.log(`   - Vendors: ${vendors.length} (${approvedVendors.length} approved)`);
        console.log(`   - Subscriptions: ${approvedCustomers.length}`);
        console.log(`   - Consumption Logs: ${approvedCustomers.length * months.length}`);
        console.log(`   - Support Tickets: ${ticketSubjects.length}`);
        console.log(`   - Leads: ${approvedVendors.length * 5}`);
        console.log(`   - Audit Logs: 10`);

    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log('⚠️ Some records already exist. Skipping duplicates.');
        } else {
            console.error('❌ Error:', err);
        }
    } finally {
        await db.close();
    }
}

seedDatabase();
