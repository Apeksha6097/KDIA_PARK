import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const VendorRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '', // Individual Name
        email: '',
        mobileNumber: '',
        password: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        locationType: 'Commercial', // Default for vendors
        consumerId: '' // Optional Business ID
    });

    useEffect(() => {
        document.title = 'Vendor Registration | KDIA Re Park';
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/api/auth/vendor/register', formData);
            // On success, redirect to login with a message? Or verify first?
            // The plan says redirect to Pending, but they need to login first to see pending.
            // So better to redirect to login.
            alert('Registration Successful! Please login to check approval status.');
            navigate('/vendor/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="KDIA" className="h-16 w-auto mx-auto mb-6 opacity-90 grayscale brightness-200" />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Salesperson Registration</h1>
                    <p className="text-slate-400 text-sm font-medium mt-2">Apply as a KDIA Sales Partner</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-emerald-500/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                                <p className="text-sm text-red-600 font-bold flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" name="fullName" required className="input-vendor" placeholder="Your Full Name" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" name="email" required className="input-vendor" placeholder="contact@company.com" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <input type="tel" name="mobileNumber" required pattern="[0-9]{10}" className="input-vendor" placeholder="9876543210" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <input type="password" name="password" required className="input-vendor" placeholder="Strong Password" onChange={handleChange} />
                                <p className="text-xs text-slate-400 mt-1">Must contain 8+ chars, uppercase, lowercase, number, special char.</p>
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address Line 1</label>
                                <input type="text" name="addressLine1" required className="input-vendor" placeholder="Building / Street" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address Line 2 (Optional)</label>
                                <input type="text" name="addressLine2" className="input-vendor" placeholder="Area / Landmark" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                <input type="text" name="city" required className="input-vendor" placeholder="City" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                <input type="text" name="state" required className="input-vendor" placeholder="State" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PIN Code</label>
                                <input type="text" name="pinCode" required pattern="[0-9]{6}" className="input-vendor" placeholder="110001" onChange={handleChange} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Type</label>
                                <select name="locationType" className="input-vendor bg-white" onChange={handleChange} value={formData.locationType}>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>

                    <div className="pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-3">
                            Already registered?
                        </p>
                        <Link to="/vendor/login" className="text-sm font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">
                            Vendor Login
                        </Link>
                    </div>
                </div>

                <style>{`
                    .input-vendor {
                        width: 100%;
                        padding: 14px;
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 0.75rem;
                        color: #0f172a;
                        font-weight: 700;
                        font-size: 0.875rem;
                        transition: all 0.2s;
                    }
                    .input-vendor:focus {
                        outline: none;
                        border-color: #6366f1;
                        ring: 2px solid rgba(99, 102, 241, 0.2);
                        background-color: #ffffff;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default VendorRegister;
