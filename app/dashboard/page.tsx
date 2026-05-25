'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'

const patientCards = [
  { href: '/patient/profile', icon: '🩺', title: 'Profil Médical', description: 'Vos informations de santé', detail: 'Ajoutez vos antécédents médicaux, allergies et autres détails.', bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb' },
  { href: '/patient/doctors', icon: '👨‍⚕️', title: 'Trouver un Médecin', description: 'Démarrer une consultation', detail: 'Parcourez les médecins disponibles et demandez une consultation.', bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a' },
  { href: '/patient/consultations', icon: '💬', title: 'Mes Consultations', description: 'Voir vos consultations', detail: 'Chattez avec des médecins et gérez vos rendez-vous.', bg: '#f0fdfa', border: '#99f6e4', accent: '#0d9488' },
  { href: '/patient/records', icon: '📋', title: 'Dossiers Médicaux', description: 'Vos documents', detail: 'Accédez aux ordonnances, résultats et documents médicaux.', bg: '#faf5ff', border: '#e9d5ff', accent: '#7c3aed' },
]

const doctorCards = [
  { href: '/doctor/profile', icon: '👤', title: 'Mon Profil', description: 'Profil médecin', detail: 'Ajoutez votre spécialisation, licence et tarifs.', bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb' },
  { href: '/doctor/consultations', icon: '💬', title: 'Consultations', description: 'Gérer les patients', detail: 'Consultez et répondez aux demandes des patients.', bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a' },
  { href: '/doctor/availability', icon: '📅', title: 'Disponibilités', description: 'Vos horaires', detail: 'Configurez vos créneaux de consultation.', bg: '#f0fdfa', border: '#99f6e4', accent: '#0d9488' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { session, user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !session) router.push('/')
  }, [session, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b', fontSize: 16 }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏥</div>
            <div>
              <span style={{ color: '#1e293b', fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>CamMed</span>
              <span style={{ color: '#2563eb', fontWeight: 800, fontSize: 18 }}>Care</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/notifications">
              <button style={{ position: 'relative', padding: '8px', borderRadius: 8, background: 'transparent', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 16, color: '#64748b' }}>
                🔔
                <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>3</span>
              </button>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
              <div>
                <p style={{ color: '#1e293b', fontSize: 13, fontWeight: 600, margin: 0 }}>{user?.full_name || 'Utilisateur'}</p>
                <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>{user?.user_type === 'doctor' ? 'Médecin' : 'Patient'}</p>
              </div>
            </div>

            <button onClick={handleSignOut} style={{ padding: '8px 16px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#bfdbfe', fontSize: 13, fontWeight: 600, margin: '0 0 8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Tableau de bord</p>
            <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.5px' }}>
              Bonjour, {user?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
            </h2>
            <p style={{ color: '#bfdbfe', fontSize: 15, margin: 0 }}>
              {user?.user_type === 'doctor'
                ? 'Gérez vos consultations et vos patients.'
                : 'Accédez à vos services médicaux en ligne.'}
            </p>
          </div>
          <div style={{ fontSize: 80, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>
            {user?.user_type === 'doctor' ? '👨‍⚕️' : '🏥'}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h3 style={{ color: '#64748b', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 20px' }}>Services disponibles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div
                style={{ borderRadius: 16, padding: 24, background: card.bg, border: `1px solid ${card.border}`, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{ color: '#1e293b', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{card.title}</h3>
                <p style={{ color: card.accent, fontSize: 12, fontWeight: 600, margin: '0 0 10px' }}>{card.description}</p>
                <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>{card.detail}</p>
                <span style={{ color: card.accent, fontSize: 13, fontWeight: 600 }}>Accéder →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
