"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
    Activity,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    LineChart,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react"

const statCards = [
    { label: "Papers Faced", value: 24, icon: BookOpen },
    { label: "Average Score", value: "82%", icon: BarChart3 },
    { label: "Streak", value: "12 days", icon: Activity },
    { label: "Time Spent", value: "36h", icon: Clock },
]

const paperPerformance = [
    { paper: "Physics Paper 1", date: "Feb 02", marks: 78 },
    { paper: "Chemistry MCQ", date: "Feb 05", marks: 85 },
    { paper: "Maths Paper 1", date: "Feb 08", marks: 92 },
    { paper: "Biology Theory", date: "Feb 10", marks: 74 },
    { paper: "Physics Paper 2", date: "Feb 12", marks: 81 },
    { paper: "Maths Paper 2", date: "Feb 14", marks: 88 },
    { paper: "Chemistry Theory", date: "Feb 16", marks: 79 },
    { paper: "Biology Practical", date: "Feb 18", marks: 90 },
    { paper: "Physics Revision", date: "Feb 20", marks: 84 },
]

const skillBreakdown = [
    { label: "Algebra", value: 86 },
    { label: "Physics", value: 79 },
    { label: "Chemistry", value: 73 },
    { label: "Essay Writing", value: 88 },
]

const upcomingSchedule = [
    { title: "Physics Mock", date: "Feb 24", duration: "90 mins", mode: "Timed" },
    { title: "Chemistry Drill", date: "Feb 26", duration: "60 mins", mode: "Practice" },
    { title: "Maths Speed Run", date: "Feb 28", duration: "45 mins", mode: "Rapid" },
]

