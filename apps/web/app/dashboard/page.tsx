"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { WelcomeBanner } from "./_components/welcome-banner"
import { CourseCard } from "./_components/course-card"
import { ExamFeedCard } from "./_components/exam-feed-card"
import { RightSidebar } from "./_components/right-sidebar"
import { studentService, type StudentProfile, type StudentSubject } from "@/lib/services/student.service"
import { assessmentService, type AssessmentExamSummary } from "@/lib/services/assessment.service"

const SUBJECT_COLORS = [
    "from-teal-500 to-emerald-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-rose-500 to-pink-600"
]

export default function DashboardPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [subjects, setSubjects] = useState<StudentSubject[]>([])
    const [allExams, setAllExams] = useState<AssessmentExamSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [examsLoading, setExamsLoading] = useState(true)
    const [showAllSubjects, setShowAllSubjects] = useState(false)
    const [showAllExams, setShowAllExams] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const searchQuery = searchParams.get("search")?.toLowerCase() || ""

    const filteredSubjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery) || 
        subject.grade?.name?.toLowerCase().includes(searchQuery)
    )

    const filteredExams = allExams.filter(exam => 
        exam.title.toLowerCase().includes(searchQuery) || 
        exam.metadata?.subjectName?.toLowerCase().includes(searchQuery)
    )

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                // Start profile and exams fetch in parallel
                const [profileData, examsData] = await Promise.all([
                    studentService.getProfile(token),
                    assessmentService.getAllExams()
                ])

                setProfile(profileData)

                // Fetch subjects after profile is known
                const subjectsData = await studentService.getSubjectsForStudent(profileData.id, token)
                setSubjects(subjectsData)

                // Sort by newest first
                const sortedExams = examsData.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setAllExams(sortedExams)
            } catch (error) {
                console.error("Dashboard Fetch Error:", error)
            } finally {
                setLoading(false)
                setExamsLoading(false)
            }
        }

        fetchAllData()
    }, [router])

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 lg:space-y-10 overflow-hidden">
                
                {/* Welcome Section */}
                {loading ? (
                    <div className="h-32 sm:h-48 w-full bg-white dark:bg-slate-900 animate-pulse rounded-[28px] sm:rounded-[32px]" />
                ) : (
                    <WelcomeBanner name={profile?.name} />
                )}

                {/* Courses Section */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {!loading && (
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Subjects</h2>
                        )}
                        {filteredSubjects.length > 3 && !loading && (
                            <button 
                                onClick={() => setShowAllSubjects(!showAllSubjects)}
                                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left sm:text-right"
                            >
                                {showAllSubjects ? "Show Less" : "View All"}
                            </button>
                        )}
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[28px]" />
                            ))}
                        </div>
                    ) : filteredSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(showAllSubjects ? filteredSubjects : filteredSubjects.slice(0, 3)).map((subject, index) => (
                                <motion.div
                                    key={subject.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CourseCard 
                                        id={subject.id}
                                        title={subject.name}
                                        category={subject.grade?.name || "Subject"}
                                        color={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                             <p className="text-slate-500 font-medium">
                                 {searchQuery ? `No subjects found matching "${searchQuery}"` : "No subjects found. Start by enrolling in a course!"}
                             </p>
                        </div>
                    )}
                </section>

                {/* New Arrivals / Recent Exams Feed */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {!loading && (
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Exams</h2>
                            </div>
                        )}
                        {filteredExams.length > 3 && !loading && (
                            <button 
                                onClick={() => setShowAllExams(!showAllExams)}
                                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left sm:text-right"
                            >
                                {showAllExams ? "Show Less" : "View All"}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examsLoading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-[28px]" />
                            ))
                        ) : filteredExams.length > 0 ? (
                            (showAllExams ? filteredExams : filteredExams.slice(0, 3)).map((exam, index) => {
                                const category = exam.metadata?.examTypeCategory || "RANDOM_NEW"
                                const typeSlug = category.toLowerCase().replace('_', '-')

                                return (
                                    <motion.div
                                        key={exam.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ExamFeedCard 
                                            id={exam.id}
                                            title={exam.title}
                                            subject={exam.metadata?.subjectName || "General"}
                                            subjectId={exam.metadata?.subjectId || ""}
                                            typeSlug={typeSlug}
                                            questions={exam.questionCount}
                                            duration={exam.duration}
                                            createdAt={exam.createdAt}
                                            color={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                                        />
                                    </motion.div>
                                )
                            })
                        ) : (
                            <div className="w-full p-10 text-center bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500 font-medium">
                                    {searchQuery ? `No exams found matching "${searchQuery}"` : "No new exams available right now."}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Right Sidebar Section */}
            <div className="hidden xl:block">
                <RightSidebar />
            </div>
        </div>
    )
}
