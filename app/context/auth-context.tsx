'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@/lib/types'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  userProfile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)

        if (session?.user) {
          // Fetch user profile from database
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setUser(userProfile)

          // Fetch role-specific profile
          if (userProfile?.user_type === 'doctor') {
            const { data: doctorProfile } = await supabase
              .from('doctor_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single()
            setUserProfile(doctorProfile)
          } else if (userProfile?.user_type === 'patient') {
            const { data: patientProfile } = await supabase
              .from('patient_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single()
            setUserProfile(patientProfile)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (!session) {
        setUser(null)
        setUserProfile(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ session, user, userProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
