'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube']

const LANGUAGES = [
  { value: 'spanglish', label: '🇺🇸🇲🇽 Spanglish' },
  { value: 'spanish',   label: '🇪🇸 Español' },
  { value: 'english',   label: '🇺🇸 English' },
]

interface ProfileFormProps {
  profile: {
    niche?: string
    brand_name?: string
    platforms?: string[]
    preferred_language?: string
  } | null
  userId: string
}

export default function ProfileForm({ profile, userId }: ProfileFormProps) {
  const [niche, setNiche] = useState(profile?.niche ?? '')
  const [brandName, setBrandName] = useState(profile?.brand_name ?? '')
  const [platforms, setPlatforms] = useState<string[]>(profile?.platforms ?? [])
  const [language, setLanguage] = useState(profile?.preferred_language ?? 'spanglish')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function togglePlatform(platform: string) {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        niche: niche.trim(),
        brand_name: brandName.trim(),
        platforms,
        preferred_language: language,
      })
      .eq('id', userId)

    setSaving(false)
    if (dbError) {
      setError(dbError?.message || dbError?.details || JSON.stringify(dbError) || 'Error desconocido')
      return
    }
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">

      {/* Nicho */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nicho principal
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Describe tu nicho en pocas palabras. Esto personaliza todo el contenido.
        </p>
        <input
          type="text"
          value={niche}
          onChange={e => setNiche(e.target.value)}
          placeholder="Ej: comida latina, fitness, belleza, finanzas personales..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Nombre de marca */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de marca o cuenta
        </label>
        <p className="text-xs text-gray-400 mb-2">
          El nombre que usas en tus redes sociales.
        </p>
        <input
          type="text"
          value={brandName}
          onChange={e => setBrandName(e.target.value)}
          placeholder="Ej: @latinalifestyle, Chef Ricardo..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Plataformas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Plataformas activas
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Selecciona donde publicas contenido.
        </p>
        <div className="flex gap-3">
          {PLATFORMS.map(p => {
            const active = platforms.includes(p)
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition ${
                  active
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {p === 'Instagram' && '📸 '}
                {p === 'TikTok' && '🎵 '}
                {p === 'YouTube' && '▶️ '}
                {p}
              </button>
            )
          })}
        </div>
      </div>

      {/* Idioma */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Idioma preferido
        </label>
        <p className="text-xs text-gray-400 mb-2">
          En qué idioma quieres generar tu contenido por defecto.
        </p>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Feedback */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <span>✓</span> ¡Perfil guardado!
        </div>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-orange-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar perfil'}
      </button>
    </form>
  )
}
