"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Mail, ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
        }, 2000)
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-transparent rounded-2xl shadow-2xl relative">
            {/* Left Column: Form/Success State */}
            <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-950 rounded-2xl md:rounded-r-none md:rounded-l-2xl z-20 relative border border-slate-200/60 dark:border-slate-800/60 md:border-r-0">
                <div className="w-full max-w-[360px] mx-auto space-y-5">
                    
                    {/* Inline Logo from Landing Page */}
                    <Link href="/" className="inline-flex items-center gap-2 group mb-2">
                        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 rounded-lg shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105 group-hover:rotate-6">
                            <Zap className="text-white h-4 w-4 fill-current" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            ExamMaster
                        </span>
                    </Link>

                    {isSubmitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="space-y-6 text-center"
                        >
                            <div className="flex justify-center mb-2">
                                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                                    Check your email
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pb-2 leading-relaxed">
                                    We have sent a password reset link to your email address.
                                </p>
                            </div>
                            
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-colors rounded-lg mb-2"
                            >
                                Try with another email
                            </Button>

                            {/* Dev Only: Simulate clicking email link */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
                                <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-semibold">Dev: Simulation</p>
                                <Link
                                    href="/reset-password"
                                    className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline font-medium"
                                >
                                    Click here to simulate email link
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-5"
                        >
                            {/* Header */}
                            <div className="space-y-1">
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
                                    Reset password
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Enter your email and we'll send you instructions.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Email<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            required
                                            className="pl-9 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500 transition-colors rounded-lg"
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5" 
                                        disabled={isLoading}
                                    >
                                        {isLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Send Reset Link
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-6 pb-2">
                        <Link href="/login" className="inline-flex items-center font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all tracking-wide">
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column: Visual/Image with Custom Borders */}
            <div className="hidden md:flex md:w-1/2 relative bg-slate-50 dark:bg-slate-900/50 pl-0 py-4 pr-4 rounded-r-2xl border-y border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                <div className="relative w-full h-full rounded-tl-[80px] rounded-br-[60px] rounded-tr-[24px] rounded-bl-[24px] overflow-hidden group shadow-inner bg-indigo-900">
                    <Image 
                        src="/auth_hero.png" 
                        alt="Student smiling" 
                        fill 
                        priority
                        className="object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-[1.5s]" 
                    />
                    
                    {/* Dark gradient overlay at the bottom for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 pointer-events-none">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl lg:text-4xl font-serif text-white mb-2 leading-tight drop-shadow-md"
                        >
                            Accelerate <span className="italic text-indigo-300 font-light">your potential</span> with ExamMaster
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-sm font-medium drop-shadow"
                        >
                            Join thousands of ambitious students testing their knowledge daily.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}
