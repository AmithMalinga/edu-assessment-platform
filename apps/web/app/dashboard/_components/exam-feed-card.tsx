"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Clock, FileCheck, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamFeedCardProps {
    id: string
    title: string
    subject: string
    subjectId: string
    typeSlug: string
    questions: number
    duration: number
    createdAt: string
    color: string
}

export function ExamFeedCard({ id, title, subject, subjectId, typeSlug, questions, duration, createdAt, color }: ExamFeedCardProps) {
    const router = useRouter()
    
    const examDate = new Date(createdAt)
    const isNew = (new Date().getTime() - examDate.getTime()) < 7 * 24 * 60 * 60 * 1000

    return (
        <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview?examId=${id}&type=${typeSlug}`)}
            className="w-full bg-white dark:bg-slate-900 rounded-[28px] p-4 shadow-sm border border-slate-100 dark:border-slate-800 group cursor-pointer active:scale-[0.98] transition-all"
        >
            <div className={cn(
                "h-32 rounded-[20px] mb-4 relative overflow-hidden flex flex-col justify-end p-4 bg-gradient-to-br",
                color
            )}>
                {/* Patterns */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '16px 16px' }} />
                
                {isNew && (
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-tighter">
                        New Exam
                    </div>
                )}
                
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{subject}</p>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight truncate px-1">
                    {title}
                </h4>

                <div className="flex items-center gap-4 px-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <FileCheck className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold">{questions} Qs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold">{duration}m</span>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between group-hover:px-1 transition-all">
                    <span className="text-[10px] font-bold text-slate-400">
                        Added {examDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
