import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendorLogin = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginDemo } = useAuth();

    useEffect(() => {
        document.title = 'Vendor Portal | KDIA Re Park';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // DEMO BYPASS: Immediate Navigation
        try {
            loginDemo('vendor');
            navigate('/vendor/dashboard');
        } catch (err) {
            setError('Demo login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="KDIA" className="h-16 w-auto mx-auto mb-6 opacity-90 grayscale brightness-200" />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Vendor Portal</h1>
                    <p className="text-slate-400 text-sm font-medium mt-2">Sales Partner Access</p>
                </div>

                <div className="bg-white rounded-[2rem] p-10 space-y-8 shadow-2xl shadow-emerald-500/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Vendor Login</h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                                <p className="text-sm text-red-600 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email or Mobile</label>
                            <input
                                type="text" required
                                placeholder="vendor@example.com"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password" required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Authenticating...' : 'Access Portal'}
                            </button>
                        </div>
                    </form>

                    <div className="pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-3">
                            Join the Vendor Network?
                        </p>
                        <Link to="/vendor/register" className="text-sm font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
                            Apply as Salesperson
                        </Link>
                    </div>
                </div>

                <p className="mt-10 text-center text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">
                    Restricted Access Area &copy; 2026
                </p>
            </div>
        </div>
    );
};

export default VendorLogin;
