import React from 'react';

const AdminReports = () => {
    return (
        <div>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>Operational Reports</h1>
                    <p style={{ color: '#718096' }}>Analyze generation metrics, subscriber allocations, and platform audit parameters.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '36px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#718096', uppercase: true, letterSpacing: '0.05em' }}>COMPLIANCE RATE</p>
                        <p style={{ fontSize: '2rem', fontWeight: '900', color: '#38a169', marginTop: '8px' }}>99.2%</p>
                    </div>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#718096', uppercase: true, letterSpacing: '0.05em' }}>REGIONAL EFFICIENCY</p>
                        <p style={{ fontSize: '2rem', fontWeight: '900', color: '#3182ce', marginTop: '8px' }}>96.8%</p>
                    </div>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#718096', uppercase: true, letterSpacing: '0.05em' }}>SLA RESOLUTIONS</p>
                        <p style={{ fontSize: '2rem', fontWeight: '900', color: '#dd6b20', marginTop: '8px' }}>4.2 Hrs Avg</p>
                    </div>
                </div>

                <div style={{ background: '#fff', p: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>System Export Parameters</h3>
                    <p style={{ color: '#718096', marginBottom: '24px', fontSize: '0.95rem' }}>Select operational data sets below to export audit files.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {['Monthly Generation Summary', 'Subscriber Allocation Quotas', 'Billing Adjustments Audit', 'Platform Support SLAs'].map(report => (
                            <div key={report} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontWeight: '700', color: '#1a202c', fontSize: '0.9rem' }}>{report}</span>
                                <button
                                    style={{
                                        padding: '8px 16px',
                                        background: '#022c22',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Download CSV
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
