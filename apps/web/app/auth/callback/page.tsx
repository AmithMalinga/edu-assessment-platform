"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { studentService } from "@/lib/services/student.service"

export default function GoogleAuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState("")

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get("token")

            if (!token) {
                setError("Google login failed: missing token.")
                return
            }

            try {
                localStorage.setItem("token", token)
                const profile = await studentService.getProfile(token)
                localStorage.setItem("currentUser", JSON.stringify(profile))
                router.replace("/loading?to=/dashboard")
            } catch (err) {
                localStorage.removeItem("token")
                localStorage.removeItem("currentUser")
                setError(err instanceof Error ? err.message : "Google login failed.")
            }
        }

        handleCallback()
    }, [router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
                {error ? (
                    <div>
                        <h1 className="text-xl font-bold text-red-600">Authentication Failed</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
                        <button
                            type="button"
                            onClick={() => router.replace("/login")}
                            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-indigo-600"
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Signing you in...</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Please wait while we complete your Google login.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
