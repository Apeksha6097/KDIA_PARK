import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../config/rbac';

const SuperAdminLogin = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user, token, loginWithCredentials, logout } = useAuth();

    React.useEffect(() => {
        document.title = 'Super Admin Portal | KDIA';
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

        if (result.user.role !== 'super_admin') {
            logout();
            setError('Access Denied: This portal is restricted to Super Admin accounts only.');
            setLoading(false);
            return;
        }

        navigate(getDashboardPath(result.user.role));
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/30">
                        <span className="text-3xl">👑</span>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                    Platform Control
                </h2>
                <p className="mt-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                    Super Admin Console
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-900/80 backdrop-blur-md py-10 px-8 sm:px-10 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-black/80">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-950/50 border border-red-900/50 p-4 rounded-2xl animate-shake">
                                <p className="text-xs text-red-400 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Identity</label>
                            <input
                                type="text" required
                                placeholder="superadmin@kdia.com"
                                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-white font-semibold placeholder:text-slate-700"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authorization Code</label>
                            <input
                                type="password" required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-white font-semibold placeholder:text-slate-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
                            >
                                {loading ? 'Initializing Console...' : 'Establish Console Connection'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/60">
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                            Secured dispatch node.<br />Cryptographic verification active.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
