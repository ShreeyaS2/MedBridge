'use client'
import { supabase } from '../../lib/supabase'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { getProfile } from '@/lib/auth'
import { getReminders } from '@/lib/api'

const CARDS = [
  {
    icon: '📋',
    title: 'Discharge Explainer',
    desc: 'Upload your summary and get a plain-language explanation in your language.',
    path: '/discharge',
    grad: 'linear-gradient(135deg, rgba(255,90,95,0.25) 0%, rgba(255,90,95,0.05) 100%)',
    border: 'rgba(255,90,95,0.3)',
    accent: '#FF5A5F',
  },
  {
    icon: '🩺',
    title: 'Symptom Checker',
    desc: 'Describe how you\'re feeling and get guidance on what to do next.',
    path: '/symptom',
    grad: 'linear-gradient(135deg, rgba(167,139,250,0.25) 0%, rgba(167,139,250,0.05) 100%)',
    border: 'rgba(167,139,250,0.3)',
    accent: '#A78BFA',
  },
  {
    icon: '💊',
    title: 'Prescription History',
    desc: 'View and manage your full prescription history over time.',
    path: '/prescriptions',
    grad: 'linear-gradient(135deg, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0.04) 100%)',
    border: 'rgba(251,191,36,0.3)',
    accent: '#FBBF24',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Count pending (un-done) reminders
  const pendingCount = reminders.filter(r => !r.is_done).length
  const nextMed = reminders.find(r => !r.is_done) || null

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (!session) { router.replace('/login'); return }
        Promise.all([
          getProfile().then(p => setProfile(p)),
          getReminders().then(r => setReminders(r)).catch(() => { })
        ]).finally(() => { clearTimeout(timeout); setLoading(false) })
      }
    })

    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [router])

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    setScrolled(e.currentTarget.scrollTop > 260)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '80px' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'rgba(245,240,232,0.25)', letterSpacing: '0.1em' }}>LOADING…</span>
    </div>
  )

  return (
    <div style={{ width: '430px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', paddingBottom: '96px' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', marginBottom: '4px' }}>
                Welcome back
              </div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', marginBottom: '2px', letterSpacing: '-0.03em' }}>
                {profile?.fname || '—'}
              </div>
            </div>

            <button
              onClick={() => router.push('/profile')}
              title="Profile"
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.8)', transition: 'all 0.2s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21v-1a8 8 0 0116 0v1" />
              </svg>
            </button>
          </div>

          {/* Header row: recovery badge + floating notif when scrolled */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              onClick={() => router.push('/reminders')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                opacity: scrolled ? 1 : 0,
                transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.9)',
                pointerEvents: scrolled ? 'auto' : 'none',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>🔔</span>
              {pendingCount > 0 && (
                <span style={{
                  background: '#FF5A5F',
                  color: '#fff',
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  fontFamily: 'JetBrains Mono, monospace',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  minWidth: '16px',
                  textAlign: 'center',
                }}>
                  {pendingCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Next medication strip — hides when scrolled */}
          <div
            onClick={() => router.push('/reminders')}
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: '3px solid #FF5A5F',
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'opacity 0.35s ease, max-height 0.35s ease, margin 0.35s ease, padding 0.35s ease',
              opacity: scrolled ? 0 : 1,
              maxHeight: scrolled ? '0px' : '80px',
              overflow: 'hidden',
              marginBottom: scrolled ? '-12px' : '0',
              pointerEvents: scrolled ? 'none' : 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>🔔</span>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Next medication due</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                  {nextMed ? nextMed.drug_name : 'No reminders yet'}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
              {nextMed ? nextMed.time_of_day?.slice(0, 5) : '—'}
            </div>
          </div>

          {/* Feature cards */}
          {CARDS.map(card => (
            <div
              key={card.path}
              onClick={() => router.push(card.path)}
              className="pressable"
              style={{
                background: card.grad,
                border: `1px solid ${card.border}`,
                borderRadius: '16px', padding: '18px',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginBottom: '4px' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    {card.desc}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '1rem', color: card.accent, flexShrink: 0 }}>›</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}






