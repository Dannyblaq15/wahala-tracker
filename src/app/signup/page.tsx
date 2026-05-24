'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      await updateProfile(userCredential.user, { displayName: name });

      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create session');
      }
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = 'Failed to sign up. Please try again.';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            friendlyMessage = "This email address already has an account. Try logging in instead! 🔑";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "That email format no correct. Please check how you write am.";
            break;
          case 'auth/weak-password':
            friendlyMessage = "Your password too weak. Abeg select a strong password (at least 6 characters).";
            break;
          case 'auth/operation-not-allowed':
            friendlyMessage = "E be like say signups no allowed right now. Contact admin.";
            break;
          case 'auth/network-request-failed':
            friendlyMessage = "Internet network wahala! Check your connection and try again.";
            break;
          default:
            friendlyMessage = err.message || friendlyMessage;
        }
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Create your <span className="gradient-text">Wahala</span> account
        </h2>

        {error && (
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1, width: '100%' }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
