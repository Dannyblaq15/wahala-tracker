'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    await updateProfile(user, { displayName: newName });
    setUser({ ...user, displayName: newName });
    notify('Name updated', 'success');
  };

  const handleLogout = async () => {
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm shadow-lg">
          <p className="mb-4">You are not logged in.</p>
          <Link href="/login" className="mr-4 underline text-primary">Log in</Link>
          <Link href="/signup" className="underline text-primary">Sign up</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl p-6">
      <ProfileHeader displayName={user.displayName || ''} email={user.email || ''} onEdit={handleNameUpdate} />
      <AccountInfoCard uid={user.uid} creationTime={user.metadata.creationTime || ''} lastSignInTime={user.metadata.lastSignInTime || ''} />
      <ActionButtons onLogout={handleLogout} />
    </section>
  );
}
