'use client'
import { useState, useEffect, useRef } from 'react'

interface Dimension {
  score: number
  razon: string
  sugerencia: string
}

interface ScoreResult {
  dimensiones: {
    hook: Dimension
    autenticidad: Dimension
    claridad: Dimension
    cta: Dimension
    viralidad: Dimension
  }
  score_total: number
  etiqueta: string
  resumen: string
}

const DIMENSIONES = [
  { key: 'hook', label: 'Hook', peso: '25%', emoji: '🎣', desc: 'Analizando si detiene el scroll...' },
  { key: 'autenticidad', label: 'Autenticidad latina', peso: '20%', emoji: '🌮', desc: 'Midiendo conexion cultural...' },
  { key: 'claridad', label: 'Claridad del mensaje', peso: '20%', emoji: '💡', desc: 'Evaluando claridad del punto central...' },
  { key: 'cta', label: 'CTA', peso: '20%', emoji: '👆', desc: 'Analizando llamada a accion...' },
  { key: 'viralidad', label: 'Viralidad', peso: '15%', emoji: '🔥', desc: 'Calculando potencial viral...' },
]

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || target === 0) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function AnimatedBar({ score, started }: { score: number, started: boolean }) {
  const [width, setWidth] = useState(0)
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => setWidth(score), 100)
    return () => clearTimeout(timer)
  }, [started, score])
  return (
    <div style={{ height: '10px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: color,
        borderRadius: '999px',
        transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: started ? `0 0 8px ${color}88` : 'none'
      }} />
    </div>
  )
}

function ScoreCard({ dimKey, label, peso, emoji, score, razon, sugerencia, visible, animateBar }: any) {
  const [open, setOpen] = useState(false)
  const count = useCountUp(score, 1000, animateBar)
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      background: 'white',
      borderRadius: '12px',
      border: `1px solid ${visible ? color + '44' : '#E5E7EB'}`,
      padding: '14px 16px',
      marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
          {emoji} {label} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: '12px' }}>({peso})</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', minWidth: '36px', textAlign: 'right' }}>
            {animateBar ? count : 0}
          </span>
          <button onClick={() => setOpen(!open)} style={{
            fontSize: '11px', color: '#6B7280', background: '#F3F4F6',
            border: 'none', cursor: 'pointer', padding: '3px 8px', borderRadius: '6px'
          }}>
            {open ? 'cerrar' : 'detalle'}
          </button>
        </div>
      </div>
      <AnimatedBar score={score} started={animateBar} />
      {open && (
        <div style={{ marginTop: '10px', padding: '10px 12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 6px', lineHeight: 1.5 }}>
            <strong>Por que:</strong> {razon}
          </p>
          <p style={{ fontSize: '12px', color: '#F97316', margin: 0, lineHeight: 1.5 }}>
            <strong>Mejora:</strong> {sugerencia}
          </p>
        </div>
      )}
    </div>
  )
}

