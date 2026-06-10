import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Password change modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            setError('');
            const res = await api.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError('Failed to load profile data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
        const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
        const hasDigit = /\d/.test(passwordForm.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
            setPasswordError('Password must contain uppercase, lowercase, digit, and special character');
            return;
        }

        setIsChangingPassword(true);
        setPasswordError('');

        try {
            await api.post('/api/profile/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPasswordSuccess(true);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

            // Close modal after 2 seconds
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (err) {
            console.error("Password change error:", err);
            setPasswordError(err.response?.data?.error || 'Failed to change password. Please try again.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleRequestContactUpdate = () => {
        navigate('/support?category=PROFILE_UPDATE_REQUEST&field=contact');
    };

    const handleRequestAddressUpdate = () => {
        navigate('/support?category=PROFILE_UPDATE_REQUEST&field=address');
    };

    const handleRequestProfileUpdate = () => {
        navigate('/support?category=PROFILE_UPDATE_REQUEST&field=contact');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading secure profile...</p>
            </div>
        </div>
    );

    return (
        <>

            <div className="w-full">
                {/* Error State */}
                {error && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-red-800">{error}</p>
                        </div>
                        <button
                            onClick={fetchProfile}
                            className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Hero Section */}
                <div className="mb-12 bg-gradient-to-br from-teal-900 to-teal-800 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl shadow-teal-900/20 relative overflow-hidden border border-teal-700">
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-teal-300">Account Profile</span>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white mb-4">My Profile</h1>
                        <p className="text-lg text-teal-100/80 font-medium leading-relaxed max-w-2xl">
                            View your registered details and manage account security. Your information is protected and managed with enterprise-grade security.
                        </p>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-teal-400/5 rounded-full blur-[80px]"></div>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Personal Information */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Personal Information</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Verified identity details</p>
                            </div>
                            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <p className="text-base font-bold text-slate-900">{profileData?.fullName || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
                                <p className="text-base font-bold text-slate-900">{formatDate(profileData?.dob)}</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                                <p className="text-base font-bold text-slate-900 capitalize">{profileData?.gender || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                            <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                Personal details are verified during onboarding and cannot be edited directly.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Contact Information */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Contact Information</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Registered communication channels</p>
                            </div>
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-bold text-slate-900">{profileData?.email || 'N/A'}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                                        Verified
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-bold text-slate-900">+91 {profileData?.mobileNumber || 'N/A'}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                                        Verified
                                    </span>
                                </div>
                            </div>
                            {profileData?.alternateMobile && (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alternate Mobile</label>
                                    <p className="text-base font-bold text-slate-900">+91 {profileData.alternateMobile}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleRequestContactUpdate}
                            className="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Request Contact Detail Update
                        </button>
                    </div>

                    {/* Section 3: Service Address & Location Details */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Service Address & Location</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Registered service location</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Address</label>
                                <p className="text-base font-bold text-slate-900 leading-relaxed">
                                    {profileData?.addressLine1 || 'N/A'}
                                    {profileData?.addressLine2 && <>, <br />{profileData.addressLine2}</>}
                                    <br />{profileData?.city}, {profileData?.state} - {profileData?.pinCode}
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location Type</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest capitalize">
                                    {profileData?.locationType || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4">
                            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
                                This address is used for service eligibility, compliance and allocation mapping.
                            </p>
                        </div>

                        <button
                            onClick={handleRequestAddressUpdate}
                            className="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Request Address Update
                        </button>
                    </div>

                    {/* Section 4: Account Security */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Account Security</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Manage your access and authentication</p>
                            </div>
                            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50 mb-8">
                            <div className="mb-6 sm:mb-0 text-center sm:text-left">
                                <h3 className="text-sm font-black text-slate-900 mb-1">Access Password</h3>
                                <p className="text-xs text-slate-500 font-medium mb-2">••••••••</p>
                                <p className="text-[10px] text-slate-400 font-medium">Keep your account secure with a strong password</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-red-50/50 rounded-[2rem] border border-red-100/50 mb-8">
                            <div className="mb-6 sm:mb-0 text-center sm:text-left">
                                <h3 className="text-sm font-black text-red-900 mb-1">Account Session</h3>
                                <p className="text-[10px] text-red-600/80 font-medium">Sign out securely from your current session on this device</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-8 py-3 bg-red-100 text-red-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-200 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex gap-4">
                            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-xs text-amber-800/80 font-medium leading-relaxed">
                                All security changes are logged for compliance.
                            </p>
                        </div>
                    </div>

                    {/* Section 5: Support & Requests Reference */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-white">Support & Requests</h2>
                            </div>
                            <p className="text-slate-300 text-sm font-medium mb-8 max-w-lg">
                                Profile updates are handled through secure support requests to ensure data accuracy and compliance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/support')}
                                    className="px-8 py-3 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20"
                                >
                                    View My Support Tickets
                                </button>
                                <button
                                    onClick={handleRequestProfileUpdate}
                                    className="px-8 py-3 bg-teal-400 text-teal-950 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-teal-400/20"
                                >
                                    Raise Profile Update Request
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-slate-800/50 to-transparent pointer-events-none"></div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-16 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        KDIA Customer Portal • Secure Profile Access • Enterprise-Grade Infrastructure
                    </p>
                </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[3rem] p-8 sm:p-12 max-w-md w-full shadow-2xl border border-slate-100 animate-scale-in">
                        <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-3xl flex items-center justify-center mb-8">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Change Password</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                            Enter your current password to authorize this change. Your new password must be at least 8 characters with uppercase, lowercase, digit, and special character.
                        </p>

                        {passwordSuccess ? (
                            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-3xl flex flex-col items-center text-center animate-fade-in border border-emerald-100">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest">Password Updated Successfully</span>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            required
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            required
                                            minLength="8"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all shadow-sm"
                                            placeholder="Min 8 characters"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            minLength="8"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-teal-500/20 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="bg-red-50 text-red-800 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-start gap-3">
                                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {passwordError}
                                    </div>
                                )}

                                <div className="flex flex-col space-y-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setPasswordError('');
                                        }}
                                        disabled={isChangingPassword}
                                        className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-slate-900 hover:border-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default CustomerProfile;
