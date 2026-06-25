'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthUser } from '@/hooks/useAuthUser';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Activity, 
  Layers, 
  HelpCircle, 
  Smartphone, 
  Plus, 
  TrendingUp, 
  LogOut, 
  Bell, 
  User, 
  Info, 
  X, 
  Download, 
  Share2, 
  CheckCircle,
  Send,
  MessageSquare,
  Bookmark
} from 'lucide-react';

// Vibe options for the interactive Vibe-o-Meter
const VIBES = [
  { 
    emoji: '🥵', 
    label: 'Stressed', 
    color: '#FF8C00', 
    desc: 'Traffic on Third Mainland Bridge, NEPA take light inside afternoon, or code refuse to deploy? Classic Naija stress. Log it to protect your peace!' 
  },
  { 
    emoji: '😡', 
    label: 'Vexed', 
    color: '#FF3B30', 
    desc: 'Who log you out of happiness? Subscriptions run out, fuel queue, or network issues? Document this vexation now make we analyze!' 
  },
  { 
    emoji: '😐', 
    label: 'Neutral', 
    color: '#FFCC00', 
    desc: 'No too much joy, no too much wahala. Just steady focus and daily grind. Standard levels. Keep logging to stay consistent!' 
  },
  { 
    emoji: '😊', 
    label: 'Vibrant', 
    color: '#34C759', 
    desc: 'Traffic clear, NEPA bring light, code build on first try? You are highly favored! Log this win so you can remember it on dark days.' 
  }
];

// Interactive emoji bubbles positioning and animation configurations
const EMOJI_BUBBLES = [
  { emoji: '🥵', label: 'Stressed', color: '#FF8C00', x: '8%', top: '24%', delay: 0, rotate: -12 },
  { emoji: '😡', label: 'Vexed', color: '#FF3B30', x: '64%', top: '15%', delay: 1.5, rotate: 15 },
  { emoji: '😐', label: 'Neutral', color: '#FFCC00', x: '30%', top: '34%', delay: 0.8, rotate: -8 },
  { emoji: '😊', label: 'Vibrant', color: '#34C759', x: '76%', top: '29%', delay: 2.2, rotate: 10 }
];

// Float animation variants for the background bubbles
const floatVariants = (delay: number) => ({
  animate: {
    y: [0, -15, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
      delay: delay
    }
  }
});

