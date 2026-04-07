"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp } from "lucide-react"

interface WelcomeBannerProps {
    name?: string;
    progress?: number;
}

export function WelcomeBanner({ name, progress = 85 }: WelcomeBannerProps) {
    const today = new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    }).format(new Date())

    const firstName = name ? name.split(' ')[0] : "Student"

    return (
        <div className="relative overflow-hidden rounded-[24px] bg-indigo-600 dark:bg-indigo-900/40 p-6 lg:p-8 shadow-sm">
            {/* Background decorative fields */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-900/50 dark:via-violet-900/50 dark:to-purple-900/50 opacity-90" />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col">
                <div className="space-y-2 max-w-xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4 text-indigo-200" />
                        <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest">
                            {today}
                        </p>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl lg:text-3xl font-black text-white leading-tight"
                    >
                        Welcome back, {firstName}!
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-indigo-100 font-medium text-sm pt-1 leading-relaxed"
                    >
                        Keep up the great work and reach new heights.
                    </motion.p>
                </div>
            </div>
        </div>
    )
}