const examCatalog = [
    { id: "phy-ol", title: "Physics O/L Paper", level: "O/L", seats: 120, tags: ["Timed", "Proctored"], nextWindow: "Feb 25" },
    { id: "chem-al", title: "Chemistry A/L Structured", level: "A/L", seats: 80, tags: ["Structured", "Essay"], nextWindow: "Feb 27" },
    { id: "math-speed", title: "Mathematics Speed Pack", level: "O/L", seats: 150, tags: ["Rapid", "MCQ"], nextWindow: "Mar 02" },
    { id: "bio-prac", title: "Biology Practical Prep", level: "A/L", seats: 60, tags: ["Lab", "Scenario"], nextWindow: "Mar 04" },
]

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<"analytics" | "exams">("analytics")
    const [enrollments, setEnrollments] = useState<Record<string, boolean>>({})

    const avgScore = useMemo(() => {
        const total = paperPerformance.reduce((sum, item) => sum + item.marks, 0)
        return Math.round(total / paperPerformance.length)
    }, [])

    const maxMarks = Math.max(...paperPerformance.map((p) => p.marks))
    const minMarks = Math.min(...paperPerformance.map((p) => p.marks))

    const handleEnroll = (id: string) => {
        setEnrollments((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            {/* Header Section */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="px-6 lg:px-20 py-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:text-indigo-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Student Portal
                            </div>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">
                                Performance Dashboard
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                                Monitor your progress, analyze performance trends, and enroll in upcoming assessments.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-indigo-700 dark:hover:bg-slate-800"
                        >
                            <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Integrity Protected</span>
                        </Link>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mt-6 flex w-full max-w-md gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
                        <button
                            type="button"
                            onClick={() => setActiveTab("analytics")}
                            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                                activeTab === "analytics"
                                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Analytics
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("exams")}
                            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                                activeTab === "exams"
                                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Eligible Exams
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-10 lg:px-20">
                {activeTab === "analytics" ? (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            {statCards.map((card) => (
                                <div
                                    key={card.label}
                                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                {card.label}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-bold">{card.value}</h3>
                                        </div>
                                        <div className="rounded-lg border border-indigo-200 p-2.5 text-indigo-600 dark:border-indigo-800 dark:text-indigo-400">
                                            <card.icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Grid */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Paper Performance Chart */}
                            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <div>
                                        <h3 className="text-lg font-bold">Paper Performance Trend</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Last {paperPerformance.length} assessments
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-semibold text-indigo-700 dark:border-indigo-800 dark:text-indigo-300">
                                        <LineChart className="h-4 w-4" />
                                        Avg {avgScore}%
                                    </div>
                                </div>

                                {/* Line Chart */}
                                <div className="mt-6 relative h-80">
                                    {/* Y-axis labels */}
                                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-medium text-slate-400 pr-2">
                                        <span>100</span>
                                        <span>75</span>
                                        <span>50</span>
                                        <span>25</span>
                                        <span>0</span>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="ml-8 h-full border-l border-b border-slate-200 dark:border-slate-700 relative">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div key={i} className="border-t border-slate-100 dark:border-slate-800/50" />
                                            ))}
                                        </div>

                                        {/* Average line */}
                                        <div
                                            className="absolute left-0 right-0 border-t-2 border-dashed border-indigo-300 dark:border-indigo-700"
                                            style={{ bottom: `${avgScore}%` }}
                                        >
                                            <span className="absolute -right-2 -top-2.5 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                Avg
                                            </span>
                                        </div>

                                        {/* Line and Points */}
                                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                                            {/* Line path */}
                                            <polyline
                                                points={paperPerformance
                                                    .map(
                                                        (item, i) =>
                                                            `${(i / (paperPerformance.length - 1)) * 100}%,${100 - item.marks}%`
                                                    )
                                                    .join(" ")}
                                                fill="none"
                                                stroke="rgb(99 102 241)"
                                                strokeWidth="2"
                                                className="dark:stroke-indigo-400"
                                            />

                                            {/* Data points */}
                                            {paperPerformance.map((item, i) => {
                                                const x = (i / (paperPerformance.length - 1)) * 100
                                                const y = 100 - item.marks
                                                return (
                                                    <g key={i}>
                                                        <circle
                                                            cx={`${x}%`}
                                                            cy={`${y}%`}
                                                            r="5"
                                                            fill="white"
                                                            stroke="rgb(99 102 241)"
                                                            strokeWidth="2.5"
                                                            className="cursor-pointer hover:r-6 dark:fill-slate-900 dark:stroke-indigo-400"
                                                        />
                                                    </g>
                                                )
                                            })}
                                        </svg>

                                        {/* Tooltips on hover */}
                                        <div className="absolute inset-0 flex items-end justify-between px-2">
                                            {paperPerformance.map((item, i) => (
                                                <div key={i} className="group/tooltip relative flex flex-col items-center" style={{ width: `${100 / paperPerformance.length}%` }}>
                                                    <div className="opacity-0 group-hover/tooltip:opacity-100 absolute bottom-full mb-2 w-32 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800 transition z-10 pointer-events-none">
                                                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.paper}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                                                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{item.marks}%</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* X-axis labels */}
                                    <div className="ml-8 mt-3 flex justify-between text-xs font-medium text-slate-400">
                                        <span>{paperPerformance[0]?.date}</span>
                                        <span>Recent</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="h-3 w-3 rounded-full border-2 border-indigo-500" />
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Performance</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="h-0.5 w-6 border-t-2 border-dashed border-indigo-400" />
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Average ({avgScore}%)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">Best: {maxMarks}%</span>
                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                        <span className="text-slate-500 dark:text-slate-400">Lowest: {minMarks}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Skill Breakdown */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-base font-bold">Subject Performance</h3>
                                    </div>
                                    <div className="mt-4 space-y-4">
                                        {skillBreakdown.map((skill) => (
                                            <div key={skill.label}>
                                                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                                    <span className="text-slate-700 dark:text-slate-300">{skill.label}</span>
                                                    <span className="text-slate-500 dark:text-slate-400">{skill.value}%</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full border-2 border-indigo-500 dark:border-indigo-400"
                                                        style={{ width: `${skill.value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Upcoming Schedule */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-base font-bold">Upcoming</h3>
                                    </div>
                                    <div className="mt-4 space-y-2.5">
                                        {upcomingSchedule.map((item) => (
                                            <div
                                                key={item.title}
                                                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                                                        {item.title}
                                                    </p>
                                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                                        {item.date}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.duration} • {item.mode}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {examCatalog.map((exam) => {
                            const isEnrolled = Boolean(enrollments[exam.id])
                            return (
                                <div
                                    key={exam.id}
                                    className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg border border-indigo-200 p-2.5 text-indigo-600 dark:border-indigo-800 dark:text-indigo-400">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                                                {exam.level}
                                            </p>
                                            <h3 className="mt-1 text-base font-bold leading-tight">{exam.title}</h3>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {exam.seats} seats available
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {exam.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                        <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                        Next: {exam.nextWindow}
                                    </div>

                                    <div className="mt-5 flex gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => handleEnroll(exam.id)}
                                            className={`flex-1 rounded-lg border px-4 py-2.5 text-xs font-bold transition ${
                                                isEnrolled
                                                    ? "border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                                                    : "border-indigo-500 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-1.5">
                                                {isEnrolled ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                ) : (
                                                    <PlayCircle className="h-3.5 w-3.5" />
                                                )}
                                                {isEnrolled ? "Enrolled" : "Enroll"}
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!isEnrolled}
                                            className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                                                isEnrolled
                                                    ? "border border-indigo-500 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                                                    : "border border-slate-200 text-slate-400 cursor-not-allowed dark:border-slate-800"
                                            }`}
                                        >
                                            Start Exam
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
