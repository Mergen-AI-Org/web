"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()

  // Mock data for dashboard stats
  const stats = [
    { name: "Total Patients", value: "42", icon: "👥", color: "neon-blue" },
    { name: "Appointments Today", value: "8", icon: "📅", color: "neon-green" },
    { name: "Diet Plans Active", value: "36", icon: "🥗", color: "neon-purple" },
    { name: "Pending Tasks", value: "12", icon: "📋", color: "neon-pink" },
  ]

  // Mock data for recent patients
  const recentPatients = [
    { id: "1", name: "Emma Johnson", lastvisit: "2023-06-15", nextappointment: "2023-06-22", status: "Active" },
    { id: "2", name: "Michael Smith", lastvisit: "2023-06-14", nextappointment: "2023-06-28", status: "Active" },
    { id: "3", name: "Sophia Williams", lastvisit: "2023-06-10", nextappointment: "2023-06-24", status: "Active" },
    { id: "4", name: "James Brown", lastvisit: "2023-06-08", nextappointment: null, status: "Inactive" },
  ]

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    { id: "1", patientName: "Emma Johnson", date: "2023-06-22", time: "10:00 AM", type: "Follow-up" },
    { id: "2", name: "Liam Davis", date: "2023-06-22", time: "11:30 AM", type: "Initial Consultation" },
    { id: "3", name: "Olivia Martinez", date: "2023-06-22", time: "2:00 PM", type: "Follow-up" },
    { id: "4", name: "Noah Wilson", date: "2023-06-23", time: "9:30 AM", type: "Diet Review" },
  ]

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
                    <td className="py-3 pr-4 text-gray-500">{patient.lastvisit}</td>
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
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/20 text-neon-green">
                  📅
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{appointment.name || appointment.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.time} - {appointment.type}
                  </p>
                </div>
              </div>
            ))}
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
