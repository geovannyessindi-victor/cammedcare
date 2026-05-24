'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Stethoscope, Users } from 'lucide-react'

export default function Page() {
  const router = useRouter()
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading && session) {
      router.push('/dashboard')
    }
  }, [session, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">CamMedCare</h1>
          <p className="text-xl text-gray-600">
            Connect with healthcare professionals online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Doctor Signup */}
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition">
            <CardHeader className="text-center">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>I&apos;m a Doctor</CardTitle>
              <CardDescription>
                Provide consultations and manage patients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Join our network of healthcare professionals to help patients remotely.
              </p>
              <div className="space-y-2">
                <Link href="/signup?type=doctor" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign Up as Doctor
                  </Button>
                </Link>
                <Link href="/login?type=doctor" className="block">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Patient Signup */}
          <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>I&apos;m a Patient</CardTitle>
              <CardDescription>
                Get medical advice from licensed professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Book consultations and manage your medical records securely.
              </p>
              <div className="space-y-2">
                <Link href="/signup?type=patient" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Sign Up as Patient
                  </Button>
                </Link>
                <Link href="/login?type=patient" className="block">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            By using CamMedCare, you agree to our{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
