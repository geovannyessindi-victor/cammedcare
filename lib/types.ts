// User Types
export interface User {
  id: string
  email: string
  user_type: 'patient' | 'doctor'
  full_name: string
  phone?: string
  profile_photo_url?: string
  bio?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface DoctorProfile {
  id: string
  user_id: string
  specialization: string
  license_number: string
  experience_years?: number
  consultation_fee?: number
  rating: number
  review_count: number
  is_available: boolean
  bio?: string
  education?: string
  certifications?: string
  languages: string[]
  created_at: string
  updated_at: string
}

export interface PatientProfile {
  id: string
  user_id: string
  date_of_birth?: string
  gender?: 'M' | 'F' | 'Other'
  blood_type?: string
  allergies?: string
  medical_conditions?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  height_cm?: number
  weight_kg?: number
  created_at: string
  updated_at: string
}

export interface Consultation {
  id: string
  patient_id: string
  doctor_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  reason_for_visit?: string
  start_time?: string
  end_time?: string
  consultation_type: 'text' | 'video' | 'audio'
  room_id?: string
  notes?: string
  prescription?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  consultation_id: string
  sender_id: string
  receiver_id: string
  message_text: string
  attachment_url?: string
  is_read: boolean
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  scheduled_time: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  created_at: string
  updated_at: string
}

export interface MedicalRecord {
  id: string
  patient_id: string
  doctor_id: string
  record_type: 'prescription' | 'diagnosis' | 'lab_test' | 'imaging' | 'document'
  title: string
  description?: string
  file_url?: string
  file_name?: string
  file_size_bytes?: number
  diagnosis?: string
  medication_name?: string
  dosage?: string
  duration?: string
  instructions?: string
  lab_name?: string
  test_results?: string
  visibility: 'private' | 'shared'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  notification_type: string
  title: string
  message: string
  related_entity_id?: string
  related_entity_type?: string
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface DoctorReview {
  id: string
  patient_id: string
  doctor_id: string
  consultation_id?: string
  rating: number
  comment?: string
  created_at: string
}
