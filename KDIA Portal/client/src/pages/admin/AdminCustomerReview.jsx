import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import AdminAllocationModal from '../../components/AdminAllocationModal';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import LifecycleTimeline from '../../components/LifecycleTimeline';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminCustomerReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showAllocationModal, setShowAllocationModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    // UI State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'primary', title: '', message: '', onConfirm: () => { } });
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (token) fetchCustomerDetails();
    }, [id, token]);

    const fetchCustomerDetails = async () => {
        try {
            const response = await api.get(`/admin/customers/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCustomer(response.data.profile);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setLoading(false);
        }
    };

    const confirmApprove = () => {
        setConfirmModal({
            isOpen: true,
            type: 'success',
            title: 'Approve Customer',
            message: 'Are you sure you want to approve this customer? They will gain full portal access.',
            onConfirm: handleApprove
        });
    };

    const handleApprove = async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setProcessing(true);
        try {
            await api.post(`/admin/customers/${id}/approve`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setToast({ message: 'Customer approved successfully.', type: 'success' });
            setTimeout(() => navigate('/admin/approvals'), 1500);
        } catch (err) {
            setToast({ message: err.response?.data?.error || err.message, type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setToast({ message: 'Please provide a rejection reason.', type: 'warning' });
            return;
        }

        setProcessing(true);
        try {
            await api.post(`/admin/customers/${id}/reject`,
                { reason: rejectionReason },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setToast({ message: 'Application rejected.', type: 'success' });
            setShowRejectModal(false);
            setTimeout(() => navigate('/admin/approvals'), 1500);
        } catch (err) {
            setToast({ message: err.response?.data?.error || err.message, type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading application details...</div>;
    if (error) return <div style={{ padding: '40px', color: '#ef4444' }}>Error: {error}</div>;
    if (!customer) return <div style={{ padding: '40px' }}>Customer not found.</div>;

    return (
        <div className="customer-review">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
            />

            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <button
                        onClick={() => navigate('/admin/approvals')}
                        style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: 0 }}
                    >
                        ← Back to Approvals
                    </button>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Review Application</h1>
                    <p style={{ color: '#64748b' }}>Application submitted on {formatDate(customer.createdAt)}</p>
                </div>
                {customer.approval_status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            disabled={processing}
                            style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Reject Application
                        </button>
                        <button
                            onClick={confirmApprove}
                            disabled={processing}
                            style={{ padding: '12px 24px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                        >
                            {processing ? 'Processing...' : 'Approve Customer'}
                        </button>
                    </div>
                )}
                {customer.approval_status === 'APPROVED' && !customer.allocationStatus && (
                    <button
                        onClick={() => setShowAllocationModal(true)}
                        style={{ padding: '12px 24px', background: '#059669', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)' }}
                    >
                        Assign Solar Allocation
                    </button>
                )}
            </div>

            {/* Lifecycle Timeline */}
            <div style={{ marginBottom: '32px', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</h3>
                <LifecycleTimeline
                    status={customer.approval_status === 'APPROVED' ? (customer.allocationStatus === 'ACTIVE' ? 'ACTIVE' : 'APPROVED') : 'PENDING'}
                    hasAllocation={customer.allocationStatus === 'ACTIVE'}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Basic Info */}
                    <section style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>Personal Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Full Name</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.fullName}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Email Address</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Mobile Number</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.mobileNumber}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Date of Birth</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.dob}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Gender</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.gender}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Consumer ID (Draft)</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.consumerId}</div>
                            </div>
                        </div>
                    </section>

                    {/* Address Info */}
                    <section style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>Service Location</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Address</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.address_line_1}</div>
                                {customer.address_line_2 && <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.address_line_2}</div>}
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>City</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.city}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>State</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.state}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>PIN Code</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.pin_code}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Location Type</label>
                                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{customer.location_type || 'Residential'}</div>
                            </div>
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Onboarding Details */}
                    <section style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Onboarding Context</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Source</label>
                                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>
                                    {customer.vendorName ? 'Vendor Subscribed' : 'Direct Registration'}
                                </div>
                            </div>
                            {customer.vendorName && (
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Sales Partner</label>
                                    <div style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '700' }}>{customer.vendorName}</div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>This customer was onboarded by a KDIA Sales Partner.</p>
                                </div>
                            )}
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Compliance Check</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.85rem', fontWeight: '600' }}>
                                    <span style={{ fontSize: '1rem' }}>✓</span> Age verified (18+)
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Allocation Info (Phase 7) */}
                    <section style={{ background: customer.allocationStatus === 'ACTIVE' ? '#f0fdf4' : '#f8fafc', padding: '32px', borderRadius: '16px', border: customer.allocationStatus === 'ACTIVE' ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Solar Allocation</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Allocation Status</label>
                                <div style={{ fontSize: '1rem', color: customer.allocationStatus === 'ACTIVE' ? '#059669' : '#64748b', fontWeight: '700' }}>
                                    {customer.allocationStatus === 'ACTIVE' ? 'Active' : 'Not Assigned'}
                                </div>
                            </div>
                            {customer.allocationStatus === 'ACTIVE' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Monthly Energy (kWh)</label>
                                        <div style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>{customer.allocatedEnergy} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>kWh / mo</span></div>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>This allocation is managed by KDIA. Administrative changes only.</p>
                                </>
                            )}
                        </div>
                    </section>

                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #ef4444', opacity: customer.approval_status === 'REJECTED' ? 1 : 0.5 }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444', marginBottom: '12px' }}>Risk Assessment</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>If rejected, the customer will be unable to log in and all services will remain suspended.</p>
                    </div>
                </div>
            </div>

            {showAllocationModal && (
                <AdminAllocationModal
                    customer={customer}
                    onClose={() => setShowAllocationModal(false)}
                    onRefresh={fetchCustomerDetails}
                />
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Reject Application</h2>
                        <label style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', display: 'block' }}>Please provide a reason for rejection (visible to admins and in audit logs):</label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontFamily: 'inherit' }}
                            placeholder="e.g. Invalid address proof, duplicate application..."
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                style={{ padding: '8px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                style={{ padding: '8px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                {processing ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomerReview;
