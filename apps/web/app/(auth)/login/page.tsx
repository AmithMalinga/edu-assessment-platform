"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Zap, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { studentService } from "@/lib/services/student.service"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const validate = () => {
        const errors: { [key: string]: string } = {}
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required."
        if (!password || password.length < 6) errors.password = "Password must be at least 6 characters."
        return errors
    }

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError("")
        setSuccess("")
        const errors = validate()
        setValidationErrors(errors)
        if (Object.keys(errors).length > 0) return

        setIsLoading(true)
        try {
            const res = await studentService.login({ email, password })
            if (res.access_token || res.success) {
                setSuccess("Login successful!")
                setTimeout(() => {
                    router.push("/loading?to=/dashboard")
                }, 800)
            } else {
                const errorMessage = Array.isArray(res.message) ? res.message[0] : res.message;
                setError(errorMessage || "Login failed.")
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-transparent rounded-2xl shadow-2xl relative">
            {/* Left Column: Form */}
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

                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
                            Sign in
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Welcome back to your educational journey.
                        </p>
                    </div>

                    {/* OAuth Providers */}
                    <div className="space-y-2.5">
                        <Button 
                            variant="outline" 
                            type="button"
                            className="w-full h-10 border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-colors rounded-lg" 
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Sign in with Google
                        </Button>
                    </div>

                    <div className="relative py-1 border-t-0">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="dark:bg-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 cursor-default">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Email<span className="text-indigo-500">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className={`pl-9 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500'} rounded-lg`}
                                />
                            </div>
                            {validationErrors.email && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.email}</div>}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Password<span className="text-indigo-500">*</span>
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={`pl-9 pr-10 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500'} rounded-lg`}
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
                            {validationErrors.password && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.password}</div>}
                        </div>

                        {error && <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</motion.div>}
                        {success && <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">{success}</motion.div>}
                        
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5" 
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-4 pb-2">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
                            Sign up
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
                        sizes="50vw"
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
