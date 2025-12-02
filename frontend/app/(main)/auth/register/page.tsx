"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/app/(main)/auth/login/_components/login-form"
import { getUserFromStorage } from "@/lib/auth-storage"
import { RegisterForm } from "./_components/register-form"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserFromStorage()
    if (user) {
      router.replace("/dashboard") // redirect to dashboard
    }
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
