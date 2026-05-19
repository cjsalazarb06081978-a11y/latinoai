export type GenerationType = 'caption' | 'script' | 'ideas' | 'hashtags' | 'bio'
export type Platform = 'instagram' | 'tiktok' | 'youtube'
export type Language = 'spanish' | 'english' | 'spanglish'

export interface GenerateInput {
  type: GenerationType
  platform: Platform
  language: Language
  niche: string
  brandName?: string
  topic?: string
  duration?: '30' | '60' | '90'
}

function getLanguageInstruction(language: Language): string {
  switch (language) {
    case 'spanish': return 'Escribe TODO en español. Usa expresiones naturales del español latinoamericano.'
    case 'english': return 'Write EVERYTHING in English. Use natural American English.'
    case 'spanglish': return 'Mezcla español e inglés de forma natural, como hablan los latinos en USA. Ejemplo: "Okay chicos, hoy les traigo algo increíble that you NEED to try."'
  }
}

function getPlatformContext(platform: Platform): string {
  switch (platform) {
    case 'instagram': return 'para Instagram. Máximo 2200 caracteres. Incluye emojis estratégicos. CTA al final.'
    case 'tiktok': return 'para TikTok. Lenguaje rápido y directo. Hook fuerte en la primera línea. Muy casual y auténtico.'
    case 'youtube': return 'para YouTube. Más detallado. Incluye palabras clave naturalmente. Llama a suscribirse.'
  }
}

export function buildSystemPrompt(input: GenerateInput): string {
  const lang = getLanguageInstruction(input.language)
  const platform = getPlatformContext(input.platform)

  const base = `Eres un experto en contenido para creadores latinos en USA. Entiendes la cultura latina, el Spanglish, las tendencias en redes sociales y cómo conectar auténticamente con audiencias hispanas en Estados Unidos.
${lang}
El creador es del nicho: ${input.niche}.
${input.brandName ? `Nombre de marca: ${input.brandName}.` : ''}
Genera contenido ${platform}`

  switch (input.type) {
    case 'caption':
      return `${base}

Genera 3 variantes de caption completas y listas para publicar. Cada una debe tener: hook en la primera línea, mini historia o valor real, CTA claro, emojis apropiados. Sentirse auténtico, no generado por IA.

Formato exacto:
**Caption 1:**
[caption completo]

**Caption 2:**
[caption completo]

**Caption 3:**
[caption completo]`

    case 'script':
      return `${base}

Genera un script de video de ${input.duration || '60'} segundos con estas secciones claramente marcadas:
HOOK (0-3 seg): Frase que detiene el scroll
DESARROLLO: Contenido principal
CTA FINAL: Acción clara para el espectador

Lenguaje conversacional y auténtico.`

    case 'ideas':
      return `${base}

Genera 10 ideas de contenido para esta semana. Cada idea incluye: título llamativo, descripción de 1 línea, por qué va a funcionar con audiencia latina en USA. Numéralas del 1 al 10.`

    case 'hashtags':
      return `${base}

Genera 25 hashtags organizados en 3 grupos:
ALTO ALCANCE (5): millones de posts
ALCANCE MEDIO (10): cientos de miles
NICHO (10): decenas de miles, más específicos

Mix de español e inglés. Evita hashtags baneados.`

    case 'bio':
      return `${base}

Genera 3 versiones de bio:
- Versión ESPAÑOL
- Versión INGLÉS
- Versión SPANGLISH

Cada bio: describe qué hace, para quién, y tiene CTA. Respeta límites: Instagram=150 chars, TikTok=80 chars, YouTube=1000 chars.`
  }
}
