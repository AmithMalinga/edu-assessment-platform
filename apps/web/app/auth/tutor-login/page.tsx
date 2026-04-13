"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { studentService } from "@/lib/services/student.service"
import { isValidEmail } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

export default function TutorLoginPage() {
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

      if (res.user.role !== "TUTOR") {
        setError("This login is only for tutor accounts.")
        return
      }

      localStorage.setItem("token", res.access_token)
      localStorage.setItem("currentUser", JSON.stringify(res.user))

      if (res.user.requiresPasswordChange) {
        setSuccess("First-time login detected. Redirecting to password change...")
        setTimeout(() => {
          router.push("/auth/change-password")
        }, 600)
        return
      }

      setSuccess("Tutor login successful!")
      setTimeout(() => {
        router.push("/loading?to=/tutor-dashboard")
      }, 600)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      imageSrc="/auth_hero.png"
      imageAlt="Tutor workspace"
      headline={<>Tutor access for <span className="italic text-indigo-300 font-light">ExamMaster</span></>}
      description="Sign in with your tutor account to access your tutor dashboard."
    >
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
            Tutor Login
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Use your approved tutor account credentials.
          </p>
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
                placeholder="Enter your tutor email"
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
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password<span className="text-indigo-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
              Sign in as Tutor
            </Button>
          </div>
        </form>

        <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-4 pb-2">
          Student account?{" "}
          <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
            Student Login
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
