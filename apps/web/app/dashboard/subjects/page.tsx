"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { studentService, type StudentProfile, type StudentSubject } from "@/lib/services/student.service"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, ChevronRight, Library, Search } from "lucide-react"
import { CourseCard } from "../_components/course-card"

const SUBJECT_COLORS = [
    "from-teal-500 to-emerald-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-rose-500 to-pink-600"
]

export default function StudentSubjectsPage() {
    const [subjects, setSubjects] = useState<StudentSubject[]>([])
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const filteredSubjects = useMemo(() => {
        return subjects.filter(subject => 
            subject.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [subjects, searchQuery])

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
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Enrolled Subjects</h1>
                <p className="text-slate-500 font-medium">Access your interactive learning modules and course materials.</p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by subject name..." 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    {error}
                </div>
            )}

            {/* Subjects Grid */}
            {!error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="h-[280px] rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse p-6">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6" />
                                <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2" />
                                <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8" />
                                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
                            </div>
                        ))
                    ) : filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, index) => (
                            <motion.div
                                key={subject.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CourseCard 
                                    id={subject.id}
                                    title={subject.name}
                                    category={subject.grade?.name || "Subject"}
                                    color={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                                    showExploreButton={true}
                                />
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
