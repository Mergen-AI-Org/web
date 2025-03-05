"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="border-neon-blue h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
    </div>
  )
}
