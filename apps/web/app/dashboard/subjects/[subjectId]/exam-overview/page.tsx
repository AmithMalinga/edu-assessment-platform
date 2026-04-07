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
    Play
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
            className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 xl:p-10"
        >
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header / Back Button */}
                <motion.button
                    variants={itemVariants}
                    onClick={() => router.back()}
                    className="group flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors w-fit"
                >
                    <div className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                        <ChevronLeft className="h-4 w-4" />
                    </div>
                    <span className="text-xs tracking-wide">Back to Subject</span>
                </motion.button>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left content area */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                        {/* Banner Section */}
                        <motion.div 
                            variants={itemVariants}
                            className={cn(
                                "relative overflow-hidden rounded-[32px] p-8 lg:p-10 shadow-lg text-white",
                                "bg-gradient-to-br",
                                examTypeInfo?.gradient || "from-slate-800 via-slate-700 to-slate-800"
                            )}
                        >
                            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
                                        <ClipboardList className="text-white h-5 w-5" />
                                    </div>
                                    <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">Information Overview</span>
                                </div>

                                <div className="space-y-4 mt-8">
                                    <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl">
                                        {exam.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium">
                                            <span className="text-white/70">Subject:</span>
                                            <span className="font-extrabold text-white">{subject?.name || "Topic"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wider">
                                            <Zap className="h-4 w-4 text-amber-300" />
                                            {examCategoryToLabel(exam.metadata?.examTypeCategory)}
                                        </div>
                                    </div>
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
                            className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm space-y-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Rules & Instructions</h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Please read carefully before proceeding</p>
                                </div>
                            </div>

                            <ul className="space-y-4 pt-4">
                                {rules.map((rule, index) => (
                                    <li key={index} className="flex gap-5 group items-start p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                        <div className="h-8 w-8 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed pt-1 flex-1">
                                            {rule}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right content area - Sticky sidebar */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-8">
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm overflow-hidden relative"
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
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleStartExam}
                                            className="w-full flex items-center justify-center gap-2.5 px-6 py-5 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all group/start hover:-translate-y-1"
                                        >
                                            <Play className="h-5 w-5 fill-current group-hover:translate-x-1 transition-transform" />
                                            <span className="text-sm">Start Examination</span>
                                        </button>
                                        <button
                                            onClick={() => router.back()}
                                            className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-xs"
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
        </motion.div>
    )
}

function OverviewDetail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 hover:border-indigo-100 min-h-[96px]">
            <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-indigo-50/50 dark:bg-slate-800 text-indigo-500 dark:text-slate-400">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1.5">{label}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-none truncate">{value}</span>
            </div>
        </div>
    )
}
