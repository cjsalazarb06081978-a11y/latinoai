import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt, type GenerateInput } from '@/lib/prompts'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_used, credits_limit, plan, niche, brand_name')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })

    if (profile.plan === 'free' && profile.credits_used >= profile.credits_limit) {
      return NextResponse.json({
        error: 'limite_creditos',
        message: 'Alcanzaste tu límite mensual. Actualiza a Pro para generar ilimitado.'
      }, { status: 403 })
    }

    const input: GenerateInput = await request.json()
    const systemPrompt = buildSystemPrompt(input)
    const userMessage = input.topic
      ? `Tema específico: ${input.topic}`
      : `Genera contenido de tipo ${input.type} para el nicho ${input.niche}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const output = message.content[0].type === 'text' ? message.content[0].text : ''

    await supabase.from('generations').insert({
      user_id: user.id,
      type: input.type,
      platform: input.platform,
      language: input.language,
      input_prompt: userMessage,
      output,
    })

    if (profile.plan === 'free') {
      await supabase
        .from('profiles')
        .update({ credits_used: profile.credits_used + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({ output, creditsUsed: profile.credits_used + 1 })

  } catch (error) {
    console.error('Error generando:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
