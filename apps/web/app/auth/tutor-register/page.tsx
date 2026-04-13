"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, CheckCircle, AlertCircle, User, Mail, Phone, BookOpen, Users, Shield, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { tutorService } from "@/lib/services/tutor.service"
import { isValidEmail, isValidPhone } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"
import { Separator } from "@/components/ui/separator"

const STEPS = [
  { id: 1, label: "Contact", icon: User },
  { id: 2, label: "Profile", icon: BookOpen },
  { id: 3, label: "Review", icon: Shield },
]

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

  const [step, setStep] = useState(1)
  const [stepDir, setStepDir] = useState(1)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"checking" | "available" | "taken" | null>(null)
  const [usernameHelp, setUsernameHelp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)

  useEffect(() => {
    const username = formData.username.trim()

    if (!usernameTouched || username.length < 3) {
      if (username.length > 0 && username.length < 3) {
        setUsernameStatus(null)
        setUsernameHelp("Username must be at least 3 characters")
      } else {
        setUsernameStatus(null)
        setUsernameHelp("")
      }
      return
    }

    setUsernameStatus("checking")
    setUsernameHelp("Checking availability...")

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await tutorService.checkUsername(username)
        if (result.available) {
          setUsernameStatus("available")
          setUsernameHelp("Username is available")
          setValidationErrors(prev => {
            const { username, ...rest } = prev
            return rest
          })
        } else {
          setUsernameStatus("taken")
          setUsernameHelp("Username is already taken")
          setValidationErrors(prev => ({ ...prev, username: "Username is already taken" }))
        }
      } catch {
        setUsernameStatus("taken")
        setUsernameHelp("Unable to verify username")
      }
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [formData.username, usernameTouched])

  const validateStep = (s: number) => {
    const errors: { [key: string]: string } = {}

    if (s === 1) {
      if (!formData.name || formData.name.trim().length < 2) errors.name = "Full name is required"
      if (!isValidEmail(formData.email)) errors.email = "Valid email is required"
      if (!isValidPhone(formData.phone)) errors.phone = "Valid phone number is required"
    } else if (s === 2) {
      if (!formData.subject || formData.subject.trim().length === 0) errors.subject = "Subject is required"
      if (!formData.studentCount) errors.studentCount = "Student count range is required"
      if (!formData.username || formData.username.length < 3) errors.username = "Valid username is required"
      if (usernameStatus === "taken") errors.username = "Username is already taken"
      if (usernameStatus === "checking") errors.username = "Please wait while we check username"
    } else if (s === 3) {
      if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms"
    }

    return errors
  }

  const goNext = () => {
    const errors = validateStep(step)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStepDir(1)
    setStep(s => s + 1)
  }

  const goBack = () => {
    setStepDir(-1)
    setStep(s => s - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const errors = validateStep(3)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      await tutorService.registerTutor(formData)
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const slideVars = {
    enter: (d: number) => ({ x: d > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -20 : 20, opacity: 0 }),
  }

  const inputClasses = (hasError: boolean) => `
    pl-9 h-11 bg-slate-50/50 dark:bg-slate-900/40 
    border-slate-200 dark:border-slate-800 
    hover:border-indigo-500/40 dark:hover:border-indigo-500/40
    transition-all duration-200 rounded-xl text-sm
    ${hasError 
      ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" 
      : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"}
  `.replace(/\s+/g, ' ').trim()

  return (
    <AuthSplitLayout
      imageSrc="/tutor_register_hero.png"
      imageAlt="Tutor teaching students"
      headline={<>Empower students with <span className="italic text-indigo-300 font-light">ExamMaster</span></>}
      description="Apply as a tutor and join our network of professional educators."
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
            Become a Tutor
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-medium">
            Professional application for verified educators.
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold">Application Received!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                Thank you for applying. Our admin team will review your profile and contact you via email with your credentials once approved.
              </p>
            </div>
            <Button asChild className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300">
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between px-2">
              {STEPS.map((s, i) => {
                const isActive = step === s.id
                const isCompleted = step > s.id
                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${isCompleted ? "bg-indigo-600 text-white" : isActive ? "bg-white dark:bg-slate-900 border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-500/10" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}
                      `}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : s.id}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-[2px] mx-4 mb-5 bg-slate-100 dark:bg-slate-800 relative">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-indigo-600"
                          initial={{ width: "0%" }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="relative overflow-hidden min-h-[280px]">
              <AnimatePresence mode="wait" custom={stepDir}>
                <motion.div
                  key={step}
                  custom={stepDir}
                  variants={slideVars}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full space-y-5"
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                        <div className="relative flex items-center group">
                          <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClasses(!!validationErrors.name)}
                          />
                        </div>
                        {validationErrors.name && <p className="text-[10px] text-red-500 font-medium ml-1">{validationErrors.name}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
                        <div className="relative flex items-center group">
                          <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClasses(!!validationErrors.email)}
                          />
                        </div>
                        {validationErrors.email && <p className="text-[10px] text-red-500 font-medium ml-1">{validationErrors.email}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
                        <div className="relative flex items-center group">
                          <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+94 77 123 4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClasses(!!validationErrors.phone)}
                          />
                        </div>
                        {validationErrors.phone && <p className="text-[10px] text-red-500 font-medium ml-1">{validationErrors.phone}</p>}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="subject" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject Specialization</Label>
                        <div className="relative flex items-center group">
                          <BookOpen className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="subject"
                            placeholder="e.g. Mathematics, AI"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className={inputClasses(!!validationErrors.subject)}
                          />
                        </div>
                        {validationErrors.subject && <p className="text-[10px] text-red-500 font-medium ml-1">{validationErrors.subject}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="studentCount" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number of Students</Label>
                        <div className="relative flex items-center group">
                          <Users className="absolute left-3.5 h-4 w-4 text-slate-400 z-10" />
                          <Select 
                            value={formData.studentCount} 
                            onValueChange={(value) => setFormData({ ...formData, studentCount: value })}
                          >
                            <SelectTrigger className={inputClasses(!!validationErrors.studentCount)}>
                              <SelectValue placeholder="Select current range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ZERO_FIFTY">0-50 students</SelectItem>
                              <SelectItem value="FIFTY_FIVE_HUNDRED">50-500 students</SelectItem>
                              <SelectItem value="FIVE_HUNDRED_PLUS">500+ students</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {validationErrors.studentCount && <p className="text-[10px] text-red-500 font-medium ml-1">{validationErrors.studentCount}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="username" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Desired Username</Label>
                        <div className="relative flex items-center group">
                          <Sparkles className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="username"
                            placeholder="choose-a-username"
                            value={formData.username}
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/\s+/g, "")
                              setFormData({ ...formData, username: value })
                              setUsernameTouched(true)
                            }}
                            className={inputClasses(!!validationErrors.username) + " pr-11"}
                          />
                          <div className="absolute right-3.5">
                            {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                            {usernameStatus === "available" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                            {usernameStatus === "taken" && <AlertCircle className="h-4 w-4 text-red-500" />}
                          </div>
                        </div>
                        {usernameHelp && (
                          <p className={`text-[10px] font-medium ml-1 ${usernameStatus === "available" ? "text-emerald-500" : usernameStatus === "taken" ? "text-red-500" : "text-slate-400"}`}>
                            {usernameHelp}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-indigo-600" />
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Summary</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Name</p>
                            <p className="font-semibold">{formData.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Subject</p>
                            <p className="font-semibold text-indigo-600">{formData.subject}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Email</p>
                            <p className="font-semibold truncate">{formData.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-1">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="terms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal cursor-pointer">
                          I agree to the <span className="text-indigo-600 font-semibold underline underline-offset-2">Terms of Service</span> and acknowledge that my application is subject to review.
                        </Label>
                      </div>
                      {validationErrors.agreedToTerms && <p className="text-[10px] text-red-500 font-medium">{validationErrors.agreedToTerms}</p>}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3 text-xs text-red-800 dark:text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="flex gap-2 pt-1">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goBack} 
                  disabled={isLoading}
                  className="h-10 px-4 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold text-sm transition-colors gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  type="button" 
                  onClick={goNext} 
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 gap-1"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !formData.agreedToTerms} 
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5" 
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
                </Button>
              )}
            </div>

            <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2 pb-1">
              Already have an account?{" "}
              <Link href="/auth/tutor-login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline font-bold transition-all underline-offset-4">
                Login here
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  )
}
