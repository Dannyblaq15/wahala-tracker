import React from 'react';
import { Copy, Calendar, Clock, ShieldCheck, Key } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { useNotification } from '@/components/NotificationProvider';

interface AccountInfoCardProps {
  uid: string;
  creationTime: string;
  lastSignInTime: string;
}

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ uid, creationTime, lastSignInTime }) => {
  const { notify } = useNotification();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      notify(`${label} copied`, 'success');
    });
  };

  const formattedCreatedDate = creationTime 
    ? new Date(creationTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Not available';
    
  const formattedLastActive = lastSignInTime 
    ? new Date(lastSignInTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Not available';

  return (
    <article className="glass-card" style={{
      border: '1px solid var(--glass-border)',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <ShieldCheck size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Account Settings & Security</h3>
      </div>

      {/* Details List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* UID */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center' }}>
              <Key size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>User Identifier (UID)</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--foreground)', marginTop: '0.1rem' }}>
                {uid}
              </div>
            </div>
          </div>
          <IconButton
            icon={Copy}
            onClick={() => copy(uid, 'UID')}
            label="Copy UID"
          />
        </div>

        {/* Date Joined */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          gap: '0.8rem'
        }}>
          <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Stress Board Registration Date</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.1rem' }}>
              {formattedCreatedDate}
            </div>
          </div>
        </div>

        {/* Last Active */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          gap: '0.8rem'
        }}>
          <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Last Active Session</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.1rem' }}>
              {formattedLastActive}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
