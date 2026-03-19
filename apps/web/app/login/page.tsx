"use client"
import { useState } from "react"
import { studentService } from "@/lib/services/student.service"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const validate = () => {
        const errors: { [key: string]: string } = {}
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required."
        if (!password || password.length < 6) errors.password = "Password must be at least 6 characters."
        return errors
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        const errors = validate()
        setValidationErrors(errors)
        if (Object.keys(errors).length > 0) return
        setLoading(true)
        try {
            const res = await studentService.login({ email, password })
            if (res.success) {
                setSuccess("Login successful!")
                // TODO: Redirect to dashboard or set auth state
            } else {
                setError(res.message || "Login failed.")
            }
        } catch (err: any) {
            setError(err.message || "Login failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.email && <div className="text-red-500 text-sm">{validationErrors.email}</div>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.password && <div className="text-red-500 text-sm">{validationErrors.password}</div>}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center text-slate-600 dark:text-slate-300">
                    Don't have an account? <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Register</Link>
                </div>
            </div>
        </div>
    )
}
