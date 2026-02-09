"use client"

import Link from "next/link"
import { useState } from "react"
import { Loader2, Lock, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function ResetPasswordPage() {
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

    if (isSubmitted) {
        return (
            <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Password reset</CardTitle>
                    <CardDescription>
                        Your password has been successfully reset.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        asChild
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                    >
                        <Link href="/login">
                            Sign in with new password
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
                <CardDescription>
                    Must be at least 8 characters.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="pl-10"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="pl-10"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25" disabled={isLoading}>
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reset Password
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Link
                    href="/login"
                    className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    )
}
