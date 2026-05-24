'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
            // Ignored
          }
        },
      },
    }
  )
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  relatedEntityId?: string,
  relatedEntityType?: string,
  actionUrl?: string
) {
  const supabase = await getSupabaseClient()

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    notification_type: type,
    title,
    message,
    related_entity_id: relatedEntityId,
    related_entity_type: relatedEntityType,
    action_url: actionUrl,
  })

  if (error) {
    console.error('Error creating notification:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getNotifications(userId: string) {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return { error: error.message }
  }

  return { notifications: data }
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await getSupabaseClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Error updating notification:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function deleteNotification(notificationId: string) {
  const supabase = await getSupabaseClient()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    console.error('Error deleting notification:', error)
    return { error: error.message }
  }

  return { success: true }
}
