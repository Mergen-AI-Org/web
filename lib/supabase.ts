import { createClient } from "@supabase/supabase-js"

// Define types for our database tables
export interface Patient {
  id: string
  name: string
  email: string
  phone?: string
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
  created_at?: string
  updated_at?: string
}

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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)

// Patient API functions
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase.from("patients").select("*").order("name")

  if (error) {
    console.error("Error fetching patients:", error)
    throw error
  }

  return data as Patient[]
}

export async function getPatientById(id: string): Promise<Patient> {
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching patient with ID ${id}:`, error)
    throw error
  }

  return data as Patient
}

export async function createPatient(patientData: Omit<Patient, "id" | "created_at" | "updated_at">): Promise<Patient> {
  const { data, error } = await supabase.from("patients").insert(patientData).select().single()

  if (error) {
    console.error("Error creating patient:", error)
    throw error
  }

  return data as Patient
}

export async function updatePatient(
  id: string,
  patientData: Partial<Omit<Patient, "id" | "created_at" | "updated_at">>
): Promise<Patient> {
  const { data, error } = await supabase.from("patients").update(patientData).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating patient with ID ${id}:`, error)
    throw error
  }

  return data as Patient
}

export async function deletePatient(id: string): Promise<boolean> {
  const { error } = await supabase.from("patients").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting patient with ID ${id}:`, error)
    throw error
  }

  return true
}

// Appointment API functions
export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching appointments:", error)
    throw error
  }

  return data as Appointment[]
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const { data, error } = await supabase.from("appointments").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error)
    throw error
  }

  return data as Appointment
}

export async function getAppointmentsByPatientId(patientid: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patientid", patientid)
    .order("date", { ascending: true })

  if (error) {
    console.error(`Error fetching appointments for patient with ID ${patientid}:`, error)
    throw error
  }

  return data as Appointment[]
}

export async function createAppointment(
  appointmentData: Omit<Appointment, "id" | "created_at" | "updated_at">
): Promise<Appointment> {
  const { data, error } = await supabase.from("appointments").insert(appointmentData).select().single()

  if (error) {
    console.error("Error creating appointment:", error)
    throw error
  }

  return data as Appointment
}

export async function updateAppointment(
  id: string,
  appointmentData: Partial<Omit<Appointment, "id" | "created_at" | "updated_at">>
): Promise<Appointment> {
  const { data, error } = await supabase.from("appointments").update(appointmentData).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating appointment with ID ${id}:`, error)
    throw error
  }

  return data as Appointment
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const { error } = await supabase.from("appointments").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting appointment with ID ${id}:`, error)
    throw error
  }

  return true
}
