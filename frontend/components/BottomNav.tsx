'use client'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label: 'Home', path: '/home', icon: HomeIcon },
  { label: 'Discharge', path: '/discharge', icon: DocIcon },
  { label: 'Symptoms', path: '/symptom', icon: StethIcon },
  { label: 'Reminders', path: '/reminders', icon: BellIcon },
  { label: 'Profile', path: '/profile', icon: PersonIcon },
]

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? '#fff' : 'rgba(255,255,255,0.45)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}
function DocIcon({ active }: { active: boolean }) {
  const c = active ? '#fff' : 'rgba(255,255,255,0.45)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  )
}
function StethIcon({ active }: { active: boolean }) {
  const c = active ? '#fff' : 'rgba(255,255,255,0.45)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2v6a4 4 0 004 4h0a4 4 0 004-4V2" />
      <path d="M14 12v4a4 4 0 004 4v0a2 2 0 000-4" />
      <circle cx="18" cy="18" r="1" fill={c} />
    </svg>
  )
}
function BellIcon({ active }: { active: boolean }) {
  const c = active ? '#fff' : 'rgba(255,255,255,0.45)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}
function PersonIcon({ active }: { active: boolean }) {
  const c = active ? '#fff' : 'rgba(255,255,255,0.45)'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-1a8 8 0 0116 0v1" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div style={{
      padding: '10px 8px 14px',
      display: 'flex',
      justifyContent: 'space-around',
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {NAV.map(item => {
        const active = pathname === item.path
        const Icon = item.icon
        return (
          <div
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '20px',
              flex: 1,
              background: active ? '#FF5A5F' : 'transparent',
              boxShadow: active ? '0 0 16px rgba(255,90,95,0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon active={active} />
            <span style={{
              fontSize: '0.52rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}