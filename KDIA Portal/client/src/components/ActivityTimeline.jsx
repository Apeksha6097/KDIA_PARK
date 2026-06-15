import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatTimestamp } from '../utils/dateUtils';
import api from '../services/api';

const ACTIVITY_ICONS = {
    allocation: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    ticket: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
    ),
    profile: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    statement: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    default: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    )
};

const ACTIVITY_STYLES = {
    allocation: 'bg-teal-800 text-white shadow-lg shadow-teal-900/20',
    ticket: 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20',
    profile: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20',
    statement: 'bg-slate-900 text-white',
    default: 'bg-slate-600 text-white'
};

const ActivityTimeline = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTimeline = useCallback(async () => {
        try {
            const res = await api.get('/activity/timeline', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch activity timeline:', err);
            setError('Unable to load activity timeline');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTimeline();
    }, [fetchTimeline]);

    const sanitizeDescription = (desc) => {
        if (!desc) return '';
        if (desc.includes('Monthly Energy Statement generated')) {
            return 'Service period update recorded';
        }
        // General sanitization
        return desc.replace(/Consumption/g, 'Service Activity');
    };

    // Derived state for content to avoid complex conditional returns
    const content = useMemo(() => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-slate-500 font-medium">{error}</p>
                </div>
            );
        }

        if (events.length === 0) {
            return (
                <>
                    <p className="text-xs text-slate-400 font-medium mb-4">Recent updates and actions related to your account.</p>
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-slate-500 font-medium">No recent account activity available.</p>
                    </div>
                </>
            );
        }

        return (
            <>
                <p className="text-xs text-slate-400 font-medium mb-10">Recent updates and actions related to your account.</p>
                <div className="space-y-10 relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>

                    {events.map((event, index) => (
                        <div key={index} className="relative flex items-start space-x-6">
                            {/* Icon */}
                            <div className={`z-10 p-2.5 rounded-full ${ACTIVITY_STYLES[event.type] || ACTIVITY_STYLES.default}`}>
                                {ACTIVITY_ICONS[event.type] || ACTIVITY_ICONS.default}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className="text-sm font-black text-slate-900">
                                    {sanitizeDescription(event.description)}
                                </h4>
                                {event.referenceId && (
                                    <p className="text-xs text-slate-500 mt-1 font-medium italic">
                                        Reference: {event.referenceId}
                                    </p>
                                )}
                                <span className="text-[10px] font-black text-slate-300 uppercase mt-2 block tracking-widest">
                                    {formatTimestamp(event.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }, [loading, error, events]);

    return (
        <div className="card-premium p-10">
            <h3 className="text-xl font-black text-slate-900 mb-4">Account Activity</h3>
            {content}
        </div>
    );
};

export default ActivityTimeline;

