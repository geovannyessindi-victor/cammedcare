'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* Logo */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl shadow-2xl mx-auto mb-4">
          🏥
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">CamMedCare</h1>
        <p className="text-blue-300 text-lg">Plateforme de Santé en Ligne</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
        
        {/* Doctor */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-all">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-white text-xl font-bold mb-2">Je suis Médecin</h2>
          <p className="text-blue-200 text-sm mb-6">Gérez vos consultations et connectez-vous avec vos patients en ligne.</p>
          <div className="flex flex-col gap-3">
            <Link href="/signup?type=doctor">
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all">
                S'inscrire
              </button>
            </Link>
            <Link href="/login?type=doctor">
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
                Se connecter
              </button>
            </Link>
          </div>
        </div>

        {/* Patient */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 transition-all">
          <div className="text-6xl mb-4">🧑‍💼</div>
          <h2 className="text-white text-xl font-bold mb-2">Je suis Patient</h2>
          <p className="text-blue-200 text-sm mb-6">Consultez des médecins en ligne et gérez vos dossiers médicaux.</p>
          <div className="flex flex-col gap-3">
            <Link href="/signup?type=patient">
              <button className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all">
                S'inscrire
              </button>
            </Link>
            <Link href="/login?type=patient">
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
                Se connecter
              </button>
            </Link>
          </div>
        </div>

      </div>

      <p className="text-white/30 text-sm text-center">
        En utilisant CamMedCare, vous acceptez nos{' '}
        <span className="text-blue-400 cursor-pointer hover:underline">Conditions d'utilisation</span>
        {' '}et notre{' '}
        <span className="text-blue-400 cursor-pointer hover:underline">Politique de confidentialité</span>
      </p>
    </div>
  )
}
