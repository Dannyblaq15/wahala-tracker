'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import WahalaForm from '@/components/WahalaForm'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trash2, RefreshCw, AlertTriangle, Users, Database, Edit3, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminPage() {
  const [wahalas, setWahalas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgSeverity: 0,
    highSeverityCount: 0
  })
  const [editingWahala, setEditingWahala] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('wahalas')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setWahalas(data)
        calculateStats(data)
      }
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: any[]) => {
    const total = data.length
    const avg = total > 0 ? data.reduce((acc, curr) => acc + curr.severity, 0) / total : 0
    const high = data.filter(w => w.severity >= 4).length
    setStats({ totalLogs: total, avgSeverity: avg, highSeverityCount: high })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wahala? This action is permanent.')) return
    
    try {
      const { error } = await supabase
        .from('wahalas')
        .delete()
        .eq('id', id)

      if (!error) {
        const updated = wahalas.filter(w => w.id !== id)
        setWahalas(updated)
        calculateStats(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleFormSuccess = (newData: any) => {
    setIsFormOpen(false)
    setEditingWahala(null)
    fetchAdminData()
  }

  return (
    <main className="container" style={{ paddingBottom: '4rem' }}>
      <Header />

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--error)', padding: '0.8rem', borderRadius: '12px' }}>
              <Shield color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Admin <span className="gradient-text">Control Center</span></h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Manage system data and monitor global wahala levels.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => {
                setEditingWahala(null)
                setIsFormOpen(true)
              }}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              Create New
            </button>
            <button 
              onClick={fetchAdminData}
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid-auto" style={{ marginBottom: '3rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Database opacity={0.5} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>System Load</span>
            </div>
            <h3 style={{ fontSize: '2rem' }}>{stats.totalLogs}</h3>
            <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Total Wahala Entries</p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <AlertTriangle opacity={0.5} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Severity Avg</span>
            </div>
            <h3 style={{ fontSize: '2rem' }}>{stats.avgSeverity.toFixed(1)}</h3>
            <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Global Stress Index</p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid var(--error)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Users opacity={0.5} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--error)' }}>Critical</span>
            </div>
            <h3 style={{ fontSize: '2rem' }}>{stats.highSeverityCount}</h3>
            <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>High-Severity Alerts</p>
          </div>
        </div>

        {/* Database Explorer / Setup Helper */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>Database Management</h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Target: {process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
          </div>
          
          {wahalas.length === 0 && !loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Database size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Table not found or empty?</h3>
              <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0.5rem auto 2rem' }}>
                If you just switched databases, you need to create the <code>wahalas</code> table in your Supabase SQL Editor.
              </p>
              
              <div style={{ textAlign: 'left', background: '#000', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', position: 'relative' }}>
                <pre style={{ fontSize: '0.8rem', color: 'var(--primary)', overflowX: 'auto' }}>
{`CREATE TABLE public.wahalas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  mood TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wahalas;`}
                </pre>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`CREATE TABLE public.wahalas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  mood TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER PUBLICATION supabase_realtime ADD TABLE public.wahalas;`);
                    alert('SQL copied to clipboard!');
                  }}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                  className="btn-outline"
                >
                  Copy SQL
                </button>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Title</th>
                    <th style={{ padding: '1rem' }}>Mood</th>
                    <th style={{ padding: '1rem' }}>Severity</th>
                    <th style={{ padding: '1rem' }}>Created At</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {wahalas.map((w) => (
                      <motion.tr 
                        key={w.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid var(--glass-border)' }}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 'bold' }}>{w.title}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{w.id}</div>
                        </td>
                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                          {w.mood}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            background: w.severity >= 4 ? 'var(--error)' : 'var(--glass)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {w.severity}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                          {new Date(w.created_at).toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => {
                                setEditingWahala(w)
                                setIsFormOpen(true)
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Edit3 size={16} />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(w.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '600px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}
              >
                <X size={24} />
              </button>
              
              <h2 style={{ marginBottom: '2rem' }}>{editingWahala ? 'Edit' : 'Create'} <span className="gradient-text">Wahala</span></h2>
              
              <WahalaForm 
                onAdd={handleFormSuccess} 
                initialData={editingWahala}
                onCancel={() => setIsFormOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
