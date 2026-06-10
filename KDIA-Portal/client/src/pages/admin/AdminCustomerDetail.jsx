import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import StatusBadge from '../../components/StatusBadge';

const AdminCustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    // Allocation Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ totalUnits: '', startDate: '' });

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({});

    // Password Reset State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDetails = async () => {
        try {
            const response = await api.get(`/admin/customers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);

            // Init forms
            setEditForm({
                totalUnits: response.data.subscription.totalUnits,
                startDate: response.data.subscription.startDate
            });
            setProfileForm({
                fullName: response.data.profile.fullName,
                email: response.data.profile.email,
                mobileNumber: response.data.profile.mobileNumber,
                consumerId: response.data.profile.consumerId,
                dob: response.data.profile.dob || '',
                gender: response.data.profile.gender || '',
                addressLine1: response.data.profile.address_line_1 || '',
                addressLine2: response.data.profile.address_line_2 || '',
                city: response.data.profile.city || '',
                state: response.data.profile.state || '',
                pinCode: response.data.profile.pin_code || '',
                locationType: response.data.profile.location_type || '',
            });

            setLoading(false);
        } catch (err) {
            setError('Failed to load customer details');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchDetails();
    }, [id, token]);

    const handleUpdateAllocation = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/admin/allocations', {
                userId: id,
                totalUnits: editForm.totalUnits,
                startDate: editForm.startDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditModalOpen(false);
            setToast({ message: 'Energy allocation updated successfully.', type: 'success' });
            fetchDetails();
        } catch (err) {
            setToast({ message: err.response?.data?.error || 'Failed to update allocation', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.patch(`/admin/customers/${id}`, profileForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditingProfile(false);
            setToast({ message: 'Profile updated successfully.', type: 'success' });
            fetchDetails();
        } catch (err) {
            setToast({ message: err.response?.data?.error || 'Failed to update profile', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPasswordMessage('');
        try {
            await api.post(`/admin/customers/${id}/reset-password`, {
                newPassword: passwordForm
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasswordMessage('Password reset successfully.');
            setToast({ message: 'Password reset successfully.', type: 'success' });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setPasswordMessage('');
                setPasswordForm('');
            }, 2000);
        } catch (err) {
            setPasswordMessage(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading customer details...</div>;
    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', color: '#c53030', margin: '24px 0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System Error</div>
            <div style={{ fontSize: '0.9rem' }}>{error}</div>
        </div>
    );
    if (!data) return <div style={{ padding: '20px' }}>Customer not found.</div>;

    const { profile, subscription, consumption } = data;
    const totalConsumed = consumption.reduce((sum, log) => sum + log.unitsConsumed, 0);

    return (
        <div style={{ position: 'relative' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {/* Allocation Modal */}
            {isEditModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Edit Energy Allocation</h3>
                        <form onSubmit={handleUpdateAllocation}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Monthly Allocation (kWh)</label>
                                <input
                                    type="number" required min="0"
                                    value={editForm.totalUnits}
                                    onChange={(e) => setEditForm({ ...editForm, totalUnits: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Effective Start Date</label>
                                <input
                                    type="date" required
                                    value={editForm.startDate}
                                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={warningBoxStyle}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#7b341e', lineHeight: '1.4' }}>
                                    <strong>Important:</strong> This change will be applied immediately and recorded in the audit logs.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" disabled={isSubmitting} style={primaryBtnStyle}>
                                    {isSubmitting ? 'Saving...' : 'Confirm Changes'}
                                </button>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} style={secondaryBtnStyle}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {isPasswordModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, borderColor: '#fbd38d' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#c05621' }}>Reset Customer Password</h3>
                        <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '24px' }}>
                            Enter a new temporary password for <strong>{profile.fullName}</strong>.
                            Warning: This will immediately invalidate their current password.
                        </p>
                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>New Password</label>
                                <input
                                    type="text" required minLength="6"
                                    placeholder="Enter new password"
                                    value={passwordForm}
                                    onChange={(e) => setPasswordForm(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            {passwordMessage && (
                                <div style={{ fontSize: '0.85rem', color: passwordMessage.includes('success') ? 'green' : 'red', marginBottom: '16px', fontWeight: 'bold' }}>
                                    {passwordMessage}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" disabled={isSubmitting} style={{ ...primaryBtnStyle, background: '#dd6b20' }}>
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} style={secondaryBtnStyle}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/admin/customers')}
                        style={{ background: 'transparent', border: 'none', color: '#3182ce', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
                    >
                        ← Back
                    </button>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Customer Profile</h1>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    style={{
                        background: '#3182ce', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                >
                    Edit Allocation
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>

                {/* Profile Card (Editable) */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', gridColumn: 'span 2', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>
                            {isEditingProfile ? 'Edit Basic Information' : 'Basic Information'}
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {!isEditingProfile && (
                                <>
                                    {profile.approval_status === 'PENDING' && (
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
                                            Admin Action Required: Approval Pending
                                        </span>
                                    )}
                                    <StatusBadge status={profile.isActive ? 'ACTIVE' : 'INACTIVE'} />
                                </>
                            )}
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                style={{
                                    background: 'transparent', border: '1px solid #cbd5e0', color: '#4a5568',
                                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                                }}
                            >
                                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input
                                        type="text" required
                                        value={profileForm.fullName}
                                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Mobile Number</label>
                                    <input
                                        type="text" required
                                        value={profileForm.mobileNumber}
                                        onChange={(e) => setProfileForm({ ...profileForm, mobileNumber: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={profileForm.dob}
                                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select
                                        value={profileForm.gender}
                                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Address Line 1</label>
                                    <input
                                        type="text"
                                        value={profileForm.addressLine1}
                                        onChange={(e) => setProfileForm({ ...profileForm, addressLine1: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Address Line 2</label>
                                    <input
                                        type="text"
                                        value={profileForm.addressLine2}
                                        onChange={(e) => setProfileForm({ ...profileForm, addressLine2: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input
                                        type="text"
                                        value={profileForm.city}
                                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>State</label>
                                    <input
                                        type="text"
                                        value={profileForm.state}
                                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>PIN Code</label>
                                    <input
                                        type="text" maxLength="6"
                                        value={profileForm.pinCode}
                                        onChange={(e) => setProfileForm({ ...profileForm, pinCode: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Location Type</label>
                                    <select
                                        value={profileForm.locationType}
                                        onChange={(e) => setProfileForm({ ...profileForm, locationType: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="submit" disabled={isSubmitting} style={{ ...primaryBtnStyle, padding: '8px 24px' }}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Full Name</div>
                                <div style={{ fontWeight: '500' }}>{profile.fullName}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Email Address</div>
                                <div style={{ fontWeight: '500' }}>{profile.email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Consumer ID</div>
                                <code style={{ background: '#f7fafc', padding: '2px 6px', borderRadius: '4px' }}>{profile.consumerId}</code>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Mobile Number</div>
                                <div style={{ fontWeight: '500' }}>{profile.mobileNumber || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Date of Birth</div>
                                <div style={{ fontWeight: '500' }}>{profile.dob || 'N/A'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Gender</div>
                                <div style={{ fontWeight: '500' }}>{profile.gender || 'N/A'}</div>
                            </div>
                            <div style={{ gridColumn: 'span 2', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '8px', fontWeight: 'bold' }}>Service Address</div>
                                <div style={{ color: '#2d3748', lineHeight: '1.5' }}>
                                    {profile.address_line_1 ? (
                                        <>
                                            {profile.address_line_1}<br />
                                            {profile.address_line_2 && <>{profile.address_line_2}<br /></>}
                                            {profile.city}, {profile.state} - {profile.pin_code || 'N/A'}
                                        </>
                                    ) : (
                                        <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Address not recorded</span>
                                    )}
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <span style={{
                                        fontSize: '0.75rem', background: '#e2e8f0', color: '#4a5568',
                                        padding: '4px 10px', borderRadius: '4px', fontWeight: '500'
                                    }}>
                                        {profile.location_type || 'Unknown Type'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Security Card */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748', marginBottom: '16px' }}>Account Security</h3>
                    <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '24px', lineHeight: '1.5' }}>
                        Manage access credentials for this customer. Resetting the password will require the customer to login with the new credentials immediately.
                    </p>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#fff',
                            color: '#c05621',
                            border: '1px solid #fbd38d',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#fffaf0' }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff' }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>🔒</span> Reset Password
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                {/* Subscription Details (Same as before) */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748', marginBottom: '20px' }}>Allocation Details</h3>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Start Date</div>
                        <div style={{ fontWeight: '500' }}>{subscription.startDate}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '4px' }}>Remaining Balance</div>
                        <div style={{ fontWeight: '500', color: subscription.totalUnits - totalConsumed < 0 ? '#e53e3e' : '#38a169' }}>
                            {subscription.totalUnits - totalConsumed} kWh
                        </div>
                    </div>
                </div>

                {/* Consumption History (Same as before) */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', color: '#4a5568' }}>
                        Consumption History
                    </div>
                    {consumption.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#718096' }}>No consumption data recorded yet.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 24px', fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>Month</th>
                                    <th style={{ padding: '12px 24px', fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>Units Consumed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consumption.map((log, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f7fafc' }}>
                                        <td style={{ padding: '12px 24px', color: '#2d3748' }}>{log.month}</td>
                                        <td style={{ padding: '12px 24px', fontWeight: '500', color: '#2d3748' }}>{log.unitsConsumed} kWh</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

// Styles
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalContentStyle = {
    background: '#fff', padding: '32px', borderRadius: '12px', maxWidth: '450px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};
const labelStyle = {
    display: 'block', fontSize: '0.85rem', color: '#4a5568', marginBottom: '8px', fontWeight: '500'
};
const inputStyle = {
    width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
};
const warningBoxStyle = {
    padding: '16px', background: '#fffaf0', borderRadius: '8px', border: '1px solid #fbd38d', marginBottom: '24px'
};
const primaryBtnStyle = {
    flex: 1, padding: '12px', background: '#3182ce', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
};
const secondaryBtnStyle = {
    flex: 1, padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#4a5568'
};

export default AdminCustomerDetail;
