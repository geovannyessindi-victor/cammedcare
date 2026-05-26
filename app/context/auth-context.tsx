'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: any | null
  userProfile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const loadProfile = async (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        if (data) {
          setUser(data)
        } else {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            full_name: sessionUser.user_metadata?.full_name || '',
            user_type: sessionUser.user_metadata?.user_type || 'patient',
          })
        }
      } catch {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          full_name: sessionUser.user_metadata?.full_name || '',
          user_type: sessionUser.user_metadata?.user_type || 'patient',
        })
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      loadProfile(session?.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      loadProfile(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
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
