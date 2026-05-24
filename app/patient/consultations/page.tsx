'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import type { Consultation, Message, User } from '@/lib/types'

interface ConsultationWithDoctor extends Consultation {
  doctor: User
}

export default function PatientConsultationsPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [consultations, setConsultations] = useState<ConsultationWithDoctor[]>([])
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationWithDoctor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [loadingConsultations, setLoadingConsultations] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.user_type === 'patient') {
      fetchConsultations()
    }
  }, [session, loading, router, user])

  useEffect(() => {
    if (selectedConsultation) {
      fetchMessages(selectedConsultation.id)
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`messages-${selectedConsultation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `consultation_id=eq.${selectedConsultation.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [selectedConsultation, supabase])

  const fetchConsultations = async () => {
    setLoadingConsultations(true)
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*, doctor:doctor_id(id, email, full_name, phone, profile_photo_url, bio)')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching consultations:', error)
        return
      }

      setConsultations(data || [])
      if (data && data.length > 0) {
        setSelectedConsultation(data[0])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingConsultations(false)
    }
  }

  const fetchMessages = async (consultationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConsultation || !user?.id) return

    setSendingMessage(true)
    try {
      const { error } = await supabase.from('messages').insert({
        consultation_id: selectedConsultation.id,
        sender_id: user.id,
        receiver_id: selectedConsultation.doctor_id,
        message_text: messageText,
      })

      if (error) {
        console.error('Error sending message:', error)
        return
      }

      setMessageText('')
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleCancelConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'cancelled' })
        .eq('id', consultationId)

      if (error) {
        console.error('Error cancelling consultation:', error)
        return
      }

      await fetchConsultations()
    } catch (err) {
      console.error('Error:', err)
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultations List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Consultations</CardTitle>
                <CardDescription>
                  {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingConsultations ? (
                  <p className="text-sm text-gray-600">Loading...</p>
                ) : consultations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No consultations yet.</p>
                    <Link href="/patient/doctors">
                      <Button className="w-full">Find a Doctor</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {consultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={() => setSelectedConsultation(consultation)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition ${
                          selectedConsultation?.id === consultation.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{consultation.doctor.full_name}</p>
                        <p className="text-xs text-gray-600">
                          Status:{' '}
                          <span className={`font-medium ${
                            consultation.status === 'accepted'
                              ? 'text-green-600'
                              : consultation.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}>
                            {consultation.status}
                          </span>
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConsultation ? (
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedConsultation.doctor.full_name}</CardTitle>
                      <CardDescription>
                        Status: {selectedConsultation.status}
                      </CardDescription>
                    </div>
                    {selectedConsultation.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelConsultation(selectedConsultation.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-600 py-8">
                        {selectedConsultation.status === 'pending'
                          ? 'Waiting for doctor to accept...'
                          : 'Start the conversation...'}
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender_id === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm break-words">{message.message_text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {(selectedConsultation.status === 'accepted' ||
                    selectedConsultation.status === 'completed') && (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={sendingMessage}
                      />
                      <Button
                        type="submit"
                        disabled={sendingMessage || !messageText.trim()}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">Select a consultation to view messages</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
