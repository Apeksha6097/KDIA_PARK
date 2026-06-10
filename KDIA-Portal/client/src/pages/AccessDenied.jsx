import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../config/rbac';

const AccessDenied = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleGoBack = () => {
        // Redirect to their default dashboard based on their role
        if (!user) {
            navigate('/login');
            return;
        }

        navigate(getDashboardPath(user.role));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-center">
                {/* Decorative glowing gradient sphere */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-900/10 rotate-3 animate-pulse">
                    <ShieldAlert size={40} />
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-4 uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Access Denied
                </h1>

                <p className="text-slate-400 font-medium leading-relaxed mb-8">
                    Your account does not have authorization to view this resource. 
                    If you believe this is an error, please contact your system administrator.
                </p>

                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 mb-8 text-left text-xs text-slate-500">
                    <div className="flex justify-between mb-1.5">
                        <span className="font-bold uppercase tracking-wider">Current Identity:</span>
                        <span className="text-slate-300 font-semibold">{user?.fullName || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold uppercase tracking-wider">Role Assigned:</span>
                        <span className="text-rose-400 font-bold uppercase tracking-widest">{user?.role || 'None'}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 active:scale-[0.98]"
                    >
                        <ArrowLeft size={16} />
                        Go to Dashboard
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-slate-950/60 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <LogOut size={16} />
                        Sign Out / Switch User
                    </button>
                </div>
            </div>

            <p className="mt-8 text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
                Secure Portal Access &copy; 2026
            </p>
        </div>
    );
};

export default AccessDenied;
