// Patient type definition
export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  gender?: string
  dateofbirth?: string
  height?: string
  weight?: string
  allergies?: string
  medicalconditions?: string
  lastvisit?: string
  nextappointment?: string
  status: string
  dietplan?: string
  notes?: string
}

// Appointment type definition
export interface Appointment {
  id: string
  patientid: string
  patientname: string
  date: string
  time: string
  duration: number
  type: string
  status: string
  notes?: string
  created_at?: string
  updated_at?: string
}

// Database tables
export type Tables = {
  patients: Patient
  appointments: Appointment
}
