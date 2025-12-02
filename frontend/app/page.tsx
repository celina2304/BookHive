"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard")
      } else {
        router.replace("/auth/login")
      }
    }
  }, [user, loading, router])

  // While checking auth, render nothing or a loader
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return null
}
