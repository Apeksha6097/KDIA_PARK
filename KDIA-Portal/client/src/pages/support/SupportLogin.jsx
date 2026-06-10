import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath, ROLES } from '../../config/rbac';
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const SupportLogin = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user, token, login, loginWithCredentials, logout } = useAuth();

    React.useEffect(() => {
        document.title = 'Support Panel | KDIA Support';
        if (token && user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [token, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const demoResult = loginWithCredentials(loginId, password);
        if (demoResult.success) {
            const role = demoResult.user.role;
            if (role === ROLES.SUPPORT || role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
                navigate(getDashboardPath(role));
                setLoading(false);
                return;
            }
            logout();
            setError('Access denied. This portal is for support agents only.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/login', { loginId, password });
            const { user: apiUser, token: apiToken } = res.data;

            if (apiUser.role !== 'support_agent' && apiUser.role !== 'admin' && apiUser.role !== 'support' && apiUser.role !== ROLES.SUPER_ADMIN) {
                setError('Access denied. This portal is for support agents only.');
                setLoading(false);
                return;
            }

            login(apiUser, apiToken);
            navigate(getDashboardPath(apiUser.role));
        } catch (err) {
            setError(demoResult.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-emerald-900/5 p-10 border border-neutral-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <div className="text-center mb-10 relative z-10">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-600/20 rotate-3">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight">Support Team</h1>
                    <p className="text-neutral-500 mt-2 font-medium">KDIA Clean Energy Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl flex items-center gap-3 animate-shake">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Agent Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-neutral-800 placeholder:text-neutral-300 font-medium"
                                placeholder="support@kdia.com"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-neutral-800 placeholder:text-neutral-300 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
                    </button>

                    <p className="text-xs text-center text-neutral-400 mt-8">
                        Authorized personnel only. Sessions are monitored for security.
                    </p>
                </form>
            </div>

            <p className="mt-8 text-neutral-400 text-sm font-medium">Sustainable Energy Solutions © 2026</p>
        </div>
    );
};

const AlertCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default SupportLogin;
