import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';

const AdminTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user: adminUser } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reply, setReply] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Profile Request Specific State
    const [requestDetails, setRequestDetails] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.get(`/admin/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setNewStatus(response.data.ticket.status);

            // Parse profile request details if applicable
            if (response.data.ticket.category === 'PROFILE_UPDATE_REQUEST') {
                try {
                    const details = JSON.parse(response.data.ticket.description);
                    setRequestDetails(details);
                } catch (e) {
                    console.error("Failed to parse request details", e);
                }
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to fetch ticket details');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [id, token]);

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/admin/tickets/${id}/reply`, {
                message: reply,
                updateStatus: newStatus !== data.ticket.status ? newStatus : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReply('');
            setToast({ message: 'Reply sent successfully.', type: 'success' });
            fetchData(); // Refresh history
        } catch (err) {
            setToast({ message: 'Failed to send reply.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (status) => {
        if (status === data.ticket.status) return;
        setSubmitting(true);
        try {
            await api.patch(`/admin/tickets/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setToast({ message: `Status updated to ${status}.`, type: 'success' });
            fetchData();
        } catch (err) {
            setToast({ message: 'Failed to update status.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const confirmApproveChange = () => {
        setShowConfirmModal(true);
    };

    const handleApproveChange = async () => {
        setShowConfirmModal(false);
        setSubmitting(true);
        try {
            await api.post(`/admin/tickets/${id}/approve-change`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ message: 'Changes approved and applied.', type: 'success' });
            fetchData();
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to approve changes.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRejectChange = async () => {
        if (!rejectReason) return;

        setSubmitting(true);
        try {
            await api.post(`/admin/tickets/${id}/reject-change`, {
                reason: rejectReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowRejectModal(false);
            setRejectReason('');
            setToast({ message: 'Request rejected.', type: 'success' });
            fetchData();
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to reject request.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading ticket details...</div>;
    if (error || !data) return <div style={{ color: 'red' }}>{error || 'Ticket not found'}</div>;

    const { ticket, responses } = data;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleApproveChange}
                title="Confirm Updates"
                message="Are you sure you want to approve and apply these profile changes? This action is irreversible."
                type="success"
                confirmText="Approve Changes"
            />

            {/* Header / Breadcrumb */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => navigate('/admin/tickets')}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    ← Back to Tickets
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Ticket Context Card */}
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.1em' }}>TICKET #TK-{1000 + ticket.id}</span>
                                <h1 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', fontWeight: '800', color: '#0f172a' }}>{ticket.subject}</h1>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {ticket.status === 'PENDING' && (
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        background: '#f59e0b',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
                                    }}>
                                        Admin Action Required
                                    </span>
                                )}
                                <StatusBadge status={ticket.status} />
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', gap: '32px' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Customer</div>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{ticket.customerName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{ticket.customerEmail}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Consumer ID</div>
                                    <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>{ticket.customerConsumerId}</code>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Category</div>
                                    <div style={{ fontWeight: '700', color: '#475569', fontSize: '0.9rem' }}>{ticket.category || ticket.subject}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Initial Message / Request Details */}
                    <div style={{ padding: '32px' }}>
                        {ticket.category === 'PROFILE_UPDATE_REQUEST' && requestDetails ? (
                            <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                                <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                                        Requested Profile Changes
                                    </h3>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', background: '#e2e8f0', padding: '4px 10px', borderRadius: '4px' }}>
                                        {requestDetails.type === 'contact' ? 'Contact Info' : 'Address'}
                                    </span>
                                </div>

                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                        {/* Current Values */}
                                        <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Current Data</div>
                                            {requestDetails.type === 'contact' ? (
                                                <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                                    <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Email:</span> {requestDetails.current.email}</div>
                                                    <div><span style={{ fontWeight: 600 }}>Mobile:</span> {requestDetails.current.mobile}</div>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                                    <div>{requestDetails.current.address1}</div>
                                                    <div>{requestDetails.current.address2}</div>
                                                    <div>{requestDetails.current.city}, {requestDetails.current.state} - {requestDetails.current.pin}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Requested Values */}
                                        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', marginBottom: '12px' }}>Requested Changes</div>
                                            {requestDetails.type === 'contact' ? (
                                                <div style={{ fontSize: '0.9rem', color: '#15803d' }}>
                                                    <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Email:</span> {requestDetails.requested.email}</div>
                                                    <div><span style={{ fontWeight: 600 }}>Mobile:</span> {requestDetails.requested.mobile}</div>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '0.9rem', color: '#15803d' }}>
                                                    <div>{requestDetails.requested.address1}</div>
                                                    <div>{requestDetails.requested.address2}</div>
                                                    <div>{requestDetails.requested.city}, {requestDetails.requested.state} - {requestDetails.requested.pin}</div>
                                                    <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Type: {requestDetails.requested.type}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Reason for Change</div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontStyle: 'italic' }}>
                                            "{requestDetails.reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{ticket.customerName} (Original Query)</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(ticket.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {ticket.description}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Response Thread */}
                    {responses.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '8px' }}>Response Thread</div>
                            {responses.map((resp, idx) => (
                                <div key={resp.id} style={{
                                    background: resp.senderRole === 'admin' ? '#f8fafc' : '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    marginLeft: resp.senderRole === 'admin' ? '40px' : '0',
                                    position: 'relative',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.85rem' }}>{resp.senderName}</span>
                                            {resp.senderRole === 'admin' && (
                                                <span style={{ background: '#0f172a', color: '#fff', fontSize: '0.6rem', fontWeight: '900', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Admin</span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(resp.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                        {resp.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply / Action Section */}
                    {ticket.status !== 'REVOKED' && ticket.status !== 'REJECTED' && (
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>

                            {ticket.category === 'PROFILE_UPDATE_REQUEST' && ticket.status !== 'RESOLVED' ? (
                                <div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Review Request</h3>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Approve to automatically update the profile, or reject with a reason.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button
                                            onClick={confirmApproveChange}
                                            disabled={submitting}
                                            style={{
                                                flex: 1,
                                                background: '#16a34a',
                                                color: '#fff',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontWeight: '700',
                                                fontSize: '0.9rem',
                                                cursor: submitting ? 'not-allowed' : 'pointer',
                                                opacity: submitting ? 0.7 : 1
                                            }}
                                        >
                                            ✓ Approve & Apply Changes
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={submitting}
                                            style={{
                                                flex: 1,
                                                background: '#fff',
                                                color: '#dc2626',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '2px solid #fee2e2',
                                                fontWeight: '700',
                                                fontSize: '0.9rem',
                                                cursor: submitting ? 'not-allowed' : 'pointer',
                                                opacity: submitting ? 0.7 : 1
                                            }}
                                        >
                                            ✕ Reject Request
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Respond to Customer</h3>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Provide a professional response. This will be visible to the customer.</p>
                                    </div>
                                    <form onSubmit={handleSendReply}>
                                        <textarea
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Type your response here..."
                                            style={{
                                                width: '100%',
                                                minHeight: '150px',
                                                padding: '16px',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit',
                                                outline: 'none',
                                                marginBottom: '16px',
                                                resize: 'vertical',
                                                background: '#fcfcfc'
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Set status to:</span>
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                                                >
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                    <option value="PENDING">Pending</option>
                                                </select>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting || !reply.trim()}
                                                style={{
                                                    background: '#0f172a',
                                                    color: '#fff',
                                                    padding: '10px 24px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    fontWeight: '700',
                                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                                    opacity: submitting || !reply.trim() ? 0.6 : 1,
                                                    boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)'
                                                }}
                                            >
                                                {submitting ? 'Sending...' : 'Post Reply'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ticket Status</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((s) => {
                                const config = {
                                    PENDING: { color: '#f59e0b' },
                                    IN_PROGRESS: { color: '#3b82f6' },
                                    RESOLVED: { color: '#10b981' },
                                    REJECTED: { color: '#ef4444' }
                                }[s] || { color: '#64748b' };

                                return (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        disabled={submitting || ticket.status === 'REVOKED' || s === ticket.status}
                                        style={{
                                            padding: '10px',
                                            textAlign: 'left',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: submitting || ticket.status === 'REVOKED' || s === ticket.status ? 'default' : 'pointer',
                                            background: s === ticket.status ? '#f1f5f9' : 'transparent',
                                            border: s === ticket.status ? '1px solid #e2e8f0' : '1px solid transparent',
                                            color: s === ticket.status ? '#0f172a' : '#64748b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: config.color
                                        }}></span>
                                        {s.replace('_', ' ')}
                                        {s === ticket.status && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {ticket.status === 'REVOKED' && (
                            <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', fontSize: '0.75rem', color: '#991b1b', fontWeight: '600', textAlign: 'center' }}>
                                This ticket was revoked by the customer and is now read-only.
                            </div>
                        )}
                    </div>

                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Helpful Info</h4>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
                            Tickets should ideally be resolved within 48 hours. Responses should be clear and professional.
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Reject Request</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Please provide a reason for rejecting this profile update request. This will be sent to the customer.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            style={{
                                width: '100%', minHeight: '100px', padding: '12px',
                                border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '20px',
                                fontFamily: 'inherit', fontSize: '0.9rem'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectChange}
                                disabled={!rejectReason || submitting}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '700', cursor: 'pointer', opacity: !rejectReason ? 0.5 : 1 }}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTicketDetail;
