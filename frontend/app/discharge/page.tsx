'use client'
import { useState } from 'react'
import PhoneShell from '@/components/PhoneShell'
import BottomNav from '@/components/BottomNav'
import ScreenHeader from '@/components/ScreenHeader'
import { analyseDischarge } from '@/lib/api'

const DEMO = 'Pt: Male, 62y. Admitted with NSTEMI. Echo: EF 45%, mild LV dysfunction. Discharged on dual antiplatelet therapy (Aspirin 75mg + Clopidogrel 75mg), ACE inhibitor (Ramipril 2.5mg OD), beta-blocker (Metoprolol 25mg BD), Metformin 500mg BD. Dietary restrictions: low sodium, low fat. F/U cardiology OPD 2 weeks. Avoid strenuous activity for 4 weeks.'

const SECTIONS = [
  { key: 'what_happened', label: 'What Happened', accent: '#FF5A5F', bg: 'rgba(255,90,95,0.08)' },
  { key: 'home_care', label: 'What To Do At Home', accent: '#34D399', bg: 'rgba(52,211,153,0.08)' },
  { key: 'warning_signs', label: 'Warning Signs', accent: '#FBBF24', bg: 'rgba(251,191,36,0.08)' },
  { key: 'follow_up', label: 'Follow-Up Needed', accent: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
]

const LANGS = [['en', 'English'], ['ta', 'தமிழ்'], ['hi', 'हिंदी']]

export default function DischargePage() {
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')
  const [hasFile, setHasFile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function analyse() {
    if (!text.trim()) return
    setLoading(true); setResult(null)
    try { setResult(await analyseDischarge(text, lang)) } catch { }
    setLoading(false)
  }

  return (
    <PhoneShell>
      <ScreenHeader title="Discharge Explainer" sub="Feature 01 — OCR + LLM" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Upload zone */}
        <div
          onClick={() => { setHasFile(true); setText(DEMO) }}
          style={{
            border: `2px ${hasFile ? 'solid' : 'dashed'} ${hasFile ? '#00C9A7' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '16px', padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
            background: hasFile ? 'rgba(0,201,167,0.07)' : 'rgba(255,255,255,0.04)',
            transition: 'all 0.3s',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{hasFile ? '✅' : '📄'}</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
            {hasFile ? 'discharge_summary.pdf' : 'Upload Discharge Summary'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
            {hasFile ? 'Apollo Hospitals · Feb 24 2026' : 'Tap to load a demo document'}
          </div>
        </div>

        {/* Language toggles */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {LANGS.map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              style={{
                flex: 1, padding: '10px',
                border: `1px solid ${lang === code ? '#FF5A5F' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '10px',
                background: lang === code ? 'rgba(255,90,95,0.2)' : 'rgba(255,255,255,0.05)',
                color: lang === code ? '#FF7B7F' : 'rgba(255,255,255,0.55)',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                boxShadow: lang === code ? '0 0 12px rgba(255,90,95,0.25)' : 'none',
                transition: 'all 0.2s',
              }}
            >{label}</button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Or paste discharge summary text here…"
          style={{
            width: '100%', padding: '13px 16px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem',
            height: '80px', resize: 'none', outline: 'none',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.9)', lineHeight: 1.5,
          }}
        />

        {/* Analyse button */}
        <button
          onClick={analyse}
          disabled={loading || !text.trim()}
          style={{
            width: '100%', padding: '15px',
            background: loading || !text.trim() ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#FF5A5F,#E04449)',
            color: '#fff', border: 'none', borderRadius: '13px',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', fontWeight: 700,
            cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
            boxShadow: loading || !text.trim() ? 'none' : '0 0 20px rgba(255,90,95,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s', opacity: !text.trim() ? 0.5 : 1,
          }}
        >
          {loading
            ? <><span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /></>
            : 'Analyse Summary ✦'}
        </button>

        {/* Results */}
        {result && (
          <div className="fade-in" style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', overflow: 'hidden',
          }}>
            {SECTIONS.map((s, i) => (
              <div
                key={s.key}
                style={{
                  padding: '14px 16px',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderLeft: `3px solid ${s.accent}`,
                  background: s.bg,
                }}
              >
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.58rem', textTransform: 'uppercase',
                  letterSpacing: '0.08em', padding: '3px 8px',
                  borderRadius: '4px', marginBottom: '8px',
                  background: `${s.accent}22`, color: s.accent,
                }}>{s.label}</span>
                <div style={{ fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.85)' }}>
                  {result[s.key]}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <BottomNav />
    </PhoneShell>
  )
}