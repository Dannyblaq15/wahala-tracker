'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WahalaForm({ onAdd, initialData, onCancel }: { 
  onAdd: (wahala: any) => void, 
  initialData?: any,
  onCancel?: () => void
}) {
  const [isOpen, setIsOpen] = useState(!!initialData)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    severity: initialData?.severity?.toString() || '3',
    category: initialData?.category || 'General'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        severity: initialData.severity.toString(),
        category: initialData.category
      })
      setIsOpen(true)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = initialData ? `/api/wahala/${initialData.id}` : '/api/wahala'
      const method = initialData ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      onAdd(data)
      setFormData({ title: '', description: '', severity: '3', category: 'General' })
      setIsOpen(false)
      if (onCancel) onCancel()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
      >
        <PlusCircle size={20} />
        {isOpen ? 'Close Form' : 'Log New Wahala'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="glass-card"
            style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Issue Title</label>
              <input 
                required
                type="text" 
                placeholder="What happened? (e.g. NEPA took light)" 
                style={{ width: '100%' }}
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Description</label>
              <textarea 
                placeholder="Give us the full gist..." 
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Severity (1-5)</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.severity}
                  onChange={e => setFormData({...formData, severity: e.target.value})}
                >
                  <option value="1">1 - Small Stress</option>
                  <option value="2">2 - E don dey happen</option>
                  <option value="3">3 - Serious Wahala</option>
                  <option value="4">4 - Omo x100</option>
                  <option value="5">5 - E don red!</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Category</label>
                <select 
                  style={{ width: '100%' }}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Work">Work</option>
                  <option value="Family">Family</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Transport">Transport</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <button 
              disabled={loading}
              className="btn-primary" 
              style={{ background: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Submit to Tracker
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
