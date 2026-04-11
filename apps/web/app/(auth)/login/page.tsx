"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { studentService } from "@/lib/services/student.service"
import { isValidEmail } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

export default function LoginPage() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured")
    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const validate = () => {
        const errors: { [key: string]: string } = {}
        if (!isValidEmail(email)) errors.email = "Valid email is required."
        if (!password || password.length < 8) errors.password = "Password must be at least 8 characters."
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
            localStorage.setItem("token", res.access_token)
            localStorage.setItem("currentUser", JSON.stringify(res.user))

            setSuccess("Login successful!")
            setTimeout(() => {
                router.push("/loading?to=/dashboard")
            }, 800)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        window.location.href = `${apiUrl}/auth/google`
    }

    return (
        <AuthSplitLayout
            imageSrc="/auth_hero.png"
            imageAlt="Student smiling"
            headline={<>Accelerate <span className="italic text-indigo-300 font-light">your potential</span> with ExamMaster</>}
            description="Join thousands of ambitious students testing their knowledge daily."
        >
            <div className="space-y-5">
                <div className="space-y-1">
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
                        Sign in
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Welcome back to your educational journey.
                    </p>
                </div>

                <div className="space-y-2.5">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleSignIn}
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
                        <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 cursor-default">OR</span>
                    </div>
                </div>

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
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className={`pl-9 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500"} rounded-lg`}
                            />
                        </div>
                        {validationErrors.email && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.email}</div>}
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Password<span className="text-indigo-500">*</span>
                            </Label>
                            <Link href="/forgot-password" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
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
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className={`pl-9 pr-10 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500"} rounded-lg`}
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

                    {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</motion.div>}
                    {success && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">{success}</motion.div>}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        </AuthSplitLayout>
    )
}