function FlashCard({ step, total }: { step: number, total: number }) {
  const dim = DIMENSIONES[step]
  if (!dim) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '48px 40px',
        textAlign: 'center', maxWidth: '380px', width: '90%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        animation: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <style>{`
          @keyframes pop {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.9); opacity: 1; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div style={{
            position: 'absolute', inset: '-8px', borderRadius: '50%',
            border: '3px solid #F97316', animation: 'pulse-ring 1.2s ease-out infinite'
          }} />
          <div style={{ fontSize: '56px', lineHeight: 1 }}>{dim.emoji}</div>
        </div>
        <div style={{ fontSize: '13px', color: '#F97316', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase' }}>
          Analizando {step + 1} de {total}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#1F2937', marginBottom: '8px' }}>
          {dim.label}
        </div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
          {dim.desc}
        </div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {DIMENSIONES.map((_, i) => (
            <div key={i} style={{
              height: '4px', borderRadius: '999px',
              width: i <= step ? '24px' : '8px',
              background: i <= step ? '#F97316' : '#E5E7EB',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TotalScoreDisplay({ score, etiqueta, resumen, visible }: any) {
  const count = useCountUp(score, 1500, visible)
  const color = score >= 85 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444'
  const bg = score >= 85 ? '#F0FDF4' : score >= 65 ? '#FFFBEB' : '#FEF2F2'

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.8)',
      transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      background: bg, borderRadius: '16px', padding: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '20px', border: `2px solid ${color}33`
    }}>
      <div>
        <div style={{
          fontSize: '64px', fontWeight: 900, color, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 30px ${color}44`
        }}>
          {visible ? count : 0}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color, marginTop: '4px' }}>{etiqueta}</div>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', maxWidth: '300px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.6 }}>{resumen}</p>
      </div>
    </div>
  )
}

export default function ContentScoreComponent({ profile }: { profile: any }) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')
  const [flashStep, setFlashStep] = useState(-1)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false, false])
  const [showTotal, setShowTotal] = useState(false)
  const [animateBars, setAnimateBars] = useState<boolean[]>([false, false, false, false, false])
  const resultRef = useRef<ScoreResult | null>(null)

  async function handleAnalyze() {
    if (!content.trim()) { setError('Pega tu contenido para analizar'); return }
    setLoading(true); setError(''); setResult(null)
    setVisibleCards([false, false, false, false, false])
    setShowTotal(false)
    setAnimateBars([false, false, false, false, false])
    setFlashStep(-1)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, niche: profile?.niche || 'general' })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al analizar'); setLoading(false); return }
      resultRef.current = data
      setLoading(false)

      // Secuencia de flashcards
      for (let i = 0; i < DIMENSIONES.length; i++) {
        setFlashStep(i)
        await new Promise(r => setTimeout(r, 1200))
      }
      setFlashStep(-1)
      setResult(data)

      // Revelar cards una por una
      for (let i = 0; i < DIMENSIONES.length; i++) {
        await new Promise(r => setTimeout(r, 150))
        setVisibleCards(prev => { const n = [...prev]; n[i] = true; return n })
        await new Promise(r => setTimeout(r, 100))
        setAnimateBars(prev => { const n = [...prev]; n[i] = true; return n })
      }

      await new Promise(r => setTimeout(r, 400))
      setShowTotal(true)

    } catch {
      setError('Error de conexion. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const etiquetaColor = result?.etiqueta === 'Listo para publicar' ? '#22c55e' : result?.etiqueta === 'Publicar con mejoras' ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {flashStep >= 0 && <FlashCard step={flashStep} total={DIMENSIONES.length} />}

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>Analiza tu contenido antes de publicar</h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Pega tu caption, script o post y recibe un score en 5 dimensiones con sugerencias especificas.</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Plataforma</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1F2937', width: '200px' }}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Tu contenido</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={6}
            placeholder="Pega aqui tu caption, script o post que quieres analizar antes de publicar..."
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#1F2937', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}
          />
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>{content.length} caracteres</p>
        </div>

        {error && <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '13px', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}>{error}</div>}

        <button onClick={handleAnalyze} disabled={loading}
          style={{ width: '100%', background: loading ? '#FED7AA' : '#F97316', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? '⏳ Analizando con IA...' : '🔍 Analizar contenido'}
        </button>
      </div>

      {result && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px' }}>
          <TotalScoreDisplay score={result.score_total} etiqueta={result.etiqueta} resumen={result.resumen} visible={showTotal} />

          <div>
            {DIMENSIONES.map((d, i) => (
              <ScoreCard
                key={d.key}
                dimKey={d.key}
                label={d.label}
                peso={d.peso}
                emoji={d.emoji}
                score={result.dimensiones[d.key as keyof typeof result.dimensiones].score}
                razon={result.dimensiones[d.key as keyof typeof result.dimensiones].razon}
                sugerencia={result.dimensiones[d.key as keyof typeof result.dimensiones].sugerencia}
                visible={visibleCards[i]}
                animateBar={animateBars[i]}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={handleAnalyze}
              style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              🔄 Re-analizar
            </button>
            {result.score_total >= 65 && (
              <button onClick={() => navigator.clipboard.writeText(content)}
                style={{ flex: 1, background: '#F97316', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ✓ Copiar y publicar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
