"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../contexts/AuthContext"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        setError(error.message)
        return
      }

      setSuccessMessage("Password reset link sent! Please check your email.")
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {/* Neon decorative elements */}
        <div className="relative">
          <div className="bg-neon-blue/20 absolute -top-10 -left-10 h-20 w-20 rounded-full blur-xl"></div>
          <div className="bg-neon-purple/20 absolute -top-10 -right-10 h-20 w-20 rounded-full blur-xl"></div>

          <div className="relative rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm">
            {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-500">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                variant="neonPurple"
                className="bg-white"
              />

              <Button type="submit" variant="solidNeonPurple" size="lg" isLoading={isLoading} className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-neon-blue hover:text-neon-blue/80">
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* More neon decorative elements */}
        <div className="bg-neon-pink/10 absolute bottom-10 left-10 h-40 w-40 rounded-full blur-xl"></div>
        <div className="bg-neon-green/10 absolute right-10 bottom-10 h-40 w-40 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
