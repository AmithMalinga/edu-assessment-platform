"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Play } from "lucide-react"

export function Hero() {
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950" />

            {/* Animated Mesh Gradient */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
                <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed" />
                <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-slow" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-8"
                    >
                        <Sparkles className="h-4 w-4" />
                        Proudly Made in Sri Lanka 🇱🇰
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
                    >
                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                            Master Your Exams
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                            with Confidence
                        </span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto"
                    >
                        The ultimate trilingual platform for Sri Lankan O/L and A/L students.
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium"> Secure, real-time assessments </span>
                        powered by advanced integrity protection.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link
                            href="/register"
                            className="group relative h-14 px-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            Try Demo Exam
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <button className="h-14 px-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                            🌐 View Trilingual Support
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>10,000+ Active Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span>100+ Schools</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>98% Pass Rate</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
