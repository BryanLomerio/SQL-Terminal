import React from 'react';

const BackButton = ({ visible, onClick }) => {
    if (!visible) return null;
    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                fontSize: '12px',
                padding: '4px 8px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                zIndex: 1100,
            }}
        >
            Back
        </button>
    );
};

export default BackButton;
