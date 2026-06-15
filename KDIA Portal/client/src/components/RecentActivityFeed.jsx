import React from 'react';

const RecentActivityFeed = ({ activities }) => {
    const formatTimestamp = (ts) => {
        const date = new Date(ts);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionLabel = (type) => {
        if (!type) return 'System Action';
        const mapping = {
            'CUSTOMER_APPROVED': 'Customer Approved',
            'CUSTOMER_REJECTED': 'Customer Rejected',
            'ALLOCATION_ASSIGNED': 'Allocation Assigned',
            'ALLOCATION_CHANGE': 'Allocation Changed',
            'VENDOR_APPROVED': 'Vendor Approved',
            'TICKET_REPLY': 'Support Reply',
            'PROFILE_UPDATE_APPROVED': 'Profile Updated'
        };
        return mapping[type] || 'System Action';
    };

    const getActionColor = (type) => {
        if (!type) return '#3182ce';
        if (type.includes('APPROVED') || type.includes('ASSIGNED')) return '#38a169';
        if (type.includes('REJECTED')) return '#e53e3e';
        return '#3182ce';
    };

    if (!activities || activities.length === 0) {
        return (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>Recent Activity</h3>
                <div style={{ padding: '20px', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                    No recent activity
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>Recent Activity</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activities.slice(0, 5).map((activity, index) => (
                    <div key={index} style={{
                        paddingBottom: index === 4 ? '0' : '16px',
                        borderBottom: index === 4 ? 'none' : '1px solid #edf2f7',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                color: getActionColor(activity.actionType),
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {getActionLabel(activity.actionType)}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#a0aec0', fontWeight: '600' }}>
                                {formatTimestamp(activity.timestamp)}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: '500' }}>
                            {activity.adminName} performed an action on target #{activity.targetId}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic' }}>
                            {typeof activity.details === 'string' ? activity.details : JSON.stringify(activity.details)}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/admin/audit" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#3182ce', textDecoration: 'none', textTransform: 'uppercase' }}>
                    View All Audit Logs →
                </a>
            </div>
        </div>
    );
};

export default RecentActivityFeed;
