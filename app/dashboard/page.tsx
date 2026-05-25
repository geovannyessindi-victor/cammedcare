'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'

const patientCards = [
  {
    href: '/patient/profile',
    icon: '🩺',
    title: 'Profil Médical',
    description: 'Vos informations de santé',
    detail: 'Ajoutez vos antécédents médicaux, allergies et autres détails de santé.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    href: '/patient/doctors',
    icon: '👨‍⚕️',
    title: 'Trouver un Médecin',
    description: 'Démarrer une consultation',
    detail: 'Parcourez les médecins disponibles et demandez une consultation.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    href: '/patient/consultations',
    icon: '💬',
    title: 'Mes Consultations',
    description: 'Voir vos consultations',
    detail: 'Chattez avec des médecins et gérez vos rendez-vous.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    href: '/patient/records',
    icon: '📋',
    title: 'Dossiers Médicaux',
    description: 'Vos documents',
    detail: 'Accédez aux ordonnances, résultats et documents médicaux.',
    color: 'from-orange-500 to-orange-600',
  },
]

const doctorCards = [
  {
    href: '/doctor/profile',
    icon: '👤',
    title: 'Mon Profil',
    description: 'Complétez votre profil médecin',
    detail: 'Ajoutez votre spécialisation, licence et tarifs de consultation.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    href: '/doctor/consultations',
    icon: '💬',
    title: 'Consultations',
    description: 'Gérer les consultations patients',
    detail: 'Consultez et répondez aux demandes de consultation des patients.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    href: '/doctor/availability',
    icon: '📅',
    title: 'Disponibilités',
    description: 'Définir vos horaires',
    detail: 'Configurez vos créneaux de consultation disponibles.',
    color: 'from-purple-500 to-purple-600',
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { session, user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
  }, [session, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const cards = user?.user_type === 'doctor' ? doctorCards : patientCards
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🏥
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">CamMedCare</h1>
              <p className="text-blue-300 text-xs mt-0.5">Plateforme de Santé</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
              </button>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium leading-none">{user?.full_name || 'Utilisateur'}</p>
                <p className="text-blue-300 text-xs mt-0.5 capitalize">{user?.user_type === 'doctor' ? 'Médecin' : 'Patient'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 text-sm font-medium transition-all border border-red-500/30"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-300 text-sm font-medium mb-1">Bienvenue sur votre espace</p>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">
                Bonjour, {user?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
              </h2>
              <p className="text-blue-200 mt-2 text-sm">
                {user?.user_type === 'doctor'
                  ? 'Gérez vos consultations et vos patients depuis votre tableau de bord.'
                  : 'Accédez à vos services médicaux et consultations en ligne.'}
              </p>
            </div>
            <div className="text-5xl">
              {user?.user_type === 'doctor' ? '👨‍⚕️' : '🏥'}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Services disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-6 transition-all duration-300 cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-blue-300 text-xs font-medium mb-3">{card.description}</p>
                <p className="text-white/50 text-sm leading-relaxed">{card.detail}</p>
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                  Accéder <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
