import React, { useState } from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';

const MOCK_ADMINS = [
    { id: 'ADM-001', name: 'System Admin User', email: 'admin@kdia.com', status: 'Active', logs: 432 },
    { id: 'ADM-002', name: 'Alok Mishra', email: 'alok@kdia.com', status: 'Active', logs: 128 },
    { id: 'ADM-003', name: 'Sujata Sen', email: 'sujata@kdia.com', status: 'Inactive', logs: 94 },
];

const SuperAdminAdmins = () => {
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        const newAdmin = {
            id: `ADM-00${admins.length + 1}`,
            name,
            email,
            status: 'Active',
            logs: 0
        };
        setAdmins([...admins, newAdmin]);
        setShowModal(false);
        setName('');
        setEmail('');
    };

    return (
        <SuperAdminLayout>
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '8px' }}>Admin Users</h1>
                        <p style={{ color: '#64748b' }}>Provision, monitor, and configure system administrator accounts.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '12px 24px',
                            background: '#1e1b4b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        + Create Administrator
                    </button>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Admin ID</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Administrator Name</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '18px 24px', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Audit Logs generated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#1a202c' }}>{a.id}</td>
                                    <td style={{ padding: '18px 24px', fontWeight: '700' }}>{a.name}</td>
                                    <td style={{ padding: '18px 24px', color: '#4a5568' }}>{a.email}</td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            background: a.status === 'Active' ? '#ede9fe' : '#f1f5f9',
                                            color: a.status === 'Active' ? '#4338ca' : '#475569',
                                            border: a.status === 'Active' ? '1px solid #c4b5fd' : '1px solid #e2e8f0',
                                            textTransform: 'uppercase'
                                        }}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '18px 24px', fontWeight: '800', color: '#1a202c' }}>{a.logs}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '450px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '16px' }}>Provision New Admin</h3>
                            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
                                    <input
                                        type="text" required
                                        placeholder="Name"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
                                    <input
                                        type="email" required
                                        placeholder="admin@kdia.com"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: '700' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '12px', background: '#1e1b4b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700' }}
                                    >
                                        Provision Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminAdmins;
