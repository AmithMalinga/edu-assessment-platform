"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Eye, EyeOff, User, Mail, Lock, CheckCircle2, ChevronLeft, ChevronRight, Phone, GraduationCap, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useRef, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { studentService } from "@/lib/services/student.service"
import { isStrongPassword, isValidEmail, isValidPhone } from "@/lib/validation"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

/* ── Constants ────────────────────────────────────────────────── */
const STEPS = [
    { id: 1, label: "About You",    icon: User    },
    { id: 2, label: "Verify Email", icon: Shield  },
    { id: 3, label: "Password",     icon: Lock    },
]

const EDUCATION_LEVELS = [
    "Grade 1",  "Grade 2",  "Grade 3",  "Grade 4",  "Grade 5",
    "Grade 6",  "Grade 7",  "Grade 8",  "Grade 9",  "Grade 10",
    "Grade 11", "Grade 12", "Grade 13",
]

type VErrors = Record<string, string>

/* ── Password strength helper ─────────────────────────────────── */
const getStrength = (pw: string) => {
    let s = 0
    if (pw.length >= 8)          s++
    if (/[A-Z]/.test(pw))        s++
    if (/[a-z]/.test(pw))        s++
    if (/[0-9]/.test(pw))        s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
}
const STRENGTH_LABELS = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
const STRENGTH_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#6366f1"]

