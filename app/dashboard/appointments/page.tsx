"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { getAppointments } from "../../../lib/api"
import { Appointment } from "../../../lib/types"

// Group appointments by date
const groupAppointmentsByDate = (appointments: Appointment[]): Record<string, Appointment[]> => {
  return appointments.reduce(
    (groups, appointment) => {
      // Skip appointments without a date
      if (typeof appointment.date !== "string") {
        return groups
      }

      const date = appointment.date

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, Appointment[]>
  )
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [view, setView] = useState<"list" | "calendar">("list") // 'list' or 'calendar'
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true)
        const data = await getAppointments()
        setAppointments(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesDate = dateFilter === "" || appointment.date === dateFilter

    const matchesType = typeFilter === "all" || appointment.type === typeFilter

    return matchesSearch && matchesDate && matchesType
  })

  // Get unique appointment types for filter
  const appointmentTypes = ["all", ...Array.from(new Set(appointments.map((appointment) => appointment.type)))]

  // Group appointments by date for calendar view
  const appointmentsByDate = groupAppointmentsByDate(filteredAppointments)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-blue border-t-transparent"></div>
          <p>Loading appointments...</p>
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

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Link href="/dashboard/appointments/new">
          <Button variant="solidNeonGreen" size="sm" className="sm:w-auto">
            + Schedule Appointment
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="neonBlue"
          className="bg-white"
        />

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          variant="neonPurple"
          className="bg-white"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          <option value="all">All Types</option>
          {appointmentTypes
            .filter((type) => type !== "all")
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>

        <div className="flex rounded-md border border-gray-300 bg-white">
          <button
            onClick={() => setView("list")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              view === "list" ? "bg-neon-blue/10 text-neon-blue" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              view === "calendar" ? "bg-neon-blue/10 text-neon-blue" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* No appointments message */}
      {filteredAppointments.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-500">No appointments found matching your criteria.</p>
        </div>
      )}

      {/* List View */}
      {view === "list" && filteredAppointments.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">{appointment.patientname}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.type}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.duration} min</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          appointment.status === "Scheduled"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "Completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/dashboard/appointments/${appointment.id}`}
                        className="text-neon-blue hover:text-neon-blue/80"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && filteredAppointments.length > 0 && (
        <div className="space-y-6">
          {Object.keys(appointmentsByDate)
            .sort()
            .map((date) => {
              // Ensure the appointments array exists for this date
              const dateAppointments = appointmentsByDate[date] || []

              return (
                <div key={date} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                    {date === today && (
                      <span className="ml-2 rounded-full bg-neon-green/20 px-2 py-1 text-xs font-medium text-neon-green">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {dateAppointments
                      .sort((a: Appointment, b: Appointment) => {
                        if (a.time && b.time) {
                          return a.time.localeCompare(b.time)
                        }
                        return 0
                      })
                      .map((appointment: Appointment) => (
                        <div
                          key={appointment.id}
                          className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-neon-blue/30"
                          onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                        >
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-neon-blue/20 text-neon-blue">
                            {appointment.time && appointment.time.includes(":")
                              ? parseInt(appointment.time.split(":")[0]) > 11
                                ? "🌙"
                                : "☀️"
                              : "⏰"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="mb-1 font-medium text-gray-900">
                                <Link
                                  href={`/dashboard/appointments/${appointment.id}`}
                                  className="hover:text-neon-blue"
                                >
                                  {appointment.time} - {appointment.patientname}
                                </Link>
                              </div>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  appointment.status === "Scheduled"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Completed"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {appointment.patientname} ({appointment.duration} min)
                            </p>
                            {appointment.notes && <p className="mt-1 text-sm text-gray-500">{appointment.notes}</p>}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
