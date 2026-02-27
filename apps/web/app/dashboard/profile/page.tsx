"use client"
import { useEffect, useState } from "react"
import { studentService } from "@/lib/services/student.service"
import { useRouter } from "next/navigation"

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Not authenticated.")
                    setLoading(false)
                    router.push("/login")
                    return
                }
                const res = await studentService.getProfile(token)
                if (res && res.id) {
                    setProfile(res)
                } else {
                    setError(res.message || "Failed to load profile.")
                }
            } catch (err: any) {
                setError(err.message || "Failed to load profile.")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-full max-w-lg p-8 rounded-3xl shadow-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Student Profile</h2>
                {loading ? (
                    <div className="text-center text-slate-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : profile ? (
                    <div className="space-y-4">
                        <div><span className="font-semibold">Name:</span> {profile.name}</div>
                        <div><span className="font-semibold">Email:</span> {profile.email}</div>
                        <div><span className="font-semibold">Phone:</span> {profile.phone}</div>
                        <div><span className="font-semibold">Age:</span> {profile.age}</div>
                        <div><span className="font-semibold">Educational Level:</span> {profile.educationalLevel}</div>
                        <div><span className="font-semibold">Role:</span> {profile.role}</div>
                        <div><span className="font-semibold">Joined:</span> {profile.createdAt && new Date(profile.createdAt).toLocaleDateString()}</div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
