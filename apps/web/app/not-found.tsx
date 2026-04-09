"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Home, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Logo */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-1/2 -translate-x-1/2"
            >
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                        <Zap className="text-white h-6 w-6 fill-current" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase">
                        ExamMaster
                    </span>
                </Link>
            </motion.div>

            {/* Premium CSS/SVG Illustration */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative w-full max-w-[500px] h-64 lg:h-80 mb-12 flex items-center justify-center select-none"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full" />
                
                {/* Large 404 Text */}
                <h1 className="text-[140px] lg:text-[200px] font-black tracking-tighter leading-none italic">
                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 drop-shadow-2xl">
                        404
                    </span>
                </h1>

                {/* Floating Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, (i % 2 === 0 ? 20 : -20), 0],
                                rotate: [0, 180, 360],
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.4
                            }}
                            className="absolute bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg blur-[2px]"
                            style={{
                                width: Math.random() * 30 + 10,
                                height: Math.random() * 30 + 10,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                borderRadius: i % 3 === 0 ? '50%' : '20%'
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Text Content */}
            <div className="max-w-md space-y-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Oops! You&apos;re Off Course
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed px-4">
                        We couldn&apos;t find the assessment you were looking for. It might have been relocated or never existed.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                >
                    <button 
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>
                    <Link 
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95"
                    >
                        <Home className="h-5 w-5" />
                        To Dashboard
                    </Link>
                </motion.div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[150px]" />
                
                {/* Thin grid lines for a more "technical/assessment" feel */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
                     style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>
        </div>
    )
}
