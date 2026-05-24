'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Send, Check, X } from 'lucide-react'
import type { Consultation, Message, User } from '@/lib/types'

interface ConsultationWithPatient extends Consultation {
  patient: User
}

export default function DoctorConsultationsPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [consultations, setConsultations] = useState<ConsultationWithPatient[]>([])
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationWithPatient | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [prescription, setPrescription] = useState('')
  const [loadingConsultations, setLoadingConsultations] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.user_type === 'doctor') {
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
        .select('*, patient:patient_id(id, email, full_name, phone, profile_photo_url, bio)')
        .eq('doctor_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching consultations:', error)
        return
      }

      setConsultations(data || [])
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

  const handleAcceptConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'accepted' })
        .eq('id', consultationId)

      if (error) {
        console.error('Error:', error)
        return
      }

      await fetchConsultations()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleRejectConsultation = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'rejected' })
        .eq('id', consultationId)

      if (error) {
        console.error('Error:', error)
        return
      }

      await fetchConsultations()
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
        receiver_id: selectedConsultation.patient_id,
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

  const handleAddPrescription = async () => {
    if (!selectedConsultation || !prescription.trim()) return

    try {
      const { error } = await supabase
        .from('consultations')
        .update({ prescription })
        .eq('id', selectedConsultation.id)

      if (error) {
        console.error('Error:', error)
        return
      }

      setPrescription('')
      await fetchConsultations()
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
                <CardTitle>Consultation Requests</CardTitle>
                <CardDescription>
                  {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingConsultations ? (
                  <p className="text-sm text-gray-600">Loading...</p>
                ) : consultations.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No consultations yet</p>
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
                        <p className="font-semibold text-sm">{consultation.patient.full_name}</p>
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
                      <CardTitle>{selectedConsultation.patient.full_name}</CardTitle>
                      <CardDescription>
                        Status: {selectedConsultation.status}
                      </CardDescription>
                    </div>
                    {selectedConsultation.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptConsultation(selectedConsultation.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectConsultation(selectedConsultation.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden space-y-4">
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-600 py-8">
                        No messages yet
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

                  {selectedConsultation.status === 'accepted' && (
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

                  {selectedConsultation.status === 'accepted' && !selectedConsultation.prescription && (
                    <div className="space-y-2 p-4 bg-blue-50 rounded">
                      <Label htmlFor="prescription" className="text-sm font-semibold">
                        Add Prescription
                      </Label>
                      <Textarea
                        id="prescription"
                        placeholder="Enter prescription details..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={handleAddPrescription}
                        disabled={!prescription.trim()}
                        className="w-full text-sm"
                      >
                        Save Prescription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">Select a consultation to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ htmlFor, children, className }: any) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  )
}
