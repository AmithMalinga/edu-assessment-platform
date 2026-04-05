"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"

interface Question {
    id: string
    number: number
    title: string
    content: string
    type: "MCQ" | "STRUCTURED" | "ESSAY"
    options?: string[]
}

interface ExamState {
    currentQuestionIndex: number
    answers: Record<string, string>
    flaggedQuestions: Set<string>
}

type ExamType = "random-new" | "lesson-wise" | "past-papers" | "live"

// Dummy questions data for Random New
const RANDOM_NEW_QUESTIONS: Question[] = [
    {
        id: "q1",
        number: 1,
        title: "Question 1",
        content: "What is the capital of France?",
        type: "MCQ",
        options: ["London", "Paris", "Berlin", "Madrid"],
    },
    {
        id: "q2",
        number: 2,
        title: "Question 2",
        content: "What is 2 + 2?",
        type: "MCQ",
        options: ["3", "4", "5", "6"],
    },
    {
        id: "q3",
        number: 3,
        title: "Question 3",
        content: "Explain the concept of photosynthesis",
        type: "ESSAY",
    },
    {
        id: "q4",
        number: 4,
        title: "Question 4",
        content: "Which planet is the largest in our solar system?",
        type: "MCQ",
        options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    },
    {
        id: "q5",
        number: 5,
        title: "Question 5",
        content: "Describe the water cycle",
        type: "STRUCTURED",
    },
]

// Dummy questions for Lesson Wise exam
const LESSON_WISE_QUESTIONS: Question[] = [
    {
        id: "lw1",
        number: 1,
        title: "Question 1",
        content: "Define the derivative of a function",
        type: "MCQ",
        options: ["Rate of change", "Slope of tangent", "Instantaneous rate of change", "All of the above"],
    },
    {
        id: "lw2",
        number: 2,
        title: "Question 2",
        content: "What is the derivative of x²?",
        type: "MCQ",
        options: ["2x", "x", "2", "x²"],
    },
    {
        id: "lw3",
        number: 3,
        title: "Question 3",
        content: "Solve: Find the derivative of 3x³ + 2x² + x",
        type: "STRUCTURED",
    },
]

// Dummy questions for Past Papers exam
const PAST_PAPERS_QUESTIONS: Question[] = [
    {
        id: "pp1",
        number: 1,
        title: "Question 1 - 2023 Paper",
        content: "What is the Pythagorean theorem?",
        type: "MCQ",
        options: [
            "a + b = c",
            "a² + b² = c²",
            "a² - b² = c²",
            "a × b = c²",
        ],
    },
    {
        id: "pp2",
        number: 2,
        title: "Question 2 - 2023 Paper",
        content: "In a right triangle, if a = 3 and b = 4, find c",
        type: "MCQ",
        options: ["5", "6", "7", "8"],
    },
    {
        id: "pp3",
        number: 3,
        title: "Question 3 - 2022 Paper",
        content: "Explain the difference between permutation and combination",
        type: "ESSAY",
    },
    {
        id: "pp4",
        number: 4,
        title: "Question 4 - 2022 Paper",
        content: "Find nP3 if n = 5",
        type: "MCQ",
        options: ["60", "120", "20", "10"],
    },
]

// Dummy questions for Live exam (official)
const LIVE_EXAM_QUESTIONS: Question[] = [
    {
        id: "live1",
        number: 1,
        title: "Question 1",
        content: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
        type: "MCQ",
        options: ["0", "1", "2", "Undefined"],
    },
    {
        id: "live2",
        number: 2,
        title: "Question 2",
        content: "Which of these is a continuous function?",
        type: "MCQ",
        options: ["f(x) = 1/x", "f(x) = sin(x)", "f(x) = floor(x)", "f(x) = |x|"],
    },
    {
        id: "live3",
        number: 3,
        title: "Question 3",
        content: "Integrate: ∫(3x² + 2x)dx",
        type: "STRUCTURED",
    },
    {
        id: "live4",
        number: 4,
        title: "Question 4",
        content: "What is the integral of sin(x)?",
        type: "MCQ",
        options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    },
    {
        id: "live5",
        number: 5,
        title: "Question 5",
        content: "Find the area under the curve f(x) = x from 0 to 2",
        type: "STRUCTURED",
    },
]

