'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendEmailVerification 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      await updateProfile(userCredential.user, { displayName: name });

      // Send Email Verification
      await sendEmailVerification(userCredential.user);

      setSuccess("Account created successfully! We don send verification link to your email. Abeg verify am before you log in. 📩");
      
      // Clear input fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
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

  const handleGoogleSignUp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
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
      let friendlyMessage = 'Failed to sign up with Google. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "You cancel Google signup before e finish.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Create your <span className="gradient-text">Wahala</span> account
        </h2>

        {error && (
          <div style={{ background: 'rgba(255, 59, 48, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success, #34c759)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(52, 199, 89, 0.2)' }}>
            {success}
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
            style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1, width: '100%' }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', opacity: 0.5 }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--foreground)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--foreground)' }}></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.07)',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          {/* Simple Inline Google SVG Logo */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.707a5.416 5.416 0 010-3.414V4.961H.957a8.997 8.997 0 000 8.078l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.896 11.426 0 9 0A8.997 8.997 0 00.957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

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
