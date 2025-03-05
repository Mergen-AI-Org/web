import { supabase } from "../lib/supabase"
import { Patient, Appointment } from "../lib/types"

// Mock patient data
const MOCK_PATIENTS: Omit<Patient, "id">[] = [
  {
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "(555) 123-4567",
    age: 34,
    gender: "Female",
    dateofbirth: "1989-04-12",
    height: "5'6\"",
    weight: "145 lbs",
    allergies: "Peanuts, Shellfish",
    medicalconditions: "None",
    lastvisit: "2023-06-15",
    nextappointment: "2023-06-22",
    status: "Active",
    dietplan: "Low Carb",
    notes: "Trying to lose weight for upcoming wedding",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    age: 42,
    gender: "Male",
    dateofbirth: "1981-09-23",
    height: "5'10\"",
    weight: "180 lbs",
    allergies: "None",
    medicalconditions: "Hypertension",
    lastvisit: "2023-05-30",
    nextappointment: "2023-06-30",
    status: "Active",
    dietplan: "DASH Diet",
    notes: "Blood pressure has improved since last visit",
  },
  {
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@example.com",
    phone: "(555) 234-5678",
    age: 29,
    gender: "Female",
    dateofbirth: "1994-02-15",
    height: "5'4\"",
    weight: "130 lbs",
    allergies: "Dairy",
    medicalconditions: "IBS",
    lastvisit: "2023-06-10",
    nextappointment: "2023-07-10",
    status: "Active",
    dietplan: "Low FODMAP",
    notes: "Symptoms have reduced with current diet plan",
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "(555) 345-6789",
    age: 55,
    gender: "Male",
    dateofbirth: "1968-11-03",
    height: "6'0\"",
    weight: "210 lbs",
    allergies: "None",
    medicalconditions: "Type 2 Diabetes",
    lastvisit: "2023-05-20",
    nextappointment: "2023-06-20",
    status: "Active",
    dietplan: "Mediterranean Diet",
    notes: "Working on weight loss and blood sugar control",
  },
  {
    name: "Olivia Taylor",
    email: "olivia.taylor@example.com",
    phone: "(555) 456-7890",
    age: 31,
    gender: "Female",
    dateofbirth: "1992-07-19",
    height: "5'7\"",
    weight: "150 lbs",
    allergies: "Gluten",
    medicalconditions: "Celiac Disease",
    lastvisit: "2023-06-05",
    nextappointment: "2023-07-05",
    status: "Active",
    dietplan: "Gluten-Free",
    notes: "Adjusting well to gluten-free diet",
  },
]

// Sample appointment types and statuses
const APPOINTMENT_TYPES: string[] = [
  "Initial Consultation",
  "Follow-up",
  "Diet Review",
  "Measurement Check",
  "Nutrition Education",
]

const APPOINTMENT_STATUSES: string[] = ["Scheduled", "Completed", "Cancelled", "No-show"]

/**
 * Seed patients table with mock data
 */
async function seedPatients(): Promise<Patient[]> {
  console.log("Seeding patients...")

  // Clear existing patients
  await supabase.from("patients").delete().not("id", "is", null)

  // Insert new patients
  const { data, error } = await supabase.from("patients").insert(MOCK_PATIENTS).select()

  if (error) {
    console.error("Error seeding patients:", error)
    throw error
  }

  if (!data || data.length === 0) {
    throw new Error("No patients were inserted")
  }

  console.log(`Successfully seeded ${data.length} patients`)
  return data as Patient[]
}

/**
 * Generate and seed appointments for patients
 */
async function seedAppointments(patients: Patient[]): Promise<Appointment[]> {
  console.log("Seeding appointments...")

  // Clear existing appointments
  await supabase.from("appointments").delete().not("id", "is", null)

  const appointments: Omit<Appointment, "id">[] = []

  // Create past appointments (completed, cancelled, or no-show)
  for (let i = 0; i < 15; i++) {
    const patientIndex = Math.floor(Math.random() * patients.length)
    const patient = patients[patientIndex]

    if (!patient || !patient.id || !patient.name) continue // Skip if patient or required fields are undefined

    // Random date in the past (1-60 days ago)
    const daysAgo = Math.floor(Math.random() * 60) + 1
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    // Type assertions since we've checked these values exist
    const appointmentType = APPOINTMENT_TYPES[Math.floor(Math.random() * APPOINTMENT_TYPES.length)]!
    const appointmentStatus = ["Completed", "Cancelled", "No-show"][Math.floor(Math.random() * 3)]!
    const appointmentDuration = [30, 45, 60][Math.floor(Math.random() * 3)]!

    appointments.push({
      patientid: patient.id,
      patientname: patient.name,
      date: date.toISOString().split("T")[0],
      time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? "00" : "30"}`,
      duration: appointmentDuration,
      type: appointmentType,
      status: appointmentStatus,
      notes: Math.random() > 0.5 ? "Patient reported progress with diet plan" : "",
    })
  }

  // Create upcoming appointments (scheduled)
  for (let i = 0; i < 10; i++) {
    const patientIndex = Math.floor(Math.random() * patients.length)
    const patient = patients[patientIndex]

    if (!patient || !patient.id || !patient.name) continue // Skip if patient or required fields are undefined

    // Random date in the future (1-30 days from now)
    const daysAhead = Math.floor(Math.random() * 30) + 1
    const date = new Date()
    date.setDate(date.getDate() + daysAhead)

    // Type assertions since we've checked these values exist
    const appointmentType = APPOINTMENT_TYPES[Math.floor(Math.random() * APPOINTMENT_TYPES.length)]!
    const appointmentDuration = [30, 45, 60][Math.floor(Math.random() * 3)]!

    appointments.push({
      patientid: patient.id,
      patientname: patient.name,
      date: date.toISOString().split("T")[0],
      time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? "00" : "30"}`,
      duration: appointmentDuration,
      type: appointmentType,
      status: "Scheduled",
      notes: Math.random() > 0.7 ? "Follow up on previous diet plan" : "",
    })
  }

  if (appointments.length === 0) {
    console.log("No appointments to insert")
    return []
  }

  // Insert appointments
  const { data, error } = await supabase.from("appointments").insert(appointments).select()

  if (error) {
    console.error("Error seeding appointments:", error)
    throw error
  }

  if (!data) {
    throw new Error("No appointments were inserted")
  }

  console.log(`Successfully seeded ${data.length} appointments`)
  return data as Appointment[]
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Seed patients first
    const patients = await seedPatients()

    // Then seed appointments using the patient data
    await seedAppointments(patients)

    console.log("Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
