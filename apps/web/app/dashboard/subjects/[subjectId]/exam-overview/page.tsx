"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
    ChevronLeft, 
    Clock, 
    FileText, 
    Trophy, 
    Zap,
    AlertTriangle,
    ClipboardList,
    Play,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { studentService, type StudentSubject } from "@/lib/services/student.service"
import { assessmentService, examCategoryToLabel, type AssessmentExamDetail } from "@/lib/services/assessment.service"

interface ExamTypeInfo {
    title: string
    accent: string
    gradient: string
}

const EXAM_TYPE_INFO: Record<string, ExamTypeInfo> = {
    "random-new": {
        title: "Random New",
        accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
        gradient: "from-blue-600 via-blue-500 to-indigo-500",
    },
    "lesson-wise": {
        title: "Lesson Wise",
        accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20",
        gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    },
    "past-papers": {
        title: "Past Papers",
        accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
        gradient: "from-amber-500 via-orange-500 to-red-500",
    },
    live: {
        title: "Live Exam",
        accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
        gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    },
}

export default function ExamOverviewPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()

    const subjectId = params.subjectId as string
    const examType = searchParams.get("type") || "random-new"
    const examId = searchParams.get("examId") || ""

    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [exam, setExam] = useState<AssessmentExamDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)

    const examTypeInfo = useMemo(() => EXAM_TYPE_INFO[examType], [examType])

    useEffect(() => {
        const loadPageData = async () => {
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const subjects = await studentService.getSubjectsForStudent("", token)
                const found = subjects.find((s) => s.id === subjectId)
                setSubject(found || null)

                let resolvedExamId = examId
                if (!resolvedExamId) {
                    const exams = await assessmentService.getAvailableExamsForSubject(subjectId, examType)
                    if (exams.length === 0) {
                        setError("No exams available for this category.")
                        return
                    }
                    resolvedExamId = exams[0].id
                }

                const examDetails = await assessmentService.getExamById(resolvedExamId)
                setExam(examDetails)
            } catch (err) {
                console.error("Failed to load exam data:", err)
                setError("Failed to load exam overview details. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        loadPageData()
    }, [router, subjectId, examId, examType])

    const handleStartExam = () => {
        setShowConfirm(true)
    }

    const confirmStartExam = () => {
        if (!exam) return
        router.push(`/dashboard/subjects/${subjectId}/exam?type=${examType}&examId=${exam.id}`)
    }

    if (loading) return (
        <div className="p-4 lg:p-6 space-y-6 animate-pulse">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-[24px]" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-[20px]" />)}
            </div>
            <div className="h-64 bg-slate-50 dark:bg-slate-900/50 rounded-[24px]" />
        </div>
    )

    if (error) return (
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[50vh]">
            <div className="h-20 w-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500">
                <AlertTriangle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{error}</h2>
                <p className="text-sm text-slate-500">Try going back and selecting the exam category again.</p>
            </div>
            <button
                onClick={() => router.back()}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all shadow-lg active:scale-95"
            >
                Go Back
            </button>
        </div>
    )

    if (!exam) return null

    const rules = exam.metadata?.rules?.length
        ? exam.metadata.rules
        : [
              `You have ${exam.duration} minutes to complete this exam session.`,
              "Once the examination starts, the timer cannot be paused or reset.",
              "You can navigate through all questions and review them before finally submitting.",
              "Please ensure you have a stable internet connection before proceeding.",
          ]

    const totalMarks = exam.metadata?.totalMarks ?? exam.examQuestions.reduce((sum, item) => sum + item.marks, 0)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-3 lg:p-4 xl:p-6"
        >
            <div className="max-w-[1600px] mx-auto space-y-5">
                {/* Header / Back Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => router.back()}
                    className="group flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors w-fit mb-2"
                >
                    <div className="h-6 w-6 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] tracking-wide">Back to Exams</span>
                </motion.button>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                    {/* Left content area */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-5">
                        {/* Banner Section */}
                        <motion.div 
                            variants={itemVariants}
                            className={cn(
                                "relative overflow-hidden rounded-[20px] px-6 py-5 lg:px-8 lg:py-6 shadow-md text-white border border-blue-400/20",
                                "bg-gradient-to-r",
                                "from-blue-600 to-indigo-600"
                            )}
                        >
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-xl lg:text-2xl font-black tracking-tight leading-tight">
                                        {exam.title}
                                    </h1>
                                    <p className="text-xs lg:text-sm font-medium text-white/80">
                                        Subject: <span className="font-bold text-white tracking-wide">{subject?.name || "Topic"}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shrink-0 border border-white/10 w-fit">
                                    <Zap className="h-3.5 w-3.5 text-amber-300 mix-blend-screen" />
                                    {examCategoryToLabel(exam.metadata?.examTypeCategory)}
                                </div>
                            </div>
                        </motion.div>

                        {/* Exam Details Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <OverviewDetail icon={FileText} label="Total Questions" value={exam.examQuestions.length.toString()} />
                            <OverviewDetail icon={Clock} label="Time Duration" value={`${exam.duration} Minutes`} />
                            <OverviewDetail icon={Trophy} label="Available Marks" value={totalMarks.toString()} />
                            <OverviewDetail icon={Zap} label="Pass Criteria" value={`${exam.passingScore}%`} />
                        </motion.div>

                        {/* Rules & Instructions */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Rules & Instructions</h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Please read carefully before proceeding</p>
                                </div>
                            </div>

                            <ul className="space-y-2 pt-2">
                                {rules.map((rule, index) => (
                                    <li key={index} className="flex gap-4 group items-start p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                        <div className="h-8 w-8 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed pt-1 flex-1">
                                            {rule}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right content area - Sticky sidebar */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-6">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] p-5 shadow-sm overflow-hidden relative"
                        >
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Important Note</h2>
                                </div>

                                <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl space-y-3">
                                    <p className="text-xs font-bold text-rose-700/80 leading-relaxed italic">
                                        "Please read all instructions carefully before starting the session."
                                    </p>
                                    <p className="text-xs font-medium text-rose-600/90 dark:text-rose-400/80 leading-relaxed">
                                        Once you click <span className="font-black underline">"Start Examination"</span>, the timer will begin immediately. 
                                        Ensure you have a stable network to avoid disruptions.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <div className="flex flex-col gap-2.5">
                                        <button
                                            onClick={handleStartExam}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all group/start hover:-translate-y-0.5"
                                        >
                                            <Play className="h-4 w-4 fill-current group-hover:translate-x-1 transition-transform" />
                                            <span className="text-sm">Start Examination</span>
                                        </button>
                                        <button
                                            onClick={() => router.back()}
                                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs"
                                        >
                                            Cancel & Return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        <div className="relative p-6 text-center space-y-6">
                            <button 
                                onClick={() => setShowConfirm(false)}
                                className="absolute top-4 right-4 h-8 w-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="mx-auto h-16 w-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mt-2 shadow-inner border border-blue-100 dark:border-blue-800/50">
                                <AlertTriangle className="h-7 w-7" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Ready to begin?
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
                                    Once started, the timer cannot be paused. Ensure you are ready and have a stable connection.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStartExam}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-sm"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    Start Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}

function OverviewDetail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[16px] border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-blue-100 min-h-[80px]">
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-blue-50/50 dark:bg-slate-800 text-blue-500 dark:text-slate-400">
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none truncate">{value}</span>
            </div>
        </div>
    )
}
