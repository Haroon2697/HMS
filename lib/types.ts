export type Patient = {
  id: string
  patient_id: string
  full_name: string
  date_of_birth: string
  gender: string
  blood_group: string | null
  phone: string
  email: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_history: string | null
  allergies: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Doctor = {
  id: string
  doctor_id: string
  profile_id: string
  specialization: string
  qualification: string
  experience_years: number
  phone: string
  consultation_fee: number
  available_days: string[]
  available_time_start: string
  available_time_end: string
  room_number: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type Room = {
  id: string
  room_number: string
  room_type: string
  ward: string
  floor: number
  capacity: number
  current_occupancy: number
  status: string
  daily_rate: number
  amenities: string[]
  created_at: string
  updated_at: string
}
