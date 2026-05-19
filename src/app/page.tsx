export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-bold text-orange-500 text-xl">LatinoAI</span>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition">
            Entrar
          </a>
          <a
            href="/register"
            className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition"
          >
            Empieza gratis
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          Para creadores latinos en USA
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl mb-6">
          Crea contenido para tus redes{" "}
          <span className="text-orange-500">en segundos</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          La herramienta de IA diseñada para creadores latinos en USA.
          En español, inglés o Spanglish.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <a
            href="/register"
            className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-orange-600 transition shadow-sm"
          >
            Empieza gratis
          </a>
          <a
            href="/login"
            className="text-gray-500 text-sm hover:text-gray-800 transition px-4 py-4"
          >
            Ya tengo cuenta →
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-5">Sin tarjeta de crédito · Gratis para siempre</p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Todo lo que necesitas para crear
          </h2>
          <p className="text-gray-500 text-center text-sm mb-12">
            Genera en segundos lo que antes te tomaba horas.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="font-bold text-lg mb-2">Captions que conectan</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                3 variantes listas para publicar, con hook, historia y CTA.
                Auténticas, no genéricas.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">🎬</div>
              <h3 className="font-bold text-lg mb-2">Scripts para Reels y TikTok</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Scripts de 30, 60 o 90 segundos con hook, desarrollo y CTA final
                para detener el scroll.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="font-bold text-lg mb-2">Ideas para toda la semana</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                10 ideas de contenido por semana, con título y por qué van a
                funcionar con tu audiencia latina.
              </p>
            </div>

          </div>

          {/* Features secundarias */}
          <div className="grid sm:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">#️⃣</div>
              <h3 className="font-bold text-lg mb-2">Hashtags estratégicos</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                25 hashtags organizados por alcance — alto, medio y nicho —
                en español e inglés.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">👤</div>
              <h3 className="font-bold text-lg mb-2">Bio optimizada</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                3 versiones de bio para Instagram, TikTok y YouTube.
                En español, inglés y Spanglish.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-3xl mb-4">🇺🇸🇲🇽</div>
              <h3 className="font-bold text-lg mb-2">Spanglish nativo</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Contenido que suena como tú hablas — mezclando inglés y español
                de forma natural y auténtica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-orange-500 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            ¿Listo para crear contenido que conecta?
          </h2>
          <p className="text-orange-100 mb-8 text-base">
            Únete a los creadores latinos que ya están usando IA para crecer más rápido.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-orange-500 font-bold px-8 py-4 rounded-xl text-base hover:bg-orange-50 transition shadow-sm"
          >
            Crear cuenta gratis
          </a>
          <p className="text-orange-200 text-xs mt-4">Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-orange-500">LatinoAI</span>
          <p className="text-gray-400 text-xs">© 2025 LatinoAI. Hecho con ❤️ para la comunidad latina en USA.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="/login" className="hover:text-gray-600 transition">Entrar</a>
            <a href="/register" className="hover:text-gray-600 transition">Registro</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
