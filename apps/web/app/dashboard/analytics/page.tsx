"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
    Activity, 
    BarChart3, 
    TrendingUp, 
    Trophy, 
    Clock, 
    Star,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resultService, type StudentAnalytics } from "@/lib/services/result.service"

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }
                const data = await resultService.getMyAnalytics(token)
                setAnalytics(data)
            } catch (error) {
                console.error("Failed to load analytics:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [router])

    if (loading) return (
        <div className="p-8 lg:p-10 space-y-10 animate-pulse">
            <div className="h-20 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-900 rounded-[32px]" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[40px]" />
                <div className="h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[40px]" />
            </div>
        </div>
    )

    if (!analytics || analytics.overview.totalAttempts === 0) return (
         <div className="p-6 lg:p-8 min-h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
                <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">No Analytics Yet</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                    Once you complete your first exam, we&apos;ll start generating detailed insights into your academic performance and progress.
                </p>
                <button 
                    onClick={() => router.push('/dashboard/subjects')}
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                    Start Your First Exam
                </button>
            </div>
         </div>
    )

    return (
        <div className="p-6 lg:p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">Deep dive into your exam statistics and progress trends.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[14px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <button className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs">Overall</button>
                    <button className="px-4 py-1.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl text-xs">Monthly</button>
                    <button className="px-4 py-1.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl text-xs">Weekly</button>
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Exams Taken" 
                    value={analytics.overview.totalAttempts.toString()} 
                    icon={Activity} 
                    color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500" 
                    sub="Past 30 days: +2"
                />
                <StatCard 
                    title="Average Score" 
                    value={`${Math.round(analytics.overview.averageScore)}%`} 
                    icon={TrendingUp} 
                    color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" 
                    sub="Performance: High"
                />
                <StatCard 
                    title="Pass Rate" 
                    value={`${Math.round(analytics.overview.passRate)}%`} 
                    icon={Trophy} 
                    color="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500" 
                    sub="Stable progress"
                />
                <StatCard 
                    title="Avg Time" 
                    value={`${Math.round(analytics.overview.averageTimeTaken / 60)}m`} 
                    icon={Clock} 
                    color="bg-pink-50 dark:bg-pink-900/20 text-pink-500" 
                    sub="Consistent pace"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Score Performance Trend</h3>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Progress over last few attempts</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-sm">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                                <span>+12%</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400">Since last month</span>
                        </div>
                    </div>
                    
                    {/* Dynamic Trend Chart (Using SVG for Line Trend) */}
                    <div className="relative h-64 w-full group">
                        <ChartBackground />
                        {analytics.scoreTrend.length > 1 && (
                            <ScoreLineChart data={analytics.scoreTrend} />
                        )}
                    </div>

                    <div className="flex justify-between px-4">
                        {analytics.scoreTrend.slice(-5).map((item, i) => (
                             <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {new Date(item.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                             </span>
                        ))}
                    </div>
                </div>

                {/* Best Performing Subject Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[24px] shadow-2xl shadow-indigo-500/30 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Star className="h-28 w-28 fill-current" />
                    </div>
                    <div className="space-y-5 relative z-10">
                        <div className="h-12 w-12 bg-white/20 rounded-[14px] flex items-center justify-center backdrop-blur-md">
                            <Star className="h-6 w-6 text-white fill-current" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-[11px] font-bold text-indigo-100 uppercase tracking-widest">Top Performance</h3>
                            <p className="text-2xl font-black leading-tight">
                                {analytics.bySubject[0]?.subject || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-3 pb-2">
                            <div className="flex items-center justify-between text-[11px] font-bold border-b border-white/10 pb-3">
                                <span className="text-indigo-100">Average Score</span>
                                <span>{Math.round(analytics.bySubject[0]?.averageScore || 0)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold border-b border-white/10 pb-3">
                                <span className="text-indigo-100">Attempts Made</span>
                                <span>{analytics.bySubject[0]?.attempts || 0} Attempts</span>
                            </div>
                        </div>
                    </div>
                    <button className="relative z-10 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-black text-xs transition-all group/btn flex items-center justify-center gap-2">
                        View Detailed Insights
                        <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Lower Row - Subject Breakdown & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Subject Breakdown</h3>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Your performance across different disciplines</p>
                    </div>

                    <div className="space-y-5">
                        {analytics.bySubject.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{item.subject}</span>
                                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{Math.round(item.averageScore)}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-[1px]">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.averageScore}%` }}
                                        transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                                        className={cn(
                                            "h-full rounded-full shadow-sm shadow-indigo-500/20",
                                            item.averageScore >= 75 ? "bg-emerald-400" : item.averageScore >= 50 ? "bg-indigo-400" : "bg-pink-400"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Mini List */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Recent Performance</h3>
                        <button 
                            onClick={() => router.push('/dashboard/results')}
                            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase hover:underline"
                        >
                            View Results Log
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        {analytics.recentAttempts.slice(0, 4).map((attempt, i) => (
                            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 group hover:scale-[1.01] transition-transform cursor-pointer border border-transparent dark:hover:border-slate-700 hover:border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                                        attempt.passed ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-pink-50 text-pink-500 dark:bg-pink-900/20 dark:text-pink-400"
                                    )}>
                                        {attempt.passed ? <Zap className="h-4 w-4 fill-current" /> : <Activity className="h-4 w-4" />}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[160px]">{attempt.examTitle}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{attempt.subjectName} • {new Date(attempt.completedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "text-sm font-black",
                                        attempt.passed ? "text-emerald-500 dark:text-emerald-400" : "text-pink-500 dark:text-pink-400"
                                    )}>{attempt.score}%</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Final Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon: Icon, color, sub }: { title: string; value: string; icon: any; color: string; sub: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all group">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="space-y-0.5">
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 tracking-tight">{sub}</p>
            </div>
        </div>
    )
}

function ChartBackground() {
    return (
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="border border-slate-900 dark:border-white" />
            ))}
        </div>
    )
}

function ScoreLineChart({ data }: { data: any[] }) {
    // Basic SVG Line Chart logic
    const scores = data.slice(-5).map(d => d.score)
    const maxScore = 100
    const padding = 20
    const width = 600 // We'll use viewbox for responsiveness
    const height = 240
    
    const points = scores.map((score, i) => {
        const x = (i / (scores.length - 1)) * (width - (padding * 2)) + padding
        const y = height - ((score / maxScore) * (height - (padding * 2)) + padding)
        return `${x},${y}`
    }).join(' ')

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-2xl overflow-visible">
            {/* Area under the line */}
            <motion.path 
                initial={{ opacity: 0, d: `M ${points} L ${width - padding},${height} L ${padding},${height} Z` }}
                animate={{ opacity: 0.1, d: `M ${points} L ${width - padding},${height} L ${padding},${height} Z` }}
                fill="url(#gradient)"
                className="text-indigo-600 fill-current"
            />
            {/* The actual line */}
            <motion.polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600 dark:text-indigo-500"
                points={points}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Dots */}
            {scores.map((score, i) => {
                const x = (i / (scores.length - 1)) * (width - (padding * 2)) + padding
                const y = height - ((score / maxScore) * (height - (padding * 2)) + padding)
                return (
                    <motion.circle 
                        key={i}
                        initial={{ r: 0 }}
                        animate={{ r: 6 }}
                        transition={{ delay: 1.5 + (i * 0.1) }}
                        cx={x} 
                        cy={y} 
                        className="fill-white dark:fill-slate-900 stroke-indigo-600 dark:stroke-indigo-400 stroke-[4px]"
                    />
                )
            })}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}
