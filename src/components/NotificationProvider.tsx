'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
}

const NotificationContext = createContext({
  notify: (message: string, type?: 'info' | 'success' | 'error') => {}
})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="glass-card"
              style={{ 
                padding: '1rem', 
                minWidth: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                borderLeft: `4px solid ${n.type === 'error' ? 'var(--error)' : n.type === 'success' ? 'var(--primary)' : 'var(--secondary)'}`
              }}
            >
              <Bell size={18} color={n.type === 'error' ? 'var(--error)' : 'var(--primary)'} />
              <p style={{ flex: 1, fontSize: '0.9rem' }}>{n.message}</p>
              <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} style={{ background: 'none', border: 'none', color: 'var(--foreground)', opacity: 0.5, cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
