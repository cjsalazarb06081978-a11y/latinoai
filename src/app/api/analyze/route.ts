import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { content, platform, niche } = await request.json()
    if (!content) return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `Eres un experto en contenido para creadores latinos en USA. Analiza el contenido dado y devuelve SOLO un JSON valido sin markdown ni texto adicional con esta estructura exacta:
{
  "dimensiones": {
    "hook": { "score": 0-100, "razon": "explicacion corta", "sugerencia": "mejora especifica y accionable" },
    "autenticidad": { "score": 0-100, "razon": "explicacion corta", "sugerencia": "mejora especifica y accionable" },
    "claridad": { "score": 0-100, "razon": "explicacion corta", "sugerencia": "mejora especifica y accionable" },
    "cta": { "score": 0-100, "razon": "explicacion corta", "sugerencia": "mejora especifica y accionable" },
    "viralidad": { "score": 0-100, "razon": "explicacion corta", "sugerencia": "mejora especifica y accionable" }
  },
  "score_total": 0-100,
  "etiqueta": "Listo para publicar" | "Publicar con mejoras" | "Necesita trabajo",
  "resumen": "resumen de 1-2 oraciones de los cambios mas importantes"
}

Criterios de scoring:
- Hook (25%): Primera frase detiene el scroll? Es especifica, curiosa o genera emocion inmediata?
- Autenticidad latina (20%): Conecta con cultura latina en USA? Usa referencias, tono o Spanglish autentico?
- Claridad (20%): El mensaje central es claro en 5 segundos? Una sola idea dominante?
- CTA (20%): Hay llamada a accion especifica y clara? No generica como "dejame tu comentario"
- Viralidad (15%): Tiene valor unico para guardar o compartir? Genera conversacion?

score_total = (hook*0.25) + (autenticidad*0.20) + (claridad*0.20) + (cta*0.20) + (viralidad*0.15)
etiqueta: 85-100="Listo para publicar", 65-84="Publicar con mejoras", 0-64="Necesita trabajo"`,
      messages: [{
        role: 'user',
        content: `Analiza este contenido para ${platform || 'Instagram'} del nicho ${niche || 'general'}:\n\n${content}`
      }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const result = JSON.parse(raw)

    await supabase.from('content_scores').insert({
      user_id: user.id,
      content,
      platform: platform || 'instagram',
      score_hook: result.dimensiones.hook.score,
      score_autenticidad: result.dimensiones.autenticidad.score,
      score_claridad: result.dimensiones.claridad.score,
      score_cta: result.dimensiones.cta.score,
      score_viralidad: result.dimensiones.viralidad.score,
      score_total: result.score_total,
      sugerencias: JSON.stringify(result),
    }).throwOnError().catch(() => {})

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error analizando:', error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}
