"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Clock, FileCheck, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
    isLive?: boolean
    startsAt?: string
    endsAt?: string
}

export function ExamFeedCard({ id, title, subject, subjectId, typeSlug, questions, duration, createdAt, color, isLive, startsAt, endsAt }: ExamFeedCardProps) {
    const router = useRouter()
    const [countdown, setCountdown] = useState<{ message: string, time: string, isActive: boolean, isEnded: boolean } | null>(null)
    
    const examDate = new Date(createdAt)
    const isNew = (new Date().getTime() - examDate.getTime()) < 7 * 24 * 60 * 60 * 1000

    useEffect(() => {
        if (!isLive || !startsAt || !endsAt) {
            setCountdown(null);
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const start = new Date(startsAt);
            const end = new Date(endsAt);

            if (now < start) {
                const diff = (start.getTime() - now.getTime()) / 1000;
                const hours = Math.floor(diff / 3600);
                const mins = Math.floor((diff % 3600) / 60);
                const secs = Math.floor((diff % 60));
                setCountdown({ message: "Starts in", time: `${hours}h ${mins}m ${secs}s`, isActive: false, isEnded: false });
            } else if (now > end) {
                setCountdown({ message: "Ended", time: "-", isActive: false, isEnded: true });
            } else {
                const diff = (end.getTime() - now.getTime()) / 1000;
                const hours = Math.floor(diff / 3600);
                const mins = Math.floor((diff % 3600) / 60);
                const secs = Math.floor((diff % 60));
                setCountdown({ message: "Ends in", time: `${hours}h ${mins}m ${secs}s`, isActive: true, isEnded: false });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isLive, startsAt, endsAt]);

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
                
                {countdown && (
                    <div className={cn("absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border", countdown.isActive ? "border-emerald-500/30" : (countdown.isEnded ? "border-slate-500/30" : "border-amber-500/30"))}>
                        <div className={cn("text-[9px] font-black uppercase tracking-widest", countdown.isActive ? "text-emerald-600" : (countdown.isEnded ? "text-slate-500" : "text-amber-600"))}>
                            {countdown.message}
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-900">
                            {countdown.time}
                        </div>
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
