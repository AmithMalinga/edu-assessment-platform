"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
    ChevronLeft, 
    Clock, 
    FileText, 
    Trophy, 
    Calendar, 
    ArrowRight,
    Zap,
    Layout
} from "lucide-react"
import { cn } from "@/lib/utils"
import { assessmentService, type AssessmentExamSummary } from "@/lib/services/assessment.service"
import { studentService, type StudentSubject } from "@/lib/services/student.service"

interface ExamTypeInfo {
    title: string
    accent: string
    gradient: string
    description: string
    emptyMessage: string
}

const EXAM_TYPE_INFO: Record<string, ExamTypeInfo> = {
    "random-new": {
        title: "Random New",
        accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
        gradient: "from-blue-600 via-blue-500 to-indigo-500",
        description: "Fresh, randomized assessments designed for quick and effective practice.",
        emptyMessage: "No random new exams are available yet for this subject.",
    },
    "lesson-wise": {
        title: "Lesson Wise",
        accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20",
        gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
        description: "Targeted practice questions organized by specific lessons and academic topics.",
        emptyMessage: "No lesson-wise exams are available yet for this subject.",
    },
    "past-papers": {
        title: "Past Papers",
        accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
        gradient: "from-amber-500 via-orange-500 to-red-500",
        description: "Official past paper simulations to build confidence and exam familiarity.",
        emptyMessage: "No past paper exams are available yet for this subject.",
    },
    live: {
        title: "Live Exam",
        accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
        gradient: "from-emerald-600 via-teal-500 to-cyan-500",
        description: "Real-time, competitive assessments conducted under strict examination criteria.",
        emptyMessage: "No live exams are currently scheduled for this subject.",
    },
}

const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleDateString()
}

export default function ExamListByTypePage() {
    const router = useRouter()
    const params = useParams()

    const subjectId = params.subjectId as string
    const examType = params.examType as string

    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [exams, setExams] = useState<AssessmentExamSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const examTypeInfo = useMemo(() => EXAM_TYPE_INFO[examType], [examType])
    const sortedExams = useMemo(
        () => [...exams].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
        [exams],
    )

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError("")

            if (!examTypeInfo) {
                setError("Invalid exam type selected.")
                setLoading(false)
                return
            }

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const [subjects, availableExams] = await Promise.all([
                    studentService.getSubjectsForStudent("", token),
                    assessmentService.getAvailableExamsForSubject(subjectId, examType),
                ])

                const foundSubject = subjects.find((item) => item.id === subjectId) || null
                setSubject(foundSubject)
                setExams(availableExams)
            } catch (err: any) {
                setError(err?.message || "Failed to load exams for this category.")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [examType, examTypeInfo, router, subjectId])

    const handleViewExam = (examId: string) => {
        router.push(`/dashboard/subjects/${subjectId}/exam-overview?type=${examType}&examId=${examId}`)
    }

    if (loading) return (
        <div className="p-4 lg:p-6 space-y-6 animate-pulse">
            <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 rounded-[24px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-900 rounded-[20px]" />)}
            </div>
        </div>
    )

    return (
        <div className="p-4 lg:p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950/50">
            {/* Header / Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors"
            >
                <div className="h-6 w-6 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center transition-transform group-hover:-translate-x-1">
                    <ChevronLeft className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px]">Back to Subject</span>
            </motion.button>

            {/* Banner Section */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "relative overflow-hidden rounded-[24px] p-6 shadow-lg text-white",
                    "bg-gradient-to-br",
                    examTypeInfo?.gradient || "from-slate-800 via-slate-700 to-slate-800"
                )}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center shadow-inner">
                            <Zap className="text-white h-3.5 w-3.5 fill-current" />
                        </div>
                        <div className="h-1 w-1 rounded-full bg-white/40" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/80">Available Category</span>
                    </div>

                    <div className="space-y-0.5">
                        <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                            {examTypeInfo?.title} Exams
                        </h1>
                        <p className="text-xs font-medium text-white/90">
                            Subject: <span className="font-extrabold">{subject?.name || "All Topics"}</span>
                        </p>
                    </div>

                    <p className="text-[10px] text-white/80 max-w-xl font-medium leading-relaxed">
                        {examTypeInfo?.description}
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-[9px] font-black border border-white/10 uppercase tracking-wider">
                            {sortedExams.length} Exams Ready
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[16px] text-rose-600 flex items-center gap-3">
                    <Zap className="h-4 w-4" />
                    <p className="text-xs font-bold">{error}</p>
                </div>
            )}

            {/* Exams Grid */}
            {!error && exams.length === 0 ? (
                <div className="rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Layout className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">No exams found</h2>
                        <p className="text-xs text-slate-500 max-w-sm">{examTypeInfo?.emptyMessage}</p>
                    </div>
                    <button
                        onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg transition-all active:scale-95 shadow-md shadow-slate-900/20 text-xs"
                    >
                        Back to Subject
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sortedExams.map((exam, index) => (
                        <motion.article
                            key={exam.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.3 }}
                            whileHover={{ y: -3 }}
                            className="group relative bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col gap-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-0.5 flex-1 overflow-hidden">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight truncate">{exam.title}</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subject?.name}</p>
                                </div>
                                <div className={cn(
                                    "px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shrink-0",
                                    examTypeInfo?.accent || "bg-slate-100 text-slate-700"
                                )}>
                                    {exam.metadata?.examQuestionType || "MCQ"}
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed min-h-[32px] line-clamp-2">
                                {exam.description || "Take this opportunity to test your knowledge and track your progress in this area."}
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                <DetailBox icon={FileText} label="Questions" value={exam.questionCount.toString()} />
                                <DetailBox icon={Clock} label="Duration" value={`${exam.duration}m`} />
                                <DetailBox icon={Trophy} label="Passing" value={`${exam.passingScore}%`} />
                                <DetailBox icon={Calendar} label="Updated" value={formatDate(exam.updatedAt)} />
                            </div>

                            <button
                                onClick={() => handleViewExam(exam.id)}
                                className="mt-1 flex items-center justify-between px-5 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl shadow-md shadow-slate-900/5 hover:shadow-indigo-500/10 active:scale-95 transition-all group/btn text-xs"
                            >
                                <span>View & Take Exam</span>
                                <div className="h-6 w-6 bg-white/10 rounded-lg flex items-center justify-center transition-transform group-hover/btn:scale-110">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                            </button>
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    )
}

function DetailBox({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-[14px] border border-slate-100/50 dark:border-slate-800/50 flex items-center gap-2 group/box hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-sm text-slate-400 group-hover/box:text-indigo-500 transition-colors shrink-0">
                <Icon className="h-3 w-3" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</span>
                <span className="text-[11px] font-black text-slate-900 dark:text-white leading-none mt-0.5 truncate">{value}</span>
            </div>
        </div>
    )
}
