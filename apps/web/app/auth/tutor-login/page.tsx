"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function TutorLoginPageRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirecting to the unified login page with the tutor role selected
    router.replace("/login?role=tutor")
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      <p className="text-sm font-bold text-slate-600 dark:text-slate-400 animate-pulse uppercase tracking-widest">
        Redirecting to Unified Login...
      </p>
    </div>
  )
}
