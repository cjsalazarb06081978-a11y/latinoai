import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContentScoreComponent from '@/components/dashboard/ContentScore'

export default async function AnalizarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, color: '#F97316', fontSize: '18px' }}>LatinoAI</span>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <a href="/dashboard" style={{ color: '#6B7280', textDecoration: 'none' }}>Generar</a>
          <a href="/analizar" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>Analizar</a>
          <a href="/historial" style={{ color: '#6B7280', textDecoration: 'none' }}>Historial</a>
          <a href="/perfil" style={{ color: '#6B7280', textDecoration: 'none' }}>Perfil</a>
        </div>
      </nav>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>ContentScore</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Analiza tu contenido antes de publicar. Score en 5 dimensiones + sugerencias especificas de mejora.</p>
        <ContentScoreComponent profile={profile} />
      </div>
    </div>
  )
}
