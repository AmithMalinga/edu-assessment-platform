"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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

export default function ExamResultPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()

    const subjectId = params.subjectId as string
    const attemptId = searchParams.get("attemptId") || ""
    const examId = searchParams.get("examId") || ""
    const examType = searchParams.get("type") || "random-new"

    const [review, setReview] = useState<AttemptReview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showAnswers, setShowAnswers] = useState(false)

    useEffect(() => {
        const loadResult = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                let resolvedAttemptId = attemptId
                if (!resolvedAttemptId) {
                    const attempts = await resultService.getMyAttempts(token)
                    const filtered = examId ? attempts.filter((item) => item.examId === examId) : attempts
                    if (filtered.length === 0) {
                        setError("No attempt found for this exam result.")
                        return
                    }

                    filtered.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                    resolvedAttemptId = filtered[0].id
                }

                const data = await resultService.getAttemptReview(token, resolvedAttemptId)
                setReview(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load exam result.")
            } finally {
                setLoading(false)
            }
        }

        loadResult()
    }, [attemptId, examId, router])

    const percentage = useMemo(() => review?.scoreSummary.score ?? 0, [review])

    if (loading) return <p>Loading exam result...</p>

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

    const passStateClass = review.passed
        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
        : "bg-rose-50 border-rose-200 text-rose-700"

    return (
        <div className="space-y-6">
            <div className={`rounded-xl border p-6 ${passStateClass}`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{review.passed ? "Exam Passed" : "Exam Completed"}</h1>
                        <p className="mt-1 text-sm">{review.examTitle}</p>
                        <p className="mt-1 text-xs">Completed: {formatDateTime(review.completedAt)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide">Score</p>
                        <p className="text-4xl font-bold">{percentage}%</p>
                        <p className="text-xs">Passing: {review.scoreSummary.passingScore}%</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Correct</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{review.scoreSummary.correctAnswers}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Wrong</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{review.scoreSummary.wrongAnswers}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Unanswered</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{review.scoreSummary.unansweredAnswers}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Time Used</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{formatDuration(review.timeTaken)}</p>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">Answer Review</h2>
                    <button
                        onClick={() => setShowAnswers((prev) => !prev)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    >
                        {showAnswers ? "Hide Answers" : "Show Answers"}
                    </button>
                </div>

                {showAnswers ? (
                    <div className="mt-4 space-y-3">
                        {review.questions.map((question) => (
                            <article key={question.questionId} className="rounded-lg border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-medium text-slate-900">Q{question.order}. {question.content}</h3>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                            question.isCorrect
                                                ? "bg-emerald-100 text-emerald-700"
                                                : question.isAnswered
                                                  ? "bg-rose-100 text-rose-700"
                                                  : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {question.isCorrect ? "Correct" : question.isAnswered ? "Incorrect" : "Unanswered"}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-slate-600">
                                    Your answer: <span className="font-medium text-slate-900">{question.selectedAnswer || "Not answered"}</span>
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    Correct answer: <span className="font-medium text-emerald-700">{question.correctAnswer || "Manual grading required"}</span>
                                </p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-slate-600">Use "Show Answers" to review each question and correct answer.</p>
                )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview?type=${examType}&examId=${review.examId}`)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Retake Exam
                </button>
                <button
                    onClick={() => router.push("/dashboard/results")}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                    All Results
                </button>
                <button
                    onClick={() => router.push("/dashboard/analytics")}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                    View Analytics
                </button>
                <button
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                    Back to Subject
                </button>
            </div>
        </div>
    )
}
