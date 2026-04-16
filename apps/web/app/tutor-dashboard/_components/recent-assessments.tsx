"use client"

import { motion } from "framer-motion"
import { MoreVertical, Users, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const assessments = [
    {
        id: "1",
        title: "Combined Mathematics - Pure Maths Unit 1",
        subject: "Mathematics",
        students: 245,
        status: "Active",
        deadline: "2024-04-20",
        avgScore: "78%",
        type: "MCQ",
    },
    {
        id: "2",
        title: "Advanced Level Physics - Mechanics Phase 1",
        subject: "Physics",
        students: 180,
        status: "Draft",
        deadline: "2024-04-25",
        avgScore: "N/A",
        type: "Structured",
    },
    {
        id: "3",
        title: "Biology - Genetic Engineering & Bio-Tech",
        subject: "Biology",
        students: 312,
        status: "Completed",
        deadline: "2024-04-10",
        avgScore: "82%",
        type: "Mixed",
    },
]

export function RecentAssessments() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Assessments</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage and monitor your current exams</p>
                </div>
                <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All Assessments
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {assessments.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-xl hover:shadow-indigo-500/5"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                                    item.subject === "Mathematics" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" :
                                    item.subject === "Physics" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30" :
                                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30"
                                )}>
                                    <ClipboardList className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            item.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                                            item.status === "Draft" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                                            "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        )}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4" />
                                            {item.students} Students
                                        </span>
                                        <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Deadline: {item.deadline}
                                        </span>
                                        <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            Type: {item.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                                <div className="text-center lg:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg. Performance</p>
                                    <p className={cn(
                                        "text-xl font-black",
                                        item.avgScore === "N/A" ? "text-slate-400" : "text-indigo-600 dark:text-indigo-400"
                                    )}>
                                        {item.avgScore}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all text-sm shadow-lg shadow-black/10">
                                        View Details
                                    </button>
                                    <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function ClipboardList(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </svg>
    )
}
