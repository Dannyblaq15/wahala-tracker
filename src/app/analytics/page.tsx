'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts'
import { TrendingUp, AlertTriangle, Smile } from 'lucide-react'

export default function Analytics() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/wahala')
      const wahalas = await res.json()
      if (Array.isArray(wahalas)) {
        setData(wahalas)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Process data for charts
  const moodCounts = data.reduce((acc: any, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1
    return acc
  }, {})

  const categoryCounts = data.reduce((acc: any, curr) => {
    acc[curr.category || 'General'] = (acc[curr.category || 'General'] || 0) + 1
    return acc
  }, {})

  const moodData = Object.keys(moodCounts).map(mood => ({
    name: mood,
    value: moodCounts[mood]
  }))

  const categoryData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }))

  const severityTrend = data.map(w => ({
    date: new Date(w.created_at).toLocaleDateString(),
    severity: w.severity
  })).reverse()

  const COLORS = ['#008751', '#FF8C00', '#FF3B30', '#FFCC00', '#007AFF']

  return (
    <main className="container" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Stress <span className="gradient-text">Analytics</span></h2>
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) && (
          <div style={{ display: 'inline-block', background: 'var(--secondary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            DEMO MODE - MOCK DATA
          </div>
        )}

        <div className="grid-auto">
          {/* Summary Cards */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '1rem', borderRadius: '12px' }}>
              <TrendingUp color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Avg Severity</p>
              <h3 style={{ fontSize: '1.5rem' }}>
                {(data.reduce((a, b) => a + b.severity, 0) / (data.length || 1)).toFixed(1)}
              </h3>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 140, 0, 0.2)', padding: '1rem', borderRadius: '12px' }}>
              <AlertTriangle color="var(--secondary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Total Wahala</p>
              <h3 style={{ fontSize: '1.5rem' }}>{data.length}</h3>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 215, 0, 0.2)', padding: '1rem', borderRadius: '12px' }}>
              <Smile color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Top Mood</p>
              <h3 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                {Object.entries(moodCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </h3>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
          <div className="glass-card" style={{ height: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Severity Trend</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={severityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="severity" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6, fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Mood Distribution</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {moodData.map((m, i) => (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', background: COLORS[i % COLORS.length], borderRadius: '2px' }} />
                    <span style={{ textTransform: 'capitalize' }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ height: '350px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Category Breakdown</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="value" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
