'use client'

import { useState } from 'react'

const TYPES = [
  { value: 'caption', label: '✍️ Caption' },
  { value: 'script', label: '🎬 Script' },
  { value: 'ideas', label: '💡 Ideas' },
  { value: 'hashtags', label: '#️⃣ Hashtags' },
  { value: 'bio', label: '👤 Bio' },
]
const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
]
const LANGUAGES = [
  { value: 'spanglish', label: '🇺🇸🇲🇽 Spanglish' },
  { value: 'spanish', label: '🇪🇸 Español' },
  { value: 'english', label: '🇺🇸 English' },
]

export default function GeneratorForm({ profile }: { profile: any }) {
  const [type, setType] = useState('caption')
  const [platform, setPlatform] = useState(profile?.platforms?.[0] || 'instagram')
  const [language, setLanguage] = useState(profile?.preferred_language || 'spanglish')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!profile?.niche) { setError('Configura tu nicho en el perfil primero'); return }
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, platform, language, niche: profile.niche, brandName: profile.brand_name, topic }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Error al generar. Intenta de nuevo.'); return }
      setResult(data.output)
    } catch { setError('Error de conexión. Intenta de nuevo.') }
    finally { setLoading(false) }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">¿Qué quieres generar?</label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${type === t.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tema o contexto <span className="text-gray-400 font-normal">(opcional)</span></label>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          placeholder="Ej: Estoy lanzando mi nueva línea de skincare para pieles morenas..."/>
      </div>
      {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
      <button onClick={handleGenerate} disabled={loading}
        className="w-full bg-orange-500 text-white rounded-xl py-4 text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generando con IA...</>) : '✨ Generar contenido'}
      </button>
      {result && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Resultado</h3>
            <button onClick={handleCopy} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
              {copied ? '✓ Copiado!' : 'Copiar todo'}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  )
}
