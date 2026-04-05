"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

export default function ExamResultPage() {
    const router = useRouter()
    const params = useParams()
    const subjectId = params.subjectId as string

    // Dummy result data
    const result = {
        score: 78,
        totalMarks: 100,
        passingScore: 60,
        timeUsed: "45 minutes",
        correctAnswers: 39,
        totalQuestions: 50,
        passed: true,
    }

    useEffect(() => {
        // Auto redirect after 5 seconds
        const timer = setTimeout(() => {
            router.push(`/dashboard/subjects/${subjectId}`)
        }, 5000)

        return () => clearTimeout(timer)
    }, [router, subjectId])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Result Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className={`text-6xl mb-4 ${result.passed ? "text-green-600" : "text-red-600"}`}>
                            {result.passed ? "🎉" : "📋"}
                        </div>
                        <h1 className={`text-3xl font-bold mb-2 ${result.passed ? "text-green-600" : "text-red-600"}`}>
                            {result.passed ? "Exam Passed!" : "Exam Completed"}
                        </h1>
                        <p className="text-slate-600">
                            {result.passed
                                ? "Congratulations! You have successfully passed the exam."
                                : "Thank you for taking the exam. Review your performance below."}
                        </p>
                    </div>

                    {/* Score Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                        <div className="text-center">
                            <p className="text-slate-600 text-sm mb-2">Your Score</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl font-bold text-blue-600">{result.score}</span>
                                <span className="text-2xl text-slate-600">/ {result.totalMarks}</span>
                            </div>
                            <p className="text-slate-600 mt-3">
                                Passing Score: <strong>{result.passingScore}%</strong>
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 mb-1">Correct Answers</p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {result.correctAnswers} / {result.totalQuestions}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm text-slate-600 mb-1">Time Used</p>
                            <p className="text-2xl font-semibold text-slate-900">{result.timeUsed}</p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="border-t pt-6">
                        <p className="text-sm text-slate-600 mb-4">What's Next?</p>
                        <div className="space-y-2">
                            <p className="text-slate-700">
                                ✓ Review your answers and understand the correct solutions.
                            </p>
                            <p className="text-slate-700">
                                ✓ Use your feedback to improve your understanding of the subject.
                            </p>
                            <p className="text-slate-700">
                                ✓ You can retake this exam to improve your score.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
                            className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                        >
                            Back to Subject
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/subjects")}
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 transition-colors"
                        >
                            My Subjects
                        </button>
                    </div>

                    {/* Auto Redirect Message */}
                    <p className="text-xs text-center text-slate-500">
                        Redirecting to subject page in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    )
}
