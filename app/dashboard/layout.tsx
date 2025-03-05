"use client"

import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../contexts/AuthContext"
import ProtectedRoute from "../../components/auth/ProtectedRoute"

// Navigation items for the sidebar
const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: "📊" },
  { name: "Patients", href: "/dashboard/patients", icon: "👥" },
  { name: "Appointments", href: "/dashboard/appointments", icon: "📅" },
  { name: "Diet Plans", href: "/dashboard/diet-plans", icon: "🥗" },
  { name: "Reports", href: "/dashboard/reports", icon: "📈" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 block md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md bg-white p-2 text-gray-600 shadow-sm hover:text-gray-900"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo and title */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-neon-blue text-xl font-bold">
                NutriTrack<span className="text-neon-pink">Pro</span>
              </h1>
              <p className="text-sm text-gray-500">Dietitian Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        pathname === item.href ? "bg-neon-blue/10 text-neon-blue" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User info and logout */}
            <div className="border-t border-gray-200 p-4">
              <div className="mb-4 flex items-center">
                <div className="bg-neon-purple/20 text-neon-purple mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Dietitian</p>
                </div>
              </div>
              <Button variant="neonPink" size="sm" onClick={handleSignOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64">
          <main className="min-h-screen p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
