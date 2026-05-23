'use client';

import React from 'react';
import { AlertCircle, User, BarChart2, Bell, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useNotification } from '@/components/NotificationProvider';

export default function Header() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const { notify } = useNotification();

  const handleLogout = async () => {
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
    notify('Logged out', 'success');
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <header className="glass-card" style={{
      margin: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '24px',
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <AlertCircle size={32} color="var(--secondary)" />
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>WahalaTracker</h1>
      </Link>

      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/analytics" style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
        {user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href="/admin" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
            <Shield size={20} />
            <span>Admin</span>
          </Link>
        )}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link href="/notifications" style={{ color: 'var(--foreground)' }}>
            <Bell size={20} />
          </Link>
          <Link href="/profile" style={{ color: 'var(--foreground)' }}>
            <User size={20} />
          </Link>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={user.displayName || user.email || 'User'}
            >
              <User size={20} />
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                opacity: 0.7,
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
