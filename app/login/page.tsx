"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* Neon decorative elements */}
        <div className="relative">
          <div className="bg-neon-blue/20 absolute -top-10 -left-10 h-20 w-20 rounded-full blur-xl"></div>
          <div className="bg-neon-pink/20 absolute -top-10 -right-10 h-20 w-20 rounded-full blur-xl"></div>

          <div className="relative rounded-xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm">
            {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                variant="neonPink"
                className="bg-white"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-neon-purple hover:text-neon-purple/80">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" variant="solidNeonBlue" size="lg" isLoading={isLoading} className="w-full">
                Sign in
              </Button>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-neon-green hover:text-neon-green/80">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* More neon decorative elements */}
        <div className="bg-neon-purple/10 absolute bottom-10 left-10 h-40 w-40 rounded-full blur-xl"></div>
        <div className="bg-neon-green/10 absolute right-10 bottom-10 h-40 w-40 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