export default function Home() {
  const { user, loading: authLoading } = useAuthUser();
  const router = useRouter();
  
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showiOSInstructions, setShowiOSInstructions] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<number | null>(null);
  
  // Stats & recent logs for authenticated PWA launcher
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [greeting, setGreeting] = useState('Welcome');

  // Time-based greeting helper
  const updateGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning, Chief 🌅');
    else if (hours < 17) setGreeting('Good afternoon, Boss ☀️');
    else if (hours < 22) setGreeting('Good evening, Elder 🌌');
    else setGreeting('Working late, Legend 🦉');
  };

  useEffect(() => {
    // 1. Determine if running as PWA (including Android TWA referrer check)
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true ||
                        source === 'pwa' ||
                        (typeof document !== 'undefined' && document.referrer.includes('android-app://'));
    setIsPWA(isStandalone);
    updateGreeting();

    // 2. Setup install prompts for standard browser users
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show banner if not already in standalone mode
      if (!isStandalone) {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback timer to show install helper (e.g. for iOS/Safari where beforeinstallprompt doesn't fire)
    if (!isStandalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowInstallBanner(true);
        }, 3000);
        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          clearTimeout(timer);
        };
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Fetch recent user logs for PWA Console Launchpad
  useEffect(() => {
    if (isPWA && user) {
      setLogsLoading(true);
      fetch('/api/wahala')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRecentLogs(data.slice(0, 3));
          }
        })
        .catch((err) => console.error('Error fetching dashboard logs:', err))
        .finally(() => setLogsLoading(false));
    }
  }, [isPWA, user]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else {
      // Trigger iOS instruction modal
      setShowiOSInstructions(true);
    }
  };

  const dismissInstallBanner = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallBanner(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.refresh();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // LOADING / AUTH SPLASH
  // ───────────────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: '1rem',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '4px solid var(--glass-border)',
          borderTopColor: 'var(--secondary)',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Initializing stress console...</p>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PWA MODE: AUTHENTICATED (LAUNCHPAD / CONSOLE QUICK ACCESSS)
  // ───────────────────────────────────────────────────────────────────────────
  if (isPWA && user) {
    return (
      <main className="container" style={{ paddingBottom: '4rem', marginTop: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '680px', margin: '0 auto' }}
        >
          {/* Custom Greetings Header */}
          <div className="glass-card" style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, rgba(0, 135, 81, 0.15), rgba(255, 140, 0, 0.05))',
            border: '1px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', filter: 'blur(15px)', zIndex: 0 }} />
            
            <div style={{ zIndex: 1, position: 'relative' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, fontWeight: 700, color: 'var(--secondary)' }}>Wahala Tracker Mobile App</span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', lineHeight: '1.2' }}>{greeting}</h2>
              <p style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '0.95rem' }}>
                Your private sanity helper. Ready to log some challenges?
              </p>
            </div>
          </div>

          {/* Quick-Launch Dashboard Actions Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Launch Console</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <Link href="/dashboard" className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem', 
                textDecoration: 'none', 
                color: 'var(--foreground)',
                padding: '1.5rem',
                borderLeft: '4px solid var(--primary)'
              }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(0, 194, 140, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Plus size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Log Wahala</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Record daily stressor</span>
                </div>
              </Link>

              <Link href="/analytics" className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem', 
                textDecoration: 'none', 
                color: 'var(--foreground)',
                padding: '1.5rem',
                borderLeft: '4px solid var(--secondary)'
              }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 140, 0, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Analytics</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Severity & vibe trends</span>
                </div>
              </Link>

              <Link href="/profile" className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem', 
                textDecoration: 'none', 
                color: 'var(--foreground)',
                padding: '1.5rem'
              }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
                  <User size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Account</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Preferences & secure keys</span>
                </div>
              </Link>

              <Link href="/notifications" className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem', 
                textDecoration: 'none', 
                color: 'var(--foreground)',
                padding: '1.5rem'
              }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
                  <Bell size={22} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Alerts</h4>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Stress triggers & logs</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick-glance Stats / Recent Entries */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.05em' }}>Recent logs summary</h4>
              <Link href="/dashboard" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
            </div>

            {logsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--glass-border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : recentLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {recentLogs.map((log) => (
                  <div key={log.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.7rem 1rem',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${log.severity >= 4 ? 'var(--error)' : 'var(--secondary)'}`
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.title}</div>
                      <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>{log.category || 'General'}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                      {log.vibe || 'neutral'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', opacity: 0.5, textAlign: 'center', padding: '1rem 0' }}>No wahala logged recently. Clean vibes! 🇳🇬</p>
            )}
          </div>

          {/* Quick Sign Out */}
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 59, 48, 0.05)',
              border: '1px solid rgba(255, 59, 48, 0.15)',
              color: 'var(--error)',
              borderRadius: '12px',
              padding: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              transition: 'all 0.2s ease'
            }}
            className="logout-btn"
          >
            <LogOut size={16} /> Sign out from App
          </button>
        </motion.div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // PWA MODE: UNAUTHENTICATED (HIGH-FIDELITY APK WELCOME REDESIGN)
  // ───────────────────────────────────────────────────────────────────────────
  if (isPWA && !user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `
          linear-gradient(rgba(0, 135, 81, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 135, 81, 0.03) 1px, transparent 1px),
          radial-gradient(circle at 50% 30%, #004d2e 0%, #0d0d0d 100%)
        `,
        backgroundSize: '45px 45px, 45px 45px, 100% 100%',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        padding: '2.5rem 2rem',
        justifyContent: 'space-between',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Floating Glossy Interactive Emoji Bubbles */}
        {EMOJI_BUBBLES.map((bubble, idx) => {
          const isSelected = selectedVibe === idx;
          return (
            <motion.div 
              key={idx}
              variants={floatVariants(bubble.delay)}
              animate="animate"
              style={{ 
                position: 'absolute', 
                left: bubble.x, 
                top: bubble.top, 
                transform: `rotate(${bubble.rotate}deg)`, 
                zIndex: 5 
              }}
            >
              <button
                onClick={() => setSelectedVibe(idx)}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1.5px solid',
                  borderColor: isSelected ? bubble.color : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: isSelected 
                    ? `0 0 20px ${bubble.color}aa, inset 0 0 10px rgba(255, 255, 255, 0.3)` 
                    : '0 8px 32px 0 rgba(0, 10, 40, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  padding: 0,
                }}
              >
                <span style={{ fontSize: '1.6rem', lineHeight: '1' }}>{bubble.emoji}</span>
                <span style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 800, 
                  color: isSelected ? bubble.color : 'rgba(255, 255, 255, 0.4)', 
                  textTransform: 'uppercase', 
                  marginTop: '2px', 
                  letterSpacing: '0.05em' 
                }}>
                  {bubble.label}
                </span>
              </button>
            </motion.div>
          );
        })}

        {/* Top Header Row */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          zIndex: 10,
        }}>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            Wahala
          </h1>
          <Link href="/forgot-password" style={{
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '99px',
            padding: '0.5rem 1.1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
          }}>
            Contact us
          </Link>
        </header>

        {/* Middle Core Copy & Design Section */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          width: '100%',
          marginTop: 'auto',
          marginBottom: '2rem',
          zIndex: 10,
        }}>
          {/* Main Huge Typography Titles */}
          <div style={{
            fontSize: '3.6rem',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}>
            <div>Wahala.</div>
            <div style={{ color: '#00C28C', opacity: 0.9 }}>Managed.</div>
          </div>

          {/* Interactive dynamic vibe description card */}
          <div style={{
            minHeight: '105px',
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '18px',
            padding: '1.2rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            borderLeft: selectedVibe !== null ? `4px solid ${VIBES[selectedVibe].color}` : '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <AnimatePresence mode="wait">
              {selectedVibe !== null ? (
                <motion.div
                  key={selectedVibe}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    color: VIBES[selectedVibe].color 
                  }}>
                    Current Vibe: {VIBES[selectedVibe].label}
                  </span>
                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'rgba(255, 255, 255, 0.85)', 
                    lineHeight: '1.45', 
                    margin: '0.3rem 0 0 0' 
                  }}>
                    {VIBES[selectedVibe].desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em', 
                    color: '#00C28C' 
                  }}>
                    Status Console
                  </span>
                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'rgba(255, 255, 255, 0.75)', 
                    lineHeight: '1.45', 
                    margin: '0.3rem 0 0 0' 
                  }}>
                    Stress is everywhere. Sanity isn't. Tap any floating emoji above to check in.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Bottom Button Rows */}
        <footer style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          width: '100%',
          maxWidth: '420px',
          zIndex: 10,
        }}>
          <Link href="/signup" style={{
            background: '#008751',
            color: 'white',
            borderRadius: '16px',
            padding: '1.1rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(0, 135, 81, 0.35)',
            border: 'none',
            transition: 'transform 0.2s ease',
          }}
          className="btn-pwa-action"
          >
            Start Logging (Sign Up) <ArrowRight size={18} />
          </Link>

          <Link href="/login" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            color: 'white',
            borderRadius: '16px',
            padding: '1.1rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            transition: 'background 0.2s ease',
          }}
          className="btn-pwa-secondary"
          >
            Continue Log (Login) <ArrowRight size={18} />
          </Link>
        </footer>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // BROWSER MODE: STANDARD MARKETING WEBPAGE WITH PWA INSTALL INVITES
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <main className="container" style={{ paddingBottom: '6rem', overflowX: 'hidden', position: 'relative' }}>
      
      {/* 1. Custom floating browser PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 1000,
              maxWidth: '360px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(135deg, rgba(13, 13, 13, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
              border: '1px solid var(--primary)',
            }}
            className="glass-card"
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                background: 'rgba(0, 135, 81, 0.1)', 
                color: 'var(--primary)', 
                padding: '0.6rem', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Smartphone size={28} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Install App <Sparkles size={14} color="var(--secondary)" />
                </h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: '1.4' }}>
                  Pin Wahala Tracker to your home screen for instant alerts, offline logs, and faster widgets.
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleInstallClick} 
                    className="btn-primary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Download size={12} /> Install
                  </button>
                  <button 
                    onClick={() => setShowiOSInstructions(true)} 
                    className="btn-outline" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px' }}
                  >
                    iOS Guide
                  </button>
                </div>
              </div>
              <button 
                onClick={dismissInstallBanner}
                style={{ background: 'none', border: 'none', color: 'var(--foreground)', opacity: 0.5, cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. iOS Safari Step-by-Step Instruction Modal */}
      <AnimatePresence>
        {showiOSInstructions && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(4px)'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card" 
              style={{ maxWidth: '400px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Smartphone size={22} color="var(--primary)" /> iOS Safari Install Guide
                </h3>
                <button 
                  onClick={() => setShowiOSInstructions(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--foreground)', opacity: 0.5, cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <p>Apple Safari does not support automated install buttons. Follow these 3 easy steps to install:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>1</span>
                    <span>Open this site in <strong>Safari browser</strong>.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>2</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                      Tap the <strong>Share</strong> button <Share2 size={16} color="var(--secondary)" /> in the menu bar.
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>3</span>
                    <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowiOSInstructions(false)}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Got it!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Original Marketing Landing Page Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '6rem', marginTop: '3rem' }}
      >
        {/* HERO SECTION */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          gap: '3rem', 
          alignItems: 'center',
          minHeight: '75vh',
        }} className="form-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 140, 0, 0.1)',
              border: '1px solid rgba(255, 140, 0, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              fontSize: '0.85rem',
              color: 'var(--secondary)',
              width: 'fit-content',
              fontWeight: 600,
            }}>
              <Sparkles size={16} />
              <span>Naija's #1 Stress Tracker</span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', lineHeight: '1.15', fontWeight: 900 }}>
              Wetyn be your <span className="gradient-text">Wahala</span> today?
            </h1>
            
            <p style={{ opacity: 0.8, fontSize: '1.15rem', lineHeight: '1.6', maxWidth: '520px' }}>
              No lock your mind! Log your daily stress, track issues, analyze your stress severity, and keep your sanity in check with our premium Nigerian-flavored tracker.
            </p>
            
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn-primary" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                textDecoration: 'none',
                padding: '1rem 2rem',
                fontSize: '1.05rem'
              }}>
                Start Log (Sign Up) <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn-outline" style={{ 
                textDecoration: 'none',
                padding: '1rem 2rem',
                fontSize: '1.05rem'
              }}>
                Continue Log (Login)
              </Link>
            </div>
          </div>

          {/* DYNAMIC APP PREVIEW */}
          <div style={{ position: 'relative' }}>
            {/* Background Glow */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(0, 194, 140, 0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
              zIndex: -1
            }} />
            
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--glass-border)' }}>
              {/* Header inside Mock App */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <AlertCircle size={24} color="var(--secondary)" />
                  <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Wahala Console</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--error)' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                </div>
              </div>

              {/* Statistics Grid Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>Stress severity Index</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>4.3 / 5.0</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>Vibe level</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>Stressed 🥵</div>
                </div>
              </div>

              {/* Mock Logs List */}
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.8rem', letterSpacing: '0.05em' }}>Recent tracked logs</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { title: "Internet don disconnect during deploy", severity: 5, mood: "angry", category: "Work" },
                  { title: "NEPA take light inside hot afternoon", severity: 4, mood: "stressed", category: "Living" },
                  { title: "Traffic for Third Mainland Bridge", severity: 3, mood: "neutral", category: "Transit" },
                ].map((w, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${w.severity >= 4 ? 'var(--error)' : 'var(--secondary)'}`
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{w.title}</div>
                      <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{w.category}</span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      textTransform: 'capitalize'
                    }}>
                      {w.mood}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>How Wahala Tracker <span className="gradient-text">helps you survive</span></h2>
            <p style={{ opacity: 0.6 }}>Designed to make stress tracking engaging, lighthearted, and data-driven.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="form-grid">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(0, 194, 140, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Real-time Stress Severity</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Rate your challenges on a scale of 1-5. Instantly monitor whether your stress levels are climbing into a critical zone.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(255, 140, 0, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Vibe & Mood Analysis</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our natural sentiment engine scans your descriptions to automatically label your log's vibe (happy, vibrant, angry, or stressed).
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(255, 59, 48, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--error)' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Visual Analytics</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Examine comprehensive stress indexes and trends in the dashboard to identify patterns and reclaim control of your peace.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY & TRUST */}
        <section className="glass-card form-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr', 
          gap: '2.5rem', 
          alignItems: 'center',
          padding: '3rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(0, 194, 140, 0.1)', padding: '1.8rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <ShieldCheck size={56} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.8rem' }}>Secure, Private, and Anonymous Options</h3>
            <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
              Your mental health is personal. We sanitize data so sensitive details remain secure. Role-based privileges ensure standard administrators only monitor user statistics without access to individual logs.
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', opacity: 0.6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={16} /> Made with respect for peace of mind
              </span>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section style={{ 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '2rem',
          padding: '4rem 1.5rem',
          background: 'radial-gradient(ellipse at center, rgba(0, 135, 81, 0.08) 0%, transparent 70%)',
        }}>
          <h2 style={{ fontSize: '2.5rem', maxWidth: '650px', lineHeight: '1.2' }}>
            Ready to convert your <span className="gradient-text">Wahala into insights</span>?
          </h2>
          <p style={{ opacity: 0.7, maxWidth: '480px' }}>
            Join thousands of users logging and managing stress. Create your account in less than 30 seconds.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
              Register Account Now
            </Link>
            <Link href="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
              Log in to Account
            </Link>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
