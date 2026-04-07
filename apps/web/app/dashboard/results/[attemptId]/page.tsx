"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { resultService, type AttemptReview } from "@/lib/services/result.service"

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
}

const formatDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleString()
}

export default function ResultDetailPage() {
    const router = useRouter()
    const params = useParams()
    const attemptId = params.attemptId as string

    const [review, setReview] = useState<AttemptReview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showAnswers, setShowAnswers] = useState(true)

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

                const data = await resultService.getAttemptReview(token, attemptId)
                setReview(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load result review.")
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [attemptId, router])

    if (loading) return <p>Loading result...</p>

    if (error || !review) {
        return (
            <div className="space-y-4">
                <button onClick={() => router.back()} className="text-sm text-blue-600 hover:text-blue-700">
                    ← Back
                </button>
                <p className="text-red-600">{error || "Result not found."}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h1 className="text-2xl font-semibold text-slate-900">{review.examTitle}</h1>
                <p className="text-sm text-slate-600 mt-1">Completed: {formatDateTime(review.completedAt)}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Score</p>
                        <p className="text-lg font-semibold text-slate-900">{review.scoreSummary.score}%</p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Correct</p>
                        <p className="text-lg font-semibold text-slate-900">{review.scoreSummary.correctAnswers}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Wrong</p>
                        <p className="text-lg font-semibold text-slate-900">{review.scoreSummary.wrongAnswers}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-3">
                        <p className="text-xs text-slate-500">Time</p>
                        <p className="text-lg font-semibold text-slate-900">{formatDuration(review.timeTaken)}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Answers</h2>
                    <button
                        onClick={() => setShowAnswers((prev) => !prev)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                    >
                        {showAnswers ? "Hide" : "Show"}
                    </button>
                </div>

                {showAnswers ? (
                    <div className="mt-4 space-y-3">
                        {review.questions.map((question) => (
                            <article key={question.questionId} className="rounded-lg border border-slate-200 p-4">
                                <h3 className="font-medium text-slate-900">Q{question.order}. {question.content}</h3>
                                <p className="mt-2 text-sm text-slate-600">Your answer: {question.selectedAnswer || "Not answered"}</p>
                                <p className="text-sm text-slate-600">Correct answer: {question.correctAnswer || "Manual grading required"}</p>
                            </article>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
