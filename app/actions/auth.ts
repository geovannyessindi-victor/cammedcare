'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function signUpAction(
  email: string,
  password: string,
  fullName: string,
  userType: 'patient' | 'doctor'
) {
  const supabase = await getSupabaseClient()

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  // Create user profile in our users table
  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    email,
    user_type: userType,
    full_name: fullName,
  })

  if (userError) {
    return { error: userError.message }
  }

  // Create role-specific profile
  if (userType === 'doctor') {
    const { error: doctorError } = await supabase
      .from('doctor_profiles')
      .insert({
        user_id: authData.user.id,
        specialization: '',
        license_number: '',
      })

    if (doctorError) {
      return { error: doctorError.message }
    }
  } else if (userType === 'patient') {
    const { error: patientError } = await supabase
      .from('patient_profiles')
      .insert({
        user_id: authData.user.id,
      })

    if (patientError) {
      return { error: patientError.message }
    }
  }

  return { success: true, user: authData.user }
}

export async function signInAction(email: string, password: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

export async function signOutAction() {
  const supabase = await getSupabaseClient()

  await supabase.auth.signOut()

  redirect('/login')
}

export async function getSessionAction() {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    return { error: error.message }
  }

  return { session: data.session }
}

export async function getCurrentUserAction() {
  const supabase = await getSupabaseClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    return { error: 'Not authenticated' }
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (userError) {
    return { error: userError.message }
  }

  return { user: userData }
}
