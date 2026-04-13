"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Eye, EyeOff, User, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { studentService } from "@/lib/services/student.service"
import { isValidEmail } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

type UserRole = "STUDENT" | "TUTOR"

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured")
    }

    const [role, setRole] = useState<UserRole>("STUDENT")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        const queryRole = searchParams.get("role")?.toUpperCase()
        if (queryRole === "TUTOR" || queryRole === "STUDENT") {
            setRole(queryRole as UserRole)
        }
    }, [searchParams])

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

            // Role verification
            if (role === "STUDENT" && res.user.role === "TUTOR") {
                setError("Tutor account detected. Please switch to the Tutor tab.")
                return
            }
            if (role === "TUTOR" && res.user.role !== "TUTOR") {
                setError("Only authorized tutor accounts can sign in here.")
                return
            }

            localStorage.setItem("token", res.access_token)
            localStorage.setItem("currentUser", JSON.stringify(res.user))

            if (res.user.role === "TUTOR" && res.user.requiresPasswordChange) {
                setSuccess("First login detected. Redirecting to password change...")
                setTimeout(() => {
                    router.push("/auth/change-password")
                }, 800)
                return
            }

            setSuccess("Login successful!")
            const destination = role === "TUTOR" ? "/tutor-dashboard" : "/dashboard"
            setTimeout(() => {
                router.push(`/loading?to=${destination}`)
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

    const roles: { id: UserRole; label: string; icon: any }[] = [
        { id: "STUDENT", label: "Student", icon: User },
        { id: "TUTOR", label: "Tutor", icon: GraduationCap },
    ]

    return (
        <AuthSplitLayout
            imageSrc={role === "STUDENT" ? "/auth_hero.png" : "/tutor_login_hero.png"}
            imageAlt={role === "STUDENT" ? "Student smiling" : "Professional tutor workspace"}
            headline={
                role === "STUDENT" ? (
                    <>Accelerate <span className="italic text-indigo-300 font-light">your potential</span> with ExamMaster</>
                ) : (
                    <>Elevate <span className="italic text-indigo-300 font-light">your teaching</span> with ExamMaster</>
                )
            }
            description={
                role === "STUDENT" 
                    ? "Join thousands of ambitious students testing their knowledge daily."
                    : "Access your professional dashboard to manage assessments and track progress."
            }
        >
            <div className="space-y-5">
                {/* Role Switcher */}
                <div className="flex justify-center p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                                setRole(r.id)
                                setError("")
                                setValidationErrors({})
                            }}
                            className={`
                                relative flex items-center justify-center gap-2 flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors z-10
                                ${role === r.id ? "text-indigo-600 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}
                            `}
                        >
                            <r.icon className={`h-3.5 w-3.5 ${role === r.id ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                            {r.label}
                            {role === r.id && (
                                <motion.div
                                    layoutId="activeRole"
                                    className="absolute inset-0 bg-white dark:bg-indigo-600 rounded-lg shadow-sm -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-1">
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
                        {role === "STUDENT" ? "Sign in" : "Tutor Portal"}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {role === "STUDENT" 
                            ? "Welcome back to your educational journey." 
                            : "Enter your educator credentials to access your workspace."}
                    </p>
                </div>

                {role === "STUDENT" && (
                    <>
                        <div className="space-y-2.5">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full h-10 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-colors rounded-lg"
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Sign in with Google
                            </Button>
                        </div>

                        <div className="relative py-1">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="dark:bg-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 cursor-default">OR</span>
                            </div>
                        </div>
                    </>
                )}

                <form onSubmit={onSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Email<span className="text-indigo-500">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                placeholder={role === "STUDENT" ? "name@example.com" : "tutor@exammaster.com"}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className={`pl-9 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 ${validationErrors.email ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"} rounded-lg`}
                            />
                        </div>
                        {validationErrors.email && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.email}</div>}
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Password<span className="text-indigo-500">*</span>
                            </Label>
                            <Link href="/forgot-password" size="sm" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className={`pl-9 pr-10 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 ${validationErrors.password ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"} rounded-lg`}
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

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50"
                        >
                            {success}
                        </motion.div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Verifying..." : role === "STUDENT" ? "Sign in" : "Sign in as Tutor"}
                        </Button>
                    </div>
                </form>

                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 pb-1">
                    {role === "STUDENT" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
                                Join as Student
                            </Link>
                        </>
                    ) : (
                        <>
                            New educator?{" "}
                            <Link href="/auth/tutor-register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
                                Apply to Tutor
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </AuthSplitLayout>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
