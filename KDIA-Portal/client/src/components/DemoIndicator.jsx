import React from 'react';

const DemoIndicator = () => {
    // Ideally this would check import.meta.env.VITE_DEMO_MODE, but for now we render it always or conditionally based on usage
    // We will style it to be unobtrusive
    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
            <div className="bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Demo Environment</span>
                </div>
                <div className="text-[8px] font-medium text-slate-400">
                    Data shown here is simulated and may reset periodically.
                </div>
            </div>
        </div>
    );
};

export default DemoIndicator;
