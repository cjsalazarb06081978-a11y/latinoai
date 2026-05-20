'use client'
import { useState } from 'react'

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
  { key: 'hook', label: 'Hook', peso: '25%', emoji: '🎣' },
  { key: 'autenticidad', label: 'Autenticidad latina', peso: '20%', emoji: '🌮' },
  { key: 'claridad', label: 'Claridad del mensaje', peso: '20%', emoji: '💡' },
  { key: 'cta', label: 'CTA', peso: '20%', emoji: '👆' },
  { key: 'viralidad', label: 'Viralidad', peso: '15%', emoji: '🔥' },
]

function ScoreBar({ score, label, peso, emoji, razon, sugerencia }: any) {
  const [open, setOpen] = useState(false)
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#1F2937' }}>{emoji} {label} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({peso})</span></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color }}>{score}</span>
          <button onClick={() => setOpen(!open)} style={{ fontSize: '11px', color: '#6B7280', background: '#F3F4F6', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' }}>
            {open ? 'cerrar' : 'ver detalle'}
          </button>
        </div>
      </div>
      <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '999px', transition: 'width 0.8s ease' }} />
      </div>
      {open && (
        <div style={{ marginTop: '8px', padding: '10px 12px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 6px' }}><strong>Por que:</strong> {razon}</p>
          <p style={{ fontSize: '12px', color: '#F97316', margin: 0 }}><strong>Mejora:</strong> {sugerencia}</p>
        </div>
      )}
    </div>
  )
}

export default function ContentScoreComponent({ profile }: { profile: any }) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')

  const etiquetaColor = result?.etiqueta === 'Listo para publicar' ? '#22c55e' : result?.etiqueta === 'Publicar con mejoras' ? '#f59e0b' : '#ef4444'

  async function handleAnalyze() {
    if (!content.trim()) { setError('Pega tu contenido para analizar'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, niche: profile?.niche || 'general' })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al analizar'); return }
      setResult(data)
    } catch { setError('Error de conexion. Intenta de nuevo.') }
    finally { setLoading(false) }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>Analiza tu contenido antes de publicar</h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>Pega tu caption, script o post y recibe un score en 5 dimensiones con sugerencias especificas.</p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Plataforma</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1F2937', width: '200px' }}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Tu contenido</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="Pega aqui tu caption, script o post que quieres analizar antes de publicar..."
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#1F2937', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}
          />
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>{content.length} caracteres</p>
        </div>

        {error && <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '13px', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px' }}>{error}</div>}

        <button onClick={handleAnalyze} disabled={loading} style={{ width: '100%', background: loading ? '#FED7AA' : '#F97316', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? 'Analizando con IA...' : '🔍 Analizar contenido'}
        </button>
      </div>

      {result && (
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: etiquetaColor, lineHeight: 1 }}>{result.score_total}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: etiquetaColor, marginTop: '4px' }}>{result.etiqueta}</div>
            </div>
            <div style={{ background: '#FFF7ED', borderRadius: '12px', padding: '12px 16px', maxWidth: '360px' }}>
              <p style={{ fontSize: '12px', color: '#92400E', margin: 0, lineHeight: 1.5 }}>{result.resumen}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            {DIMENSIONES.map(d => (
              <ScoreBar
                key={d.key}
                score={result.dimensiones[d.key as keyof typeof result.dimensiones].score}
                label={d.label}
                peso={d.peso}
                emoji={d.emoji}
                razon={result.dimensiones[d.key as keyof typeof result.dimensiones].razon}
                sugerencia={result.dimensiones[d.key as keyof typeof result.dimensiones].sugerencia}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleAnalyze} style={{ flex: 1, background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              🔄 Re-analizar
            </button>
            {result.score_total >= 65 && (
              <button onClick={handleCopy} style={{ flex: 1, background: '#F97316', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ✓ Copiar y publicar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
