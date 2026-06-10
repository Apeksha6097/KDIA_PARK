import React from 'react';

const AllocationCapacity = ({ totalAllocated, totalAvailable: totalAvailableProp }) => {
    // Use prop if supplied (e.g. from DISCOM filter), else fall back to cumulative default
    const totalAvailable = totalAvailableProp != null ? totalAvailableProp : 50000;
    const allocated = totalAllocated || 0;
    const remaining = Math.max(0, totalAvailable - allocated);
    const percentage = Math.min(100, (allocated / totalAvailable) * 100);

    const getStatusColor = (pct) => {
        if (pct < 80) return '#38a169'; // Green
        if (pct < 90) return '#d69e2e'; // Amber
        return '#e53e3e'; // Red
    };

    const statusColor = getStatusColor(percentage);

    if (totalAllocated === undefined || totalAllocated === null) {
        return (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>Allocation Capacity</h3>
                <div style={{ padding: '20px', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                    Allocation data unavailable
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>Allocation Capacity</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', marginBottom: '4px' }}>Total Available</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2d3748' }}>{totalAvailable.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>kWh</span></div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', marginBottom: '4px' }}>Total Allocated</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: statusColor }}>{allocated.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>kWh</span></div>
                </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Capacity Usage</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: statusColor }}>{percentage.toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#edf2f7', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: statusColor,
                        borderRadius: '6px',
                        transition: 'width 0.5s ease-out'
                    }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #edf2f7' }}>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                    Remaining: <span style={{ fontWeight: '700', color: '#2d3748' }}>{remaining.toLocaleString()} kWh</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase' }}>
                    Allocations Restricted
                </div>
            </div>
        </div>
    );
};

export default AllocationCapacity;
