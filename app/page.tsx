'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading && session) {
      router.push('/dashboard')
    }
  }, [session, loading, router])

  if (loading) return null
  if (session) return null

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Cam<span style={{ color: '#2563eb' }}>Med</span>Care</span>
        </div>

        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: 14, cursor: 'pointer' }}>Fonctionnalités</span>
          <span style={{ color: '#6b7280', fontSize: 14, cursor: 'pointer' }}>À propos</span>
          <span style={{ color: '#6b7280', fontSize: 14, cursor: 'pointer' }}>Contact</span>
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login>
            <button style={{ padding: '8px 20px', borderRadius: 20, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#111' }}>
              Connexion
            </button>
          </Link>
          <Link href="/signup?type=patient">
            <button style={{ padding: '8px 20px', borderRadius: 20, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              S'inscrire →
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ position: 'relative', padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #eff6ff 0%, #fff 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1400&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06 }}></div>
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 20, background: '#dbeafe', color: '#2563eb', fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px' }}>
            🏥 PLATEFORME DE SANTÉ EN LIGNE
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#111', margin: '0 0 16px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Votre Santé,<br />
            <span style={{ color: '#2563eb' }}>Notre Priorité</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: 17, margin: '0 0 40px', lineHeight: 1.6 }}>
            Consultez des médecins en ligne, gérez vos dossiers médicaux et accédez à des soins de qualité depuis chez vous.
          </p>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', maxWidth: 560, margin: '0 auto 24px', background: '#fff', borderRadius: 40, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '6px 6px 6px 20px' }}>
            <span style={{ fontSize: 16, marginRight: 8 }}>🔍</span>
            <input placeholder="Rechercher un médecin, spécialité..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#111', background: 'transparent' }} />
            <button style={{ padding: '10px 24px', borderRadius: 30, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Rechercher</button>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Généraliste', 'Pédiatrie', 'Cardiologie', 'Dermatologie', 'Urgences'].map(tag => (
              <span key={tag} style={{ padding: '5px 16px', borderRadius: 20, border: '1px solid #e5e7eb', fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Section Je suis... */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Commencer</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', margin: '0 0 40px' }}>Choisissez votre profil pour accéder à nos services</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>

          {/* Médecin */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80" alt="Médecin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(37,99,235,0.7), transparent)' }}></div>
              <h3 style={{ position: 'absolute', bottom: 16, left: 16, color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Je suis Médecin</h3>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>Gérez vos consultations et connectez-vous avec vos patients en ligne.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/signup?type=doctor" style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>S'inscrire</button>
                </Link>
                <Link href="/login?type=doctor" style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', color: '#111', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Se connecter</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Patient */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80" alt="Patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,148,136,0.7), transparent)' }}></div>
              <h3 style={{ position: 'absolute', bottom: 16, left: 16, color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Je suis Patient</h3>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>Consultez des médecins en ligne et gérez vos dossiers médicaux facilement.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/signup?type=patient" style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#0d9488', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>S'inscrire</button>
                </Link>
                <Link href="/login?type=patient" style={{ flex: 1 }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', color: '#111', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Se connecter</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ background: '#f8fafc', padding: '60px 24px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Nos Services</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', margin: '0 0 40px' }}>Tout ce dont vous avez besoin pour votre santé</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', title: 'Médicaments', desc: 'Ordonnances et prescriptions en ligne' },
              { img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80', title: 'Perfusion & Cathéter', desc: 'Suivi des soins intensifs à distance' },
              { img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', title: 'Consultations', desc: 'Rendez-vous médicaux en ligne' },
              { img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&q=80', title: 'Dossiers Médicaux', desc: 'Accès sécurisé à vos documents' },
            ].map((item) => (
              <div key={item.title} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ color: '#111', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{item.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111', padding: '30px 24px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
          © 2026 CamMedCare — En utilisant ce service, vous acceptez nos{' '}
          <span style={{ color: '#2563eb', cursor: 'pointer' }}>Conditions d'utilisation</span>
          {' '}et notre{' '}
          <span style={{ color: '#2563eb', cursor: 'pointer' }}>Politique de confidentialité</span>
        </p>
      </footer>
    </div>
  )
}
