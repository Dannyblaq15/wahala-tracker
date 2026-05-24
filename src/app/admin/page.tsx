'use client'

import React, { useState, useEffect } from 'react'
import WahalaForm from '@/components/WahalaForm'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Trash2, RefreshCw, AlertTriangle, Users, Database, Edit3, Plus, X, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuthUser } from '@/hooks/useAuthUser'
import { useNotification } from '@/components/NotificationProvider'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuthUser()
  const { notify } = useNotification()
  const [wahalas, setWahalas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgSeverity: 0,
    highSeverityCount: 0
  })
  const [editingWahala, setEditingWahala] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [activeTab, setActiveTab] = useState<'wahalas' | 'users'>('wahalas')
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (user && user.role === 'admin') {
      setActiveTab('users')
    }
  }, [user])

  useEffect(() => {
    fetchAdminData()
    fetchUsersData()
  }, [])

  const fetchUsersData = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else {
        console.error('Failed to fetch users')
      }
    } catch (err) {
      console.error('Admin fetch users error:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

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

  const handleRoleChange = async (uid: string, newRole: string) => {
    setUpdatingRole(uid)
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, role: newRole }),
      })
      
      if (res.ok) {
        notify('User role updated successfully!', 'success')
        setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u))
      } else {
        const data = await res.json()
        notify(data.error || 'Failed to update role', 'error')
      }
    } catch (err) {
      console.error('Role change error:', err)
      notify('Network error updating role', 'error')
    } finally {
      setUpdatingRole(null)
    }
  }

  if (authLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <Shield size={48} color="var(--error)" />
        <h2>Access Denied</h2>
        <p style={{ opacity: 0.7 }}>You must be an admin to view this page.</p>
      </div>
    )
  }

  return (
    <main className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--error)', padding: '0.8rem', borderRadius: '12px' }}>
              <Shield color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>
                {user.role === 'super_admin' ? 'Super Admin' : 'Admin'} <span className="gradient-text">Control Center</span>
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                {user.role === 'super_admin' ? 'Manage system data and monitor global wahala levels.' : 'Manage user records and track site membership.'}
              </p>
            </div>
          </div>
          <div className="admin-header-actions" style={{ display: 'flex', gap: '1rem' }}>
            {activeTab === 'wahalas' && user.role === 'super_admin' && (
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
            )}
            <button 
              onClick={activeTab === 'wahalas' ? fetchAdminData : fetchUsersData}
              className="btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={18} className={(activeTab === 'wahalas' ? loading : loadingUsers) ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          </div>
        </div>

        {user.role === 'super_admin' && (
          <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <button 
              onClick={() => setActiveTab('wahalas')}
              style={{ 
                background: activeTab === 'wahalas' ? 'var(--glass)' : 'transparent',
                border: activeTab === 'wahalas' ? '1px solid var(--glass-border)' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: activeTab === 'wahalas' ? 'var(--primary)' : 'var(--foreground)',
                cursor: 'pointer',
                fontWeight: activeTab === 'wahalas' ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              Wahala Logs
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ 
                background: activeTab === 'users' ? 'var(--glass)' : 'transparent',
                border: activeTab === 'users' ? '1px solid var(--glass-border)' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: activeTab === 'users' ? 'var(--primary)' : 'var(--foreground)',
                cursor: 'pointer',
                fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              Users ({users.length})
            </button>
          </div>
        )}

        {/* User Stats Grid (For Admin role or when Users tab is selected) */}
        {activeTab === 'users' && (
          <div className="grid-auto" style={{ marginBottom: '3rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Users opacity={0.5} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>Membership</span>
              </div>
              <h3 style={{ fontSize: '2rem' }}>{users.length}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Total Registered Users</p>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <RefreshCw opacity={0.5} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Activity</span>
              </div>
              <h3 style={{ fontSize: '2rem' }}>{users.filter(u => u.lastSignInTime).length}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Active Accounts</p>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Award opacity={0.5} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--error)' }}>Staff</span>
              </div>
              <h3 style={{ fontSize: '2rem' }}>{users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}</h3>
              <p style={{ opacity: 0.6, fontSize: '0.8rem' }}>Administrators</p>
            </div>
          </div>
        )}

        {activeTab === 'wahalas' && (
          <>
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
          </>
        )}
        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ margin: 0 }}>Registered Users</h3>
            </div>
            
            {loadingUsers ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto', opacity: 0.5 }} />
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.6 }}>No users found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Joined</th>
                      <th style={{ padding: '1rem' }}>Last Sign In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.uid} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 'bold' }}>{u.displayName || 'Anonymous'}</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{u.uid}</div>
                        </td>
                        <td style={{ padding: '1rem', opacity: 0.8 }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {user.role === 'super_admin' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <select
                                value={u.role || 'basic'}
                                onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                                disabled={updatingRole === u.uid}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid var(--glass-border)',
                                  color: 'var(--foreground)',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="basic">Basic User</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                              {updatingRole === u.uid && (
                                <RefreshCw size={14} className="animate-spin" style={{ color: 'var(--primary)' }} />
                              )}
                            </div>
                          ) : (
                            <span style={{
                              background: u.role === 'super_admin' ? 'rgba(255, 59, 48, 0.15)' : u.role === 'admin' ? 'rgba(255, 140, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: u.role === 'super_admin' ? 'var(--error)' : u.role === 'admin' ? 'var(--secondary)' : 'var(--foreground)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              textTransform: 'capitalize',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Basic User'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                          {u.creationTime ? new Date(u.creationTime).toLocaleString() : 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                          {u.lastSignInTime ? new Date(u.lastSignInTime).toLocaleString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
