'use client'
import { useEffect, useState } from 'react'

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0'))
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      width: '390px',
      minHeight: '780px',
      background: '#08061A',
      borderRadius: '48px',
      padding: '14px',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 60px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Notch */}
      <div style={{width:'120px',height:'30px',background:'#08061A',borderRadius:'0 0 20px 20px',margin:'0 auto',flexShrink:0}} />

      {/* Screen container */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #0F0C29 0%, #1A1A4E 100%)',
        borderRadius: '36px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Persistent radial glows */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}}>
          <div style={{position:'absolute',top:'-40px',right:'-40px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle, rgba(255,90,95,0.18) 0%, transparent 70%)'}} />
          <div style={{position:'absolute',bottom:'-60px',left:'-60px',width:'320px',height:'320px',borderRadius:'50%',background:'radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%)'}} />
        </div>

        {/* Status bar */}
        <div style={{padding:'12px 24px 8px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0,position:'relative',zIndex:2}}>
          <span style={{fontFamily:'JetBrains Mono, monospace',fontSize:'0.72rem',fontWeight:500,color:'rgba(255,255,255,0.6)'}}>{time}</span>
          <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.5)',letterSpacing:'2px'}}>▲ ● ●●●</span>
        </div>

        {/* Page content */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative',zIndex:2}}>
          {children}
        </div>
      </div>
    </div>
  )
}