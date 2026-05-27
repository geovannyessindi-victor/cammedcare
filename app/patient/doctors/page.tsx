'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

function DoctorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  useEffect(() => {
    if (!loading && !session) router.push('/')
    if (session) fetchDoctors()
  }, [session, loading])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors)
    } else {
      setFilteredDoctors(doctors.filter(doc =>
        doc.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }
  }, [searchTerm, doctors])

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const { data } = await supabase
        .from('doctor_profiles')
        .select('*, user:user_id(id, email, full_name)')
      setDoctors(data || [])
      setFilteredDoctors(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleRequestConsultation = async (doctorUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: user?.id,
          doctor_id: doctorUserId,
          status: 'pending',
          consultation_type: 'text',
        })
        .select()
      if (error) { console.error(error); return }
      router.push(`/patient/consultations/${data[0]?.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!session) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: 14 }}>
          ← Retour au Dashboard
        </Link>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Cam<span style={{ color: '#2563eb' }}>Med</span>Care</span>
        <div></div>
      </header>

      {/* Hero search */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af, #0d9488)', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: '0 0 8px' }}>Trouver un Médecin</h1>
        <p style={{ color: '#bfdbfe', fontSize: 15, margin: '0 0 28px' }}>Consultez les médecins disponibles sur CamMedCare</p>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 40, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '6px 6px 6px 20px' }}>
          <span style={{ fontSize: 16, marginRight: 8 }}>🔍</span>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Nom du médecin, spécialité..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#111', background: 'transparent' }}
          />
          <button
            onClick={() => setSearchTerm('')}
            style={{ padding: '10px 20px', borderRadius: 30, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >Effacer</button>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
          {filteredDoctors.length} médecin{filteredDoctors.length !== 1 ? 's' : ''} trouvé{filteredDoctors.length !== 1 ? 's' : ''}
        </p>

        {loadingDoctors ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Chargement des médecins...</div>
        ) : filteredDoctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>Aucun médecin trouvé</p>
            <p>Essayez une autre recherche ou vérifiez plus tard.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} style={{ borderRadius: 16, background: '#fff', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                {/* Card header */}
                <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                    {doctor.user?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'DR'}
                  </div>
                  <div>
                    <h3 style={{ color: '#111', fontSize: 16, fontWeight: 700, margin: '0 0 2px' }}>Dr. {doctor.user?.full_name || 'Médecin'}</h3>
                    <p style={{ color: '#2563eb', fontSize: 13, fontWeight: 600, margin: 0 }}>{doctor.specialization || 'Médecine Générale'}</p>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 20px 20px' }}>
                  {doctor.experience_years && (
                    <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 8px' }}>⏱ {doctor.experience_years} ans d'expérience</p>
                  )}
                  {doctor.bio && (
                    <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{doctor.bio}</p>
                  )}
                  {doctor.consultation_fee && (
                    <p style={{ color: '#16a34a', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>💰 {doctor.consultation_fee} FCFA</p>
                  )}
                  <button
                    onClick={() => handleRequestConsultation(doctor.user_id)}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, background: '#2563eb', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Demander une consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BrowseDoctorsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>}>
      <DoctorsContent />
    </Suspense>
  )
}
