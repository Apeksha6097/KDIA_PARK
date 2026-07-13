import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import AdminAllocationModal from '../../components/AdminAllocationModal';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmModal, setConfirmModal] = useState({ show: false, customer: null });
    const [allocationModal, setAllocationModal] = useState({ show: false, customer: null });
    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/admin/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch customers');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCustomers();
    }, [token]);

    const handleToggleStatus = async () => {
        if (!confirmModal.customer) return;
        setUpdating(true);
        try {
            await api.patch(`/admin/customers/${confirmModal.customer.id}/status`,
                { isActive: !confirmModal.customer.isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConfirmModal({ show: false, customer: null });
            setToast({ message: 'Customer status updated successfully.', type: 'success' });
            fetchCustomers();
        } catch (err) {
            setToast({ message: err.response?.data?.error || 'Failed to update status', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const confirmStatusChange = () => {
        if (confirmModal.customer) {
            handleToggleStatus();
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.consumerId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading customers...</div>;
    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', color: '#c53030', margin: '24px 0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System Error</div>
            <div style={{ fontSize: '0.9rem' }}>{error}</div>
        </div>
    );

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.show}
                onClose={() => setConfirmModal({ show: false, customer: null })}
                onConfirm={confirmStatusChange}
                title={confirmModal.customer?.isActive ? "Deactivate Customer" : "Activate Customer"}
                message={`Are you sure you want to ${confirmModal.customer?.isActive ? 'deactivate' : 'activate'} ${confirmModal.customer?.fullName}? ${confirmModal.customer?.isActive ? 'They will lose portal access.' : 'Access will be restored.'}`}
                type={confirmModal.customer?.isActive ? 'danger' : 'success'}
                confirmText={confirmModal.customer?.isActive ? 'Deactivate' : 'Activate'}
            />

            {allocationModal.show && (
                <AdminAllocationModal
                    customer={allocationModal.customer}
                    onClose={() => setAllocationModal({ show: false, customer: null })}
                    onRefresh={fetchCustomers}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Customer Directory</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Manage customer accounts, allocations, and service compliance.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 12px 10px 40px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                width: '300px',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '500' }}>
                        {filteredCustomers.length} Records
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase' }}>Consumer ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase' }}>Allocation</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase' }}>Approval</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600', color: '#4a5568', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
                                    No customer records found matching your current parameters.
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '600', color: '#2d3748' }}>{customer.fullName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>{customer.email}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <code style={{ background: '#edf2f7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: '#4a5568' }}>
                                            {customer.consumerId}
                                        </code>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {customer.allocationStatus === 'ACTIVE' ? (
                                                <>
                                                    <div style={{ color: '#059669', fontWeight: '700', fontSize: '0.9rem' }}>{customer.allocatedEnergy} kWh</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#166534', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px', textTransform: 'uppercase', fontWeight: '800', border: '1px solid #bbf7d0' }}>Managed by KDIA</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Not Assigned</div>
                                                    {customer.approval_status === 'APPROVED' && (
                                                        <button
                                                            onClick={() => setAllocationModal({ show: true, customer })}
                                                            style={{
                                                                fontSize: '0.7rem', color: '#059669', background: 'none', border: 'none',
                                                                padding: 0, textDecoration: 'underline', cursor: 'pointer', fontWeight: '800', textAlign: 'left'
                                                            }}
                                                        >
                                                            Assign Now
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <StatusBadge
                                            status={customer.approval_status || 'APPROVED'}
                                            customLabel={customer.approval_status === 'PENDING' ? 'Admin Action Required' : null}
                                        />
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div onClick={() => setConfirmModal({ show: true, customer })} style={{ cursor: 'pointer' }}>
                                            <StatusBadge status={customer.isActive ? 'ACTIVE' : 'INACTIVE'} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/admin/customers/${customer.id}`)}
                                            style={{
                                                background: '#fff',
                                                color: '#0f172a',
                                                border: '1px solid #e2e8f0',
                                                padding: '6px 16px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = '#94a3b8';
                                                e.currentTarget.style.background = '#f8fafc';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.background = '#fff';
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomers;
