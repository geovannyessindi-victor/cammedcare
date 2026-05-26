'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'

const patientCards = [
  { href: '/patient/profile', icon: '🩺', title: 'Profil Médical', description: 'Vos informations de santé', detail: 'Ajoutez vos antécédents médicaux, allergies et autres détails.', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  { href: '/patient/doctors', icon: '👨‍⚕️', title: 'Trouver un Médecin', description: 'Démarrer une consultation', detail: 'Parcourez les médecins disponibles et demandez une consultation.', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
  { href: '/patient/consultations', icon: '💬', title: 'Mes Consultations', description: 'Voir vos consultations', detail: 'Chattez avec des médecins et gérez vos rendez-vous.', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' },
  { href: '/patient/records', icon: '📋', title: 'Dossiers Médicaux', description: 'Vos documents', detail: 'Accédez aux ordonnances, résultats et documents médicaux.', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80' },
]

const doctorCards = [
  { href: '/doctor/profile', icon: '👤', title: 'Mon Profil', description: 'Profil médecin', detail: 'Ajoutez votre spécialisation, licence et tarifs.', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
  { href: '/doctor/consultations', icon: '💬', title: 'Consultations', description: 'Gérer les patients', detail: 'Consultez et répondez aux demandes des patients.', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' },
  { href: '/doctor/availability', icon: '📅', title: 'Disponibilités', description: 'Vos horaires', detail: 'Configurez vos créneaux de consultation.', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { session, user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !session) router.push('/')
  }, [session, loading, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>Chargement...</p>
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
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏥</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>Cam<span style={{ color: '#2563eb' }}>Med</span>Care</span>
          </div>

          <nav style={{ display: 'flex', gap: 32 }}>
            <Link href="/dashboard" style={{ color: '#111', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Accueil</Link>
            <Link href="/patient/doctors" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>Médecins</Link>
            <Link href="/patient/consultations" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>Consultations</Link>
            <Link href="/notifications" style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>Notifications</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
              <span style={{ color: '#111', fontSize: 13, fontWeight: 600 }}>{user?.full_name || 'Utilisateur'}</span>
            </div>
            <button onClick={handleSignOut} style={{ padding: '7px 16px', borderRadius: 20, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Hero avec image médicale */}
      <div style={{
        position: 'relative', padding: '60px 24px', textAlign: 'center', overflow: 'hidden',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }}></div>
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#2563eb', fontSize: 13, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 12px' }}>Tableau de bord</p>
          <h1 style={{ color: '#111', fontSize: 40, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
            Bonjour, {user?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, margin: '0 0 32px' }}>
            {user?.user_type === 'doctor' ? 'Gérez vos consultations et vos patients.' : 'Accédez à vos services médicaux en ligne.'}
          </p>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 40, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '6px 6px 6px 20px' }}>
            <span style={{ fontSize: 16, marginRight: 8 }}>🔍</span>
            <input placeholder="Rechercher un médecin, service..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#111', background: 'transparent' }} />
            <button style={{ padding: '10px 24px', borderRadius: 30, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Rechercher</button>
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['Généraliste', 'Pédiatrie', 'Cardiologie', 'Dermatologie', 'Urgences'].map(tag => (
              <span key={tag} style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid #e5e7eb', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ color: '#111', fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>Services disponibles</h2>
        <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px' }}>Accédez rapidement à vos services médicaux</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {cards.map((card, index) => (
            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
              <div
                className={`card-float-${index}`}
                style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}></div>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <h3 style={{ color: '#111', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{card.title}</h3>
                  <p style={{ color: '#2563eb', fontSize: 12, fontWeight: 600, margin: '0 0 8px' }}>{card.description}</p>
                  <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 14px', lineHeight: 1.5 }}>{card.detail}</p>
                  <span style={{ color: '#2563eb', fontSize: 13, fontWeight: 600 }}>Accéder →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .card-float-0 { animation: float 3s ease-in-out infinite; }
        .card-float-1 { animation: float 3s ease-in-out infinite 0.5s; }
        .card-float-2 { animation: float 3s ease-in-out infinite 1s; }
        .card-float-3 { animation: float 3s ease-in-out infinite 1.5s; }
      `}</style>
    </div>
  )
}
