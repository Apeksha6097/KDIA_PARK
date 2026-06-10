import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import { logAdminAction } from '../../config/rbac';

const MOCK_SUPPORT_USERS = [
    { id: 'SUP-001', name: 'John Doe', email: 'john@kdia.com', status: 'Active', shift: 'Morning', resolvedCount: 120, isActive: true },
    { id: 'SUP-002', name: 'Jane Smith', email: 'jane@kdia.com', status: 'Active', shift: 'Evening', resolvedCount: 95, isActive: true },
    { id: 'SUP-003', name: 'Robert Johnson', email: 'robert@kdia.com', status: 'Inactive', shift: 'Night', resolvedCount: 45, isActive: false },
];

const AdminSupportUsers = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    
    // We keep these states from original modal for consistency if needed, though Settings -> Create User is now the main creator
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserShift, setNewUserShift] = useState('Morning');

    const fetchSupportUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/support-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const created = JSON.parse(localStorage.getItem('kdia_created_support_users') || '[]');
            
            // Apply status overrides if saved in localStorage
            const localUsersStr = localStorage.getItem('kdia_support_users');
            const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
            
            const merged = [...created, ...response.data].map(user => {
                const match = localUsers.find(lu => lu.id === user.id);
                if (match) {
                    return { ...user, status: match.status, isActive: match.isActive };
                }
                return { ...user, isActive: user.status === 'Active' };
            });
            
            setUsers(merged);
            setLoading(false);
        } catch (err) {
            // Fallback to offline / demo mock data
            const created = JSON.parse(localStorage.getItem('kdia_created_support_users') || '[]');
            const localUsersStr = localStorage.getItem('kdia_support_users');
            const localUsers = localUsersStr ? JSON.parse(localUsersStr) : MOCK_SUPPORT_USERS;
            
            // Merge created support users with local/mock users
            const merged = [...created];
            localUsers.forEach(lu => {
                if (!merged.some(m => m.id === lu.id || m.email === lu.email)) {
                    merged.push(lu);
                }
            });
            
            setUsers(merged);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupportUsers();
    }, [token]);

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const newIsActive = newStatus === 'Active';
        
        // Find support user email for logging
        const supportUser = users.find(u => u.id === userId);
        const email = supportUser ? supportUser.email : 'unknown@support.com';
        
        // Log to audit logs
        logAdminAction(newIsActive ? 'Support User Activated' : 'Support User Deactivated', email, 'Support', 'Success');
        logAdminAction('User Status Changed', email, 'Support', newStatus);
        
        // 1. Update React state immediately
        const updatedUsers = users.map(u => 
            u.id === userId 
                ? { ...u, status: newStatus, isActive: newIsActive } 
                : u
        );
        setUsers(updatedUsers);
        
        // 2. Persist to localStorage
        localStorage.setItem('kdia_support_users', JSON.stringify(updatedUsers));
        
        // Update it in kdia_created_support_users too if it is a locally created agent
        const created = JSON.parse(localStorage.getItem('kdia_created_support_users') || '[]');
        const updatedCreated = created.map(u => 
            u.id === userId 
                ? { ...u, status: newStatus, isActive: newIsActive } 
                : u
        );
        localStorage.setItem('kdia_created_support_users', JSON.stringify(updatedCreated));
        
        // 3. Show success Toast
        setToast({ 
            message: `Support agent status updated to ${newStatus} successfully.`, 
            type: 'success' 
        });
        
        // 4. Try hiting backend API
        try {
            await api.patch(`/admin/support-users/${userId}/status`, { isActive: newIsActive }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.info("Using offline localStorage fallback for support status change.");
        }
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const idSuffix = Date.now().toString().slice(-6);
        const newUser = {
            id: `SUP-${idSuffix}`,
            name: newUserName,
            fullName: newUserName,
            email: newUserEmail,
            status: 'Active',
            isActive: true,
            shift: newUserShift,
            resolvedCount: 0,
            department: 'Customer Care',
            designation: 'Support Agent',
            supportLevel: 'L1',
            assignedRegion: 'Default Region'
        };
        
        // Log user creation
        logAdminAction('New Support User Created', newUserEmail, 'Support', 'Success');
        
        const updated = [newUser, ...users];
        setUsers(updated);
        
        // Save locally to created lists
        const created = JSON.parse(localStorage.getItem('kdia_created_support_users') || '[]');
        created.unshift(newUser);
        localStorage.setItem('kdia_created_support_users', JSON.stringify(created));
        localStorage.setItem('kdia_support_users', JSON.stringify(updated));


        setShowAddModal(false);
        setNewUserName('');
        setNewUserEmail('');
        
        setToast({
            message: `Support agent "${newUserName}" created successfully.`,
            type: 'success'
        });
    };

    if (loading) return (
        <AdminLayout>
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '1.2rem' }}>Loading support user list...</div>
            </div>
        </AdminLayout>
    );

    return (
        <div style={{ paddingBottom: '60px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>Support Users</h1>
                    <p style={{ color: '#718096' }}>Configure, monitor, and manage regional support agents.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        padding: '12px 24px',
                        background: '#022c22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    + Add Support Agent
                </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Agent ID</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Name</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Email</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Shift</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase' }}>Tickets Resolved</th>
                            <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 24px', fontWeight: '700', color: '#1a202c' }}>{u.id}</td>
                                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{u.name || u.fullName}</td>
                                <td style={{ padding: '16px 24px', color: '#4a5568' }}>{u.email}</td>
                                <td style={{ padding: '16px 24px', color: '#4a5568' }}>{u.shift}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        background: u.status === 'Active' ? '#e6fffa' : '#f8fafc',
                                        color: u.status === 'Active' ? '#319795' : '#64748b',
                                        border: u.status === 'Active' ? '1px solid #b2f5ea' : '1px solid #e2e8f0',
                                        textTransform: 'uppercase'
                                    }}>
                                        {u.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', fontWeight: '700', color: '#1a202c' }}>{u.resolvedCount || 0}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleToggleStatus(u.id, u.status)}
                                        style={{
                                            background: u.status === 'Active' ? '#fee2e2' : '#d1fae5',
                                            color: u.status === 'Active' ? '#b91c1c' : '#065f46',
                                            border: 'none',
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '450px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>Add New Support Agent</h3>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase', marginBottom: '6px' }}>Name</label>
                                <input
                                    type="text" required
                                    placeholder="Agent Name"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase', marginBottom: '6px' }}>Email</label>
                                <input
                                    type="email" required
                                    placeholder="agent@kdia.com"
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#718096', textTransform: 'uppercase', marginBottom: '6px' }}>Shift</label>
                                <select
                                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                    value={newUserShift}
                                    onChange={(e) => setNewUserShift(e.target.value)}
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '12px', background: '#022c22', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Create Agent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupportUsers;
