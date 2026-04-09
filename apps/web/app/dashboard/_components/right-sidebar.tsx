"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, FileText, ChevronRight as ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { resultService, type AttemptListItem } from "@/lib/services/result.service"

export function RightSidebar() {
    const [attempts, setAttempts] = useState<AttemptListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return
                const data = await resultService.getMyAttempts(token)
                setAttempts(data)
            } catch (error) {
                console.error("Failed to load attempts in sidebar:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAttempts()
    }, [])

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Calendar math
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = new Date(year, month, 1).getDay()
    const startingDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1 // Shift so Monday is 0

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    const todayDate = new Date()
    const isCurrentMonth = todayDate.getFullYear() === year && todayDate.getMonth() === month

    // Gather dates user took an exam in rendering month
    const attemptDays = new Set(attempts
        .filter(a => {
            const d = new Date(a.completedAt)
            return d.getFullYear() === year && d.getMonth() === month
        })
        .map(a => new Date(a.completedAt).getDate())
    )

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col gap-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
            {/* Calendar */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Activity Calendar</h3>
                    <div className="flex gap-1">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 pb-2">
                     <p className="text-center text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">{monthNames[month]} {year}</p>
                     <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <span key={`header-${i}`} className="text-[10px] font-black text-slate-400">{day}</span>
                        ))}
                        
                        {[...Array(startingDay)].map((_, i) => (
                            <span key={`empty-${i}`} className="py-1.5" />
                        ))}
                        
                        {[...Array(daysInMonth)].map((_, i) => {
                            const dayNum = i + 1
                            const isToday = isCurrentMonth && dayNum === todayDate.getDate()
                            const hasAttempt = attemptDays.has(dayNum)

                            return (
                                <span key={dayNum} className={cn(
                                    "text-xs font-bold py-1.5 rounded-lg cursor-default transition-colors relative",
                                    isToday ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : 
                                    hasAttempt ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40" : 
                                    "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                                )}>
                                    {dayNum}
                                    {hasAttempt && !isToday && (
                                        <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-indigo-500 rounded-full" />
                                    )}
                                </span>
                            )
                        })}
                     </div>
                </div>
            </section>

            {/* Recent Exams */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Recent Exams</h3>
                </div>
                
                <div className="space-y-6">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                            <div className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                        </div>
                    ) : attempts.length === 0 ? (
                         <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                             <p className="text-xs font-semibold text-slate-500">No exams taken yet.</p>
                         </div>
                    ) : (
                        <div className="space-y-3">
                            {attempts.slice(0, 5).map(attempt => (
                                <TaskItem 
                                    key={attempt.id}
                                    icon={FileText} 
                                    iconColor={attempt.score >= attempt.exam.passingScore ? "bg-emerald-100 text-emerald-500" : "bg-red-100 text-red-500"} 
                                    title={attempt.exam.title} 
                                    subject={`Score: ${attempt.score}%`} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </aside>
    )
}

function TaskItem({ icon: Icon, iconColor, title, subject, active = false }: { icon: any, iconColor: string, title: string, subject: string, active?: boolean }) {
    return (
        <div className={cn(
            "group flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer",
            active ? "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
        )}>
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", iconColor)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{title}</h4>
                <p className="text-[10px] font-semibold text-slate-400 truncate">{subject}</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>
    )
}
