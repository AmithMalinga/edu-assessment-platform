"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { studentService, type StudentSubject } from "@/lib/services/student.service"
import { motion } from "framer-motion"
import { ArrowLeft, Dices, BookText, FileClock, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SubjectDetailPage() {
    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()
    const params = useParams()
    const subjectId = params.subjectId as string

    useEffect(() => {
        const loadSubject = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const subjects = await studentService.getSubjectsForStudent("", token)
                const found = subjects.find((s) => s.id === subjectId)
                
                if (!found) {
                    setError("Subject not found")
                } else {
                    setSubject(found)
                }
            } catch (err: any) {
                setError(err?.message || "Failed to load subject")
            } finally {
                setLoading(false)
            }
        }

        loadSubject()
    }, [router, subjectId])

    const handleTakeExam = (examType?: string) => {
        if (examType) {
            router.push(`/dashboard/subjects/${subjectId}/exam?type=${examType}`)
        } else {
            router.push(`/dashboard/subjects/${subjectId}/exam-types`)
        }
    }

    if (loading) {
        return (
            <div className="p-8 lg:p-10 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
                 <div className="h-24 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                 <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-[32px] w-full" />
            </div>
        )
    }

    if (error || !subject) {
        return (
            <div className="p-8 lg:p-10">
                <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Go Back
                </button>
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    {error || "Subject not found"}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 lg:p-10 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Subjects
                </button>
                <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        {subject.grade?.name ?? `Grade ${subject.gradeId}`}
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {subject.name}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        ID: {subject.id}
                    </p>
                </div>
            </div>

            {/* Exam Types Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 lg:p-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">MCQ Exam Simulator</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Select a mode to generate a practice exam designed specifically for {subject.name}.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Random Mix */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        onClick={() => handleTakeExam("random-new")}
                        className="group bg-blue-50/50 dark:bg-blue-900/10 rounded-[28px] border border-blue-100 dark:border-blue-900/30 p-6 cursor-pointer overflow-hidden relative transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                                <Dices className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Random Mix</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                                Generates random questions from all recent lessons for a comprehensive quick practice session.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 font-bold shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                Start Session
                            </button>
                        </div>
                    </motion.div>

                    {/* Lesson Wise */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        onClick={() => handleTakeExam("lesson-wise")}
                        className="group bg-purple-50/50 dark:bg-purple-900/10 rounded-[28px] border border-purple-100 dark:border-purple-900/30 p-6 cursor-pointer overflow-hidden relative transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                                <BookText className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lesson Wise</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                                Targeted practice questions organized by specific lessons and topics within the syllabus.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 font-bold shadow-sm group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                                Target Practice
                            </button>
                        </div>
                    </motion.div>

                    {/* Past Papers */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        onClick={() => handleTakeExam("past-papers")}
                        className="group bg-amber-50/50 dark:bg-amber-900/10 rounded-[28px] border border-amber-100 dark:border-amber-900/30 p-6 cursor-pointer overflow-hidden relative transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                <FileClock className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Past Papers</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                                Complete previous actual exam papers to practice with original historical questions.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 font-bold shadow-sm group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all">
                                View Archive
                            </button>
                        </div>
                    </motion.div>

                    {/* Live Exam */}
                    <motion.div 
                        whileHover={{ y: -4 }}
                        onClick={() => handleTakeExam("live")}
                        className="group bg-red-50/50 dark:bg-red-900/10 rounded-[28px] border border-red-100 dark:border-red-900/30 p-6 cursor-pointer overflow-hidden relative transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                                <Radio className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Live Exam</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
                                Enter a real-time proctored scheduled exam with strict monitoring and time constraints.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-bold shadow-sm group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                                Join Live
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Other Options */}
            <div className="text-center pt-4">
                <button
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview`)}
                    className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4"
                >
                    View global exam rules & requirements for this subject
                </button>
            </div>
        </div>
    )
}
