import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminAllocations = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [allocationUnits, setAllocationUnits] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const { token } = useAuth();

    const presets = [
        { label: 'Small', units: 500 },
        { label: 'Medium', units: 1000 },
        { label: 'Large', units: 2000 },
    ];

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/admin/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch customers');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCustomers();
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedCustomer || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await api.post('/admin/allocations',
                {
                    userId: selectedCustomer.id,
                    totalUnits: parseInt(allocationUnits),
                    startDate
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Allocation updated successfully!');
            setSelectedCustomer(null);
            setAllocationUnits('');
            fetchCustomers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update allocation. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const maxAllocation = Math.max(...customers.map(c => c.allocatedEnergy || 0), 1);
    const totalAllocated = customers.reduce((sum, c) => sum + (c.allocatedEnergy || 0), 0);
    const zeroAllocations = customers.filter(c => !c.allocatedEnergy || c.allocatedEnergy === 0).length;

    if (loading) return (
        <div style={{ padding: '64px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '500' }}>Loading allocation data...</div>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const StatCard = ({ label, value, icon, color }) => (
        <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: color
            }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{value}</div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Energy Allocation Management</h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>Distribute energy units across approved industrial customers.</p>
            </div>

            {/* Allocation Overview Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Allocated" value={`${totalAllocated.toLocaleString()} kWh`} icon="⚡" color="#3b82f6" />
                <StatCard label="Total Customers" value={customers.length} icon="👥" color="#64748b" />
                <StatCard label="Not Allocated" value={zeroAllocations} icon="⚠️" color="#f59e0b" />
                <StatCard label="Highest Allocation" value={`${maxAllocation.toLocaleString()} kWh`} icon="🏆" color="#10b981" />
            </div>

            {message && (
                <div style={{ background: '#f0fdf4', color: '#166534', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600' }}>
                    <span>✅</span> {message}
                </div>
            )}

            {error && (
                <div style={{ padding: '16px 24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#c53030', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>⚠️</span>
                    <span style={{ fontSize: '0.95rem' }}>{error}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1.2fr 1fr' : '1fr', gap: '40px' }}>
                {/* Customer List Container */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>Active Customers</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{customers.length} total</span>
                    </div>

                    {customers.length === 0 ? (
                        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>⚡</div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b', marginBottom: '4px' }}>No customers available</div>
                            <div style={{ color: '#64748b', fontSize: '0.95rem' }}>Approved customers will appear here for allocation.</div>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {customers.map((customer) => {
                                    const isSelected = selectedCustomer?.id === customer.id;
                                    const allocation = customer.allocatedEnergy || 0;
                                    const relativePercent = (allocation / maxAllocation) * 100;

                                    return (
                                        <li
                                            key={customer.id}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setAllocationUnits(customer.allocatedEnergy || '');
                                            }}
                                            onMouseEnter={() => setHoveredRow(customer.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{
                                                padding: '16px 24px',
                                                borderBottom: '1px solid #f1f5f9',
                                                cursor: 'pointer',
                                                background: isSelected ? '#eff6ff' : (hoveredRow === customer.id ? '#f8fafc' : 'transparent'),
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderLeft: `4px solid ${isSelected ? '#3b82f6' : 'transparent'}`
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ fontWeight: '700', color: isSelected ? '#1e40af' : '#0f172a', fontSize: '1rem' }}>{customer.fullName}</div>
                                                    {allocation === 0 && (
                                                        <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', borderRadius: '4px', fontWeight: '800', textTransform: 'uppercase' }}>Not Allocated</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace', fontWeight: '600' }}>#{customer.consumerId}</div>
                                            </div>

                                            <div style={{ textAlign: 'right', minWidth: '140px' }}>
                                                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: allocation > 0 ? '#0f172a' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                    {allocation.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>kWh</span>
                                                </div>
                                                {/* Relative Allocation Indicator */}
                                                {allocation > 0 && (
                                                    <div style={{ width: '100px', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden', marginLeft: 'auto' }}>
                                                        <div style={{ width: `${relativePercent}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Allocation Form Section */}
                <div>
                    {selectedCustomer ? (
                        <div style={{
                            background: '#fff',
                            padding: '32px',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', marginBottom: '16px' }}>
                                <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Energy Distribution Control</span>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.01em' }}>Update Allocation</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '32px' }}>Adjusting energy units for <span style={{ fontWeight: '700', color: '#1e293b' }}>{selectedCustomer.fullName}</span></p>

                            <form onSubmit={handleUpdate}>
                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Quick Presets</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {presets.map((p) => (
                                            <button
                                                key={p.label}
                                                type="button"
                                                onClick={() => setAllocationUnits(p.units)}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px 12px',
                                                    border: `1px solid ${parseInt(allocationUnits) === p.units ? '#0f172a' : '#e2e8f0'}`,
                                                    background: parseInt(allocationUnits) === p.units ? '#0f172a' : '#fff',
                                                    color: parseInt(allocationUnits) === p.units ? '#fff' : '#475569',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '700',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Allocated Units (kWh)</label>
                                    <input
                                        type="number"
                                        value={allocationUnits}
                                        onChange={(e) => setAllocationUnits(e.target.value)}
                                        placeholder="0"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Effective Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 1.5,
                                            background: isSubmitting ? '#94a3b8' : '#3b82f6',
                                            color: '#fff',
                                            padding: '14px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            fontWeight: '700',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            boxShadow: !isSubmitting ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
                                        }}
                                        onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2563eb')}
                                        onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                                    >
                                        {isSubmitting ? 'Confirming...' : 'Update Allocation'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCustomer(null)}
                                        style={{
                                            flex: 1,
                                            background: '#f8fafc',
                                            color: '#64748b',
                                            padding: '14px',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div style={{
                            height: '100%',
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f8fafc',
                            border: '2px dashed #e2e8f0',
                            borderRadius: '20px',
                            color: '#94a3b8',
                            padding: '40px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👈</div>
                            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#64748b', marginBottom: '4px' }}>Selection Required</div>
                            <div style={{ fontSize: '0.9rem' }}>Select a customer from the list to manage their energy allocation distribution.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAllocations;
