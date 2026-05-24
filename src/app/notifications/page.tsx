// src/app/notifications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // assumes firebase.ts exports a Firestore instance
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string; createdAt: any }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Notifications</h2>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : notifications.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No notifications yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map((n) => (
              <li key={n.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{n.title}</h3>
                <p style={{ margin: '0.3rem 0', color: 'var(--foreground)' }}>{n.body}</p>
                <small style={{ color: 'var(--secondary)' }}>{new Date(n.createdAt?.seconds * 1000).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
