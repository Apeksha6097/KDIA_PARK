import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const AdminVendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const [confirmApprove, setConfirmApprove] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const fetchVendor = async () => {
        try {
            const response = await api.get(`/admin/vendors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVendor(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch vendor details');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchVendor();
    }, [id, token]);

    const handleApprove = async () => {
        setConfirmApprove(false);
        setSubmitting(true);
        try {
            await api.post(`/admin/vendors/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ message: 'Sales Partner approved successfully.', type: 'success' });
            fetchVendor();
        } catch (err) {
            setToast({ message: 'Failed to approve vendor.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            setToast({ message: 'Please provide a rejection reason.', type: 'warning' });
            return;
        }
        setSubmitting(true);
        try {
            await api.post(`/admin/vendors/${id}/reject`, {
                reason: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowRejectModal(false);
            setToast({ message: 'Application rejected.', type: 'success' });
            fetchVendor();
        } catch (err) {
            setToast({ message: 'Failed to reject application.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading vendor application...</div>;
    if (error || !vendor) return <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>{error || 'Vendor not found'}</div>;

    const isPending = vendor.approval_status === 'PENDING';

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <ConfirmModal
                isOpen={confirmApprove}
                onClose={() => setConfirmApprove(false)}
                onConfirm={handleApprove}
                title="Confirm Approval"
                message={`Are you sure you want to approve ${vendor.fullName} as an authorized Sales Partner?`}
                type="success"
                confirmText="Yes, Approve"
            />

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/admin/vendors')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    ← Back to Vendor Management
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#0f172a' }}>Sales Partner Application Review</h1>
                        <p style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '600', marginTop: '4px' }}>
                            Individual Salesperson Application
                        </p>
                    </div>
                    <StatusBadge status={vendor.approval_status} />
                </div>
            </div>

            {/* Info Card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Application Details</h3>
                </div>

                <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <DetailItem label="Full Name" value={vendor.fullName} />
                    <DetailItem label="Email Address" value={vendor.email} />
                    <DetailItem label="System ID" value={`#VND-${vendor.id}`} />
                    <DetailItem label="Consumer ID (Reference)" value={vendor.consumerId || 'N/A'} />
                    <DetailItem label="Application Date" value={new Date(vendor.createdAt).toLocaleDateString()} />
                    <DetailItem label="Account Status" value={vendor.isActive ? 'Active' : 'Inactive'} />
                </div>

                {vendor.approval_status === 'REJECTED' && vendor.rejection_reason && (
                    <div style={{ margin: '0 32px 32px 32px', padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase', marginBottom: '4px' }}>Rejection Reason</div>
                        <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{vendor.rejection_reason}</p>
                    </div>
                )}

                <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                        <span>This application represents an individual salesperson, not a company.</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isPending && (
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => setConfirmApprove(true)}
                        style={{
                            flex: 1,
                            background: '#059669',
                            color: '#fff',
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background 0.2s'
                        }}
                    >
                        Approve Sales Partner
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        style={{
                            flex: 1,
                            background: '#fff',
                            color: '#dc2626',
                            padding: '14px',
                            borderRadius: '10px',
                            border: '2px solid #fee2e2',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Reject Application
                    </button>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Reject Application</h2>
                        <label style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', display: 'block' }}>Please provide a reason for rejection:</label>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontFamily: 'inherit' }}
                            placeholder="e.g. Incomplete documentation..."
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={submitting}
                                style={{ padding: '8px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={submitting}
                                style={{ padding: '8px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            {label}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
            {value}
        </div>
    </div>
);

export default AdminVendorDetail;
