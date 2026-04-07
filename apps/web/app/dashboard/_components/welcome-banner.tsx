"use client"

import { motion } from "framer-motion"
import Image from "next/image"

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
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 p-8 lg:p-10 shadow-xl shadow-indigo-500/20">
            {/* Background decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl text-center md:text-left">
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-indigo-100 font-bold text-sm lg:text-base tracking-wide"
                    >
                        {today}
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl lg:text-5xl font-black text-white leading-tight"
                    >
                        Welcome back, {firstName}!
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-indigo-50 font-medium text-sm lg:text-base opacity-90"
                    >
                        You&apos;ve finished <span className="font-black text-white">{progress}%</span> of your weekly goal!<br/>
                        Keep up the great work and reach new heights.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="relative w-48 h-48 lg:w-56 lg:h-56 shrink-0 drop-shadow-2xl"
                >
                    <Image 
                        src="/dashboard/welcome.png" 
                        alt="Education" 
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>
            </div>
        </div>
    )
}