/* ── Page ─────────────────────────────────────────────────────── */
export default function RegisterPage() {
    const router  = useRouter()
    const apiUrl  = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured")
    }

    /* form */
    const [name,             setName]             = useState("")
    const [email,            setEmail]            = useState("")
    const [phone,            setPhone]            = useState("")
    const [age,              setAge]              = useState("")
    const [educationalLevel, setEducationalLevel] = useState("")
    const [password,         setPassword]         = useState("")
    const [confirmPassword,  setConfirmPassword]  = useState("")
    const [showPassword,     setShowPassword]     = useState(false)
    const [showConfirm,      setShowConfirm]      = useState(false)

    /* wizard */
    const [step,    setStep]    = useState(1)
    const [stepDir, setStepDir] = useState(1)

    /* network */
    const [isLoading,  setIsLoading]  = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)

    /* feedback */
    const [error,   setError]   = useState("")
    const [success, setSuccess] = useState("")
    const [vErrors, setVErrors] = useState<VErrors>({})

    /* OTP */
    const [otpDigits,   setOtpDigits]   = useState(["","","","","",""])
    const [otpFocus,    setOtpFocus]    = useState(-1)
    const [otpSent,     setOtpSent]     = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [evToken,     setEvToken]     = useState("")
    const [otpExpiry,   setOtpExpiry]   = useState("")
    const [cooldown,    setCooldown]    = useState(0)
    const otpRefs = useRef<Array<HTMLInputElement | null>>([])

    const otpCode = otpDigits.join("")
    const pwStrength = getStrength(password)

    /* ── helpers ── */
    const resetOtp = () => {
        setOtpDigits(["","","","","",""])
        setOtpSent(false); setOtpVerified(false)
        setEvToken(""); setOtpExpiry(""); setOtpFocus(-1)
    }
    const startCooldown = () => {
        setCooldown(60)
        const iv = setInterval(() => setCooldown(c => { if (c <= 1) { clearInterval(iv); return 0 } return c - 1 }), 1000)
    }

    /* ── validation ── */
    const v1 = (): VErrors => {
        const e: VErrors = {}
        if (!name.trim() || name.trim().length < 2)             e.name             = "Name must be at least 2 characters."
        if (!isValidPhone(phone))                                e.phone            = "Valid phone required (min 10 digits)."
        if (!age || isNaN(+age) || +age < 10 || +age > 100)    e.age              = "Enter a valid age (10–100)."
        if (!educationalLevel)                                   e.educationalLevel = "Please select your grade."
        return e
    }
    const v2 = (): VErrors => {
        const e: VErrors = {}
        if (!isValidEmail(email)) e.email = "Enter a valid email address."
        if (!otpVerified)         e.otp   = "Please verify your email before continuing."
        return e
    }
    const v3 = (): VErrors => {
        const e: VErrors = {}
        if (!isStrongPassword(password))  e.password        = "Min 8 chars with uppercase, lowercase, and number."
        if (password !== confirmPassword) e.confirmPassword = "Passwords do not match."
        return e
    }

    /* ── navigation ── */
    const goNext = () => {
        setError(""); setSuccess("")
        const errs = step === 1 ? v1() : step === 2 ? v2() : {}
        setVErrors(errs)
        if (Object.keys(errs).length) return
        setStepDir(1); setStep(s => s + 1)
    }
    const goBack = () => {
        setError(""); setSuccess(""); setVErrors({})
        setStepDir(-1); setStep(s => s - 1)
    }

    /* ── OTP ── */
    const handleSendOtp = async () => {
        setError(""); setSuccess("")
        if (!isValidEmail(email)) { setVErrors({ email: "Enter a valid email address." }); return }
        setVErrors({}); setOtpLoading(true)
        try {
            const r = await studentService.requestRegisterOtp({ email })
            const mins = Math.max(1, Math.floor(r.expiresInSeconds / 60))
            setOtpSent(true)
            setOtpExpiry(`${mins} minute${mins > 1 ? "s" : ""}`)
            setSuccess(`Code sent to ${email}. Check your inbox.`)
            startCooldown()
            setTimeout(() => otpRefs.current[0]?.focus(), 100)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send OTP.")
        } finally { setOtpLoading(false) }
    }

    const handleOtpKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault()
            const next = [...otpDigits]; next[i] = ""
            setOtpDigits(next)
            if (i > 0) { otpRefs.current[i - 1]?.focus(); setOtpFocus(i - 1) }
        } else if (e.key === "ArrowLeft"  && i > 0) { otpRefs.current[i - 1]?.focus(); setOtpFocus(i - 1) }
          else if (e.key === "ArrowRight" && i < 5) { otpRefs.current[i + 1]?.focus(); setOtpFocus(i + 1) }
    }
    const handleOtpInput = (i: number, val: string) => {
        const digit = val.replace(/\D/g, "").slice(-1)
        if (!digit && val) return
        const next = [...otpDigits]; next[i] = digit
        setOtpDigits(next)
        if (digit && i < 5) { otpRefs.current[i + 1]?.focus(); setOtpFocus(i + 1) }
    }
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("")
        const next = ["","","","","",""]; digits.forEach((d, i) => { next[i] = d })
        setOtpDigits(next)
        const last = Math.min(digits.length, 5)
        otpRefs.current[last]?.focus(); setOtpFocus(last)
    }
    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) { setError("Enter the complete 6-digit code."); return }
        setError(""); setOtpLoading(true)
        try {
            const r = await studentService.verifyRegisterOtp({ email, otp: otpCode })
            setEvToken(r.emailVerificationToken); setOtpVerified(true)
            setSuccess("Email verified! You can now continue.")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Incorrect code. Please try again.")
        } finally { setOtpLoading(false) }
    }

    /* ── register ── */
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(""); setSuccess("")
        const errs = v3(); setVErrors(errs)
        if (Object.keys(errs).length) return
        if (!otpVerified || !evToken) { setError("Email not verified. Go back to Step 2."); return }
        setIsLoading(true)
        try {
            const res = await studentService.register({ name, email, phone, age: +age, educationalLevel, password, emailVerificationToken: evToken })
            localStorage.setItem("token", res.access_token)
            localStorage.setItem("currentUser", JSON.stringify(res.user))
            setSuccess("Account created! Redirecting to your dashboard…")
            setTimeout(() => router.push("/loading?to=/dashboard"), 900)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
        } finally { setIsLoading(false) }
    }

    const handleGoogleSignUp = () => { window.location.href = `${apiUrl}/auth/google` }

    /* ── slide animation (matches login page motion style) ── */
    const slide = {
        enter:  (d: number) => ({ x: d * 20, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit:   (d: number) => ({ x: d * -20, opacity: 0 }),
    }

    /* ── Common classes for inputs ── */
    const inputClasses = (hasError: boolean) => `
        pl-10 h-11 bg-slate-50/50 dark:bg-slate-900/40 
        border-slate-200 dark:border-slate-800 
        hover:border-indigo-500/30 dark:hover:border-indigo-500/30
        focus-visible:ring-4 focus-visible:ring-indigo-500/5 
        focus-visible:border-indigo-500/50 
        transition-all duration-200 rounded-xl text-sm
        ${hasError ? "border-red-500 focus-visible:ring-red-500/5 focus-visible:border-red-500" : ""}
    `.replace(/\s+/g, ' ').trim()

    /* ─────────────────────────────────── RENDER ── */
    return (
        <AuthSplitLayout
            imageSrc="/student_register_hero.png"
            imageAlt="Inspiring student learning"
            headline={<>Start <span className="italic text-indigo-300 font-light">thriving</span> with ExamMaster</>}
            description="Build your knowledge, challenge yourself, and reach new heights."
        >
            <div className="space-y-4">

                {/* ── Header ── */}
                <div className="space-y-1.5">
                    <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                        Create account
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                        Join our community of exceptional learners.
                    </p>
                </div>

                {/* ── Step progress indicator ── */}
                <div className="flex items-center px-1">
                    {STEPS.map((s, i) => {
                        const completed = step > s.id
                        const current   = step === s.id
                        return (
                            <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                                        completed
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                            : current
                                            ? "bg-white dark:bg-slate-950 border-indigo-600 text-indigo-600 ring-4 ring-indigo-500/10"
                                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400"
                                    }`}>
                                        {completed
                                            ? <CheckCircle2 className="h-4 w-4" />
                                            : <span className="text-xs font-bold">{s.id}</span>
                                        }
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                        current ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                                    }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="flex-1 px-2 mb-5">
                                        <div className="h-0.5 rounded-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-indigo-500"
                                                initial={{ width: "0%" }}
                                                animate={{ width: completed ? "100%" : "0%" }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ── Step content ── */}
                <div className="relative overflow-visible" style={{ minHeight: 280 }}>
                    <AnimatePresence mode="wait" custom={stepDir}>

                        {/* STEP 1 — Personal Info */}
                        {step === 1 && (
                            <motion.div
                                key="s1" custom={stepDir} variants={slide}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                Full Name<span className="text-indigo-500">*</span>
                                            </Label>
                                            <div className="relative group text-slate-900 dark:text-slate-100">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                <Input
                                                    id="name" type="text"
                                                    placeholder="Your name"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className={inputClasses(!!vErrors.name)}
                                                />
                                            </div>
                                            {vErrors.name && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.name}</div>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="phone" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                Phone<span className="text-indigo-500">*</span>
                                            </Label>
                                            <div className="relative group text-slate-900 dark:text-slate-100">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                <Input
                                                    id="phone" type="tel"
                                                    placeholder="+1234567"
                                                    value={phone}
                                                    onChange={e => setPhone(e.target.value)}
                                                    className={inputClasses(!!vErrors.phone)}
                                                />
                                            </div>
                                            {vErrors.phone && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.phone}</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="age" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                Age<span className="text-indigo-500">*</span>
                                            </Label>
                                            <div className="relative group text-slate-900 dark:text-slate-100">
                                                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                                <Input
                                                    id="age" type="number"
                                                    placeholder="e.g. 16"
                                                    value={age}
                                                    onChange={e => setAge(e.target.value)}
                                                    min={10} max={100}
                                                    className={inputClasses(!!vErrors.age)}
                                                />
                                            </div>
                                            {vErrors.age && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.age}</div>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="educationalLevel" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                Grade<span className="text-indigo-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10 pointer-events-none" />
                                                <Select value={educationalLevel} onValueChange={setEducationalLevel}>
                                                    <SelectTrigger className={inputClasses(!!vErrors.educationalLevel)}>
                                                        <SelectValue placeholder="Select…" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {EDUCATION_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {vErrors.educationalLevel && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.educationalLevel}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-1">
                                    <div className="relative py-0.5">
                                        <div className="absolute inset-0 flex items-center">
                                            <Separator className="dark:bg-slate-800" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                            <span className="bg-white dark:bg-slate-950 px-3">or continue with</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleGoogleSignUp}
                                        className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-all rounded-xl gap-2.5"
                                        disabled={isLoading}
                                    >
                                        <svg className="h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                        </svg>
                                        Google
                                    </Button>
                                </div>
                            </motion.div>
                        )}


                        {/* STEP 2 — Email verification */}
                        {step === 2 && (
                            <motion.div
                                key="s2" custom={stepDir} variants={slide}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-5"
                            >
                                {/* Email + Send button */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        Email Address<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group text-slate-900 dark:text-slate-100">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                            <Input
                                                id="email" type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); if (otpSent || otpVerified) resetOtp() }}
                                                disabled={otpVerified}
                                                className={inputClasses(!!vErrors.email) + (otpVerified ? " opacity-60" : "")}
                                            />
                                        </div>
                                        {!otpVerified && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleSendOtp}
                                                disabled={otpLoading || !isValidEmail(email) || cooldown > 0}
                                                className="h-11 px-4 text-xs font-bold shrink-0 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-indigo-600 dark:text-indigo-400 transition-all active:scale-95"
                                            >
                                                {otpLoading
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : cooldown > 0 ? `${cooldown}s`
                                                    : otpSent ? "Resend"
                                                    : "Send OTP"}
                                            </Button>
                                        )}
                                    </div>
                                    {vErrors.email && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.email}</div>}
                                </div>

                                {/* OTP digit boxes — appears after sending */}
                                <AnimatePresence>
                                    {otpSent && !otpVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/60 dark:bg-slate-900/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Shield className="h-3.5 w-3.5 text-indigo-500" />
                                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">6-digit verification code</p>
                                                    </div>
                                                    {otpExpiry && (
                                                        <p className="text-[10px] text-slate-400">Expires in <span className="font-semibold text-slate-600 dark:text-slate-300">{otpExpiry}</span></p>
                                                    )}
                                                </div>

                                                {/* OTP boxes */}
                                                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                                                    {otpDigits.map((d, i) => (
                                                        <div key={i} className="relative flex-1">
                                                            {/* Visual cell */}
                                                            <div className={`
                                                                flex items-center justify-center h-12 rounded-xl border-2 text-lg font-bold transition-all duration-200
                                                                ${otpFocus === i
                                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/5"
                                                                    : d
                                                                    ? "border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white"
                                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50"
                                                                }
                                                            `}>
                                                                {d || (otpFocus === i ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-indigo-500">|</motion.span> : "")}
                                                            </div>
                                                            {/* Hidden real input */}
                                                            <input
                                                                ref={el => { otpRefs.current[i] = el }}
                                                                type="text" inputMode="numeric" maxLength={1}
                                                                value={d}
                                                                disabled={otpLoading}
                                                                onChange={e => handleOtpInput(i, e.target.value)}
                                                                onKeyDown={e => handleOtpKey(i, e)}
                                                                onFocus={() => setOtpFocus(i)}
                                                                onBlur={() => setOtpFocus(-1)}
                                                                className="absolute inset-0 opacity-0 cursor-text"
                                                                aria-label={`OTP digit ${i + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    className="w-full h-11 text-sm font-bold bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all rounded-xl shadow-lg shadow-indigo-500/10"
                                                    disabled={otpLoading || otpCode.length !== 6}
                                                >
                                                    {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Verify Code
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Verified success badge */}
                                <AnimatePresence>
                                    {otpVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 px-3 py-2.5"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Email verified!</p>
                                                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500 truncate">{email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { resetOtp(); setEmail("") }}
                                                className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                            >
                                                Change
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Helper hint when nothing sent */}
                                {!otpSent && !otpVerified && (
                                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 px-3 py-2.5 flex items-start gap-2">
                                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Enter your email and tap <span className="font-semibold text-indigo-600 dark:text-indigo-400">Send OTP</span> to receive a 6-digit code. This confirms you own the email.
                                        </p>
                                    </div>
                                )}

                                {vErrors.otp && <div className="text-red-500 text-[10px] font-semibold">{vErrors.otp}</div>}
                            </motion.div>
                        )}

                        {/* STEP 3 — Password */}
                        {step === 3 && (
                            <motion.form
                                key="s3" custom={stepDir} variants={slide}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                onSubmit={handleRegister}
                                className="space-y-5"
                            >
                                {/* Account summary */}
                                {/* <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 shadow-sm shadow-slate-200/50 dark:shadow-none">
                                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/50">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Account Summary</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">Name</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{name}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">Age</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{age} years</span>
                                        </div>
                                        <div className="col-span-2 flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">Email Address</span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate">{email}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">Educational Grade</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{educationalLevel}</span>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        Password<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative group text-slate-900 dark:text-slate-100">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className={inputClasses(!!vErrors.password) + " pr-11"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors outline-none h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {/* Strength bar */}
                                    {password && (
                                        <div className="space-y-1.5 px-1 pt-0.5">
                                            <div className="flex gap-1.5">
                                                {[1,2,3,4,5].map(i => (
                                                    <div
                                                        key={i}
                                                        className="h-1 flex-1 rounded-full transition-all duration-300"
                                                        style={{ backgroundColor: i <= pwStrength ? STRENGTH_COLORS[pwStrength] : "#e2e8f0" }}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight" style={{ color: STRENGTH_COLORS[pwStrength] }}>
                                                {STRENGTH_LABELS[pwStrength]}
                                            </p>
                                        </div>
                                    )}
                                    {vErrors.password && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.password}</div>}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        Confirm Password<span className="text-indigo-500">*</span>
                                    </Label>
                                    <div className="relative group text-slate-900 dark:text-slate-100">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Repeat your password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className={inputClasses(!!vErrors.confirmPassword) + " pr-11"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors outline-none h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                            tabIndex={-1}
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {/* Match indicator */}
                                    {confirmPassword && (
                                        <p className={`text-[10px] font-bold ml-1 flex items-center gap-1.5 transition-colors ${password === confirmPassword ? "text-emerald-500" : "text-red-400"}`}>
                                            {password === confirmPassword
                                                ? <><CheckCircle2 className="h-3.5 w-3.5 shrink-0" />Passwords match</>
                                                : <><div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />Passwords don&apos;t match yet</>
                                            }
                                        </p>
                                    )}
                                    {vErrors.confirmPassword && <div className="text-red-500 text-[10px] font-semibold ml-1">{vErrors.confirmPassword}</div>}
                                </div>

                                {/* Step 3 alerts */}
                                {error   && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-100 dark:border-red-900/50">{error}</motion.div>}
                                {success && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</motion.div>}

                                {/* Submit button — exact login style */}
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-slate-900/10 dark:shadow-indigo-500/10 transition-all active:scale-[0.98]"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isLoading ? "Creating account…" : "Create Account"}
                                    </Button>
                                </div>

                                <p className="text-[10px] text-slate-400 text-center leading-relaxed pb-1">
                                    By creating an account, you agree to our{" "}
                                    <span className="underline cursor-pointer hover:text-indigo-600 transition-colors">Terms of Use</span>
                                    {" "}and{" "}
                                    <span className="underline cursor-pointer hover:text-indigo-600 transition-colors">Privacy Policy</span>.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Step 1 & 2 alert messages ── */}
                {step < 3 && error   && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</motion.div>}
                {step < 3 && success && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">{success}</motion.div>}

                {/* ── Navigation buttons ── */}
                {step < 3 && (
                    <div className="flex items-center gap-2 pt-1">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                className="h-10 px-4 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold text-sm transition-colors gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={goNext}
                            className="flex-1 h-10 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 gap-1"
                        >
                            {step === 2 && !otpVerified ? "Verify Email First" : "Continue"}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {step === 3 && (
                    <button
                        type="button"
                        onClick={goBack}
                        className="w-full text-[10px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
                    >
                        <ChevronLeft className="h-3 w-3" /> Back to email verification
                    </button>
                )}

                {/* ── Sign in link — exact login style ── */}
                <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 pb-1">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
                        Log in
                    </Link>
                </div>
            </div>
        </AuthSplitLayout>
    )
}
