"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
    Search, 
    Calendar, 
    Clock, 
    Trophy, 
    ChevronRight, 
    ArrowUpRight,
    Filter,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resultService, type AttemptListItem } from "@/lib/services/result.service"

export default function ResultsPage() {
    const [attempts, setAttempts] = useState<AttemptListItem[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }
                const data = await resultService.getMyAttempts(token)
                setAttempts(data)
            } catch (error) {
                console.error("Failed to load results:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [router])

    return (
        <div className="p-8 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Exam Results</h1>
                <p className="text-slate-500 font-medium">Track your performance and review past attempts.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by exam name..." 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            {/* Results Grid/List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-[32px]" />
                    ))}
                </div>
            ) : attempts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {attempts.map((attempt, index) => (
                        <ResultCard key={attempt.id} attempt={attempt} index={index} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No exam results yet</h3>
                    <p className="text-slate-500 max-w-sm mb-8">You haven&apos;t completed any exams. Take your first exam to see your results and analytics here!</p>
                    <button 
                        onClick={() => router.push('/dashboard/subjects')}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        Go to Subjects
                    </button>
                </div>
            )}
        </div>
    )
}

function ResultCard({ attempt, index }: { attempt: AttemptListItem; index: number }) {
    const isPassed = attempt.score >= (attempt.exam.passingScore || 50)
    const dateStr = new Date(attempt.completedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    })
    const timeTakenMin = Math.floor(attempt.timeTaken / 60)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
        >
            {/* Status Icon */}
            <div className={cn(
                "absolute top-6 right-6 h-10 w-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                isPassed ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20" : "bg-pink-50 text-pink-500 dark:bg-pink-900/20"
            )}>
                {isPassed ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            </div>

            <div className="space-y-4">
                {/* Result Type/Date */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    {dateStr}
                </div>

                {/* Exam Title */}
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {attempt.exam.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                        Exam Attempt #{attempt.id.slice(-4).toUpperCase()}
                    </p>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-800/50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Your Score</p>
                        <div className="flex items-baseline gap-1">
                            <span className={cn(
                                "text-2xl font-black",
                                isPassed ? "text-emerald-500" : "text-pink-500"
                            )}>
                                {attempt.score}%
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1 pl-4 border-l border-slate-50 dark:border-slate-800/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Time Taken</p>
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-lg font-bold">{timeTakenMin}m</span>
                        </div>
                    </div>
                </div>

                {/* Action */}
                <button 
                    onClick={() => {}} // TODO: Navigate to review
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group/btn"
                >
                    Review Detailed Result
                    <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover/btn:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5 text-indigo-500" />
                    </div>
                </button>
            </div>
        </motion.div>
    )
}
