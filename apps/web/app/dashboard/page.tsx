"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { studentService, type StudentProfile } from "@/lib/services/student.service"

type DashboardView = "dashboard" | "profile"

const getInitials = (name: string) => {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
    if (parts.length === 0) return "NA"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function DashboardPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeView, setActiveView] = useState<DashboardView>("dashboard")
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

    const joinedDate = profile ? new Date(profile.createdAt).toLocaleDateString() : ""
    const updatedDate = profile ? new Date(profile.updatedAt).toLocaleDateString() : ""
    const initials = getInitials(profile?.name ?? "")

    const openProfile = () => {
        setActiveView("profile")
    }

    const openDashboard = () => {
        setActiveView("dashboard")
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-7xl gap-4">
                <aside className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <button
                        type="button"
                        onClick={openProfile}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                            {initials}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{profile?.name ?? "Student"}</p>
                            <p className="text-sm text-slate-500">{profile?.educationalLevel ?? "Profile"}</p>
                        </div>
                    </button>

                    <nav className="mt-5 space-y-1">
                        <button
                            type="button"
                            onClick={openDashboard}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                activeView === "dashboard"
                                    ? "bg-slate-100 font-medium text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={openProfile}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                activeView === "profile"
                                    ? "bg-slate-100 font-medium text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            My Profile
                        </button>
                    </nav>
                </aside>

                <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    {loading ? <p>Loading profile...</p> : null}
                    {error ? <p className="text-red-600">{error}</p> : null}

                    {!loading && !error && profile && activeView === "dashboard" ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-slate-900">Student Dashboard</h1>
                            <p className="text-sm text-slate-600">
                                Welcome back, {profile.name}. Use the sidebar to open your profile details.
                            </p>

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
                        </div>
                    ) : null}

                    {!loading && !error && profile && activeView === "profile" ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">ID</p>
                                    <p className="mt-1 break-all font-medium text-slate-900">{profile.id}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.name}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.email}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.phone}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Age</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.age}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Educational Level</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.educationalLevel}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Role</p>
                                    <p className="mt-1 font-medium text-slate-900">{profile.role}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-sm text-slate-500">Joined At</p>
                                    <p className="mt-1 font-medium text-slate-900">{joinedDate}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                                    <p className="text-sm text-slate-500">Last Updated</p>
                                    <p className="mt-1 font-medium text-slate-900">{updatedDate}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </main>
    )
}
