'use client'

import React from 'react'
import { Trash2, Edit3, Calendar, Tag, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface Wahala {
  id: string
  title: string
  description: string
  severity: number
  mood: string
  category: string
  created_at: string
}

export default function WahalaCard({
  wahala,
  onDelete,
  onEdit
}: {
  wahala: Wahala,
  onDelete?: (id: string) => void,
  onEdit?: (wahala: Wahala) => void
}) {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'stressed': return '😩'
      case 'angry': return '😡'
      case 'vibrant': return '🔥'
      default: return '😐'
    }
  }

  const getSeverityColorVar = (severity: number) => {
    if (severity >= 4) return '--error-rgb'
    if (severity >= 3) return '--secondary-rgb'
    return '--primary-rgb'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid rgb(var(${getSeverityColorVar(wahala.severity)}))` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{wahala.title}</h3>
          <div style={{ display: 'flex', gap: '0.8rem', opacity: 0.6, fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Calendar size={14} />
              {new Date(wahala.created_at).toLocaleDateString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Tag size={14} />
              {wahala.category}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.5rem' }}>{getMoodEmoji(wahala.mood)}</div>
      </div>

      <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
        {wahala.description}
      </p>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          background: `rgba(var(${getSeverityColorVar(wahala.severity)}), 0.15)`,
          color: `rgb(var(${getSeverityColorVar(wahala.severity)}))`,
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          Severity: {wahala.severity}
        </div>

        {(onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onEdit && (
              <button
                className="btn-icon"
                onClick={() => onEdit(wahala)}
              >
                <Edit3 size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(wahala.id)}
                className="btn-icon"
                style={{ color: 'var(--error)' }}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
