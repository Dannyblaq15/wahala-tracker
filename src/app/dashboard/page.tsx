'use client'

import React, { useState, useEffect } from 'react'
import WahalaForm from '@/components/WahalaForm'
import WahalaCard from '@/components/WahalaCard'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const [wahalas, setWahalas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchWahalas()

    // Realtime subscription
    const channel = supabase
      .channel('wahala_changes')
      .on('postgres_changes', { event: '*', table: 'wahalas' }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setWahalas(prev => {
            if (prev.some(w => w.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'DELETE') {
          setWahalas(prev => prev.filter(w => w.id !== payload.old.id))
        } else if (payload.eventType === 'UPDATE') {
          setWahalas(prev => prev.map(w => w.id === payload.new.id ? payload.new : w))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchWahalas = async () => {
    try {
      const res = await fetch('/api/wahala')
      const data = await res.json()
      if (Array.isArray(data)) {
        setWahalas(data)
      }
    } catch (err) {
      console.error('Error fetching wahalas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (newWahala: any) => {
    setWahalas(prev => {
      const exists = prev.findIndex(w => w.id === newWahala.id)
      if (exists !== -1) {
        const updated = [...prev]
        updated[exists] = newWahala
        return updated
      }
      return [newWahala, ...prev]
    })
  }

  return (
    <main className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Wetyn be your <span className="gradient-text">Wahala</span> today?
          </h2>
          <p style={{ opacity: 0.7 }}>Log your daily stress and keep your sanity in check.</p>
        </div>

        <WahalaForm onAdd={handleAdd} />

        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Recent Logs</h3>
            <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>{wahalas.length} Issues Tracked</div>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
          ) : (
            <div className="grid-auto">
              <AnimatePresence>
                {wahalas.map((wahala) => (
                  <WahalaCard 
                    key={wahala.id} 
                    wahala={wahala} 
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && wahalas.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ opacity: 0.5, marginBottom: '1rem' }}>No wahala yet? You be lucky person! 🇳🇬</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.3 }}>
                If you just switched databases, make sure to set up the table in the <a href="/admin" style={{ textDecoration: 'underline' }}>Admin Panel</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
