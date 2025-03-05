"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { getPatients, getAppointments } from "../../lib/api"
import { Patient, Appointment } from "../../lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stats based on real data
  const stats = [
    {
      name: "Total Patients",
      value: patients.length.toString(),
      icon: "👥",
      color: "neon-blue",
    },
    {
      name: "Appointments Today",
      value: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length.toString(),
      icon: "📅",
      color: "neon-green",
    },
    {
      name: "Active Patients",
      value: patients.filter((p) => p.status === "Active").length.toString(),
      icon: "🥗",
      color: "neon-purple",
    },
    {
      name: "Upcoming Appointments",
      value: appointments.filter((a) => a.status === "Scheduled").length.toString(),
      icon: "📋",
      color: "neon-pink",
    },
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [patientsData, appointmentsData] = await Promise.all([getPatients(), getAppointments()])
        setPatients(patientsData)
        setAppointments(appointmentsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get recent patients
  const recentPatients = patients
    .sort((a, b) => {
      const dateA = a.lastvisit ? new Date(a.lastvisit).getTime() : 0
      const dateB = b.lastvisit ? new Date(b.lastvisit).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 4)

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter((a) => a.status === "Scheduled")
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime()
      const dateB = new Date(`${b.date}T${b.time}`).getTime()
      return dateA - dateB
    })
    .slice(0, 3)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neon-blue border-t-transparent"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
        <p className="mb-4 text-red-600">{error}</p>
        <button
          className="rounded-md bg-neon-blue px-4 py-2 text-white hover:bg-neon-blue/80"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {user?.email?.split("@")[0] || "User"}</h1>
        <p className="text-gray-600">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`rounded-lg border border-${stat.color}/30 bg-white p-6 shadow-sm transition-all hover:shadow-${stat.color}`}
          >
            <div className="flex items-center">
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-${stat.color}/20 text-2xl text-${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Patients */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            <Link href="/dashboard/patients" className="text-sm font-medium text-neon-blue hover:text-neon-blue/80">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Last Visit</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="text-sm">
                    <td className="py-3 pr-4 font-medium text-gray-900">{patient.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{patient.lastvisit || "N/A"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          patient.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
            <Link
              href="/dashboard/appointments"
              className="text-sm font-medium text-neon-green hover:text-neon-green/80"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/20 text-neon-green">
                  📅
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{appointment.patientname}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.time} - {appointment.type}
                  </p>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <p className="text-center text-gray-500">No upcoming appointments scheduled.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <Link
            href="/dashboard/patients/new"
            className="flex flex-col items-center rounded-lg border border-neon-blue/30 p-4 text-center transition-all hover:shadow-neon-blue"
          >
            <span className="mb-2 text-2xl">👤</span>
            <span className="text-sm font-medium text-gray-900">Add Patient</span>
          </Link>
          <Link
            href="/dashboard/appointments/new"
            className="flex flex-col items-center rounded-lg border border-neon-green/30 p-4 text-center transition-all hover:shadow-neon-green"
          >
            <span className="mb-2 text-2xl">📅</span>
            <span className="text-sm font-medium text-gray-900">Schedule Appointment</span>
          </Link>
          <Link
            href="/dashboard/diet-plans/new"
            className="flex flex-col items-center rounded-lg border border-neon-purple/30 p-4 text-center transition-all hover:shadow-neon-purple"
          >
            <span className="mb-2 text-2xl">🥗</span>
            <span className="text-sm font-medium text-gray-900">Create Diet Plan</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex flex-col items-center rounded-lg border border-neon-pink/30 p-4 text-center transition-all hover:shadow-neon-pink"
          >
            <span className="mb-2 text-2xl">📊</span>
            <span className="text-sm font-medium text-gray-900">Generate Report</span>
          </Link>
          <Link
            href="/dashboard/patients/import"
            className="flex flex-col items-center rounded-lg border border-gray-200 p-4 text-center transition-all hover:bg-gray-50"
          >
            <span className="mb-2 text-2xl">📤</span>
            <span className="text-sm font-medium text-gray-900">Import Data</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
