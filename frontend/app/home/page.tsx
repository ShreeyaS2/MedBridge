'use client'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneShell from '@/components/PhoneShell'
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
    title: 'Drug Info',
    desc: 'Look up any medication for plain-language dosage and interaction info.',
    path: '/drugs',
    grad: 'linear-gradient(135deg, rgba(0,201,167,0.25) 0%, rgba(0,201,167,0.05) 100%)',
    border: 'rgba(0,201,167,0.3)',
    accent: '#00C9A7',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [nextMed, setNextMed] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const timeout = setTimeout(() => setLoading(false), 5000) // fallback

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') {
      if (!session) { router.replace('/login'); return }
      Promise.all([
        getProfile().then(p => setProfile(p)),
        getReminders().then(r => setNextMed(r.find((x: any) => !x.is_done) || null)).catch(() => {})
      ]).finally(() => { clearTimeout(timeout); setLoading(false) })
    }
  })

  return () => { subscription.unsubscribe(); clearTimeout(timeout) }
}, [router])

  if (loading) return (
  <PhoneShell>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'rgba(245,240,232,0.25)', letterSpacing: '0.1em' }}>LOADING…</span>
    </div>
  </PhoneShell>
)

  return (
    <PhoneShell>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Header */}
          <div style={{ padding: '20px 24px 20px', position: 'relative' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)', marginBottom: '4px' }}>
              Welcome back
            </div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', marginBottom: '2px', letterSpacing: '-0.03em' }}>
              {profile?.fname || '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', marginBottom: '14px' }}>
              {profile?.diagnosis || 'Post-discharge care'}
            </div>

            {/* Pulsing recovery badge */}
            <div className="pulsing" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,90,95,0.15)',
              border: '1px solid rgba(255,90,95,0.35)',
              padding: '5px 12px', borderRadius: '20px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem', color: '#FF7B7F',
              boxShadow: '0 0 12px rgba(255,90,95,0.25)',
            }}>
              🫀 Recovery mode
            </div>
          </div>

          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Next medication strip */}
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
                cursor: 'pointer', transition: 'all 0.2s',
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
    </PhoneShell>
  )
}
