'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { AccountInfoCard } from '@/components/AccountInfoCard';
import { ActionButtons } from '@/components/ActionButtons';
import { useNotification } from '@/components/NotificationProvider';

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const auth = getAuth();
  const router = useRouter();
  const { notify } = useNotification();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNameUpdate = async (newName: string) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: newName });
      setUser({ ...user, displayName: newName });
      notify('Name updated successfully', 'success');
    } catch (err) {
      console.error(err);
      notify('Failed to update name', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      notify('Logged out successfully', 'success');
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      notify('Logout failed', 'error');
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="animate-spin" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid var(--glass-border)', 
          borderTopColor: 'var(--primary)', 
          borderRadius: '50%' 
        }} />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="container flex-center" style={{ minHeight: '80vh', padding: '1.5rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '400px', width: '100%', border: '1px solid var(--glass-border)' }}
        >
          <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '1.1rem' }}>You are not logged in.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 1.5rem' }}>Log in</Link>
            <Link href="/signup" className="btn-outline" style={{ textDecoration: 'none', padding: '0.8rem 1.5rem' }}>Sign up</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: '6rem', position: 'relative' }}>
      {/* Background glow highlight */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        height: '450px',
        background: 'radial-gradient(circle, rgba(0, 194, 140, 0.05) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '720px', margin: '2rem auto' }}>
        {/* Navigation Link back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <Link href="/dashboard" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: 'var(--foreground)', 
            opacity: 0.7, 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </motion.div>

        {/* Profile Card & Details with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 15 }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <ProfileHeader displayName={user.displayName || ''} email={user.email || ''} onEdit={handleNameUpdate} />
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 90 }}
          >
            <AccountInfoCard uid={user.uid} creationTime={user.metadata.creationTime || ''} lastSignInTime={user.metadata.lastSignInTime || ''} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 90 }}
          >
            <ActionButtons onLogout={handleLogout} />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
