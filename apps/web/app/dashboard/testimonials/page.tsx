"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Send, CheckCircle2, MessageSquare, Quote, User, Sparkles } from "lucide-react"
import { studentService, type StudentProfile } from "@/lib/services/student.service"
import { testimonialService } from "@/lib/services/testimonial.service"
import { cn } from "@/lib/utils"

export default function TestimonialsPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const data = await studentService.getProfile(token)
                    setProfile(data)
                } catch (err) {
                    console.error("Failed to fetch profile", err)
                }
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        setError(null)

        try {
            const token = localStorage.getItem("token")
            if (!token || !profile) throw new Error("Authentication required")

            await testimonialService.submit({
                name: profile.name,
                role: `${profile.educationalLevel} Student`,
                content,
                rating,
                avatar: profile.name.charAt(0) // Default avatar logic
            }, token)

            setIsSuccess(true)
            setContent("")
            setRating(5)
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-xs"
                >
                    <Sparkles className="h-4 w-4" />
                    Share Your Journey
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-slate-900 dark:text-white tracking-tight"
                >
                    Testimonials & Feedback
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium"
                >
                    Your success stories inspire thousands of other students. Tell us how ExamMaster helped you achieve your goals!
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Form Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                            >
                                <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center shadow-inner border border-emerald-100 dark:border-emerald-800/50">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Thank you, {profile?.name}!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your testimonial has been submitted successfully and is waiting for review.</p>
                                </div>
                                <button 
                                    onClick={() => setIsSuccess(false)}
                                    className="px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all"
                                >
                                    Submit Another
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                {/* Rating Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        How would you rate your experience?
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star 
                                                    className={cn(
                                                        "h-10 w-10 transition-colors",
                                                        (hoverRating || rating) >= star 
                                                            ? "text-amber-400 fill-amber-400" 
                                                            : "text-slate-200 dark:text-slate-700"
                                                    )} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        Your Success Story
                                        <span className="text-xs font-normal text-slate-400">(Min 20 characters)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea 
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Write your experience here... (e.g. 'ExamMaster helped me improve my score by 40% in just one month!')"
                                            className="w-full min-h-[200px] p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
                                            required
                                        />
                                        <div className="absolute top-4 right-4 text-slate-300 dark:text-slate-700">
                                            <Quote className="h-8 w-8 fill-current opacity-20" />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                                        {error}
                                    </p>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isSubmitting || content.length < 10}
                                    className="w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Submit Testimonial
                                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Preview Card */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white px-2">Preview</h3>
                    <motion.div 
                        className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-lg border border-slate-100 dark:border-slate-800 space-y-6 relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                         <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="h-6 w-6" />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={cn(
                                        "h-5 w-5",
                                        rating > i ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"
                                    )} 
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <p className="text-slate-600 dark:text-slate-300 italic min-h-[80px]">
                            {content || "Your feedback will look like this..."}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                                {profile?.name?.charAt(0) || <User className="h-6 w-6" />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">{profile?.name || "Student Name"}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                    {profile?.educationalLevel ? `${profile.educationalLevel} Student` : "Student"}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tip Card */}
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[28px] border border-indigo-100 dark:border-indigo-800/50">
                        <h4 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm mb-2">Pro Tip!</h4>
                        <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                            Try to be specific! Mention which subject you improved in or how a specific feature like 'Timed Exams' helped you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
