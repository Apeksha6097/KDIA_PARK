import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../config/rbac';

const AdminLogin = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user, token, loginWithCredentials, logout } = useAuth();

    React.useEffect(() => {
        document.title = 'Admin Panel | KDIA Admin';
        if (token && user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [token, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = loginWithCredentials(loginId, password);
        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        if (result.user.role !== 'super_admin' && result.user.role !== 'admin') {
            logout();
            setError('This portal is for Admin and Super Admin users only.');
            setLoading(false);
            return;
        }

        navigate(getDashboardPath(result.user.role));
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-10">
                    <img src="/logo.png" alt="KDIA Admin" className="h-10 w-auto" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-heading">
                    Admin Services
                </h2>
                <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
                    Infrastructure Control Panel
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-12 px-8 sm:px-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200/50">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                                <p className="text-sm text-red-600 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Admin ID</label>
                            <input
                                type="text" required
                                placeholder="admin@kdia.com"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                            <input
                                type="password" required
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-0 transition-all duration-300 font-bold text-slate-900 placeholder:text-slate-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-5 bg-teal-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-teal-900 transition-all duration-300 shadow-xl shadow-teal-900/20 active:scale-[0.98] focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                {loading ? 'Verifying...' : 'Authenticate'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                            Authorized personnel only.<br />All actions are logged.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
