'use client'

import React from 'react'
import { AlertCircle, User, BarChart2, Bell, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="glass-card" style={{ 
      margin: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderRadius: '24px',
      position: 'sticky',
      top: '1rem',
      zIndex: 100
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertCircle size={32} color="var(--secondary)" />
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', margin: 0 }}>WahalaTracker</h1>
      </Link>
      
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/analytics" style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
        <Link href="/admin" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Shield size={20} />
          <span>Admin</span>
        </Link>
        <button className="flex-center" style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}>
          <Bell size={20} />
        </button>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} />
        </div>
      </nav>
    </header>
  )
}
