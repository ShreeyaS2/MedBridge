'use client'
import { useState, useEffect } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { getPrescriptions } from '@/lib/api'

type Prescription = {
  id: string
  drug_name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  notes: string | null
  created_at: string
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getPrescriptions()
      .then(setPrescriptions)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const grouped = prescriptions.reduce<Record<string, Prescription[]>>((acc, p) => {
    const date = new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(p)
    return acc
  }, {})

  return (
    <PhoneShell>
      <ScreenHeader title="Prescription History"/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <span style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#00C9A7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            Failed to load prescriptions.
          </div>
        )}

        {!loading && !error && prescriptions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '2.5rem' }}>💊</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>No prescriptions yet</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', maxWidth: '200px', lineHeight: 1.6 }}>
              Analyse a discharge summary to extract and save your medications here.
            </div>
          </div>
        )}

        {!loading && Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {/* Date header */}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.3)', paddingLeft: '4px',
            }}>{date}</div>

            {/* Drug cards */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden',
            }}>
              {items.map((p, i) => (
                <div key={p.id} style={{
                  padding: '14px 16px',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderLeft: '3px solid #00C9A7',
                  display: 'flex', flexDirection: 'column', gap: '4px',
                }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                    {p.drug_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.dosage && <span>{p.dosage}</span>}
                    {p.frequency && <span>· {p.frequency}</span>}
                    {p.duration && <span>· {p.duration}</span>}
                  </div>
                  {p.notes && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                      {p.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
      <BottomNav />
    </PhoneShell>
  )
}