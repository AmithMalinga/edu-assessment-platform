"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

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
        <AuthSplitLayout
            imageSrc="/auth_hero.png"
            imageAlt="Student smiling"
            headline={<>Accelerate <span className="italic text-indigo-300 font-light">your potential</span> with ExamMaster</>}
            description="Join thousands of ambitious students testing their knowledge daily."
        >
            <div className="w-full max-w-[360px] mx-auto space-y-5">
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
        </AuthSplitLayout>
    )
}
