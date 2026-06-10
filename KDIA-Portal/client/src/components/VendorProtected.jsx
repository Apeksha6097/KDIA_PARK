import React from 'react';
import RoleProtectedRoute from './RoleProtectedRoute';

const VendorProtected = ({ children }) => (
    <RoleProtectedRoute portal="vendor" allowedRoles={['vendor']}>
        {children}
    </RoleProtectedRoute>
);

export default VendorProtected;
