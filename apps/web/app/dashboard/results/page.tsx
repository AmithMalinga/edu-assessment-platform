"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { resultService, type AttemptListItem } from "@/lib/services/result.service"

const formatDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleString()
}

const parseSubjectFromDescription = (description: string | null) => {
    if (!description) return "General"
    const marker = "Exam Config: "
    const idx = description.indexOf(marker)
    if (idx === -1) return "General"

    try {
        const parsed = JSON.parse(description.slice(idx + marker.length).trim()) as { subjectName?: string }
        return parsed.subjectName || "General"
    } catch {
        return "General"
    }
}

export default function ResultsPage() {
    const router = useRouter()
    const [attempts, setAttempts] = useState<AttemptListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadAttempts = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const data = await resultService.getMyAttempts(token)
                setAttempts(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load results.")
            } finally {
                setLoading(false)
            }
        }

        loadAttempts()
    }, [router])

    const sortedAttempts = useMemo(
        () => [...attempts].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
        [attempts],
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">My Results</h1>
                <p className="text-sm text-slate-600 mt-1">Review your exam attempts and open detailed answer reviews.</p>
            </div>

            {loading ? <p>Loading results...</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!loading && !error && sortedAttempts.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-lg font-semibold text-slate-900">No results yet</h2>
                    <p className="text-sm text-slate-600 mt-2">Once you complete an exam, your results and answer review will appear here.</p>
                    <button
                        onClick={() => router.push("/dashboard/subjects")}
                        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Start an Exam
                    </button>
                </div>
            ) : null}

            {sortedAttempts.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-slate-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Exam</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Score</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Completed</th>
                                    <th className="px-4 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sortedAttempts.map((attempt) => {
                                    const passed = attempt.score >= attempt.exam.passingScore
                                    const subject = parseSubjectFromDescription(attempt.exam.description)

                                    return (
                                        <tr key={attempt.id}>
                                            <td className="px-4 py-3 font-medium text-slate-900">{attempt.exam.title}</td>
                                            <td className="px-4 py-3 text-slate-700">{subject}</td>
                                            <td className="px-4 py-3 text-slate-700">{attempt.score}%</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    {passed ? "Passed" : "Failed"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{formatDateTime(attempt.completedAt)}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => router.push(`/dashboard/results/${attempt.id}`)}
                                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50"
                                                >
                                                    View Result
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
