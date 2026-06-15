import React, { useState } from 'react';
import { Edit2, ClipboardCopy, Check, X } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useNotification } from '@/components/NotificationProvider';

interface ProfileHeaderProps {
  displayName: string;
  email: string;
  onEdit: (newName: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ displayName, email, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const { notify } = useNotification();

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    notify('Email copied', 'success');
  };

  const save = () => {
    onEdit(name);
    setEditing(false);
  };

  const initial = (displayName || email || 'U').charAt(0).toUpperCase();

  return (
    <header className="glass-card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      padding: '2.5rem 2rem',
      borderRadius: '24px',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--glass-border)',
    }}>
      {/* Background radial highlight */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '-40%',
        width: '180%',
        height: '180%',
        background: 'radial-gradient(circle at 30% 30%, rgba(0, 194, 140, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Avatar with dynamic premium gradient */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px var(--primary-glow)',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0,
        userSelect: 'none'
      }}>
        <span style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 900, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{initial}</span>
      </div>

      {/* Profile Details */}
      <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 700,
        }}>
          Oga/Madam Profile 🇳🇬
        </span>
        
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--primary)',
                color: 'var(--foreground)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: 600,
                outline: 'none',
                maxWidth: '240px'
              }}
              autoFocus
            />
            <button onClick={save} className="btn-primary" style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              border: 'none',
              cursor: 'pointer'
            }}>
              <Check size={14} /> Save
            </button>
            <button onClick={() => { setName(displayName); setEditing(false); }} className="btn-outline" style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}>
              <X size={14} /> Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
            <h2 className="gradient-text" style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {displayName || 'No Name Set'}
            </h2>
            <IconButton
              icon={Edit2}
              onClick={() => setEditing(true)}
              label="Edit name"
              className="btn-icon"
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.7, fontSize: '0.95rem', overflow: 'hidden' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
          <IconButton
            icon={ClipboardCopy}
            onClick={handleCopy}
            label="Copy email"
            className="btn-icon"
          />
        </div>
      </div>
    </header>
  );
};
