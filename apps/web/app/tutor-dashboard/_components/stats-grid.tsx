"use client"

import { motion } from "framer-motion"
import { Users, ClipboardList, Star, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
    {
        name: "Total Students",
        value: "2,543",
        change: "+12.5%",
        trend: "up",
        icon: Users,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        name: "Active Exams",
        value: "14",
        change: "+2",
        trend: "up",
        icon: ClipboardList,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
        name: "Average Rating",
        value: "4.8",
        change: "+0.2",
        trend: "up",
        icon: Star,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        name: "Monthly Earnings",
        value: "$12,450",
        change: "-3.1%",
        trend: "down",
        icon: TrendingUp,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
]

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            stat.trend === "up" 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
                                : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                        )}>
                            {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {stat.change}
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                            {stat.name}
                        </p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {stat.value}
                        </h3>
                    </div>

                    <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={cn("h-full rounded-full bg-gradient-to-r", 
                                stat.name === "Total Students" ? "from-blue-500 text-blue-600" :
                                stat.name === "Active Exams" ? "from-indigo-500 text-indigo-600" :
                                stat.name === "Average Rating" ? "from-amber-500 text-amber-600" :
                                "from-emerald-500 text-emerald-600"
                            )}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
