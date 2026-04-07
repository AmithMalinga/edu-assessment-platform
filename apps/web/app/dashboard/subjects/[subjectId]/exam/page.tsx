"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import {
    assessmentService,
    examCategoryToLabel,
    type AssessmentExamDetail,
    type AssessmentQuestion,
} from "@/lib/services/assessment.service"
import { resultService } from "@/lib/services/result.service"

interface ExamState {
    currentQuestionIndex: number
    answers: Record<string, string>
    flaggedQuestions: Set<string>
}

interface UiQuestion {
    id: string
    number: number
    title: string
    content: string
    type: "MCQ" | "STRUCTURED" | "ESSAY"
    options?: string[]
}

export default function ExamPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const subjectId = params.subjectId as string
    const examType = searchParams.get("type") || "random-new"
    const examId = searchParams.get("examId") || ""

    const [exam, setExam] = useState<AssessmentExamDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [examState, setExamState] = useState<ExamState>({
        currentQuestionIndex: 0,
        answers: {},
        flaggedQuestions: new Set(),
    })
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionError, setSubmissionError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const examStateRef = useRef<ExamState>(examState)
    const timeRemainingRef = useRef<number>(0)

    useEffect(() => {
        const loadExam = async () => {
            setError("")
            setLoading(true)
            try {
                let resolvedExamId = examId
                if (!resolvedExamId) {
                    const availableExams = await assessmentService.getAvailableExamsForSubject(subjectId, examType)
                    if (availableExams.length === 0) {
                        setError("No exams are available for this subject and type.")
                        return
                    }
                    resolvedExamId = availableExams[0].id
                }

                const examDetails = await assessmentService.getExamById(resolvedExamId)
                setExam(examDetails)
                setTimeRemaining(examDetails.duration * 60)
            } catch (err: any) {
                setError(err?.message || "Failed to load exam")
            } finally {
                setLoading(false)
            }
        }

        loadExam()
    }, [examId, examType, subjectId])

    const questions = useMemo<UiQuestion[]>(() => {
        if (!exam) return []

        return exam.examQuestions
            .sort((a, b) => a.order - b.order)
            .map((item, index) => {
                const question = item.question as AssessmentQuestion
                return {
                    id: question.id,
                    number: index + 1,
                    title: `Question ${index + 1}`,
                    content: question.content,
                    type: question.type,
                    options: question.choices?.length ? question.choices : undefined,
                }
            })
    }, [exam])

    const currentQuestion = questions[examState.currentQuestionIndex]

    useEffect(() => {
        examStateRef.current = examState
    }, [examState])

    useEffect(() => {
        timeRemainingRef.current = timeRemaining
    }, [timeRemaining])

    useEffect(() => {
        if (!exam || questions.length === 0) return

        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current)
                    void handleSubmitExam(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [exam, questions.length])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    const handleAnswerChange = (answer: string) => {
        if (!currentQuestion) return
        setExamState((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentQuestion.id]: answer,
            },
        }))
    }

    const handleFlagQuestion = () => {
        if (!currentQuestion) return

        setExamState((prev) => {
            const newFlagged = new Set(prev.flaggedQuestions)
            if (newFlagged.has(currentQuestion.id)) {
                newFlagged.delete(currentQuestion.id)
            } else {
                newFlagged.add(currentQuestion.id)
            }
            return {
                ...prev,
                flaggedQuestions: newFlagged,
            }
        })
    }

    const handleNextQuestion = () => {
        if (examState.currentQuestionIndex < questions.length - 1) {
            setExamState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
            }))
        }
    }

    const handlePreviousQuestion = () => {
        if (examState.currentQuestionIndex > 0) {
            setExamState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1,
            }))
        }
    }

    const handleGoToQuestion = (index: number) => {
        setExamState((prev) => ({
            ...prev,
            currentQuestionIndex: index,
        }))
    }

    const handleSubmitExam = async (autoSubmit = false) => {
        if (!exam || submitting) return

        if (!autoSubmit) {
            const confirmed = confirm("Are you sure you want to submit the exam? You cannot change your answers after submission.")
            if (!confirmed) return
        }

        try {
            setSubmitting(true)
            setSubmissionError("")

            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            const totalTime = exam.duration * 60
            const timeTaken = Math.max(0, totalTime - timeRemainingRef.current)
            const response = await resultService.submitExam(token, {
                examId: exam.id,
                answers: examStateRef.current.answers,
                timeTaken,
            })

            setIsSubmitted(true)
            router.push(`/dashboard/subjects/${subjectId}/exam-result?examId=${exam.id}&attemptId=${response.id}&type=${examType}`)
        } catch (err: any) {
            setSubmissionError(err?.message || "Failed to submit exam. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p>Loading exam...</p>

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:text-blue-700"
                >
                    ← Back
                </button>
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    if (!exam || questions.length === 0 || !currentQuestion) {
        return <p className="text-red-600">No questions available for this exam.</p>
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="text-5xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold text-green-600 mb-2">Exam Submitted!</h1>
                    <p className="text-slate-600 mb-4">Your answers have been recorded successfully.</p>
                    <p className="text-sm text-slate-500">Redirecting to results...</p>
                </div>
            </div>
        )
    }

    const isFlagged = examState.flaggedQuestions.has(currentQuestion.id)

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="bg-slate-900 text-white sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-lg font-semibold">Exam In Progress</h1>
                            <div className="text-xs text-slate-400 mt-1">{examCategoryToLabel(exam.metadata?.examTypeCategory)}</div>
                        </div>
                        <div className="text-sm text-slate-300">
                            Question {examState.currentQuestionIndex + 1} of {questions.length}
                        </div>
                    </div>
                    <div className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? "text-red-400" : "text-green-400"}`}>
                        ⏱️ {formatTime(timeRemaining)}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 flex gap-4 min-h-[calc(100vh-70px)]">
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {submissionError ? <p className="mb-4 text-sm text-red-600">{submissionError}</p> : null}

                        <div className="border-b pb-4 mb-6">
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-xl font-semibold text-slate-900">{currentQuestion.title}</h2>
                                <button
                                    onClick={handleFlagQuestion}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isFlagged
                                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {isFlagged ? "🚩 Flagged" : "🚩 Flag"}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-slate-900 text-lg mb-6">{currentQuestion.content}</p>

                            <div className="space-y-3">
                                {currentQuestion.type === "MCQ" && currentQuestion.options ? (
                                    <>
                                        <p className="text-sm font-medium text-slate-600 mb-3">Select the correct answer:</p>
                                        <div className="space-y-2">
                                            {currentQuestion.options.map((option, idx) => (
                                                <label key={idx} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.id}`}
                                                        value={option}
                                                        checked={examState.answers[currentQuestion.id] === option}
                                                        onChange={() => handleAnswerChange(option)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-slate-900">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-slate-600 mb-3">Your answer:</p>
                                        <textarea
                                            value={examState.answers[currentQuestion.id] || ""}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 border-t pt-6">
                            <button
                                onClick={handlePreviousQuestion}
                                disabled={examState.currentQuestionIndex === 0}
                                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={handleNextQuestion}
                                disabled={examState.currentQuestionIndex === questions.length - 1}
                                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                            <button
                                onClick={() => void handleSubmitExam(false)}
                                disabled={submitting}
                                className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit Exam"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-64">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-slate-900 mb-3">Questions</h3>
                        <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
                            {questions.map((q, idx) => {
                                const isCurrentQuestion = idx === examState.currentQuestionIndex
                                const isAnswered = !!examState.answers[q.id]
                                const isFlaggedQuestion = examState.flaggedQuestions.has(q.id)

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handleGoToQuestion(idx)}
                                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                                            isCurrentQuestion
                                                ? "bg-blue-600 text-white"
                                                : isFlaggedQuestion
                                                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                                                  : isAnswered
                                                    ? "bg-green-100 text-green-900 hover:bg-green-200"
                                                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Q{q.number}</span>
                                            <div className="flex gap-1">
                                                {isFlaggedQuestion && <span>🚩</span>}
                                                {isAnswered && !isFlaggedQuestion && <span>✓</span>}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="border-t mt-4 pt-4 text-xs space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-100 rounded"></div>
                                <span className="text-slate-600">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-100 rounded"></div>
                                <span className="text-slate-600">Flagged</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                <span className="text-slate-600">Current</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
