import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function PerfilPage() {
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
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">Dashboard</a>
          <a href="/historial" className="text-sm text-gray-500 hover:text-gray-800">Historial</a>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <a href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          ← Volver al dashboard
        </a>
        <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>
        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}
