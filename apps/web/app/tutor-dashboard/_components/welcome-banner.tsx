"use client"

import { motion } from "framer-motion"
import { Sparkles, Trophy, BookOpen, Clock } from "lucide-react"

interface WelcomeBannerProps {
    name?: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    const hours = new Date().getHours()
    let greeting = "Good Morning"
    if (hours >= 12 && hours < 17) greeting = "Good Afternoon"
    if (hours >= 17) greeting = "Good Evening"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] p-8 md:p-12"
        >
            {/* Background with Glassmorphism and Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-600/90 dark:to-purple-900/90" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-64 w-64 text-white" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-wider"
                    >
                        <Sparkles className="h-3 w-3" />
                        Tutor Professional Dashboard
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        {greeting}, <br />
                        <span className="text-indigo-200">{name || "Professor"}!</span>
                    </h1>
                    
                    <p className="text-indigo-100/80 text-lg font-medium">
                        Your students have been active! There are <span className="text-white font-black underline decoration-indigo-400">12 new submissions</span> waiting for your review today.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 transition-all active:scale-95 text-sm">
                            Review Submissions
                        </button>
                        <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all active:scale-95 text-sm">
                            View Analytics
                        </button>
                    </div>
                </div>

                {/* Right Side Stats (Quick Peek) */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white flex flex-col gap-2 min-w-[140px]">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">94%</p>
                            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Pass Rate</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white flex flex-col gap-2 min-w-[140px]">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">1.2h</p>
                            <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Avg. Time</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
