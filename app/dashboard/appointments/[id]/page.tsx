"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../../components/ui/Button"
import { getAppointmentById, getPatientById, updateAppointment, deleteAppointment } from "../../../../lib/api"
import { Appointment, Patient } from "../../../../lib/types"

// Mock appointment data - in a real app, this would come from an API
const MOCK_APPOINTMENTS = [
  {
    id: "1",
    patientId: "1",
    patientName: "Emma Johnson",
    date: "2023-06-22",
    time: "10:00 AM",
    duration: 30,
    type: "Follow-up",
    status: "Scheduled",
    notes: "Review progress on diet plan",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Michael Smith",
    date: "2023-06-22",
    time: "11:00 AM",
    duration: 45,
    type: "Initial Consultation",
    status: "Scheduled",
    notes: "New patient assessment",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Sophia Williams",
    date: "2023-06-22",
    time: "1:30 PM",
    duration: 60,
    type: "Diet Review",
    status: "Scheduled",
    notes: "Adjust meal plan based on recent lab results",
  },
]

// Mock patient data
const MOCK_PATIENTS = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "555-123-4567",
    dateofbirth: "1985-04-12",
    height: "5'6\"",
    weight: "145 lbs",
    allergies: "Peanuts, Shellfish",
    medicalconditions: "None",
  },
  {
    id: "2",
    name: "Michael Smith",
    email: "michael.smith@example.com",
    phone: "555-987-6543",
    dateofbirth: "1978-09-23",
    height: "5'11\"",
    weight: "185 lbs",
    allergies: "None",
    medicalconditions: "Hypertension",
  },
  {
    id: "3",
    name: "Sophia Williams",
    email: "sophia.williams@example.com",
    phone: "555-456-7890",
    dateofbirth: "1992-07-15",
    height: "5'4\"",
    weight: "130 lbs",
    allergies: "Lactose intolerance",
    medicalconditions: "None",
  },
]

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const appointmentData = await getAppointmentById(params.id)
        setAppointment(appointmentData)

        if (appointmentData.patientid) {
          const patientData = await getPatientById(appointmentData.patientid)
          setPatient(patientData)
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching appointment details:", err)
        setError("Failed to load appointment details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleCancel = async () => {
    if (!appointment) return

    try {
      setSubmitting(true)
      await updateAppointment(appointment.id, {
        ...appointment,
        status: "Cancelled",
      })

      setAppointment({
        ...appointment,
        status: "Cancelled",
      })

      setShowCancelConfirm(false)
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      setError("Failed to cancel appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async () => {
    if (!appointment) return

    try {
      setSubmitting(true)
      await updateAppointment(appointment.id, {
        ...appointment,
        status: "Completed",
      })

      setAppointment({
        ...appointment,
        status: "Completed",
      })
    } catch (err) {
      console.error("Error completing appointment:", err)
      setError("Failed to mark appointment as completed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-blue border-t-transparent"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
        <p className="mb-4 text-red-600">{error}</p>
        <Button variant="solidNeonBlue" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-amber-700">Appointment Not Found</h2>
        <p className="mb-4 text-amber-600">The appointment you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/appointments">
          <Button variant="solidNeonBlue">Back to Appointments</Button>
        </Link>
      </div>
    )
  }

  const isUpcoming = appointment.status === "Scheduled"
  const isPast = ["Completed", "Cancelled", "No-show"].includes(appointment.status)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/appointments"
            className="mb-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-neon-blue"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointments
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        </div>

        {isUpcoming && (
          <div className="flex space-x-3">
            <Link href={`/dashboard/appointments/edit/${appointment.id}`}>
              <Button variant="outlineNeonBlue">Reschedule</Button>
            </Link>
            <Button variant="outlineRed" onClick={() => setShowCancelConfirm(true)} disabled={submitting}>
              Cancel Appointment
            </Button>
            <Button variant="solidNeonGreen" onClick={handleComplete} disabled={submitting}>
              Mark as Completed
            </Button>
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Appointment Information</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Patient</p>
              <p className="text-lg font-medium text-gray-900">
                <Link href={`/dashboard/patients/${appointment.patientid}`} className="hover:text-neon-blue">
                  {appointment.patientname}
                </Link>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-medium">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    appointment.status === "Scheduled"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "Completed"
                      ? "bg-blue-100 text-blue-800"
                      : appointment.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg font-medium text-gray-900">{appointment.date}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-lg font-medium text-gray-900">{appointment.time}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-lg font-medium text-gray-900">{appointment.duration} minutes</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-lg font-medium text-gray-900">{appointment.type}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Notes</p>
            <p className="text-gray-700">{appointment.notes || "No notes available"}</p>
          </div>
        </div>

        {patient && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Patient Information</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-medium text-gray-900">{patient.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-gray-700">{patient.email}</p>
                <p className="text-gray-700">{patient.phone}</p>
              </div>

              {patient.age && patient.gender && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Demographics</p>
                  <p className="text-gray-700">
                    {patient.age} years, {patient.gender}
                  </p>
                </div>
              )}

              {patient.dietplan && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Diet Plan</p>
                  <p className="text-gray-700">{patient.dietplan}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500">Date of Birth</p>
                <p className="text-sm text-gray-700">
                  {patient.dateofbirth && new Date(patient.dateofbirth).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-2">
                <Link href={`/dashboard/patients/${patient.id}`}>
                  <Button variant="outlineNeonBlue" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Cancel Appointment</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outlineGray" onClick={() => setShowCancelConfirm(false)} disabled={submitting}>
                No, Keep It
              </Button>
              <Button variant="solidRed" onClick={handleCancel} disabled={submitting}>
                {submitting ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
