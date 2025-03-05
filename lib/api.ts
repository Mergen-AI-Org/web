import { supabase } from "./supabase"
import { Appointment, Patient } from "./types"

// Patient API functions
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase.from("patients").select("*").order("name")

  if (error) {
    console.error("Error fetching patients:", error)
    throw error
  }

  return data || []
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching patient with id ${id}:`, error)
    return null
  }

  return data
}

export async function createPatient(patient: Omit<Patient, "id">): Promise<Patient> {
  const { data, error } = await supabase.from("patients").insert([patient]).select().single()

  if (error) {
    console.error("Error creating patient:", error)
    throw error
  }

  return data
}

export async function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  const { data, error } = await supabase.from("patients").update(patient).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating patient with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase.from("patients").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting patient with id ${id}:`, error)
    throw error
  }
}

// Appointment API functions
export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase.from("appointments").select("*").order("date").order("time")

  if (error) {
    console.error("Error fetching appointments:", error)
    throw error
  }

  return data || []
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const { data, error } = await supabase.from("appointments").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching appointment with id ${id}:`, error)
    return null
  }

  return data
}

export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patientid", patientId)
    .order("date")
    .order("time")

  if (error) {
    console.error(`Error fetching appointments for patient ${patientId}:`, error)
    throw error
  }

  return data || []
}

export async function createAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
  const { data, error } = await supabase.from("appointments").insert([appointment]).select().single()

  if (error) {
    console.error("Error creating appointment:", error)
    throw error
  }

  return data
}

export async function updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
  const { data, error } = await supabase.from("appointments").update(appointment).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating appointment with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase.from("appointments").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting appointment with id ${id}:`, error)
    throw error
  }
}
