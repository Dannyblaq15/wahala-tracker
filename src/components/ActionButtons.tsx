'use client';

import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

interface ActionButtonsProps {
  onLogout: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onLogout }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginTop: '1.5rem',
      justifyContent: 'flex-start'
    }}>
      <Link href="/notifications" className="btn-outline" style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.95rem',
        padding: '0.8rem 1.5rem',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
      }}>
        <Settings size={18} />
        <span>Notification Settings</span>
      </Link>
      
      <button 
        onClick={onLogout} 
        className="btn-outline" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.95rem',
          padding: '0.8rem 1.5rem',
          borderRadius: '12px',
          borderColor: 'rgba(255, 59, 48, 0.2)',
          background: 'rgba(255, 59, 48, 0.04)',
          color: 'var(--error)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--error)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'var(--error)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 59, 48, 0.04)';
          e.currentTarget.style.color = 'var(--error)';
          e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.2)';
        }}
      >
        <LogOut size={18} />
        <span>Logout Session</span>
      </button>
    </div>
  );
};
