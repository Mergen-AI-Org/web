"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../contexts/AuthContext"

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Show success message
      setSuccessMessage("Registration successful! Please check your email to confirm your account.")

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login")
      }, 5000)
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create an Account</h1>
          <p className="mt-2 text-sm text-gray-600">Join us today and get started</p>
        </div>

        {/* Neon decorative elements */}
        <div className="relative">
          <div className="bg-neon-green/20 absolute -top-10 -left-10 h-20 w-20 rounded-full blur-xl"></div>
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
                variant="neonGreen"
                className="bg-white"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                variant="neonPurple"
                className="bg-white"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                variant="neonPurple"
                className="bg-white"
              />

              <Button type="submit" variant="solidNeonGreen" size="lg" isLoading={isLoading} className="w-full">
                Sign up
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-neon-blue hover:text-neon-blue/80">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* More neon decorative elements */}
        <div className="bg-neon-blue/10 absolute bottom-10 left-10 h-40 w-40 rounded-full blur-xl"></div>
        <div className="bg-neon-pink/10 absolute right-10 bottom-10 h-40 w-40 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
