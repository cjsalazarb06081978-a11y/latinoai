import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const TYPE_LABELS: Record<string, string> = {
  caption: '✍️ Caption',
  script: '🎬 Script',
  ideas: '💡 Ideas',
  hashtags: '#️⃣ Hashtags',
  bio: '👤 Bio',
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

export default async function HistorialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-orange-500 text-lg">LatinoAI</span>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">Dashboard</a>
          <a href="/perfil" className="text-sm text-gray-500 hover:text-gray-800">Perfil</a>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <a href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          ← Volver al dashboard
        </a>
        <h1 className="text-2xl font-bold mb-6">Historial</h1>

        {!generations || generations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-gray-500 text-sm">Todavía no has generado contenido.</p>
            <a href="/dashboard" className="inline-block mt-4 bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition">
              Crear mi primer contenido
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {generations.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-800">
                    {TYPE_LABELS[g.type] ?? g.type}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{PLATFORM_LABELS[g.platform] ?? g.platform}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {new Date(g.created_at).toLocaleDateString('es-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                {g.input_prompt && (
                  <p className="text-xs text-gray-400 mb-2 italic">{g.input_prompt}</p>
                )}
                <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">{g.output}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
