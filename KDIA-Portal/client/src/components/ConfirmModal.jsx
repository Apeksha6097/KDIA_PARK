import React from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'primary' // primary, danger, success
}) => {
    if (!isOpen) return null;

    const getButtonStyle = () => {
        switch (type) {
            case 'danger': return { background: '#ef4444', color: '#fff' };
            case 'success': return { background: '#10b981', color: '#fff' };
            default: return { background: '#3b82f6', color: '#fff' };
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div style={{
                background: '#fff', padding: '32px', borderRadius: '16px',
                width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>{title}</h2>
                <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0',
                            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#64748b'
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '10px 24px', border: 'none', borderRadius: '8px',
                            cursor: 'pointer', fontWeight: '600', ...getButtonStyle()
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
