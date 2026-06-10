import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, ROLES, ROLE_LABELS, logAdminAction } from '../../config/rbac';
import Toast from '../../components/Toast';

const AdminSettings = () => {
    const { user } = useAuth();
    
    // Init state for Role: Admins default to Support role since they can't create Admin or Super Admin
    const initialRole = user?.role === ROLES.SUPER_ADMIN ? ROLES.ADMIN : ROLES.SUPPORT;
    const [newRole, setNewRole] = useState(initialRole);
    
    // Form field states
    const [formState, setFormState] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        tempPassword: '',
        status: 'Active',
        
        // Vendor-specific
        companyName: '',
        contactPerson: '',
        gstNumber: '',
        panNumber: '',
        address: '',
        serviceArea: ''
    });

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

    const canManageRbac = hasPermission(user?.role, 'manage_rbac_settings');
    const canCreateSuperAdmin = hasPermission(user?.role, 'create_super_admin');

    const getAssignableRoles = () => {
        if (user?.role === ROLES.SUPER_ADMIN) {
            const roles = [
                { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
                { value: ROLES.SUPPORT, label: ROLE_LABELS[ROLES.SUPPORT] },
                { value: ROLES.VENDOR, label: ROLE_LABELS[ROLES.VENDOR] },
                { value: ROLES.CUSTOMER, label: ROLE_LABELS[ROLES.CUSTOMER] },
            ];
            if (canCreateSuperAdmin) {
                roles.unshift({ value: ROLES.SUPER_ADMIN, label: ROLE_LABELS[ROLES.SUPER_ADMIN] });
            }
            return roles;
        } else if (user?.role === ROLES.ADMIN) {
            return [
                { value: ROLES.SUPPORT, label: ROLE_LABELS[ROLES.SUPPORT] },
                { value: ROLES.VENDOR, label: ROLE_LABELS[ROLES.VENDOR] },
            ];
        }
        return [];
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formState.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formState.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formState.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^[0-9+-\s]{10,15}$/.test(formState.mobileNumber)) {
            newErrors.mobileNumber = 'Invalid mobile number format';
        }
        if (!formState.tempPassword.trim()) {
            newErrors.tempPassword = 'Temporary password is required';
        } else if (formState.tempPassword.length < 6) {
            newErrors.tempPassword = 'Password must be at least 6 characters';
        }

        // Vendor Specific validation
        if (newRole === ROLES.VENDOR) {
            if (!formState.companyName.trim()) newErrors.companyName = 'Company name is required';
            if (!formState.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
            if (!formState.gstNumber.trim()) {
                newErrors.gstNumber = 'GST number is required';
            } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formState.gstNumber)) {
                newErrors.gstNumber = 'Invalid Indian GSTIN format';
            }
            if (!formState.panNumber.trim()) {
                newErrors.panNumber = 'PAN is required';
            } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formState.panNumber)) {
                newErrors.panNumber = 'Invalid Indian PAN format';
            }
            if (!formState.address.trim()) newErrors.address = 'Business address is required';
            if (!formState.serviceArea.trim()) newErrors.serviceArea = 'Service area is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        
        // Security Gate check
        if (newRole === ROLES.SUPER_ADMIN && !canCreateSuperAdmin) {
            setToast({ type: 'error', message: 'Access denied: Admin users cannot create Super Admin accounts.' });
            return;
        }

        if (!validateForm()) {
            setToast({ type: 'error', message: 'Please correct the validation errors in the form.' });
            return;
        }

        const idSuffix = Date.now().toString().slice(-6);
        const isActive = formState.status === 'Active';

        if (newRole === ROLES.VENDOR) {
            const newVendor = {
                id: `VND-${idSuffix}`,
                fullName: formState.fullName,
                email: formState.email,
                mobileNumber: formState.mobileNumber,
                role: ROLES.VENDOR,
                isActive: isActive,
                createdAt: new Date().toISOString(),
                consumerId: `VEND-ID-${idSuffix}`,
                approval_status: 'APPROVED',
                companyName: formState.companyName,
                contactPerson: formState.contactPerson,
                gstNumber: formState.gstNumber,
                panNumber: formState.panNumber,
                address: formState.address,
                serviceArea: formState.serviceArea,
            };

            const createdVendors = JSON.parse(localStorage.getItem('kdia_created_vendors') || '[]');
            createdVendors.unshift(newVendor);
            localStorage.setItem('kdia_created_vendors', JSON.stringify(createdVendors));
            
            // Sync status overrides
            const overrides = JSON.parse(localStorage.getItem('kdia_vendor_status_overrides') || '{}');
            overrides[newVendor.id] = isActive;
            localStorage.setItem('kdia_vendor_status_overrides', JSON.stringify(overrides));

            logAdminAction(`New vendor user created`, user?.fullName || 'Admin User', formState.email, ROLES.VENDOR, 'Success');

        } else if (newRole === ROLES.SUPPORT) {
            const newSupport = {
                id: `SUP-${idSuffix}`,
                name: formState.fullName,
                fullName: formState.fullName,
                email: formState.email,
                mobileNumber: formState.mobileNumber,
                role: ROLES.SUPPORT,
                status: formState.status,
                isActive: isActive,
                resolvedCount: 0,
            };

            const createdSupport = JSON.parse(localStorage.getItem('kdia_created_support_users') || '[]');
            createdSupport.unshift(newSupport);
            localStorage.setItem('kdia_created_support_users', JSON.stringify(createdSupport));

            // Sync with local support users list
            const localUsers = JSON.parse(localStorage.getItem('kdia_support_users') || '[]');
            localUsers.unshift(newSupport);
            localStorage.setItem('kdia_support_users', JSON.stringify(localUsers));

            logAdminAction(`New support user created`, user?.fullName || 'Admin User', formState.email, ROLES.SUPPORT, 'Success');
        }

        setToast({ 
            type: 'success', 
            message: `User Account "${formState.fullName}" created successfully as ${ROLE_LABELS[newRole]}.` 
        });

        // Reset form inputs
        setFormState({
            fullName: '',
            email: '',
            mobileNumber: '',
            tempPassword: '',
            status: 'Active',
            companyName: '',
            contactPerson: '',
            gstNumber: '',
            panNumber: '',
            address: '',
            serviceArea: ''
        });
        setErrors({});
    };

    const labelStyle = {
        display: 'block', 
        fontSize: '0.75rem', 
        fontWeight: '800', 
        color: '#64748b', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em',
        marginBottom: '6px'
    };

    const inputStyle = (hasError) => ({
        width: '100%', 
        padding: '12px 16px', 
        borderRadius: '10px', 
        border: `1px solid ${hasError ? '#ef4444' : '#e2e8f0'}`,
        outline: 'none',
        fontSize: '0.95rem',
        color: '#1e293b',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s'
    });

    const errorStyle = {
        color: '#ef4444', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        marginTop: '4px'
    };

    const assignableRoles = getAssignableRoles();

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a202c', marginBottom: '8px' }}>
                System Settings & RBAC
            </h1>
            <p style={{ color: '#718096', marginBottom: '24px' }}>
                Manage users, roles, and system-level permissions.
            </p>

            {/* Super Admin gate messages */}
            {user?.role === ROLES.ADMIN && (
                <div style={{
                    marginBottom: '28px',
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                    border: '1px solid #fcd34d',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }}>🔒</span>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#92400e', marginBottom: '4px' }}>
                            RBAC Management — Super Admin Gate Active
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#b45309', lineHeight: '1.5' }}>
                            Logged in as <strong>Admin</strong>. You can create <strong>Vendor</strong> and <strong>Support</strong> accounts, but you cannot assign Admin/Super Admin roles or modify system-wide permissions matrices.
                        </div>
                    </div>
                </div>
            )}

            {user?.role === ROLES.SUPER_ADMIN && (
                <div style={{
                    marginBottom: '28px',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
                    border: '1px solid #c4b5fd',
                    borderLeft: '4px solid #7c3aed',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#4338ca',
                }}>
                    <span>👑</span> Super Admin — Full RBAC user creation privileges active.
                </div>
            )}

            <div style={{ display: 'grid', gap: '24px', maxWidth: '850px', marginBottom: '40px' }}>
                <section style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a' }}>Create User Account</h2>
                    
                    <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Common Section Headers */}
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
                                📑 Basic Account Parameters
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter full name"
                                        value={formState.fullName}
                                        onChange={handleInputChange}
                                        style={inputStyle(errors.fullName)}
                                    />
                                    {errors.fullName && <div style={errorStyle}>{errors.fullName}</div>}
                                </div>
                                
                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@kdia.com"
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        style={inputStyle(errors.email)}
                                    />
                                    {errors.email && <div style={errorStyle}>{errors.email}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Mobile Number *</label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        placeholder="9876543210"
                                        value={formState.mobileNumber}
                                        onChange={handleInputChange}
                                        style={inputStyle(errors.mobileNumber)}
                                    />
                                    {errors.mobileNumber && <div style={errorStyle}>{errors.mobileNumber}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Account Role *</label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => {
                                            setNewRole(e.target.value);
                                            setErrors({});
                                        }}
                                        style={inputStyle(false)}
                                    >
                                        {assignableRoles.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Temporary Password *</label>
                                    <input
                                        type="password"
                                        name="tempPassword"
                                        placeholder="Min 6 characters"
                                        value={formState.tempPassword}
                                        onChange={handleInputChange}
                                        style={inputStyle(errors.tempPassword)}
                                    />
                                    {errors.tempPassword && <div style={errorStyle}>{errors.tempPassword}</div>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Status *</label>
                                    <select
                                        name="status"
                                        value={formState.status}
                                        onChange={handleInputChange}
                                        style={inputStyle(false)}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Vendor-Specific Section */}
                        {newRole === ROLES.VENDOR && (
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
                                    🏢 Sales Partner / Vendor Configuration
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Company Name *</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            placeholder="Solar Solutions Private Ltd"
                                            value={formState.companyName}
                                            onChange={handleInputChange}
                                            style={inputStyle(errors.companyName)}
                                        />
                                        {errors.companyName && <div style={errorStyle}>{errors.companyName}</div>}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Contact Person *</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            placeholder="Spokesperson name"
                                            value={formState.contactPerson}
                                            onChange={handleInputChange}
                                            style={inputStyle(errors.contactPerson)}
                                        />
                                        {errors.contactPerson && <div style={errorStyle}>{errors.contactPerson}</div>}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>GST Number *</label>
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            placeholder="07AAAAA1111A1Z1"
                                            value={formState.gstNumber}
                                            onChange={handleInputChange}
                                            style={inputStyle(errors.gstNumber)}
                                        />
                                        {errors.gstNumber && <div style={errorStyle}>{errors.gstNumber}</div>}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>PAN Number *</label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            placeholder="ABCDE1234F"
                                            value={formState.panNumber}
                                            onChange={handleInputChange}
                                            style={inputStyle(errors.panNumber)}
                                        />
                                        {errors.panNumber && <div style={errorStyle}>{errors.panNumber}</div>}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Service Area *</label>
                                        <input
                                            type="text"
                                            name="serviceArea"
                                            placeholder="Agra / Lucknow / Noida"
                                            value={formState.serviceArea}
                                            onChange={handleInputChange}
                                            style={inputStyle(errors.serviceArea)}
                                        />
                                        {errors.serviceArea && <div style={errorStyle}>{errors.serviceArea}</div>}
                                    </div>

                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Business Address *</label>
                                        <textarea
                                            name="address"
                                            placeholder="Complete street address..."
                                            value={formState.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            style={{ ...inputStyle(errors.address), fontFamily: 'inherit', resize: 'vertical' }}
                                        />
                                        {errors.address && <div style={errorStyle}>{errors.address}</div>}
                                    </div>

                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={labelStyle}>Partner Documents</label>
                                        <div style={{
                                            padding: '24px', 
                                            background: '#f8fafc', 
                                            border: '1px dashed #cbd5e1', 
                                            borderRadius: '12px', 
                                            textAlign: 'center', 
                                            fontSize: '0.85rem', 
                                            color: '#64748b',
                                            fontWeight: '600'
                                        }}>
                                            📄 Uploaded Business Verification Certificates (GST, PAN, SLA)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '12px' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '14px 28px',
                                    background: '#0f766e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d5a54'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f766e'}
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AdminSettings;
