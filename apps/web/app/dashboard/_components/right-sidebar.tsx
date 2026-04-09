import { ChevronLeft, ChevronRight, Mic, FileText, Clock, ChevronRight as ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function RightSidebar() {
    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col gap-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
            {/* Schedule / Calendar Placeholder */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">My Schedule</h3>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 pb-2">
                     <p className="text-center text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">December 2024</p>
                     <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                            <span key={day} className="text-[10px] font-black text-slate-400">{day}</span>
                        ))}
                        {[...Array(31)].map((_, i) => (
                            <span key={i} className={cn(
                                "text-xs font-bold py-1.5 rounded-lg cursor-pointer transition-colors",
                                i === 10 ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : 
                                i === 15 || i === 18 ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40" : 
                                "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            )}>
                                {i + 1}
                            </span>
                        ))}
                     </div>
                </div>
            </section>

            {/* Upcoming Tasks */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Upcoming Tasks</h3>
                    <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">See All</button>
                </div>
                
                <div className="space-y-6">
                    {/* Today */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Today</p>
                        <TaskItem 
                            icon={Mic} 
                            iconColor="bg-pink-100 text-pink-500" 
                            title="Demo Speech" 
                            subject="Mass Communication" 
                        />
                        <TaskItem 
                            icon={FileText} 
                            iconColor="bg-orange-100 text-orange-500" 
                            title="Globalization Essay" 
                            subject="Advanced Geography" 
                        />
                    </div>

                    {/* This Week */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">This Week</p>
                        <TaskItem 
                            icon={Clock} 
                            iconColor="bg-purple-100 text-purple-600" 
                            title="Management Quiz" 
                            subject="Product Management" 
                            active
                        />
                        <TaskItem 
                            icon={FileText} 
                            iconColor="bg-yellow-100 text-yellow-600" 
                            title="Docu Reaction Paper" 
                            subject="Advance Geography" 
                        />
                    </div>
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
