'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DoctorProfilePage() {
  const router = useRouter()
  const { session, user, userProfile, loading } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    specialization: '',
    license_number: '',
    experience_years: 0,
    consultation_fee: 0,
    bio: '',
    education: '',
    certifications: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (userProfile) {
      setFormData({
        specialization: userProfile.specialization || '',
        license_number: userProfile.license_number || '',
        experience_years: userProfile.experience_years || 0,
        consultation_fee: userProfile.consultation_fee || 0,
        bio: userProfile.bio || '',
        education: userProfile.education || '',
        certifications: userProfile.certifications || '',
      })
    }
  }, [session, loading, router, userProfile])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('_') && name !== 'license_number'
        ? parseFloat(value) || 0
        : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('doctor_profiles')
        .update(formData)
        .eq('user_id', user?.id)

      if (error) {
        setMessage('Error saving profile: ' + error.message)
      } else {
        setMessage('Profile saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session || user?.user_type !== 'doctor') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>
              Complete your professional information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    placeholder="e.g., Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number *</Label>
                  <Input
                    id="license_number"
                    name="license_number"
                    placeholder="Your medical license number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation_fee">Consultation Fee ($)</Label>
                  <Input
                    id="consultation_fee"
                    name="consultation_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell patients about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  placeholder="Your medical education and training"
                  value={formData.education}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  placeholder="List your certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {message && (
                <div className={`p-3 rounded text-sm ${
                  message.includes('Error') 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
