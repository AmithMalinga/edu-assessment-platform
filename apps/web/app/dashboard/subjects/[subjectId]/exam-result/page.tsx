"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { resultService, type AttemptReview } from "@/lib/services/result.service"
import { 
    CheckCircle, XCircle, MinusCircle, Clock, 
    ChevronLeft, RotateCcw, List, BarChart2, Eye, EyeOff, Trophy, AlertTriangle 
} from "lucide-react"
import { cn } from "@/lib/utils"

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
}

const formatDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
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

    if (loading) return (
        <div className="p-8 lg:p-10 space-y-8 max-w-5xl mx-auto animate-pulse">
            <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-[32px]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-100 dark:bg-slate-900 rounded-[24px]" />)}
            </div>
            <div className="h-64 bg-slate-50 dark:bg-slate-900/50 rounded-[32px]" />
        </div>
    )

    if (error || !review) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[50vh]">
                <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500">
                    <AlertTriangle className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{error || "Result not found"}</h2>
                    <p className="text-sm text-slate-500">Could not retrieve your examination result.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all shadow-lg active:scale-95"
                >
                    Go Back
                </button>
            </div>
        )
    }

    const isPassed = review.passed
    const themeClass = isPassed 
        ? "from-emerald-500 via-teal-500 to-emerald-600"
        : "from-rose-500 via-red-500 to-rose-600"
        
    const iconWrapperClass = isPassed
        ? "bg-emerald-600/20 text-emerald-100 border-emerald-500/30"
        : "bg-rose-600/20 text-rose-100 border-rose-500/30"

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen bg-slate-50 dark:bg-slate-950/50 p-4 lg:p-6"
        >
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header / Back Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
                    className="group flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors w-fit"
                >
                    <div className="h-6 w-6 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] tracking-wide">Back to Subject</span>
                </motion.button>

                {/* Hero Banner */}
                <motion.div 
                    variants={itemVariants}
                    className={cn(
                        "relative overflow-hidden rounded-[24px] p-6 shadow-lg text-white",
                        "bg-gradient-to-br",
                        themeClass
                    )}
                >
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={cn("h-10 w-10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner border", iconWrapperClass)}>
                                    {isPassed ? <Trophy className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                                        {isPassed ? "Exam Passed!" : "Exam Completed"}
                                    </h1>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Result Overview</span>
                                </div>
                            </div>

                            <div className="pt-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-black border border-white/10 uppercase tracking-wider">
                                        <span className="text-white line-clamp-1">{review.examTitle}</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-black border border-white/10 uppercase tracking-wider">
                                        {formatDateTime(review.completedAt)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[16px] p-4 text-center shadow-inner shrink-0 min-w-[160px]">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Final Score</p>
                            <p className="text-4xl font-black tracking-tighter">{percentage}<span className="text-xl text-white/60 ml-1">%</span></p>
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-[10px] font-medium text-white/80">Passing Criteria: <span className="font-bold text-white">{review.scoreSummary.passingScore}%</span></p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stat Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        icon={CheckCircle} 
                        label="Correct Answers" 
                        value={review.scoreSummary.correctAnswers.toString()} 
                        colorClass="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                    />
                    <StatCard 
                        icon={XCircle} 
                        label="Wrong Answers" 
                        value={review.scoreSummary.wrongAnswers.toString()} 
                        colorClass="text-rose-500 bg-rose-50 dark:bg-rose-900/20" 
                    />
                    <StatCard 
                        icon={MinusCircle} 
                        label="Unanswered" 
                        value={review.scoreSummary.unansweredAnswers.toString()} 
                        colorClass="text-slate-500 bg-slate-100 dark:bg-slate-800" 
                    />
                    <StatCard 
                        icon={Clock} 
                        label="Time Used" 
                        value={formatDuration(review.timeTaken)} 
                        colorClass="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                    />
                </motion.div>

                {/* Answer Review */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 p-6 lg:p-7 shadow-sm space-y-5 overflow-hidden"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3.5">
                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center">
                                <List className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Answer Review</h2>
                                <p className="text-[11px] text-slate-500 font-bold mt-0.5">Review your answers against the correct solutions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAnswers(!showAnswers)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-colors active:scale-95 border border-slate-200 dark:border-slate-700"
                        >
                            {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {showAnswers ? "Hide Answers" : "Reveal Answers"}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showAnswers && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 pt-2"
                            >
                                {review.questions.map((question) => {
                                    const statusClass = question.isCorrect
                                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                                        : question.isAnswered
                                            ? "bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/10 dark:border-rose-900/30"
                                            : "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/10 dark:border-amber-900/30"
                                            
                                    const StatusIcon = question.isCorrect ? CheckCircle : (question.isAnswered ? XCircle : MinusCircle)

                                    return (
                                        <article key={question.questionId} className={cn("rounded-2xl border p-5 transition-colors", statusClass)}>
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-slate-950 shadow-sm text-[10px] font-black">
                                                        {question.order}
                                                    </div>
                                                    <div className="space-y-3 flex-1">
                                                        <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                                                            {question.content}
                                                        </h3>
                                                        <div className="grid sm:grid-cols-2 gap-3">
                                                            <div className="bg-white/60 dark:bg-slate-950/40 p-2.5 rounded-lg border border-black/5 dark:border-white/5">
                                                                <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Your Answer</p>
                                                                <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                                                    {question.selectedAnswer || "Not answered"}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/60 dark:bg-slate-950/40 p-2.5 rounded-lg border border-black/5 dark:border-white/5">
                                                                <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Correct Answer</p>
                                                                <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-500">
                                                                    {question.correctAnswer || "Manual grading required"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                                                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg shadow-sm border border-black/5 dark:border-white/5 ml-auto sm:ml-0">
                                                        <StatusIcon className="h-4 w-4" />
                                                        <span className="text-xs font-bold capitalize">
                                                            {question.isCorrect ? "Correct" : question.isAnswered ? "Incorrect" : "Unanswered"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!showAnswers && (
                         <div className="py-8 flex flex-col items-center justify-center text-center opacity-70 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                             <EyeOff className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                             <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Answers are currently hidden.</p>
                             <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">Click "Reveal Answers" when you're ready to review what you got wrong.</p>
                         </div>
                    )}
                </motion.div>

                {/* Bottom Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview?type=${examType}&examId=${review.examId}`)}
                        className="col-span-2 lg:col-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg shadow-md shadow-indigo-600/20 transition-all active:scale-95 text-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        <span>Retake Exam</span>
                    </button>
                    
                    <button
                        onClick={() => router.push("/dashboard/results")}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm text-sm"
                    >
                        <List className="h-4 w-4 opacity-50" />
                        <span className="hidden sm:inline">All Results</span>
                        <span className="sm:hidden">Results</span>
                    </button>
                    
                    <button
                        onClick={() => router.push("/dashboard/analytics")}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm text-sm ml-auto"
                    >
                        <BarChart2 className="h-4 w-4 opacity-50" />
                        <span>Analytics</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

function StatCard({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-[20px] border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 hover:border-indigo-100 dark:hover:border-indigo-900/30">
            <div className={cn("h-10 w-10 shrink-0 flex items-center justify-center rounded-xl", colorClass)}>
                <Icon className="h-5 w-5 shrink-0" />
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{value}</span>
            </div>
        </div>
    )
}
