import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

const AdminAllocationModal = ({ customer, onClose, onRefresh }) => {
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [allocationName, setAllocationName] = useState('Monthly Solar Allocation');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            setToast({ message: 'Please enter a valid allocation amount.', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/allocations', {
                userId: customer.id,
                totalUnits: amount,
                startDate,
                allocationName,
                notes,
                period: 'Monthly'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ message: 'Solar allocation assigned successfully.', type: 'success' });
            setTimeout(() => {
                onRefresh();
                onClose();
            }, 1000);
        } catch (err) {
            setToast({ message: err.response?.data?.error || 'Failed to assign allocation', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div style={{
                background: '#fff', borderRadius: '24px', maxWidth: '500px', width: '90%',
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Assign Solar Allocation</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Setup energy distribution for <strong>{customer.fullName}</strong></p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Allocation Name</label>
                            <input
                                type="text"
                                value={allocationName}
                                onChange={(e) => setAllocationName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                placeholder="e.g. Monthly Standard Plan"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Amount (kWh)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                placeholder="500"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                required
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Period</label>
                            <input
                                type="text"
                                value="Monthly (Fixed)"
                                disabled
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Internal Admin Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }}
                                placeholder="Internal context regarding this allocation..."
                            />
                        </div>
                    </div>

                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginBottom: '32px' }}>
                        <p style={{ color: '#166534', fontSize: '0.8rem', fontWeight: '600', margin: 0 }}>
                            “Solar allocations are assigned by KDIA and cannot be modified by customers or vendors”
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#059669', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                        >
                            {loading ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAllocationModal;
