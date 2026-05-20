import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GeneratorForm from '@/components/dashboard/GeneratorForm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-orange-500 text-lg">LatinoAI</span>
        <div className="flex items-center gap-4">
          {profile?.plan === 'free' && (
            <span className="text-xs text-gray-500">{profile.credits_used}/{profile.credits_limit} créditos</span>
          )}
          {profile?.plan === 'pro' && (
            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">Pro ✓</span>
          )}
          <a href="/analizar" className="text-sm text-gray-500 hover:text-gray-800">Analizar</a>
          <a href="/historial" className="text-sm text-gray-500 hover:text-gray-800">Historial</a>
          <a href="/perfil" className="text-sm text-gray-500 hover:text-gray-800">Perfil</a>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {!profile?.niche && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6 text-sm text-orange-700">
            👋 Para mejores resultados, <a href="/perfil" className="font-semibold underline">configura tu nicho en tu perfil</a>.
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6">Crear contenido</h1>
        <GeneratorForm profile={profile} />
      </div>
    </div>
  )
}
