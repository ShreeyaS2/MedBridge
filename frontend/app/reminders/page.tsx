'use client'
import { useEffect, useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { getReminders, addReminder, toggleReminder } from '@/lib/api'
import { getProfile } from '@/lib/auth'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [drug, setDrug] = useState('')
  const [time, setTime] = useState('08:00')
  const [dose, setDose] = useState('')

  useEffect(() => { load(); getProfile().then(setProfile).catch(() => { }) }, [])

  async function load() { getReminders().then(setReminders).catch(() => { }) }

  async function toggle(id: string, done: boolean) {
    await toggleReminder(id, !done).catch(() => { }); load()
  }

  async function add() {
    if (!drug || !time) return
    await addReminder(drug, dose || '1 dose', time).catch(() => { })
    setDrug(''); setDose(''); load()
  }

  const GLS: React.CSSProperties = {
    width: '100%', padding: '10px 13px',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem',
    outline: 'none', background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.9)',
  }
  const LBL: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.35)', marginBottom: '6px', display: 'block',
  }
  const SEC: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.35)', marginBottom: '10px', marginTop: '18px',
  }

  return (
    <PhoneShell>
      <ScreenHeader title="Reminders & History"/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>

        <div style={SEC}>Today's Medications</div>

        {reminders.length === 0 && (
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', padding: '8px 0 10px' }}>
            No reminders yet — add one below.
          </div>
        )}

        {reminders.map(r => (
          <div
            key={r.id}
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '13px 15px',
              marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px',
            }}
          >
            {/* Time pill badge */}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 600,
              color: r.is_done ? '#00C9A7' : '#FF7B7F',
              background: r.is_done ? 'rgba(0,201,167,0.12)' : 'rgba(255,90,95,0.12)',
              border: `1px solid ${r.is_done ? 'rgba(0,201,167,0.3)' : 'rgba(255,90,95,0.25)'}`,
              padding: '5px 10px', borderRadius: '8px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {r.time_of_day?.slice(0, 5)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>{r.drug_name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>{r.dose}</div>
            </div>

            {/* Teal checkmark */}
            <div
              onClick={() => toggle(r.id, r.is_done)}
              style={{
                marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '50%',
                border: `2px solid ${r.is_done ? '#00C9A7' : 'rgba(255,255,255,0.2)'}`,
                background: r.is_done ? '#00C9A7' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', color: '#fff', flexShrink: 0,
                boxShadow: r.is_done ? '0 0 10px rgba(0,201,167,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >{r.is_done ? '✓' : ''}</div>
          </div>
        ))}

        <div style={SEC}>Upcoming Appointments</div>

        {/* Appointment card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '16px 16px',
          marginBottom: '8px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>
              Your Doctor
            </div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
              {profile?.doctor_name || '—'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', marginTop: '4px' }}>
              Tuesday, March 11 · 10:30 AM
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,90,95,0.18)', border: '1px solid rgba(255,90,95,0.3)', color: '#FF7B7F', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', padding: '4px 9px', borderRadius: '6px', marginBottom: '3px' }}>
              Upcoming
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>in 11 days</div>
          </div>
        </div>

        <div style={SEC}>Add Reminder</div>

        {/* Add form — glass card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '16px',
        }}>
          <div style={{ marginBottom: '12px' }}><label style={LBL}>Medicine Name</label><input style={GLS} placeholder="e.g. Metformin 500mg" value={drug} onChange={e => setDrug(e.target.value)} /></div>
          <div style={{ marginBottom: '12px' }}><label style={LBL}>Time</label><input style={{ ...GLS, colorScheme: 'dark' }} type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
          <div style={{ marginBottom: '14px' }}><label style={LBL}>Dose</label><input style={GLS} placeholder="e.g. 1 tablet with food" value={dose} onChange={e => setDose(e.target.value)} /></div>
          <button
            onClick={add}
            style={{
              width: '100%', padding: '12px',
              background: 'linear-gradient(135deg,#FF5A5F,#E04449)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 16px rgba(255,90,95,0.35)',
            }}
          >+ Add Reminder</button>
        </div>
      </div>
      <BottomNav />
    </PhoneShell>
  )
}