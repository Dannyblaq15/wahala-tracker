'use client';

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your email inbox (and spam folder too) to set your new password. 📩");
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = 'Could not send reset email. Please try again.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            friendlyMessage = "We no fit find any account with this email address. Double-check am! 🤷‍♂️";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "That email format no correct. Please check how you write am.";
            break;
          case 'auth/too-many-requests':
            friendlyMessage = "You don try too many times! Pls wait small before you try again.";
            break;
          case 'auth/network-request-failed':
            friendlyMessage = "Internet network issues! Check your connection and try again.";
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
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>
          Reset your <span className="gradient-text">Password</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--foreground)', opacity: 0.7, fontSize: '0.9rem', marginBottom: '2rem' }}>
          No panic! Enter your email and we go send you link to set new password.
        </p>

        {error && (
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success, #34c759)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(52, 199, 89, 0.2)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1, width: '100%' }}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          Remember your password?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
