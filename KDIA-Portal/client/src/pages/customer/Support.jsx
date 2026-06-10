import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const Support = () => {
    const { user, token, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // Profile Update Request State
    const requestCategory = searchParams.get('category'); // PROFILE_UPDATE_REQUEST
    const requestField = searchParams.get('field'); // 'contact' or 'address'

    // Standard Form State
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    // Profile Request Form State
    const [requestForm, setRequestForm] = useState({
        newEmail: user?.email || '',
        newMobile: user?.mobileNumber || '',
        newAddress1: user?.address_line_1 || '',
        newAddress2: user?.address_line_2 || '',
        newCity: user?.city || '',
        newState: user?.state || '',
        newPin: user?.pin_code || '',
        newLocationType: user?.location_type || 'Residential',
        reason: ''
    });

    const [expandedFaq, setExpandedFaq] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
    const [tickets, setTickets] = useState([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [showRevokeModal, setShowRevokeModal] = useState(null); // stores ticket to revoke
    const [isRevoking, setIsRevoking] = useState(false);

    const faqs = [
        {
            question: "How does energy allocation work?",
            answer: "Your energy allocation represents a reserved portion of clean energy generated from our solar infrastructure. This allocation is credited against your electricity consumption by the grid authorities."
        },
        {
            question: "How is my billing managed?",
            answer: "Your electricity billing is managed entirely by your local DISCOM (Distribution Company). KDIA Re Park ensures your clean energy allocation is active, but we do not track your real-time usage or generate electricity bills."
        },
        {
            question: "Who handles my electricity billing?",
            answer: "Your electricity billing continues to be managed by your local DISCOM (Distribution Company). KDIA Re Park provides the clean energy allocation infrastructure, while your regular electricity provider handles all billing, payments, and customer service for your electricity account."
        },
        {
            question: "How do I update my account information?",
            answer: "Account information updates are currently managed through our administrative team to ensure data accuracy and regulatory compliance. Please use the contact form below to request any changes to your profile, and our team will assist you with the update process."
        }
    ];

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const fetchUrl = '/support/tickets';
        console.log(`[Support] Fetching tickets from: ${fetchUrl}`);
        try {
            const res = await api.get(fetchUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`[Support] Fetch Tickets Status: ${res.status}`);
            // Ensure we set an array even if the fallback API returns an object
            const ticketData = res.data;
            setTickets(Array.isArray(ticketData) ? ticketData : (ticketData?.tickets || []));
        } catch (err) {
            console.error("[Support] Error fetching tickets:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
            // Don't alert here as it runs on mount
        } finally {
            setIsLoadingTickets(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequestFormChange = (e) => {
        const { name, value } = e.target;
        setRequestForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle Specialized Profile Request
        if (requestCategory === 'PROFILE_UPDATE_REQUEST') {
            if (!requestForm.reason) return;

            setIsSubmitting(true);
            try {
                // Construct Payload
                const changes = {
                    type: requestField, // 'contact' or 'address'
                    current: {},
                    requested: {},
                    reason: requestForm.reason
                };

                if (requestField === 'contact') {
                    changes.current = { email: user?.email, mobile: user?.mobileNumber };
                    changes.requested = { email: requestForm.newEmail, mobile: requestForm.newMobile };
                } else if (requestField === 'address') {
                    changes.current = {
                        address1: user?.address_line_1, address2: user?.address_line_2,
                        city: user?.city, state: user?.state, pin: user?.pin_code, type: user?.location_type
                    };
                    changes.requested = {
                        address1: requestForm.newAddress1, address2: requestForm.newAddress2,
                        city: requestForm.newCity, state: requestForm.newState, pin: requestForm.newPin, type: requestForm.newLocationType
                    };
                }

                console.log("[Support] Submitting Profile Update Request:", {
                    url: '/support/tickets',
                    payload: changes
                });

                const res = await api.post('/support/tickets', {
                    subject: requestField === 'contact' ? 'Profile Update Request: Contact Details' : 'Profile Update Request: Service Address',
                    description: JSON.stringify(changes), // Store structured data in description
                    category: 'PROFILE_UPDATE_REQUEST'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("[Support] Submit Response Status:", res.status);

                setSubmitStatus('success');
                fetchTickets();
                setTimeout(() => {
                    setSubmitStatus(null);
                    navigate('/support'); // Reset view
                }, 3000);
            } catch (err) {
                console.error("[Support] Error submitting profile request:", {
                    message: err.message,
                    status: err.response?.status,
                    data: err.response?.data
                });
                setSubmitStatus('error');
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Handle Standard Ticket
        if (!formData.subject || formData.message.length < 10) return;
        setIsSubmitting(true);
        try {
            const payload = {
                subject: formData.subject,
                description: formData.message,
                category: formData.subject // Or map properly if needed
            };

            console.log("[Support] Submitting Standard Ticket:", {
                url: '/support/tickets',
                payload: payload
            });

            const res = await api.post('/support/tickets', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("[Support] Submit Response Status:", res.status);

            setSubmitStatus('success');
            setFormData({ subject: '', message: '' });
            fetchTickets();
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (err) {
            console.error("[Support] Error submitting ticket:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevoke = async () => {
        if (!showRevokeModal) return;

        setIsRevoking(true);
        try {
            await api.patch(`/support/tickets/${showRevokeModal.id}/revoke`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTickets(); // Refresh list
            setShowRevokeModal(null);
            setToast({ message: 'Ticket revoked successfully.', type: 'success' });
        } catch (err) {
            console.error("Error revoking ticket:", err);
            setToast({ message: "Failed to revoke ticket. Please try again.", type: 'error' });
        } finally {
            setIsRevoking(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const configs = {
            'PENDING': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'Pending' },
            'IN_PROGRESS': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'In Progress' },
            'RESOLVED': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Resolved' },
            'REVOKED': { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100', label: 'Revoked' }
        };
        const config = configs[status] || configs['PENDING'];

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                {config.label}
            </span>
        );
    };

    if (!user) {
        return (
            <div className="flex-grow w-full py-20 text-center">
                <div className="card-premium p-10 max-w-lg mx-auto bg-white border-red-100 border-2">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-4">Unable to Load Support Center</h2>
                    <p className="text-sm text-slate-500 mb-8 font-medium">We're having trouble accessing your profile data. Please try refreshing the page or logging in again.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn-premium bg-teal-600 text-white hover:bg-teal-700 w-full"
                    >
                        Refresh Page
                    </button>
                    <button 
                        onClick={() => logout()}
                        className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                    >
                        Sign Out & Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="flex-grow w-full">
                {/* Hero Section */}
                <div className="mb-12 bg-teal-900 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl shadow-teal-900/10 relative overflow-hidden border border-teal-800">
                    <div className="relative z-10 max-w-3xl">
                        <span className="inline-block px-4 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-teal-300">Support & Help</span>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">We're Here to Help</h1>
                        <p className="mt-6 text-xl text-teal-100/70 font-medium leading-relaxed">
                            Access informational guidance and technical resources. This space is dedicated to your understanding of KDIA clean energy infrastructure—without commercial pressure.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-1/2 -ml-24 -mb-24 w-72 h-72 bg-teal-400/5 rounded-full blur-[60px]"></div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <a href="/customer/dashboard" className="card-premium p-6 group hover:bg-teal-50 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl group-hover:bg-teal-700 group-hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900">Dashboard</h3>
                                <p className="text-xs text-slate-500 font-medium">View your allocation</p>
                            </div>
                        </div>
                    </a>
                    <div className="card-premium p-6 bg-white group hover:bg-slate-50 transition-all border-teal-500/20 border-2 shadow-md">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900">Support & Help</h3>
                                <p className="text-xs text-slate-500 font-medium">You are here</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq-section" className="mb-12">
                    <div className="card-premium p-10">
                        <h2 className="text-2xl font-black text-slate-900 mb-8">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden transition-all hover:shadow-md">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-left text-sm font-bold text-slate-900">{faq.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-teal-600 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
                                            <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact/Support Form Section */}
                <div className="card-premium p-10 bg-white">
                    {requestCategory === 'PROFILE_UPDATE_REQUEST' ? (
                        <>
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                                        {requestField === 'contact' ? 'Update Contact Details' : 'Update Service Address'}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Please review your current details and specify the changes required.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/support')}
                                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                                >
                                    Cancel Request
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Current Values (Read Only) */}
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 opacity-75">
                                        <div className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Current Authorized Data
                                        </div>
                                        {requestField === 'contact' ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                                    <div className="text-sm font-bold text-slate-700">{user?.email}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Mobile</label>
                                                    <div className="text-sm font-bold text-slate-700">{user?.mobileNumber}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {user?.address_line_1}<br />
                                                        {user?.address_line_2}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {user?.city}, {user?.state} - {user?.pin_code}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Requested Changes (Editable) */}
                                    <div className="p-6 bg-white rounded-2xl border-2 border-teal-100 shadow-lg shadow-teal-900/5">
                                        <div className="mb-4 text-[10px] font-black text-teal-600 uppercase tracking-widest">
                                            Requested Changes
                                        </div>
                                        {requestField === 'contact' ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2">New Email</label>
                                                    <input
                                                        type="email"
                                                        name="newEmail"
                                                        value={requestForm.newEmail}
                                                        onChange={handleRequestFormChange}
                                                        className="input-premium w-full"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2">New Mobile</label>
                                                    <input
                                                        type="text"
                                                        name="newMobile"
                                                        value={requestForm.newMobile}
                                                        onChange={handleRequestFormChange}
                                                        className="input-premium w-full"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-2">Address Line 1</label>
                                                    <input
                                                        type="text" name="newAddress1" value={requestForm.newAddress1}
                                                        onChange={handleRequestFormChange} className="input-premium w-full" required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-2">City</label>
                                                        <input type="text" name="newCity" value={requestForm.newCity} onChange={handleRequestFormChange} className="input-premium w-full" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-2">PIN Code</label>
                                                        <input type="text" name="newPin" value={requestForm.newPin} onChange={handleRequestFormChange} className="input-premium w-full" required />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Reason Section */}
                                <div className="pt-6 border-t border-slate-100">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reason for Change (Required)</label>
                                    <textarea
                                        name="reason"
                                        value={requestForm.reason}
                                        onChange={handleRequestFormChange}
                                        rows="3"
                                        className="input-premium w-full resize-none"
                                        placeholder="Why is this update required?"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-premium bg-teal-600 text-white hover:bg-teal-700 w-full md:w-auto"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Change Request'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Contact KDIA Support</h2>
                            <p className="text-sm text-slate-500 mb-8">If you have specific allocation queries or need billing clarification, our team is here to help.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Auto-populated Customer Info (Read-only) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Name</label>
                                        <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Consumer ID</label>
                                        <p className="text-sm font-mono font-bold text-teal-700">{user?.consumerId}</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Subject Dropdown */}
                                    <div>
                                        <label htmlFor="subject" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            Subject
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="input-premium w-full bg-white transition-all ring-offset-0 focus:ring-2 focus:ring-teal-500/20"
                                        >
                                            <option value="" disabled>Select a subject</option>
                                            <option value="General Question">General Question</option>
                                            <option value="Billing & Metering Query">Billing & Metering Query</option>
                                            <option value="Allocation Related">Allocation Related</option>
                                            <option value="PROFILE_UPDATE_REQUEST">Profile Update Request</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Message Textarea */}
                                    <div>
                                        <label htmlFor="message" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            minLength="10"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Describe your query here..."
                                            className="input-premium w-full bg-white resize-none transition-all ring-offset-0 focus:ring-2 focus:ring-teal-500/20"
                                        ></textarea>
                                        <p className="mt-2 text-[10px] text-slate-400 font-medium">Please provide at least 10 characters.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.subject || formData.message.length < 10}
                                        className="btn-premium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Send Message
                                            </span>
                                        )}
                                    </button>

                                    {/* Success/Error Feedback */}
                                    {submitStatus === 'success' && (
                                        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl flex items-center animate-fade-in border border-emerald-100">
                                            <svg className="w-5 h-5 mr-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-bold">Your query has been shared with the KDIA team.</span>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="bg-red-50 text-red-800 p-4 rounded-2xl flex items-center animate-fade-in border border-red-100">
                                            <svg className="w-5 h-5 mr-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-bold">Submission failed. Please check your connection and try again.</span>
                                        </div>
                                    )}

                                    {/* Disclaimer Helper Text */}
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mt-2 italic">
                                        Support requests are reviewed by the KDIA Re Park team.
                                        <br />Responses may be provided via registered contact details.
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* My Support Requests Section */}
                <div className="mt-12">
                    <div className="card-premium p-10 bg-white">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">My Support Requests</h2>
                        <p className="text-sm text-slate-500 mb-8">Track the status of your reported infrastructure queries.</p>

                        {isLoadingTickets ? (
                            <div className="py-12 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You have not raised any support requests yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket ID</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="text-right py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(Array.isArray(tickets) ? tickets : []).map((ticket) => (
                                            <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="py-5 px-4">
                                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">#TK-{1000 + ticket.id}</span>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900">{ticket.subject}</span>
                                                        <span className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">{ticket.description}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <span className="text-xs font-bold text-slate-600">{new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <StatusBadge status={ticket.status} />
                                                </td>
                                                <td className="py-5 px-4 text-right">
                                                    {(ticket.status === 'PENDING' || ticket.status === 'IN_PROGRESS') && (
                                                        <button
                                                            onClick={() => setShowRevokeModal(ticket)}
                                                            className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-700 transition-colors"
                                                        >
                                                            Revoke
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Status Disclaimer */}
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed flex items-center italic">
                                <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Support ticket statuses are updated by the KDIA Re Park team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Note */}
                <div className="mt-16 text-center border-t border-slate-100 pt-12">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto">
                        All values shown in this portal are indicative and informational.
                        <br />Electricity billing continues to be handled by your DISCOM.
                    </p>
                </div>

            {/* Revoke Confirmation Modal */}
            {showRevokeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-sm w-full shadow-2xl animate-scale-in border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">Revoke Ticket?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                            Are you sure you want to revoke this support request? This action cannot be undone.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleRevoke}
                                disabled={isRevoking}
                                className="btn-premium w-full bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-900/20 disabled:opacity-50"
                            >
                                {isRevoking ? 'Revoking...' : 'Confirm Revocation'}
                            </button>
                            <button
                                onClick={() => setShowRevokeModal(null)}
                                disabled={isRevoking}
                                className="btn-premium w-full bg-white border-2 border-slate-100 text-slate-400 hover:text-slate-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default Support;
