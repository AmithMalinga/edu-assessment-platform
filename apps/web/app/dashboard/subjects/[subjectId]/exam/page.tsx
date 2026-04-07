"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Flag, ArrowLeft, ArrowRight, Timer, AlertCircle, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"
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
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const examStateRef = useRef<ExamState>(examState)
    const timeRemainingRef = useRef<number>(0)

    // Intercept browser back button
    useEffect(() => {
        window.history.pushState(null, "", window.location.href)
        
        const handlePopState = (e: PopStateEvent) => {
            window.history.pushState(null, "", window.location.href)
            setShowSubmitModal(true)
        }
        
        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [])

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
                    void performSubmit()
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

    const handleSubmitExam = () => {
        if (!exam || submitting) return
        setShowSubmitModal(true)
    }

    const performSubmit = async () => {
        if (!exam || submitting) return

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

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 animate-pulse" />
            <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8 animate-pulse">
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800" />
                <div className="w-80 hidden lg:block bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800" />
            </div>
        </div>
    )

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] text-center max-w-md shadow-sm border border-slate-100 dark:border-slate-800">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Exam Unavailable</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Subject
                    </button>
                </div>
            </div>
        )
    }

    if (!exam || questions.length === 0 || !currentQuestion) {
        return <p className="text-red-600 m-8 font-medium">No questions available for this exam.</p>
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-10 text-center max-w-md relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Exam Submitted!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Your answers have been securely recorded. Redirecting to your detailed performance report...</p>
                    <div className="flex justify-center">
                        <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </motion.div>
            </div>
        )
    }

    const isFlagged = examState.flaggedQuestions.has(currentQuestion.id)
    const timeColor = timeRemaining < 300 ? "text-red-500 dark:text-red-400" : "text-indigo-600 dark:text-indigo-400"

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
            {/* Frosted Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 lg:px-8 py-3 w-full">
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="bg-indigo-600 text-white p-2 rounded-xl">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Exam In Progress</h1>
                            <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">{examCategoryToLabel(exam.metadata?.examTypeCategory)}</div>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400">
                            Q {examState.currentQuestionIndex + 1} <span className="text-slate-400 mx-1">/</span> {questions.length}
                        </div>
                    </div>
                    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm", timeColor)}>
                        <Timer className="h-5 w-5" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 lg:p-8 max-w-[1600px] mx-auto auto-rows-fr">
                
                {/* Main Question Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col flex-1 relative overflow-hidden">
                        
                        {/* Question Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Question {currentQuestion.number}</h2>
                            <button
                                onClick={handleFlagQuestion}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                    isFlagged
                                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <Flag className={cn("h-4 w-4", isFlagged && "fill-current")} />
                                {isFlagged ? "Flagged" : "Flag"}
                            </button>
                        </div>

                        {/* Question Content */}
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="prose dark:prose-invert max-w-none mb-10">
                                <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">{currentQuestion.content}</p>
                            </div>

                            <div className="mt-auto">
                                {currentQuestion.type === "MCQ" && currentQuestion.options ? (
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Select the correct option:</p>
                                        <div className="grid gap-3">
                                            {currentQuestion.options.map((option, idx) => {
                                                const isSelected = examState.answers[currentQuestion.id] === option;
                                                return (
                                                    <label 
                                                        key={idx} 
                                                        className={cn(
                                                            "group flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                                                            isSelected 
                                                                ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-500 shadow-sm shadow-indigo-500/10" 
                                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                                                        )}
                                                    >
                                                        <div className="relative pt-0.5 mt-px shrink-0">
                                                            <div className={cn(
                                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                                isSelected ? "border-indigo-500" : "border-slate-300 dark:border-slate-600 group-hover:border-indigo-400"
                                                            )}>
                                                                {isSelected && <motion.div layoutId="mcq-select" className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                                                            </div>
                                                            <input
                                                                type="radio"
                                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                                name={`question-${currentQuestion.id}`}
                                                                value={option}
                                                                checked={isSelected}
                                                                onChange={() => handleAnswerChange(option)}
                                                            />
                                                        </div>
                                                        <span className={cn(
                                                            "text-base font-medium leading-relaxed",
                                                            isSelected ? "text-indigo-950 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"
                                                        )}>
                                                            {option}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Your Answer:</p>
                                        <textarea
                                            value={examState.answers[currentQuestion.id] || ""}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full min-h-[200px] p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 resize-y text-slate-900 dark:text-slate-100 transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                            <button
                                onClick={handlePreviousQuestion}
                                disabled={examState.currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                            <button
                                onClick={handleNextQuestion}
                                disabled={examState.currentQuestionIndex === questions.length - 1}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="hidden sm:inline">Next Question</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleSubmitExam}
                                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                            >
                                {submitting ? "Submitting..." : "Submit Exam"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Status Grid */}
                <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col lg:sticky lg:top-24">
                        <h3 className="font-black text-slate-900 dark:text-white mb-4">Question Map</h3>
                        
                        {/* Scrollable grid — padding prevents scale-110 clipping */}
                        <div className="overflow-y-auto min-h-0 max-h-[420px] pr-1 custom-scrollbar">
                            <div className="grid grid-cols-5 gap-2 p-1">
                                {questions.map((q, idx) => {
                                    const isCurrent = idx === examState.currentQuestionIndex
                                    const isAnswered = !!examState.answers[q.id]
                                    const isFlaggedQuestion = examState.flaggedQuestions.has(q.id)

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => handleGoToQuestion(idx)}
                                            title={`Question ${q.number}`}
                                            className={cn(
                                                "relative aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 border-2",
                                                isCurrent 
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400/30 shadow-md shadow-indigo-500/20 scale-110 z-10"
                                                    : isFlaggedQuestion
                                                        ? "border-amber-300 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:scale-105"
                                                        : isAnswered
                                                            ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:scale-105"
                                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105"
                                            )}
                                        >
                                            {q.number}
                                            {isFlaggedQuestion && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-x-3 gap-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 shrink-0 rounded-full bg-emerald-400" /> Answered
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 shrink-0 rounded-full bg-amber-400" /> Flagged
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" /> Unanswered
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 shrink-0 rounded-full border-2 border-indigo-500 bg-transparent" /> Current
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-8">
                                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                    Submit Examination?
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    You are about to submit your exam. Please note that once submitted, you cannot change your answers or return to this session. Are you sure you want to proceed?
                                </p>
                                
                                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setShowSubmitModal(false)}
                                        className="px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Resume Exam
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowSubmitModal(false)
                                            performSubmit()
                                        }}
                                        className="px-6 py-4 rounded-xl bg-emerald-500 text-white font-black hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-colors"
                                    >
                                        Yes, Submit Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
