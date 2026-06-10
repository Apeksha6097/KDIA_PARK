/**
 * RBAC verification script — run: node scripts/rbac-test.mjs
 */
import {
    authenticateDemoUser,
    canAccessPortal,
    getDashboardPath,
    hasPermission,
    PORTAL_ACCESS,
    ROLES,
} from '../src/config/rbac.js';

const results = [];

function assert(name, condition) {
    results.push({ name, pass: !!condition });
    if (!condition) console.error(`FAIL: ${name}`);
}

// Credential auth
assert('super_admin login', authenticateDemoUser('superadmin@kdia.com', 'Super@123').success);
assert('admin login', authenticateDemoUser('admin@kdia.com', 'Admin@123').success);
assert('support login', authenticateDemoUser('support@kdia.com', 'Support@123').success);
assert('vendor login', authenticateDemoUser('vendor@kdia.com', 'Vendor@123').success);
assert('customer login', authenticateDemoUser('customer@kdia.com', 'Customer@123').success);
assert('invalid password rejected', !authenticateDemoUser('customer@kdia.com', 'wrong').success);

// Portal access matrix
assert('customer cannot access admin', !canAccessPortal(ROLES.CUSTOMER, 'admin'));
assert('vendor cannot access support', !canAccessPortal(ROLES.VENDOR, 'support'));
assert('support cannot access admin', !canAccessPortal(ROLES.SUPPORT, 'admin'));
assert('admin can access admin', canAccessPortal(ROLES.ADMIN, 'admin'));
assert('super_admin can access all portals', ['admin', 'support', 'vendor', 'customer'].every((p) => canAccessPortal(ROLES.SUPER_ADMIN, p)));

// Permissions
assert('admin cannot create super admin', !hasPermission(ROLES.ADMIN, 'create_super_admin'));
assert('super_admin can create super admin', hasPermission(ROLES.SUPER_ADMIN, 'create_super_admin'));
assert('admin cannot manage rbac', !hasPermission(ROLES.ADMIN, 'manage_rbac_settings'));
assert('support cannot manage subscriptions', !hasPermission(ROLES.SUPPORT, 'manage_subscriptions'));

// Redirect paths
assert('customer dashboard path', getDashboardPath(ROLES.CUSTOMER) === '/dashboard');
assert('admin dashboard path', getDashboardPath(ROLES.ADMIN) === '/admin/dashboard');
assert('super_admin dashboard path', getDashboardPath(ROLES.SUPER_ADMIN) === '/admin/dashboard');

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log('\n=== RBAC Test Results ===');
console.log(`Passed: ${passed}/${results.length}`);
if (failed.length) {
    failed.forEach((f) => console.log(`  - ${f.name}`));
    process.exit(1);
}
console.log('All automated RBAC checks passed.\n');
