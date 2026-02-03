"use client"
import { motion } from "framer-motion"
import { Zap, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export default function ComingSoonPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const textVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    }

    const letterVariants = {
        hidden: { opacity: 0, y: 50, rotateX: -90 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    const text = "Coming Soon"

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 p-4 sm:p-6 md:p-8"
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-xl">
                        <Zap className="text-white h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                    </div>
                    <span className="font-bold text-lg sm:text-xl text-slate-800">ExamMaster</span>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 py-8 sm:py-12">
                <div className="text-center max-w-2xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6 sm:mb-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Clock className="h-4 w-4 text-indigo-600" />
                        </motion.div>
                        <span className="text-xs sm:text-sm font-semibold text-indigo-600">Under Development</span>
                    </motion.div>

                    {/* Main Heading - Letter by Letter Animation */}
                    <motion.h1
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight flex justify-center flex-wrap"
                    >
                        {text.split("").map((char, i) => (
                            <motion.span
                                key={i}
                                variants={letterVariants}
                                className={`inline-block text-slate-800 ${char === " " ? "w-3 sm:w-4 md:w-6" : ""}`}
                                whileHover={{
                                    scale: 1.2,
                                    color: "#6366f1",
                                    rotate: [0, -10, 10, 0],
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-base sm:text-lg text-slate-500 mb-8 sm:mb-10 px-2"
                    >
                        We're building the ultimate exam platform for Sri Lankan students.
                        Get ready for an amazing experience!
                    </motion.p>

                    {/* Animated Circles */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="flex justify-center gap-3"
                    >
                        {[
                            { color: "bg-indigo-500", delay: 0 },
                            { color: "bg-purple-500", delay: 0.2 },
                            { color: "bg-pink-500", delay: 0.4 }
                        ].map((circle, i) => (
                            <motion.div
                                key={i}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${circle.color}`}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                    scale: [0.8, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: circle.delay,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="relative z-10 p-4 sm:p-6 text-center text-slate-400 text-xs sm:text-sm"
            >
                © 2026 ExamMaster. All rights reserved.
            </motion.footer>
        </div>
    )
}
