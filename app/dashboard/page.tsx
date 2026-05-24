'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { session, user, userProfile, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
  }, [session, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session || !user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CamMedCare Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user.full_name}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/notifications">
              <Button variant="outline">
                Notifications
              </Button>
            </Link>
            <Button
              onClick={handleSignOut}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.user_type === 'doctor' ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Setup</CardTitle>
                  <CardDescription>Complete your doctor profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Add your specialization, license, and consultation fees to get started accepting patients.
                  </p>
                  <Link href="/doctor/profile">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consultations</CardTitle>
                  <CardDescription>Manage patient consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    View and respond to consultation requests from patients.
                  </p>
                  <Link href="/doctor/consultations">
                    <Button className="w-full">View Consultations</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>Set your working hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Define your available consultation slots and time zones.
                  </p>
                  <Link href="/doctor/availability">
                    <Button className="w-full">Manage Availability</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Medical Profile</CardTitle>
                  <CardDescription>Your health information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Add your medical history, allergies, and other health details.
                  </p>
                  <Link href="/patient/profile">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Find a Doctor</CardTitle>
                  <CardDescription>Start a consultation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Browse available doctors and request a consultation.
                  </p>
                  <Link href="/patient/doctors">
                    <Button className="w-full">Browse Doctors</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Consultations</CardTitle>
                  <CardDescription>View your consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Chat with doctors and manage your appointments.
                  </p>
                  <Link href="/patient/consultations">
                    <Button className="w-full">View Consultations</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Your documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Access prescriptions, test results, and medical documents.
                  </p>
                  <Link href="/patient/records">
                    <Button className="w-full">View Records</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
