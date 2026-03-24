"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

function LoadingSequence() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Look for the '?to=' parameter, default to dashboard
        const destination = searchParams.get("to") || "/dashboard"
        
        // Wait 2 seconds for the animation to play before navigating
        const timer = setTimeout(() => {
            router.replace(destination)
        }, 2000)

        return () => clearTimeout(timer)
    }, [router, searchParams])

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 flex border-[8px] bg-white dark:bg-slate-900 border-indigo-50 dark:border-indigo-900/20 p-8 rounded-full shadow-2xl shadow-indigo-500/20 items-center justify-center flex-col"
            >
                {/* Educational Animation: Floating Book */}
                <motion.div
                    animate={{ 
                        y: [-10, 10, -10],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="relative"
                >
                    <BookOpen className="w-16 h-16 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                    
                    {/* Sparkles around the book */}
                    <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: [0, -20] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                        className="absolute -top-2 -right-2 w-2 h-2 bg-purple-400 rounded-full blur-[1px]" 
                    />
                    <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: [0, -15] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                        className="absolute top-4 -left-3 w-1.5 h-1.5 bg-pink-400 rounded-full blur-[1px]" 
                    />
                </motion.div>
                
                {/* Minimal loading indicator ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-indigo-500"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </svg>
            </motion.div>
        </div>
    )
}

// Wrap in Suspense because we use useSearchParams() which can trigger deopts in Next.js
export default function LoadingPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-slate-50 dark:bg-slate-950" />}>
            <LoadingSequence />
        </Suspense>
    )
}
