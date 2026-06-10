import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath, getLoginPathForPortal, ROLES } from '../../config/rbac';

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, loginWithCredentials } = useAuth();

    useEffect(() => {
        document.title = 'Customer Portal | KDIA Re Park';
        if (token && user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location.state, token, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const email = loginId.trim().toLowerCase();
        if (email.includes('superadmin') || email === 'superadmin@kdia.com') {
            navigate(getLoginPathForPortal('admin'));
            setLoading(false);
            return;
        }
        if (email.includes('admin@') || email === 'admin@kdia.com') {
            navigate(getLoginPathForPortal('admin'));
            setLoading(false);
            return;
        }
        if (email.includes('vendor')) {
            navigate(getLoginPathForPortal('vendor'));
            setLoading(false);
            return;
        }
        if (email.includes('support')) {
            navigate(getLoginPathForPortal('support'));
            setLoading(false);
            return;
        }

        const result = loginWithCredentials(loginId, password);
        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        navigate(getDashboardPath(result.user.role));
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="KDIA" className="h-16 w-auto mx-auto mb-6" />
                    <h1 className="title-infrastructure text-3xl">Clean Energy Portal</h1>
                </div>

                <div className="card-premium p-10 space-y-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Authorize Access</h2>
                            <p className="text-slate-400 text-sm font-medium mt-1 text-center">Enter your credentials to continue</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                                <p className="text-sm text-red-600 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </p>
                            </div>
                        )}
                        {message && (
                            <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl">
                                <p className="text-sm text-teal-700 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {message}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email or Mobile</label>
                            <input
                                type="text" required
                                placeholder="name@example.com"
                                className="input-premium"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-[10px] font-black text-teal-700 hover:text-teal-800 uppercase tracking-widest"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <input
                                type="password" required
                                placeholder="••••••••"
                                className="input-premium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="btn-premium w-full bg-teal-800 text-white hover:bg-teal-900 shadow-xl shadow-teal-900/10 h-14"
                            >
                                {loading ? 'Authenticating...' : 'Authorize Access'}
                            </button>
                        </div>
                    </form>

                    {/* Sentry Test Button */}
                    <div className="pt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={() => { throw new Error('Frontend test error for Sentry'); }}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                        >
                            Trigger Sentry Error
                        </button>
                    </div>

                    {/* [DEPRECATED] Vendor-Led Onboarding: Self-enrollment disabled.
                    <div className="pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-3">
                            New to Re Park?
                        </p>
                        <Link to="/register" className="text-sm font-black text-teal-700 hover:text-teal-800 uppercase tracking-widest">
                            Enroll New Infrastructure ID
                        </Link>
                    </div>
                    */}
                </div>

                <p className="mt-10 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Sustainable Energy Solutions &copy; 2026
                </p>
            </div>

            {/* Forgot Password Informational Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full shadow-2xl animate-scale-in border border-slate-100">
                        <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">Account Recovery</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                            Password recovery is handled by the KDIA Re Park support team. Please contact support if you are unable to access your account.
                        </p>

                        <div className="pt-6 border-t border-slate-50 mb-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Need further assistance?</p>
                            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-center">
                                <p className="text-[11px] text-slate-500 font-medium mb-3">You can reach the KDIA Re Park support team at:</p>
                                <div className="space-y-2">
                                    <a href="mailto:support@kdiarepark.com" className="block text-xs font-black text-teal-700 hover:text-teal-800 transition-colors">
                                        support@kdiarepark.com
                                    </a>
                                    <a href="tel:+91XXXXXXXXXX" className="block text-xs font-black text-teal-700 hover:text-teal-800 transition-colors">
                                        +91-XXXXXXXXXX
                                    </a>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowForgotModal(false)}
                            className="btn-premium w-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
