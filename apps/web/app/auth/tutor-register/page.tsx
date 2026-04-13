"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { tutorService } from "@/lib/services/tutor.service"
import { isValidEmail, isValidPhone } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

export default function TutorRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    studentCount: "",
    username: "",
    agreedToTerms: false,
  })

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"checking" | "available" | "taken" | null>(null)
  const [usernameHelp, setUsernameHelp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)

  useEffect(() => {
    const username = formData.username.trim()

    if (!usernameTouched) {
      return
    }

    if (username.length < 3) {
      setUsernameStatus(null)
      setUsernameHelp("")
      setValidationErrors(prev => {
        const { username, ...rest } = prev
        return rest
      })
      return
    }

    setUsernameStatus("checking")
    setUsernameHelp("Checking username availability...")

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await tutorService.checkUsername(username)

        if (result.available) {
          setUsernameStatus("available")
          setUsernameHelp("Username is available.")
          setValidationErrors(prev => {
            const { username, ...rest } = prev
            return rest
          })
        } else {
          setUsernameStatus("taken")
          setUsernameHelp("Username is already taken.")
          setValidationErrors(prev => ({ ...prev, username: "Username is already taken" }))
        }
      } catch {
        setUsernameStatus("taken")
        setUsernameHelp("Unable to verify username right now.")
        setValidationErrors(prev => ({ ...prev, username: "Unable to verify username right now" }))
      }
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [formData.username, usernameTouched])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!isValidEmail(formData.email)) {
      errors.email = "Valid email is required"
    }

    if (!isValidPhone(formData.phone)) {
      errors.phone = "Enter a valid Sri Lankan phone number (e.g., +94 77 123 4567)"
    }

    if (!formData.subject || formData.subject.trim().length === 0) {
      errors.subject = "Subject is required"
    }

    if (!formData.studentCount) {
      errors.studentCount = "Student count range is required"
    }

    if (!formData.username || formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    if (usernameStatus === "checking") {
      errors.username = "Please wait while we verify your username"
    }

    if (usernameStatus === "taken") {
      errors.username = "Username is already taken"
    }

    if (usernameStatus !== "available" && formData.username.trim().length >= 3) {
      errors.username = errors.username || "Username availability must be confirmed"
    }

    if (!formData.agreedToTerms) {
      errors.agreedToTerms = "You must agree to terms and conditions"
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const errors = validateForm()
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      await tutorService.registerTutor(formData)
      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        studentCount: "",
        username: "",
        agreedToTerms: false,
      })
      setUsernameStatus(null)
      setUsernameHelp("")
      setUsernameTouched(false)
    } catch (err) {
      setError((err as Error).message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      imageSrc="/auth_hero.png"
      imageAlt="Tutor teaching students"
      headline={<>Teach smarter with <span className="italic text-indigo-300 font-light">ExamMaster</span></>}
      description="Apply as a tutor and help more students achieve better outcomes."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
            Become a Tutor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Submit your application and our admin team will review it.
          </p>
        </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold">Registration Submitted!</h3>
          <p className="text-sm text-muted-foreground">
            Thank you for applying. We'll review your details and send you an email with the decision.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your inbox (and spam folder) for our response.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Full Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={validationErrors.name ? "border-red-500" : ""}
            />
            {validationErrors.name && <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={validationErrors.email ? "border-red-500" : ""}
            />
            {validationErrors.email && <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+94 77 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={validationErrors.phone ? "border-red-500" : ""}
            />
            {validationErrors.phone && <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="e.g., Mathematics, English"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={validationErrors.subject ? "border-red-500" : ""}
            />
            {validationErrors.subject && <p className="text-xs text-red-500 mt-1">{validationErrors.subject}</p>}
          </div>

          {/* Student Count Range */}
          <div>
            <Label htmlFor="studentCount" className="text-sm font-medium">
              Number of Students (Roughly)
            </Label>
            <Select value={formData.studentCount} onValueChange={(value) => setFormData({ ...formData, studentCount: value })}>
              <SelectTrigger className={validationErrors.studentCount ? "border-red-500" : ""}>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZERO_FIFTY">0-50 students</SelectItem>
                <SelectItem value="FIFTY_FIVE_HUNDRED">50-500 students</SelectItem>
                <SelectItem value="FIVE_HUNDRED_PLUS">500+ students</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.studentCount && <p className="text-xs text-red-500 mt-1">{validationErrors.studentCount}</p>}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="your-username"
                value={formData.username}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/\s+/g, "")
                  setFormData({ ...formData, username: value })
                  setUsernameTouched(true)
                  setUsernameStatus(value.trim().length >= 3 ? "checking" : null)
                  setUsernameHelp("")
                  setValidationErrors(prev => {
                    const { username, ...rest } = prev
                    return rest
                  })
                }}
                className={validationErrors.username ? "border-red-500 pr-10" : "pr-10"}
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                {usernameStatus === "checking" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : usernameStatus === "available" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : null}
              </div>
            </div>
            <div className="mt-1 min-h-[1rem]">
              {validationErrors.username ? (
                <p className="text-xs text-red-500">{validationErrors.username}</p>
              ) : usernameHelp ? (
                <p className={`text-xs ${usernameStatus === "available" ? "text-green-600" : usernameStatus === "taken" ? "text-red-500" : "text-slate-500"}`}>
                  {usernameHelp}
                </p>
              ) : null}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="terms" className="text-xs font-normal text-muted-foreground cursor-pointer mt-0.5">
              I agree to the terms and conditions
            </Label>
          </div>
          {validationErrors.agreedToTerms && <p className="text-xs text-red-500">{validationErrors.agreedToTerms}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-center text-xs text-muted-foreground">
            Already a tutor?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </p>
        </form>
      )}
      </div>
    </AuthSplitLayout>
  )
}
