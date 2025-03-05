import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Patient API functions
export async function getPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
  
  return data;
}

export async function getPatientById(id) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function createPatient(patientData) {
  const { data, error } = await supabase
    .from('patients')
    .insert(patientData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
  
  return data;
}

export async function updatePatient(id, patientData) {
  const { data, error } = await supabase
    .from('patients')
    .update(patientData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function deletePatient(id) {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting patient with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Appointment API functions
export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return data;
}

export async function getAppointmentById(id) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function getAppointmentsByPatientId(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patientId', patientId)
    .order('date', { ascending: true });
  
  if (error) {
    console.error(`Error fetching appointments for patient with ID ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

export async function createAppointment(appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  
  return data;
}

export async function updateAppointment(id, appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .update(appointmentData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating appointment with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function deleteAppointment(id) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting appointment with ID ${id}:`, error);
    throw error;
  }
  
  return true;
} 