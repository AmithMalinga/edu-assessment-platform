"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { studentService, type StudentProfile, type StudentSubject } from "@/lib/services/student.service"

export default function StudentSubjectsPage() {
    const [subjects, setSubjects] = useState<StudentSubject[]>([])
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const loadSubjects = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const student = await studentService.getProfile(token)
                setProfile(student)

                const data = await studentService.getSubjectsForStudent(student.id, token)
                setSubjects(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load subjects")
            } finally {
                setLoading(false)
            }
        }

        loadSubjects()
    }, [router])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">My Subjects</h1>
            {profile ? (
                <p className="text-sm text-slate-600">
                    Showing subjects for {profile.educationalLevel}.
                </p>
            ) : null}

            {loading ? <p>Loading subjects...</p> : null}
            {error ? <p className="text-red-600">{error}</p> : null}

            {!loading && !error ? (
                subjects.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                            <article key={subject.id} className="rounded-lg border border-slate-200 p-4">
                                <p className="text-sm text-slate-500">{subject.grade?.name ?? `Grade ${subject.gradeId}`}</p>
                                <h2 className="mt-1 text-lg font-medium text-slate-900">{subject.name}</h2>
                                <p className="mt-2 text-xs text-slate-500">Subject ID: {subject.id}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
                        No subjects available for your grade yet.
                    </p>
                )
            ) : null}
        </div>
    )
}