export default function ExamPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const subjectId = params.subjectId as string
    const examType = (searchParams.get("type") || "random-new") as ExamType

    // Select questions based on exam type
    const getQuestionsForExamType = (): Question[] => {
        switch (examType) {
            case "lesson-wise":
                return LESSON_WISE_QUESTIONS
            case "past-papers":
                return PAST_PAPERS_QUESTIONS
            case "live":
                return LIVE_EXAM_QUESTIONS
            default:
                return RANDOM_NEW_QUESTIONS
        }
    }

    const QUESTIONS = getQuestionsForExamType()
    const EXAM_DURATION = examType === "live" ? 120 : examType === "past-papers" ? 120 : 60 // minutes

    const [examState, setExamState] = useState<ExamState>({
        currentQuestionIndex: 0,
        answers: {},
        flaggedQuestions: new Set(),
    })
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION * 60) // Convert to seconds
    const [isSubmitted, setIsSubmitted] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const currentQuestion = QUESTIONS[examState.currentQuestionIndex]

    // Get exam type display name
    const getExamTypeName = (): string => {
        switch (examType) {
            case "lesson-wise":
                return "Lesson Wise Exam"
            case "past-papers":
                return "Past Papers Exam"
            case "live":
                return "Live Exam"
            default:
                return "Random New Exam"
        }
    }

    // Timer effect
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(timerRef.current!)
                    handleSubmitExam()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    const handleAnswerChange = (answer: string) => {
        setExamState((prev) => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentQuestion.id]: answer,
            },
        }))
    }

    const handleFlagQuestion = () => {
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
        if (examState.currentQuestionIndex < DUMMY_QUESTIONS.length - 1) {
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

    const handleSubmitExam = () => {
        if (confirm("Are you sure you want to submit the exam? You cannot change your answers after submission.")) {
            setIsSubmitted(true)
            console.log("Submitted answers:", examState.answers)
            // Here you would send the answers to the backend
            setTimeout(() => {
                router.push(`/dashboard/subjects/${subjectId}/exam-result`)
            }, 2000)
        }
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

    const isQuestionAnswered = !!examState.answers[currentQuestion.id]
    const isFlagged = examState.flaggedQuestions.has(currentQuestion.id)

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header with Timer */}
            <div className="bg-slate-900 text-white sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-lg font-semibold">Exam In Progress</h1>
                            <div className="text-xs text-slate-400 mt-1">{getExamTypeName()}</div>
                        </div>
                        <div className="text-sm text-slate-300">
                            Question {examState.currentQuestionIndex + 1} of {QUESTIONS.length}
                        </div>
                    </div>
                    <div className={`text-2xl font-bold font-mono ${timeRemaining < 300 ? "text-red-400" : "text-green-400"}`}>
                        ⏱️ {formatTime(timeRemaining)}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 flex gap-4 min-h-[calc(100vh-70px)]">
                {/* Main Question Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Question Header */}
                        <div className="border-b pb-4 mb-6">
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {currentQuestion.title}
                                </h2>
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

                        {/* Question Content */}
                        <div className="mb-6">
                            <p className="text-slate-900 text-lg mb-6">{currentQuestion.content}</p>

                            {/* Answer Options / Input */}
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

                        {/* Navigation Buttons */}
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
                                disabled={examState.currentQuestionIndex === QUESTIONS.length - 1}
                                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                            <button
                                onClick={handleSubmitExam}
                                className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                            >
                                Submit Exam
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Panel (Sidebar) */}
                <div className="w-64">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="font-semibold text-slate-900 mb-3">Questions</h3>
                        <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
                            {QUESTIONS.map((q, idx) => {
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

                        {/* Legend */}
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
