"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Lock, ArrowRight, CheckCircle2, ArrowLeft, Zap, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
            imageSrc="/set_new_password_hero.png"
            imageAlt="Secure key illustration"
            headline={<>Update <span className="italic text-indigo-300 font-light">your keys</span> to your workspace</>}
            description="Establish a new, iron-clad password to keep your dashboard and data protected."
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
                                    Password reset
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pb-4 leading-relaxed">
                                    Your password has been successfully reset.
                                </p>
                            </div>
                            
                            <Button
                                asChild
                                className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <Link href="/login">
                                    Sign in with new password
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
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
                                    Set new password
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Must be at least 8 characters.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        New Password<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            required
                                            minLength={8}
                                            className="pl-9 pr-10 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500 transition-colors rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-500 transition-colors outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Confirm Password<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            required
                                            minLength={8}
                                            className="pl-9 pr-10 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500 transition-colors rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-slate-400 hover:text-indigo-500 transition-colors outline-none"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
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
                                        Reset Password
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
