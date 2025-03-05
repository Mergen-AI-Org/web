"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "../../../../components/ui/Button"
import { getPatientById, getAppointmentsByPatientId } from "../../../../lib/api"
import { Patient, Appointment } from "../../../../lib/types"

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPatientData() {
      try {
        setLoading(true)

        // Fetch patient details
        const patientData = await getPatientById(id)
        if (!patientData) {
          setError("Patient not found")
          return
        }
        setPatient(patientData)

        // Fetch patient appointments
        const appointmentsData = await getAppointmentsByPatientId(id)
        setAppointments(appointmentsData)

        setError(null)
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError("Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-blue border-t-transparent"></div>
          <p>Loading patient details...</p>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
        <p className="mb-4 text-red-600">{error || "Patient not found"}</p>
        <Link href="/dashboard/patients">
          <Button variant="solidNeonBlue">Return to Patients</Button>
        </Link>
      </div>
    )
  }

  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Get upcoming appointments
  const today = new Date().toISOString().split("T")[0]
  const upcomingAppointments = sortedAppointments.filter((appointment) => appointment.date >= today)

  // Get past appointments
  const pastAppointments = sortedAppointments.filter((appointment) => appointment.date < today)

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/patients" className="mr-2 text-sm text-neon-blue hover:text-neon-blue/80">
            ← Back to Patients
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Information Card */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-purple/20 text-2xl font-semibold text-neon-purple">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                  <p className="text-gray-500">{patient.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  patient.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : patient.status === "Inactive"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {patient.status}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {patient.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {patient.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Personal Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Age:</span> {patient.age || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Gender:</span> {patient.gender || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {patient.dateofbirth ? new Date(patient.dateofbirth).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Medical Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Height:</span> {patient.height || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Weight:</span> {patient.weight || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Allergies:</span> {patient.allergies || "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Diet Plan</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">{patient.dietplan || "No diet plan assigned"}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Notes</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">{patient.notes || "No notes available"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
              <Button
                variant="neonGreen"
                size="sm"
                onClick={() => router.push(`/dashboard/appointments/new?patientid=${patient.id}`)}
              >
                Schedule
              </Button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-500">Upcoming</h4>
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-gray-50 p-3 hover:border-neon-blue/30"
                      onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                    >
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-neon-blue/20 text-neon-blue">
                        {new Date(appointment.date).getDate()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            )}

            {pastAppointments.length > 0 ? (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">Past</h4>
                <div className="space-y-3">
                  {pastAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-gray-50 p-3 hover:border-neon-blue/30"
                      onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                    >
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                        {new Date(appointment.date).getDate()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-gray-500">No past appointments</p>
              </div>
            )}

            {(upcomingAppointments.length > 3 || pastAppointments.length > 3) && (
              <div className="mt-4 text-center">
                <Link
                  href={`/dashboard/patients/${patient.id}/appointments`}
                  className="text-sm text-neon-blue hover:underline"
                >
                  View all appointments
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
