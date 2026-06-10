import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VendorLayout from '../../components/VendorLayout';

const VendorProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        companyName: user?.fullName || 'Vendor Partner LLC',
        email: user?.email || 'vendor@kdia.com',
        phone: '+91 98765 43210',
        address: '404 Solar Boulevard, Green Park, Sector 5',
        city: 'Gandhinagar',
        state: 'Gujarat',
        pincode: '382010',
        serviceArea: 'West Zone Region',
        capacityTarget: '1,200 kW',
        allocatedCapacity: '850 kW',
    });

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/vendor/login');
    };

    return (
        <VendorLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Profile</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your company credentials and operational parameters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 border border-emerald-100">
                                {profileData.companyName.charAt(0)}
                            </div>
                            <h2 className="text-lg font-black text-slate-900">{profileData.companyName}</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">KDIA Certified Vendor</p>
                            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Approved Partner
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Allocation Stats</h3>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target Capacity</p>
                                <p className="text-lg font-black text-slate-800">{profileData.capacityTarget}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Currently Allocated</p>
                                <p className="text-lg font-black text-emerald-600">{profileData.allocatedCapacity}</p>
                            </div>
                            <div className="pt-2">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: '70%' }}></div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium mt-1.5 block text-right">70.8% Target Reached</span>
                            </div>
                        </div>

                        {/* Sign Out Action */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-sm font-black text-red-600 uppercase tracking-widest bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Company Details</h3>
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 rounded-xl transition-all border border-emerald-100"
                                        >
                                            Edit Info
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-xs font-black text-white bg-emerald-600 uppercase tracking-widest hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/10"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.companyName}
                                            onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Area</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.serviceArea}
                                            onChange={(e) => setProfileData({ ...profileData, serviceArea: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-4 border-t border-slate-50">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.state}
                                            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.pincode}
                                            onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all font-bold text-slate-900 disabled:opacity-75"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
};

export default VendorProfile;
