import React, { useEffect } from 'react';

const Toast = ({
    message,
    type = 'success',
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'error': return { background: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2' };
            case 'warning': return { background: '#fffbeb', color: '#92400e', border: '1px solid #fef3c7' };
            default: return { background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' };
        }
    };

    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '24px',
            padding: '16px 24px', borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            fontWeight: '600', fontSize: '0.9rem',
            zIndex: 3000, display: 'flex', alignItems: 'center', gap: '12px',
            ...getStyles(),
            animation: 'slideIn 0.3s ease-out'
        }}>
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '4px', display: 'flex' }}
            >
                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <style>
                {`
                    @keyframes slideIn {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default Toast;
