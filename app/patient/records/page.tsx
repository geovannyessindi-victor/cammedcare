'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Download, Trash2, Plus } from 'lucide-react'
import type { MedicalRecord } from '@/lib/types'

const RECORD_TYPES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'lab_test', label: 'Lab Test' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'document', label: 'Document' },
]

export default function PatientMedicalRecordsPage() {
  const router = useRouter()
  const { session, user, loading } = useAuth()
  const supabase = createClient()

  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    record_type: 'prescription' as const,
    title: '',
    description: '',
    diagnosis: '',
    medication_name: '',
    dosage: '',
    duration: '',
    instructions: '',
    lab_name: '',
    test_results: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/')
    }
    if (user?.user_type === 'patient') {
      fetchRecords()
    }
  }, [session, loading, router, user])

  const fetchRecords = async () => {
    setLoadingRecords(true)
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching records:', error)
        return
      }

      setRecords(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingRecords(false)
    }
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase.from('medical_records').insert({
        patient_id: user?.id,
        doctor_id: user?.id,
        record_type: newRecord.record_type,
        title: newRecord.title,
        description: newRecord.description,
        diagnosis: newRecord.record_type === 'diagnosis' ? newRecord.diagnosis : undefined,
        medication_name:
          newRecord.record_type === 'prescription' ? newRecord.medication_name : undefined,
        dosage: newRecord.record_type === 'prescription' ? newRecord.dosage : undefined,
        duration: newRecord.record_type === 'prescription' ? newRecord.duration : undefined,
        instructions:
          newRecord.record_type === 'prescription' ? newRecord.instructions : undefined,
        lab_name: newRecord.record_type === 'lab_test' ? newRecord.lab_name : undefined,
        test_results: newRecord.record_type === 'lab_test' ? newRecord.test_results : undefined,
      })

      if (error) {
        console.error('Error adding record:', error)
        return
      }

      await fetchRecords()
      setShowForm(false)
      setNewRecord({
        record_type: 'prescription',
        title: '',
        description: '',
        diagnosis: '',
        medication_name: '',
        dosage: '',
        duration: '',
        instructions: '',
        lab_name: '',
        test_results: '',
      })
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', recordId)

      if (error) {
        console.error('Error deleting record:', error)
        return
      }

      await fetchRecords()
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Medical Record</CardTitle>
              <CardDescription>Add a new medical record to your file</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Record Type *</Label>
                  <select
                    id="record-type"
                    value={newRecord.record_type}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        record_type: e.target.value as any,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    {RECORD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Record title"
                      value={newRecord.title}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details..."
                    value={newRecord.description}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                {newRecord.record_type === 'diagnosis' && (
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis Details</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Diagnosis information..."
                      value={newRecord.diagnosis}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          diagnosis: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                )}

                {newRecord.record_type === 'prescription' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medication">Medication Name</Label>
                        <Input
                          id="medication"
                          placeholder="e.g., Ibuprofen"
                          value={newRecord.medication_name}
                          onChange={(e) =>
                            setNewRecord((prev) => ({
                              ...prev,
                              medication_name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                          id="dosage"
                          placeholder="e.g., 500mg"
                          value={newRecord.dosage}
                          onChange={(e) =>
                            setNewRecord((prev) => ({
                              ...prev,
                              dosage: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 7 days"
                          value={newRecord.duration}
                          onChange={(e) =>
                            setNewRecord((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Input
                          id="instructions"
                          placeholder="e.g., Take twice daily"
                          value={newRecord.instructions}
                          onChange={(e) =>
                            setNewRecord((prev) => ({
                              ...prev,
                              instructions: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {newRecord.record_type === 'lab_test' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lab-name">Lab Name</Label>
                        <Input
                          id="lab-name"
                          placeholder="Laboratory name"
                          value={newRecord.lab_name}
                          onChange={(e) =>
                            setNewRecord((prev) => ({
                              ...prev,
                              lab_name: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test-results">Test Results</Label>
                      <Textarea
                        id="test-results"
                        placeholder="Test results..."
                        value={newRecord.test_results}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            test_results: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save Record'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            <Plus className="w-4 h-4 mr-2" />
            Add New Record
          </Button>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Medical Records</CardTitle>
            <CardDescription>
              {records.length} record{records.length !== 1 ? 's' : ''} on file
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRecords ? (
              <p className="text-gray-600">Loading...</p>
            ) : records.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No medical records yet. Add one to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <Card key={record.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              {RECORD_TYPES.find((t) => t.value === record.record_type)?.label}
                            </span>
                            <p className="font-semibold">{record.title}</p>
                          </div>

                          {record.description && (
                            <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                          )}

                          {record.record_type === 'prescription' && (
                            <div className="text-sm text-gray-600 space-y-1">
                              {record.medication_name && (
                                <p>
                                  <span className="font-medium">Medication:</span> {record.medication_name}
                                </p>
                              )}
                              {record.dosage && (
                                <p>
                                  <span className="font-medium">Dosage:</span> {record.dosage}
                                </p>
                              )}
                              {record.duration && (
                                <p>
                                  <span className="font-medium">Duration:</span> {record.duration}
                                </p>
                              )}
                              {record.instructions && (
                                <p>
                                  <span className="font-medium">Instructions:</span> {record.instructions}
                                </p>
                              )}
                            </div>
                          )}

                          {record.record_type === 'diagnosis' && record.diagnosis && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                            </p>
                          )}

                          {record.record_type === 'lab_test' && (
                            <div className="text-sm text-gray-600 space-y-1">
                              {record.lab_name && (
                                <p>
                                  <span className="font-medium">Lab:</span> {record.lab_name}
                                </p>
                              )}
                              {record.test_results && (
                                <p>
                                  <span className="font-medium">Results:</span> {record.test_results}
                                </p>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
