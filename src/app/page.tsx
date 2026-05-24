'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ShieldCheck, Heart, Sparkles, Activity, Layers, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  // Mock wahala logs for preview
  const mockWahalas = [
    { title: "Internet don disconnect during deploy", severity: 5, mood: "angry", category: "Work" },
    { title: "NEPA take light inside hot afternoon", severity: 4, mood: "stressed", category: "Living" },
    { title: "Traffic for Third Mainland Bridge", severity: 3, mood: "neutral", category: "Transit" },
  ];

  return (
    <main className="container" style={{ paddingBottom: '6rem', overflowX: 'hidden' }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
          
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          </motion.div>

          {/* DYNAMIC APP PREVIEW */}
          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
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
                {mockWahalas.map((w, idx) => (
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
                      background: 'rgba(255,255,255,0.05)', 
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
          </motion.div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>How Wahala Tracker <span className="gradient-text">helps you survive</span></h2>
            <p style={{ opacity: 0.6 }}>Designed to make stress tracking engaging, lighthearted, and data-driven.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="form-grid">
            <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(0, 194, 140, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Real-time Stress Severity</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Rate your challenges on a scale of 1-5. Instantly monitor whether your stress levels are climbing into a critical zone.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(255, 140, 0, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Vibe & Mood Analysis</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our natural sentiment engine scans your descriptions to automatically label your log's vibe (happy, vibrant, angry, or stressed).
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem' }}>
              <div style={{ width: '45px', height: '45px', background: 'rgba(255, 59, 48, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--error)' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Visual Analytics</h3>
              <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Examine comprehensive stress indexes and trends in the dashboard to identify patterns and reclaim control of your peace.
              </p>
            </motion.div>
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
          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(0, 194, 140, 0.1)', padding: '1.8rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <ShieldCheck size={56} />
            </div>
          </motion.div>
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.8rem' }}>Secure, Private, and Anonymous Options</h3>
            <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
              Your mental health is personal. We sanitize data so sensitive details remain secure. Role-based privileges ensure standard administrators only monitor user statistics without access to individual logs.
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', opacity: 0.6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={16} /> Made with respect for peace of mind
              </span>
            </div>
          </motion.div>
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
          <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', maxWidth: '650px', lineHeight: '1.2' }}>
            Ready to convert your <span className="gradient-text">Wahala into insights</span>?
          </motion.h2>
          <motion.p variants={itemVariants} style={{ opacity: 0.7, maxWidth: '480px' }}>
            Join thousands of users logging and managing stress. Create your account in less than 30 seconds.
          </motion.p>
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
              Register Account Now
            </Link>
            <Link href="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '1rem 2.5rem' }}>
              Log in to Account
            </Link>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}
