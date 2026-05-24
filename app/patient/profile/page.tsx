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

export default function PatientProfilePage() {
  const router = useRouter()
  const { session, user, userProfile, loading } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: 'Other' as 'M' | 'F' | 'Other',
    blood_type: '',
    allergies: '',
    medical_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    height_cm: 0,
    weight_kg: 0,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (userProfile) {
      setFormData({
        date_of_birth: userProfile.date_of_birth || '',
        gender: userProfile.gender || 'Other',
        blood_type: userProfile.blood_type || '',
        allergies: userProfile.allergies || '',
        medical_conditions: userProfile.medical_conditions || '',
        emergency_contact_name: userProfile.emergency_contact_name || '',
        emergency_contact_phone: userProfile.emergency_contact_phone || '',
        height_cm: userProfile.height_cm || 0,
        weight_kg: userProfile.weight_kg || 0,
      })
    }
  }, [session, loading, router, userProfile])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'height_cm' || name === 'weight_kg'
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
        .from('patient_profiles')
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

  if (!session || user?.user_type !== 'patient') {
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
            <CardTitle>Your Medical Profile</CardTitle>
            <CardDescription>
              Maintain your medical information securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blood_type">Blood Type</Label>
                  <Input
                    id="blood_type"
                    name="blood_type"
                    placeholder="e.g., O+, A-"
                    value={formData.blood_type}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height_cm">Height (cm)</Label>
                  <Input
                    id="height_cm"
                    name="height_cm"
                    type="number"
                    min="0"
                    value={formData.height_cm}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    name="weight_kg"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  placeholder="List any allergies (e.g., Penicillin, Shellfish)"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_conditions">Medical Conditions</Label>
                <Textarea
                  id="medical_conditions"
                  name="medical_conditions"
                  placeholder="List any chronic conditions or health issues"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      placeholder="Emergency contact name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      type="tel"
                      placeholder="Emergency contact phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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
