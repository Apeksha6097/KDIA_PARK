import React from 'react';

const DashboardBanner = ({ title, text }) => {
    return (
        <div className="bg-teal-50 border-b border-teal-100 px-4 py-3 sm:px-6 log:px-8">
            <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                    <svg className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    {title && <p className="text-[10px] font-black text-teal-800 uppercase tracking-widest mb-0.5">{title}</p>}
                    <p className="text-xs text-teal-700 font-medium leading-relaxed">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardBanner;
