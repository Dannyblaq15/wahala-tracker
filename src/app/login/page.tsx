'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      let friendlyMessage = 'Failed to log in. Please check your credentials.';
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            friendlyMessage = "Abeg check your email or password again. E be like say something no match! 🤷‍♂️";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "That email format no correct. Please check how you write am.";
            break;
          case 'auth/user-disabled':
            friendlyMessage = "E be like say this account don block. Contact support first.";
            break;
          case 'auth/too-many-requests':
            friendlyMessage = "You don try too many times! Access is locked temporarily. Pls wait small.";
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
          Welcome back to <span className="gradient-text">Wahala Tracker</span>
        </h2>

        {error && (
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1, width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
