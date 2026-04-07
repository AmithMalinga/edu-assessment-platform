"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { resultService, type StudentAnalytics } from "@/lib/services/result.service"

const formatPercent = (value: number) => `${Math.round(value * 100) / 100}%`

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
}

export default function AnalyticsPage() {
    const router = useRouter()
    const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const data = await resultService.getMyAnalytics(token)
                setAnalytics(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load analytics.")
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [router])

    const trendPoints = useMemo(() => analytics?.scoreTrend.slice(-8) ?? [], [analytics])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Performance Analytics</h1>
                <p className="text-sm text-slate-600 mt-1">Track your exam growth, pass rate, and recent activity.</p>
            </div>

            {loading ? <p>Loading analytics...</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!loading && !error && analytics ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Total Attempts</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">{analytics.overview.totalAttempts}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Average Score</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatPercent(analytics.overview.averageScore)}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Pass Rate</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatPercent(analytics.overview.passRate)}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs text-slate-500">Best Score</p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">{analytics.overview.bestScore}%</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                        <h2 className="text-lg font-semibold text-slate-900">Score Trend (Recent)</h2>
                        {trendPoints.length === 0 ? (
                            <p className="mt-3 text-sm text-slate-600">No trend data available yet.</p>
                        ) : (
                            <div className="mt-4 space-y-2">
                                {trendPoints.map((point, idx) => (
                                    <div key={point.attemptId} className="flex items-center gap-3">
                                        <span className="w-7 text-xs text-slate-500">#{idx + 1}</span>
                                        <div className="h-2 flex-1 rounded bg-slate-200">
                                            <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.max(3, point.score)}%` }} />
                                        </div>
                                        <span className="w-12 text-right text-sm font-medium text-slate-900">{point.score}%</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-slate-900">By Exam Type</h2>
                            <div className="mt-3 space-y-2">
                                {analytics.byExamType.length === 0 ? (
                                    <p className="text-sm text-slate-600">No exam-type data yet.</p>
                                ) : (
                                    analytics.byExamType.map((item) => (
                                        <div key={item.examType} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                                            <span className="text-sm text-slate-700">{item.examType}</span>
                                            <span className="text-sm font-medium text-slate-900">{item.attempts} attempts • {item.averageScore}%</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-slate-900">By Subject</h2>
                            <div className="mt-3 space-y-2">
                                {analytics.bySubject.length === 0 ? (
                                    <p className="text-sm text-slate-600">No subject data yet.</p>
                                ) : (
                                    analytics.bySubject.map((item) => (
                                        <div key={item.subject} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                                            <span className="text-sm text-slate-700">{item.subject}</span>
                                            <span className="text-sm font-medium text-slate-900">{item.attempts} attempts • {item.averageScore}%</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Recent Attempts</h2>
                            <button
                                onClick={() => router.push("/dashboard/results")}
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                            >
                                View All Results
                            </button>
                        </div>
                        <div className="mt-3 space-y-2">
                            {analytics.recentAttempts.length === 0 ? (
                                <p className="text-sm text-slate-600">No attempts yet.</p>
                            ) : (
                                analytics.recentAttempts.slice(0, 6).map((attempt) => (
                                    <div key={attempt.attemptId} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{attempt.examTitle}</p>
                                            <p className="text-xs text-slate-500">{attempt.subjectName} • {attempt.examType} • {formatDate(attempt.completedAt)}</p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                attempt.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            }`}
                                        >
                                            {attempt.score}%
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}
