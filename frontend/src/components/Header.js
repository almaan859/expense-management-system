import React from 'react';

const Header = ({ role, logout }) => {
  return (
    <div style={{
      background: 'rgba(15, 15, 35, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '20px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="holo-title" style={{ fontSize: '1.8rem' }}>
          💰 ExpenseFlow AI
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ color: '#a0a0a0' }}>
            {role ? role.toUpperCase() : 'GUEST'}
          </span>
          {logout && (
            <button 
              onClick={logout}
              className="btn-neon"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

