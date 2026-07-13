import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorPending = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/vendor/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-4">Approval Pending</h1>

                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    Your salesperson application has been submitted and is currently under review by the KDIA administration team.
                    <br /><br />
                    You will be notified once your account has been approved and you can begin working as a KDIA sales partner.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status: <span className="text-amber-600">Under Review</span></p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-white border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default VendorPending;
