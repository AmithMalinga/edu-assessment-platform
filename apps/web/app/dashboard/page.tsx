"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { studentService, type StudentProfile } from "@/lib/services/student.service"

export default function DashboardPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const data = await studentService.getProfile(token)
                setProfile(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load dashboard")
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [router])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">Student Dashboard</h1>
            {loading ? <p>Loading profile...</p> : null}
            {error ? <p className="text-red-600">{error}</p> : null}

            {!loading && !error && profile ? (
                <>
                    <p className="text-sm text-slate-600">Welcome back, {profile.name}.</p>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">Role</p>
                            <p className="mt-1 font-medium text-slate-900">{profile.role}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">Educational Level</p>
                            <p className="mt-1 font-medium text-slate-900">{profile.educationalLevel}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 p-4">
                            <p className="text-sm text-slate-500">Age</p>
                            <p className="mt-1 font-medium text-slate-900">{profile.age}</p>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}
