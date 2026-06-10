import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img src="/logo.png" alt="KDIA" className="h-16 w-auto mx-auto mb-10" />
                <h1 className="title-infrastructure mb-2">
                    Infrastructure Enrollment
                </h1>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="card-premium py-12 px-8 sm:px-12 mb-10 text-center">
                    <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-4">Vendor-Led Onboarding</h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                        Customer self-enrollment is currently disabled. Please contact a KDIA representative or your assigned vendor to initiate your account setup and allocation.
                    </p>

                    <Link to="/login" className="btn-premium w-full block bg-slate-900 text-white hover:bg-slate-800">
                        Return to Login
                    </Link>
                </div>

                <p className="mt-10 text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Sustainable Energy Solutions &copy; 2026 Secured Interface
                </p>
            </div>
        </div>
    );
};

export default Register;
