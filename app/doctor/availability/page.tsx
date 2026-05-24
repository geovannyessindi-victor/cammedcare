'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'

interface DoctorAvailability {
  id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration_minutes: number
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export default function DoctorAvailabilityPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [availability, setAvailability] = useState<DoctorAvailability[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [newSlot, setNewSlot] = useState({
    day_of_week: 0,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.user_type === 'doctor') {
      fetchAvailability()
    }
  }, [session, loading, router, user])

  const fetchAvailability = async () => {
    setLoadingData(true)
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', user?.id)
        .order('day_of_week', { ascending: true })

      if (error) {
        console.error('Error fetching availability:', error)
        return
      }

      setAvailability(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase.from('doctor_availability').insert({
        doctor_id: user?.id,
        ...newSlot,
      })

      if (error) {
        console.error('Error adding availability:', error)
        return
      }

      await fetchAvailability()
      setNewSlot({
        day_of_week: 0,
        start_time: '09:00',
        end_time: '17:00',
        slot_duration_minutes: 30,
      })
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('doctor_availability')
        .delete()
        .eq('id', slotId)

      if (error) {
        console.error('Error deleting availability:', error)
        return
      }

      await fetchAvailability()
    } catch (err) {
      console.error('Error:', err)
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Your Availability</CardTitle>
            <CardDescription>
              Set your working hours so patients can book consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Day of Week</Label>
                  <select
                    id="day"
                    value={newSlot.day_of_week}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        day_of_week: parseInt(e.target.value),
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot-duration">Slot Duration (minutes)</Label>
                  <Input
                    id="slot-duration"
                    type="number"
                    min="15"
                    step="15"
                    value={newSlot.slot_duration_minutes}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        slot_duration_minutes: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        start_time: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        end_time: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {saving ? 'Adding...' : 'Add Availability Slot'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Availability Slots</CardTitle>
            <CardDescription>
              {availability.length} slot{availability.length !== 1 ? 's' : ''} configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <p className="text-gray-600">Loading...</p>
            ) : availability.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No availability slots yet. Add one to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">
                        {DAYS[slot.day_of_week]}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slot.start_time} - {slot.end_time}
                        {' '}
                        ({slot.slot_duration_minutes} min slots)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </Button>
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
