'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Star, Search } from 'lucide-react'
import type { DoctorProfile, User } from '@/lib/types'

interface DoctorWithUser extends DoctorProfile {
  user: User
}

export default function BrowseDoctorsPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [doctors, setDoctors] = useState<DoctorWithUser[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWithUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.user_type === 'patient') {
      fetchDoctors()
    }
  }, [session, loading, router, user])

  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (specialization) {
      filtered = filtered.filter((doc) =>
        doc.specialization.toLowerCase().includes(specialization.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
  }, [searchTerm, specialization, doctors])

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const { data: doctorProfiles, error } = await supabase
        .from('doctor_profiles')
        .select('*, user:user_id(id, email, full_name, phone, profile_photo_url, bio)')

      if (error) {
        console.error('Error fetching doctors:', error)
        return
      }

      setDoctors(doctorProfiles || [])
      setFilteredDoctors(doctorProfiles || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleRequestConsultation = async (doctorId: string) => {
    try {
      const { data: consultation, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: user?.id,
          doctor_id: doctorId,
          status: 'pending',
          consultation_type: 'text',
        })
        .select()

      if (error) {
        console.error('Error creating consultation:', error)
        return
      }

      router.push(`/patient/consultations/${consultation[0]?.id}`)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session || user?.user_type !== 'patient') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find a Doctor</CardTitle>
            <CardDescription>Browse available healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Specialization (optional)"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-40"
                />
              </div>
              <p className="text-sm text-gray-600">
                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </CardContent>
        </Card>

        {loadingDoctors ? (
          <div className="text-center py-12">Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No doctors found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor.user.full_name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {doctor.specialization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(doctor.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({doctor.review_count} reviews)
                    </span>
                  </div>

                  {doctor.experience_years && (
                    <p className="text-sm text-gray-600">
                      {doctor.experience_years} years experience
                    </p>
                  )}

                  {doctor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">{doctor.bio}</p>
                  )}

                  {doctor.consultation_fee && (
                    <p className="text-lg font-semibold text-green-600">
                      ${doctor.consultation_fee}
                    </p>
                  )}

                  <Button
                    onClick={() => handleRequestConsultation(doctor.user_id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Request Consultation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
