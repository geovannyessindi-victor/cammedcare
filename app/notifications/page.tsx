'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Trash2, Check } from 'lucide-react'
import type { Notification } from '@/lib/types'
import { markNotificationAsRead, deleteNotification } from '@/app/actions/notifications'

export default function NotificationsPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.id) {
      fetchNotifications()
    }
  }, [session, loading, router, user?.id])

  useEffect(() => {
    if (user?.id) {
      // Subscribe to new notifications
      const subscription = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new as Notification, ...prev])
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user?.id, supabase])

  const fetchNotifications = async () => {
    setLoadingNotifications(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      await fetchNotifications()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      await fetchNotifications()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
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
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingNotifications ? (
              <p className="text-gray-600">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-4 rounded-lg border-2 transition ${
                      notification.is_read
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {notification.notification_type}
                        </span>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()} at{' '}
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      {notification.action_url && (
                        <Link href={notification.action_url}>
                          <Button variant="link" size="sm" className="mt-2 pl-0">
                            View →
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
