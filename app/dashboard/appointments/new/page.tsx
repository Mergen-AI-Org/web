"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"
import { getPatients, createAppointment } from "../../../../lib/api"
import { Patient } from "../../../../lib/types"

// Appointment types
const APPOINTMENT_TYPES = [
  "Initial Consultation",
  "Follow-up",
  "Diet Review",
  "Comprehensive Review",
  "Weight Check",
  "Lab Results Review",
  "Meal Planning Session",
]

// Duration options in minutes
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120]

export default function NewAppointmentPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("30")
  const [type, setType] = useState("Follow-up")
  const [notes, setNotes] = useState("")

  // Derived state
  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true)
        const data = await getPatients()
        setPatients(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching patients:", err)
        setError("Failed to load patients. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient) {
      setError("Please select a patient")
      return
    }

    try {
      setSubmitting(true)

      await createAppointment({
        patientid: selectedPatientId,
        patientname: selectedPatient.name,
        date,
        time,
        duration: parseInt(duration),
        type,
        status: "Scheduled",
        notes,
      })

      router.push("/dashboard/appointments")
    } catch (err) {
      console.error("Error creating appointment:", err)
      setError("Failed to create appointment. Please try again.")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-green border-t-transparent"></div>
          <p>Loading patients...</p>
        </div>
      </div>
    )
  }

  if (error && patients.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
        <p className="mb-4 text-red-600">{error}</p>
        <Button variant="solidNeonGreen" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/appointments"
          className="mb-2 inline-flex items-center text-sm font-medium text-gray-500 hover:text-neon-green"
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
        <h1 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Appointment Details</h2>

            <div className="mb-4">
              <label htmlFor="patient" className="mb-1 block text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                id="patient"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">
                  Time *
                </label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
                  Duration (minutes) *
                </label>
                <select
                  id="duration"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
                  Appointment Type *
                </label>
                <select
                  id="type"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="Initial Consultation">Initial Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Diet Review">Diet Review</option>
                  <option value="Measurement Check">Measurement Check</option>
                  <option value="Nutrition Education">Nutrition Education</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or special instructions"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="solidNeonGreen" disabled={submitting} className="min-w-[150px]">
                {submitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </form>
        </div>

        <div>
          {selectedPatient ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Appointment Summary</h2>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Patient</p>
                <p className="text-gray-900">{selectedPatient.name}</p>
              </div>

              {date && time && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">When</p>
                  <p className="text-gray-900">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-900">
                    {time} ({duration} minutes)
                  </p>
                </div>
              )}

              {type && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-gray-900">{type}</p>
                </div>
              )}

              {notes && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-gray-700">{notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Patient Selection</h2>
              <p className="text-gray-500">Please select a patient to schedule an appointment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
