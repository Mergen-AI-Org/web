#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be provided in .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data for patients
const patients = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    age: 35,
    gender: 'Male',
    dateofbirth: '1988-05-15',
    height: '180 cm',
    weight: '82 kg',
    allergies: 'Peanuts, Shellfish',
    medicalconditions: 'Hypertension',
    lastvisit: '2023-10-15',
    status: 'Active',
    dietplan: 'Low sodium diet with moderate carbohydrate intake',
    notes: 'Patient is responding well to the current diet plan'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    age: 28,
    gender: 'Female',
    dateofbirth: '1995-08-22',
    height: '165 cm',
    weight: '60 kg',
    allergies: 'Lactose',
    medicalconditions: 'None',
    lastvisit: '2023-11-05',
    status: 'Active',
    dietplan: 'Balanced diet with focus on protein intake',
    notes: 'Patient is training for a marathon'
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-456-7890',
    age: 45,
    gender: 'Male',
    dateofbirth: '1978-03-10',
    height: '175 cm',
    weight: '90 kg',
    allergies: 'None',
    medicalconditions: 'Type 2 Diabetes',
    lastvisit: '2023-09-20',
    status: 'Active',
    dietplan: 'Low carb diet with regular meal timing',
    notes: 'Blood sugar levels have improved since last visit'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '555-789-0123',
    age: 32,
    gender: 'Female',
    dateofbirth: '1991-11-28',
    height: '170 cm',
    weight: '65 kg',
    allergies: 'Gluten',
    medicalconditions: 'Celiac Disease',
    lastvisit: '2023-10-30',
    status: 'Active',
    dietplan: 'Gluten-free diet with focus on nutrient density',
    notes: 'Patient reports improved energy levels'
  },
  {
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '555-234-5678',
    age: 50,
    gender: 'Male',
    dateofbirth: '1973-07-14',
    height: '182 cm',
    weight: '95 kg',
    allergies: 'None',
    medicalconditions: 'High Cholesterol',
    lastvisit: '2023-08-12',
    status: 'Inactive',
    dietplan: 'Mediterranean diet with limited saturated fats',
    notes: 'Needs follow-up on cholesterol levels'
  }
];

// Sample appointment types and statuses
const appointmentTypes = ['Initial Consultation', 'Follow-up', 'Diet Review', 'Measurement Check', 'Nutrition Education'];
const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No-show'];

// Function to generate random appointments for patients
const generateAppointments = (patientids, patientnames) => {
  const appointments = [];
  
  // Create past appointments
  for (let i = 0; i < 15; i++) {
    const patientIndex = Math.floor(Math.random() * patientids.length);
    const patientid = patientids[patientIndex];
    const patientname = patientnames[patientIndex];
    
    // Random date in the past (1-60 days ago)
    const daysAgo = Math.floor(Math.random() * 60) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    appointments.push({
      patientid,
      patientname,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
      duration: [30, 45, 60][Math.floor(Math.random() * 3)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      status: ['Completed', 'Cancelled', 'No-show'][Math.floor(Math.random() * 3)],
      notes: Math.random() > 0.5 ? 'Patient reported progress with diet plan' : ''
    });
  }
  
  // Create upcoming appointments
  for (let i = 0; i < 10; i++) {
    const patientIndex = Math.floor(Math.random() * patientids.length);
    const patientid = patientids[patientIndex];
    const patientname = patientnames[patientIndex];
    
    // Random date in the future (1-30 days from now)
    const daysAhead = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    
    appointments.push({
      patientid,
      patientname,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 8) + 9}:${Math.random() > 0.5 ? '00' : '30'}`,
      duration: [30, 45, 60][Math.floor(Math.random() * 3)],
      type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      status: 'Scheduled',
      notes: Math.random() > 0.7 ? 'Follow up on previous diet plan' : ''
    });
  }
  
  return appointments;
};

// Main seeding function
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await supabase.from('appointments').delete().not('id', 'is', null);
    await supabase.from('patients').delete().not('id', 'is', null);
    
    // Insert patients
    console.log('Inserting patients...');
    const { data: insertedPatients, error: patientsError } = await supabase
      .from('patients')
      .insert(patients)
      .select();
    
    if (patientsError) {
      throw new Error(`Error inserting patients: ${patientsError.message}`);
    }
    
    if (!insertedPatients || insertedPatients.length === 0) {
      throw new Error('No patients were inserted');
    }
    
    console.log(`Successfully inserted ${insertedPatients.length} patients`);
    
    // Get patient IDs and names for appointments
    const patientids = insertedPatients.map(p => p.id);
    const patientnames = insertedPatients.map(p => p.name);
    
    // Generate and insert appointments
    const appointments = generateAppointments(patientids, patientnames);
    console.log('Inserting appointments...');
    const { data: insertedAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .insert(appointments)
      .select();
    
    if (appointmentsError) {
      throw new Error(`Error inserting appointments: ${appointmentsError.message}`);
    }
    
    if (!insertedAppointments) {
      throw new Error('No appointments were inserted');
    }
    
    console.log(`Successfully inserted ${insertedAppointments.length} appointments`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase(); 