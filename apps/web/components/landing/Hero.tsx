"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Play, CheckCircle2 } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
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
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="flex-1 text-left max-w-2xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-8 shadow-sm"
                        >
                            <Sparkles className="h-4 w-4" />
                            Proudly Made in Sri Lanka 🇱🇰
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                                Master Your Exams
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                with Confidence
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            The ultimate trilingual platform for Sri Lankan O/L and A/L students.
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold"> Secure, real-time assessments </span>
                            powered by advanced integrity protection.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link
                                href="/register"
                                className="group relative h-14 px-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <Play className="h-5 w-5 fill-current" />
                                Try Demo Exam
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                            </Link>
                            <button className="h-14 px-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                                🌐 Trilingual Support
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
                                    10k+
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Joined by <span className="text-indigo-600 dark:text-indigo-400 font-bold">10,000+</span> ambitious students
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-200/50 dark:border-slate-800/50 p-2 bg-white/10 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-10" />
                            <Image
                                src="/mockup1.png"
                                alt="ExamMaster Dashboard Mockup"
                                fill
                                className="object-cover rounded-2xl"
                                priority
                            />
                        </div>
                        
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pass Rate</div>
                                <div className="text-xl font-black dark:text-white">98.2%</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Questions</div>
                                <div className="text-xl font-black dark:text-white">50,000+</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
