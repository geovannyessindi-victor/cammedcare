'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'

const patientCards = [
  { href: '/patient/profile', icon: '🩺', title: 'Profil Médical', description: 'Vos informations de santé', detail: 'Ajoutez vos antécédents médicaux, allergies et autres détails.', color: '#0ea5e9', shadow: '#0369a1' },
  { href: '/patient/doctors', icon: '👨‍⚕️', title: 'Trouver un Médecin', description: 'Démarrer une consultation', detail: 'Parcourez les médecins disponibles et demandez une consultation.', color: '#14b8a6', shadow: '#0f766e' },
  { href: '/patient/consultations', icon: '💬', title: 'Mes Consultations', description: 'Voir vos consultations', detail: 'Chattez avec des médecins et gérez vos rendez-vous.', color: '#06b6d4', shadow: '#0e7490' },
  { href: '/patient/records', icon: '📋', title: 'Dossiers Médicaux', description: 'Vos documents', detail: 'Accédez aux ordonnances, résultats et documents médicaux.', color: '#10b981', shadow: '#047857' },
]

const doctorCards = [
  { href: '/doctor/profile', icon: '👤', title: 'Mon Profil', description: 'Profil médecin', detail: 'Ajoutez votre spécialisation, licence et tarifs.', color: '#0ea5e9', shadow: '#0369a1' },
  { href: '/doctor/consultations', icon: '💬', title: 'Consultations', description: 'Gérer les patients', detail: 'Consultez et répondez aux demandes des patients.', color: '#14b8a6', shadow: '#0f766e' },
  { href: '/doctor/availability', icon: '📅', title: 'Disponibilités', description: 'Vos horaires', detail: 'Configurez vos créneaux de consultation.', color: '#06b6d4', shadow: '#0e7490' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { session, user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !session) router.push('/')
  }, [session, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #134e4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, border: '4px solid #22d3ee', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#99f6e4', fontSize: 18, textShadow: '0 0 20px #14b8a6' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const cards = user?.user_type === 'doctor' ? doctorCards : patientCards
  const initials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 40%, #134e4a 100%)', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Background grid */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', perspective: '800px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'rotateX(60deg) translateZ(-100px) scale(2.5)',
          transformOrigin: 'center bottom',
        }}></div>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.15), transparent 70%)' }}></div>
      </div>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)', background: 'rgba(15,23,42,0.7)', borderBottom: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 4px 30px rgba(6,182,212,0.1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 15px rgba(14,165,233,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>🏥</div>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0, textShadow: '0 0 20px rgba(6,182,212,0.8)', letterSpacing: '0.5px' }}>CamMedCare</h1>
              <p style={{ color: '#5eead4', fontSize: 11, margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Plateforme de Santé</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/notifications">
              <button style={{ position: 'relative', padding: '8px 10px', borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#fff', cursor: 'pointer', fontSize: 16 }}>
                🔔
                <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#ef4444', borderRadius: '50%', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>3</span>
              </button>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 12, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, boxShadow: '0 2px 10px rgba(6,182,212,0.4)' }}>{initials}</div>
              <div>
                <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{user?.full_name || 'Utilisateur'}</p>
                <p style={{ color: '#5eead4', fontSize: 11, margin: 0 }}>{user?.user_type === 'doctor' ? 'Médecin' : 'Patient'}</p>
              </div>
            </div>
            <button onClick={handleSignOut} style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 20px', position: 'relative' }}>
        <div style={{
          borderRadius: 24, padding: '32px 40px',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(20,184,166,0.2))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(6,182,212,0.3)',
          boxShadow: '0 20px 60px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transform: 'perspective(1000px) rotateX(2deg)',
        }}>
          <div>
            <p style={{ color: '#5eead4', fontSize: 13, fontWeight: 600, margin: '0 0 8px', letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 0 10px rgba(94,234,212,0.5)' }}>Bienvenue sur votre espace</p>
            <h2 style={{
              color: '#fff', fontSize: 36, fontWeight: 900, margin: '0 0 10px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 30px rgba(6,182,212,0.4)',
              letterSpacing: '-0.5px'
            }}>
              Bonjour, {user?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
              {user?.user_type === 'doctor' ? 'Gérez vos consultations et connectez-vous avec vos patients.' : 'Accédez à vos services médicaux et consultations en ligne.'}
            </p>
          </div>
          <div style={{ fontSize: 72, filter: 'drop-shadow(0 10px 20px rgba(6,182,212,0.4))', transform: 'perspective(500px) rotateY(-15deg)' }}>
            {user?.user_type === 'doctor' ? '👨‍⚕️' : '🏥'}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 48px', position: 'relative' }}>
        <p style={{ color: 'rgba(94,234,212,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, textShadow: '0 0 10px rgba(94,234,212,0.4)' }}>Services disponibles</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: 20, padding: 24,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -4px 0 ${card.shadow}55`,
                cursor: 'pointer', height: '100%',
                transform: 'perspective(800px) rotateX(3deg)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'perspective(800px) rotateX(0deg) translateY(-6px)'
                el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 2px 0 rgba(255,255,255,0.1) inset, 0 -4px 0 ${card.color}88`
                el.style.borderColor = `${card.color}66`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'perspective(800px) rotateX(3deg)'
                el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 2px 0 rgba(255,255,255,0.05) inset, 0 -4px 0 ${card.shadow}55`
                el.style.borderColor = 'rgba(255,255,255,0.12)'
              }}
              >
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg, ${card.color}, ${card.shadow})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, boxShadow: `0 6px 20px ${card.color}44` }}>
                  {card.icon}
                </div>
                <h3 style={{
                  color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 4px',
                  textShadow: `0 2px 8px rgba(0,0,0,0.5), 0 0 15px ${card.color}44`,
                  letterSpacing: '0.3px'
                }}>{card.title}</h3>
                <p style={{ color: card.color, fontSize: 11, fontWeight: 600, margin: '0 0 12px', letterSpacing: '0.5px', textShadow: `0 0 10px ${card.color}66` }}>{card.description}</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>{card.detail}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: card.color, fontSize: 13, fontWeight: 600, textShadow: `0 0 10px ${card.color}66` }}>
                  Accéder <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
