"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { studentService, type StudentSubject } from "@/lib/services/student.service"
import { motion } from "framer-motion"
import { ArrowLeft, ChevronLeft, Dices, BookText, FileClock, Radio } from "lucide-react"
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
            router.push(`/dashboard/subjects/${subjectId}/exam-types/${examType}`)
            return
        }

        router.push(`/dashboard/subjects/${subjectId}/exam-types`)
    }

    if (loading) {
        return (
            <div className="px-8 lg:px-10 py-4 lg:py-6 space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
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
        <div className="px-8 lg:px-10 py-4 lg:py-6 space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div>
                {/* <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6 group"
                >
                    <div className="flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">
                        Back to Subjects
                    </span>
                </button> */}
                <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        {subject.grade?.name ?? `Grade ${subject.gradeId}`}
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {subject.name}
                    </h1>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Random Mix */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => handleTakeExam("random-new")}
                        className="group relative bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col min-h-[300px] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Dices className="h-7 w-7" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                            Random Mix
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-auto leading-relaxed">
                            Generates random questions from all recent lessons for a comprehensive quick practice session.
                        </p>

                        <button className="mt-6 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            Start Session
                        </button>
                    </motion.div>

                    {/* Lesson Wise */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => handleTakeExam("lesson-wise")}
                        className="group relative bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col min-h-[300px] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookText className="h-7 w-7" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                            Lesson Wise
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-auto leading-relaxed">
                            Targeted practice questions organized by specific lessons and topics within the syllabus.
                        </p>

                        <button className="mt-6 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            Target Practice
                        </button>
                    </motion.div>

                    {/* Past Papers */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => handleTakeExam("past-papers")}
                        className="group relative bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col min-h-[300px] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileClock className="h-7 w-7" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                            Past Papers
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-auto leading-relaxed">
                            Complete previous actual exam papers to practice with original historical questions.
                        </p>

                        <button className="mt-6 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                            View Archive
                        </button>
                    </motion.div>

                    {/* Live Exam */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        onClick={() => handleTakeExam("live")}
                        className="group relative bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col min-h-[300px] cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Radio className="h-7 w-7" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                            Live Exam
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-auto leading-relaxed">
                            Enter a real-time proctored scheduled exam with strict monitoring and time constraints.
                        </p>

                        <button className="mt-6 w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                            Join Live
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Other Options */}
            {/* <div className="text-center pt-4">
                <button
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview`)}
                    className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4"
                >
                    View global exam rules & requirements for this subject
                </button>
            </div> */}
        </div>
    )
}
