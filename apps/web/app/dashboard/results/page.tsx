"use client"

import { useEffect, useState, useMemo } from "react"
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

function getExamTypeLabel(description: string | null) {
    if (!description) return 'General';
    const prefix = 'Exam Config: ';
    const idx = description.indexOf(prefix);
    if (idx === -1) return 'General';
    try {
        const meta = JSON.parse(description.slice(idx + prefix.length).trim());
        const cat = meta.examTypeCategory;
        if (cat === 'LESSON_WISE') return 'Lesson Wise';
        if (cat === 'PAST_PAPERS') return 'Past Papers';
        if (cat === 'LIVE') return 'Live';
        if (cat === 'RANDOM_NEW') return 'Random New';
        return 'General';
    } catch {
        return 'General';
    }
}

export default function ResultsPage() {
    const [attempts, setAttempts] = useState<AttemptListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("ALL")
    const router = useRouter()

    const examTypes = useMemo(() => {
        const types = new Set<string>()
        attempts.forEach(a => types.add(getExamTypeLabel(a.exam.description)))
        return Array.from(types).sort()
    }, [attempts])

    const filteredAttempts = useMemo(() => {
        return attempts.filter(attempt => {
            const matchesSearch = attempt.exam.title.toLowerCase().includes(searchQuery.toLowerCase())
            const attemptType = getExamTypeLabel(attempt.exam.description)
            const matchesType = filterType === "ALL" || attemptType === filterType
            return matchesSearch && matchesType
        })
    }, [attempts, searchQuery, filterType])

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by exam name..." 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="relative shrink-0">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="ALL">All Types</option>
                        {examTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Results Grid/List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-[32px]" />
                    ))}
                </div>
            ) : filteredAttempts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAttempts.map((attempt, index) => (
                        <ResultCard key={attempt.id} attempt={attempt} index={index} router={router} />
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

function ResultCard({ attempt, index, router }: { attempt: AttemptListItem; index: number; router: ReturnType<typeof useRouter> }) {
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {dateStr}
                    </div>
                    {attempt.exam.description && (
                        <div className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black rounded-md uppercase tracking-wider">
                            {getExamTypeLabel(attempt.exam.description)}
                        </div>
                    )}
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
                    onClick={() => router.push(`/dashboard/subjects/all/exam-result?attemptId=${attempt.id}&examId=${attempt.examId}`)}
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
