"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { studentService } from "@/lib/services/student.service"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
            if (res.success) {
                setSuccess("Login successful!")
                // TODO: Redirect to dashboard or set auth state
            } else {
                setError(res.message || "Login failed.")
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                className={`pl-10 ${validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                required
                            />
                        </div>
                        {validationErrors.email && <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLoading}
                                className={`pl-10 ${validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                required
                            />
                        </div>
                        {validationErrors.password && <div className="text-red-500 text-sm mt-1">{validationErrors.password}</div>}
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                    {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 mt-2" disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="w-full">
                    <Button variant="outline" className="w-full" disabled={isLoading}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-500">
                <div>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
