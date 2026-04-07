"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { studentService, type StudentProfile, type StudentSubject } from "@/lib/services/student.service"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, ChevronRight, Library } from "lucide-react"

export default function StudentSubjectsPage() {
    const [subjects, setSubjects] = useState<StudentSubject[]>([])
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const loadSubjects = async () => {
            setLoading(true)
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }
                const student = await studentService.getProfile(token)
                setProfile(student)
                const data = await studentService.getSubjectsForStudent(student.id, token)
                setSubjects(data)
            } catch (err: any) {
                setError(err?.message || "Failed to load subjects")
            } finally {
                setLoading(false)
            }
        }
        loadSubjects()
    }, [router])

    return (
        <div className="p-8 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-10 shadow-xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-indigo-100 font-bold text-sm tracking-wide"
                    >
                        <Library className="h-4 w-4" />
                        ACADEMIC WORKSPACE
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl lg:text-5xl font-black text-white leading-tight"
                    >
                        My Enrolled Subjects
                    </motion.h1>
                    {profile && (
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-indigo-50 font-medium opacity-90 max-w-lg mt-2"
                        >
                            Showing syllabus mapped to <span className="font-bold text-white">{profile.educationalLevel}</span>. Select a subject to view course content and start an exam.
                        </motion.p>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    {error}
                </div>
            )}

            {/* Subjects Grid */}
            {!error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-[280px] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse p-6">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6" />
                                <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2" />
                                <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8" />
                                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
                            </div>
                        ))
                    ) : subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <motion.div
                                key={subject.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white dark:bg-slate-900 rounded-[28px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col min-h-[280px]"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                                
                                <div className="mb-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                        {subject.grade?.name ?? `Grade ${subject.gradeId}`} • ID: {subject.id.substring(0, 8)}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-auto">
                                    {subject.name}
                                </h3>

                                <button
                                    onClick={() => router.push(`/dashboard/subjects/${subject.id}`)}
                                    className="mt-8 flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                                >
                                    <span>Explore Subject</span>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm">
                            <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active syllabus found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">There are no subjects currently mapped to your educational profile. Check back later.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
