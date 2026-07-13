import React from 'react';

const SystemHealthIndicators = () => {
    const lastCheck = new Date().toLocaleTimeString();

    const services = [
        { name: 'Alerts Service', status: 'Active', color: '#38a169', bg: '#f0fff4' },
        { name: 'Allocation Engine', status: 'Active', color: '#38a169', bg: '#f0fff4' },
        { name: 'DISCOM Sync', status: 'Warning', color: '#d69e2e', bg: '#fffaf0' }
    ];

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '700', color: '#1a202c' }}>System Health</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {services.map((service, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: service.color, boxShadow: `0 0 8px ${service.color}80` }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>{service.name}</span>
                        </div>
                        <div
                            style={{
                                padding: '4px 10px',
                                background: service.bg,
                                color: service.color,
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                cursor: 'help'
                            }}
                            title={`Last successful check: ${lastCheck}`}
                        >
                            {service.status}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '24px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.75rem', color: '#718096', lineHeight: '1.5', margin: 0 }}>
                    <span style={{ fontWeight: '700' }}>Operational Logic:</span> Services are monitored in real-time. Warnings indicate minor sync delays from DISCOM providers.
                </p>
            </div>
        </div>
    );
};

export default SystemHealthIndicators;
