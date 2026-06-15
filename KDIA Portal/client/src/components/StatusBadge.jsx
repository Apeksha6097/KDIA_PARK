import React from 'react';

const StatusBadge = ({ status, customLabel }) => {
    const getStatusStyles = (status) => {
        const normalizedStatus = (status || '').toUpperCase();

        switch (normalizedStatus) {
            case 'PENDING':
                return {
                    bg: '#fffbeb',
                    color: '#92400e',
                    dot: '#f59e0b',
                    icon: '🕒',
                    label: customLabel || 'Pending Action',
                    flag: true
                };
            case 'APPROVED':
            case 'ACTIVE':
            case 'RESOLVED':
                return {
                    bg: '#ecfdf5',
                    color: '#065f46',
                    dot: '#10b981',
                    icon: '✓',
                    label: customLabel || (normalizedStatus === 'ACTIVE' ? 'Active' : normalizedStatus === 'RESOLVED' ? 'Resolved' : 'Approved')
                };
            case 'REJECTED':
            case 'INACTIVE':
            case 'REVOKED':
                return {
                    bg: '#fef2f2',
                    color: '#b91c1c',
                    dot: '#ef4444',
                    icon: '✕',
                    label: customLabel || (normalizedStatus === 'INACTIVE' ? 'Inactive' : normalizedStatus === 'REVOKED' ? 'Revoked' : 'Rejected')
                };
            case 'IN_PROGRESS':
                return {
                    bg: '#eff6ff',
                    color: '#1e40af',
                    dot: '#3b82f6',
                    icon: '⚙️',
                    label: customLabel || 'In Progress'
                };
            default:
                return {
                    bg: '#f3f4f6',
                    color: '#374151',
                    dot: '#9ca3af',
                    icon: '•',
                    label: customLabel || status || 'Unknown'
                };
        }
    };

    const styles = getStatusStyles(status);

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            background: styles.bg,
            color: styles.color,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            border: `1px solid ${styles.dot}30`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
            <span style={{
                marginRight: '6px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: styles.dot
            }}>
                {styles.icon}
            </span>
            {styles.label}
        </div>
    );
};

export default StatusBadge;
