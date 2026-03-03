'use client'
import { useEffect, useState } from 'react'
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

  // Warm cream input — matches the reference screenshot
  const INP: React.CSSProperties = {
    width: '100%',
    padding: '15px 16px',
    border: '1px solid rgba(210, 190, 140, 0.25)',
    borderRadius: '12px',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'rgba(230, 210, 160, 0.08)',
    color: 'rgba(255,255,255,0.75)',
    boxSizing: 'border-box',
  }

  const LBL: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.58rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.38)',
    marginBottom: '8px',
    display: 'block',
  }

  const SEC: React.CSSProperties = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.58rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.38)',
    marginBottom: '14px',
  }

  return (
    <div style={{ width: '430px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Reminders & History" back="/home" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 12px 0', paddingBottom: '96px' }}>

        {/* Today's Medications */}
        {reminders.length > 0 && (
          <>
            <div style={{ ...SEC, marginBottom: '12px' }}>Today's Medications</div>
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
                <div
                  onClick={() => toggle(r.id, r.is_done)}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    border: `2px solid ${r.is_done ? '#00C9A7' : 'rgba(255,255,255,0.2)'}`,
                    background: r.is_done ? '#00C9A7' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', color: '#fff', flexShrink: 0,
                    boxShadow: r.is_done ? '0 0 10px rgba(0,201,167,0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >{r.is_done ? '✓' : ''}</div>
              </div>
            ))}
          </>
        )}

        {/* Upcoming Appointments */}
        <div style={{ ...SEC, marginTop: reminders.length > 0 ? '20px' : '0' }}>Upcoming Appointments</div>

        {/* Doctor card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '18px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)', marginBottom: '8px',
            }}>Your Doctor</div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'rgba(255,255,255,0.95)', marginBottom: '6px',
            }}>
              {profile?.doctor_name || '—'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>
              Tuesday, March 11 · 10:30 AM
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              In 11 days
            </div>
          </div>
          <div style={{
            background: 'rgba(255,90,95,0.2)',
            border: '1px solid rgba(255,90,95,0.45)',
            color: '#FF7B7F',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '7px 13px',
            borderRadius: '8px',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            Upcoming
          </div>
        </div>

        {/* Add Reminder section */}
        <div style={{ ...SEC }}>Add Reminder</div>

        <div style={{ marginBottom: '16px' }}>
          <label style={LBL}>Medicine Name</label>
          <input
            style={INP}
            placeholder="e.g. Metformin 500mg"
            value={drug}
            onChange={e => setDrug(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={LBL}>Time</label>
          <input
            style={{ ...INP, colorScheme: 'dark' }}
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={LBL}>Dose</label>
          <input
            style={INP}
            placeholder="e.g. 1 tablet with food"
            value={dose}
            onChange={e => setDose(e.target.value)}
          />
        </div>

        {/* Dark gold Add button */}
        <button
          onClick={add}
          style={{
            width: '100%',
            padding: '17px',
            background: 'linear-gradient(135deg, #FF5A5F, #E04449)',
            color: 'rgba(255,255,255,0.92)',
            border: 'none',
            borderRadius: '14px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(100, 80, 20, 0.4)',
            marginBottom: '8px',
          }}
        >
          ✓ + Add Reminder
        </button>

      </div>
      <BottomNav />
    </div>
  )
}



