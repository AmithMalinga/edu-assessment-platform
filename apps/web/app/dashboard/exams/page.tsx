"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { assessmentService, type AssessmentExamSummary } from "@/lib/services/assessment.service"
import { ExamFeedCard } from "../_components/exam-feed-card"
import { Search, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

const SUBJECT_COLORS = [
    "from-teal-500 to-emerald-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-rose-500 to-pink-600"
]

export default function ExamsPage() {
    const [allExams, setAllExams] = useState<AssessmentExamSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL")

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const examsData = await assessmentService.getAllExams()
                // Sort by newest first
                const sortedExams = examsData.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setAllExams(sortedExams)
            } catch (error) {
                console.error("Exams Fetch Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchExams()
    }, [])

    const categories = [
        { id: "ALL", name: "All Exams" },
        { id: "LIVE", name: "Live Exams" },
        { id: "PAST_PAPERS", name: "Past Papers" },
        { id: "LESSON_WISE", name: "Lesson Wise" },
        { id: "RANDOM_NEW", name: "New Quizzes" },
    ]

    const filteredExams = allExams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            exam.metadata?.subjectName?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "ALL" || exam.metadata?.examTypeCategory === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="p-8 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Examination Hall</h1>
                <p className="text-slate-500 font-medium text-lg">
                    Access all your assessments, past papers, and live examinations in one place.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search exams or subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border-2",
                                selectedCategory === cat.id
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-100 dark:hover:border-indigo-900/30"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-72 bg-white dark:bg-slate-900 animate-pulse rounded-[28px] border border-slate-100 dark:border-slate-800" />
                    ))}
                </div>
            ) : filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredExams.map((exam, index) => {
                        const category = exam.metadata?.examTypeCategory || "RANDOM_NEW"
                        const typeSlug = category.toLowerCase().replace('_', '-')

                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
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
                                    isLive={exam.metadata?.examTypeCategory === 'LIVE'}
                                    startsAt={exam.metadata?.startsAt || undefined}
                                    endsAt={exam.metadata?.endsAt || undefined}
                                />
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-100 dark:border-slate-800 text-center space-y-6">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">No assessments found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                            {searchQuery 
                                ? `We couldn't find any exams matching "${searchQuery}". Try adjusting your keywords.`
                                : "There are no exams available in this category at the moment. Please check back later!"}
                        </p>
                    </div>
                    <button 
                        onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }}
                        className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 transition-all active:scale-95"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    )
}
