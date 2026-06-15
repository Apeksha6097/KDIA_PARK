import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VendorOnboarding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { lead } = location.state || {}; // Get lead data if available

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        addressLine1: '',
        city: '',
        state: '',
        pinCode: '',
        locationType: 'Residential',
        gender: '',
        dob: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill form from lead data
    useEffect(() => {
        if (lead) {
            // lead.contact is "Phone | Email"
            const [phone, email] = lead.contact.split(' | ');
            setFormData(prev => ({
                ...prev,
                fullName: lead.name || '',
                mobileNumber: phone || '',
                email: email || '',
                addressLine1: lead.location || ''
            }));
        }
    }, [lead]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/vendor-customers', {
                ...formData,
                leadId: lead?.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create customer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <VendorLayout>
                <div className="max-w-3xl mx-auto py-12 px-6 text-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Draft Profile Created</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            The customer record has been saved as a draft. You can now found this in your <strong>Customers</strong> list, where you must submit it for official admin review.
                        </p>
                        <button
                            onClick={() => navigate('/vendor/customers')}
                            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Go to My Customers
                        </button>
                    </div>
                </div>
            </VendorLayout>
        );
    }

    return (
        <VendorLayout>
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">
                        <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate('/vendor/leads')}>Leads</span>
                        <span>/</span>
                        <span className="text-emerald-600">Onboarding</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">New Customer Onboarding</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Details */}
                            <div className="col-span-full">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Customer Details</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Amit Sharma" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Date of Birth</label>
                                <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Gender</label>
                                <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile Number</label>
                                <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="9876543210" />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="amit@example.com" />
                            </div>

                            {/* Location Details */}
                            <div className="col-span-full mt-2">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Location & Address</h3>
                            </div>

                            <div className="col-span-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Property Address</label>
                                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Flat No, Building, Street" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">City</label>
                                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">State</label>
                                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Pincode</label>
                                <input required type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="110001" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Property Type</label>
                                <select name="locationType" value={formData.locationType} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/vendor/leads')}
                                className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Submitting...' : 'Create Draft Customer'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </VendorLayout>
    );
};

export default VendorOnboarding;
