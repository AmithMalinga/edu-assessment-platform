"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { studentService, type StudentSubject } from "@/lib/services/student.service"
import { assessmentService } from "@/lib/services/assessment.service"

interface ExamType {
    id: string
    title: string
    description: string
    icon: string
    color: string
}

const EXAM_TYPES: ExamType[] = [
    {
        id: "random-new",
        title: "Random New",
        description: "Random questions from recent lessons. Perfect for quick practice.",
        icon: "🎲",
        color: "from-blue-500 to-blue-600",
    },
    {
        id: "lesson-wise",
        title: "Lesson Wise",
        description: "Practice questions organized by specific lessons and topics.",
        icon: "📚",
        color: "from-purple-500 to-purple-600",
    },
    {
        id: "past-papers",
        title: "Past Papers",
        description: "Previous exam papers with original questions and patterns.",
        icon: "📄",
        color: "from-amber-500 to-amber-600",
    },
    {
        id: "live",
        title: "Live Exam",
        description: "Real-time proctored exam with strict time limits and monitoring.",
        icon: "🔴",
        color: "from-red-500 to-red-600",
    },
]

export default function ExamTypesPage() {
    const router = useRouter()
    const params = useParams()
    const subjectId = params.subjectId as string
    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [availableTypes, setAvailableTypes] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadSubject = async () => {
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

                const examCounts = await Promise.all(
                    EXAM_TYPES.map(async (examType) => {
                        const exams = await assessmentService.getAvailableExamsForSubject(subjectId, examType.id)
                        return [examType.id, exams.length] as const
                    }),
                )

                setAvailableTypes(Object.fromEntries(examCounts))
            } catch (err) {
                console.error("Failed to load subject:", err)
                setError("Failed to load exam types")
            } finally {
                setLoading(false)
            }
        }

        loadSubject()
    }, [router, subjectId])

    const handleSelectExamType = async (examTypeId: string) => {
        try {
            const exams = await assessmentService.getAvailableExamsForSubject(subjectId, examTypeId)
            if (exams.length === 0) {
                setError("No exams are available for this type yet.")
                return
            }

            const latestExam = exams[0]
            router.push(`/dashboard/subjects/${subjectId}/exam-overview?type=${examTypeId}&examId=${latestExam.id}`)
        } catch {
            setError("Unable to load the selected exam type right now.")
        }
    }

    if (loading) return <p>Loading exam types...</p>

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={() => router.back()}
                    className="mb-4 text-sm text-blue-600 hover:text-blue-700"
                >
                    ← Back
                </button>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">MCQ Exam Types</h1>
                <p className="text-slate-600 mt-1">Subject: {subject?.name || "Loading..."}</p>
                <p className="text-sm text-slate-500 mt-2">Select the type of exam you'd like to take</p>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {/* Exam Types Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
                {EXAM_TYPES.map((examType) => (
                    <div
                        key={examType.id}
                        className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Card Header with Gradient */}
                        <div className={`bg-gradient-to-r ${examType.color} p-6 text-white`}>
                            <div className="text-4xl mb-2">{examType.icon}</div>
                            <h2 className="text-xl font-semibold">{examType.title}</h2>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col">
                            <p className="text-slate-600 text-sm mb-4 flex-1">{examType.description}</p>
                            <p className="text-xs text-slate-500 mb-3">
                                Available exams: {availableTypes[examType.id] ?? 0}
                            </p>

                            {/* Details based on type */}
                            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-xs space-y-1">
                                {examType.id === "random-new" && (
                                    <>
                                        <p className="text-slate-600">• Questions: Random</p>
                                        <p className="text-slate-600">• Time: 60 minutes</p>
                                        <p className="text-slate-600">• Best for: Quick practice</p>
                                    </>
                                )}
                                {examType.id === "lesson-wise" && (
                                    <>
                                        <p className="text-slate-600">• Select specific lessons</p>
                                        <p className="text-slate-600">• Time: Flexible</p>
                                        <p className="text-slate-600">• Best for: Focused learning</p>
                                    </>
                                )}
                                {examType.id === "past-papers" && (
                                    <>
                                        <p className="text-slate-600">• Actual past exam papers</p>
                                        <p className="text-slate-600">• Time: 120 minutes</p>
                                        <p className="text-slate-600">• Best for: Exam preparation</p>
                                    </>
                                )}
                                {examType.id === "live" && (
                                    <>
                                        <p className="text-slate-600">• Real-time exam</p>
                                        <p className="text-slate-600">• Time: 120 minutes</p>
                                        <p className="text-slate-600">• Best for: Official assessment</p>
                                    </>
                                )}
                            </div>

                            {/* Button */}
                            <button
                                onClick={() => handleSelectExamType(examType.id)}
                                disabled={(availableTypes[examType.id] ?? 0) === 0}
                                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors bg-gradient-to-r ${examType.color} hover:opacity-90`}
                            >
                                Take {examType.title}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Exam Type Guide</h3>
                <div className="space-y-2 text-sm text-blue-800">
                    <p>
                        <strong>Random New:</strong> Get randomly selected questions from recently covered lessons.
                        Perfect for daily practice and quick revision.
                    </p>
                    <p>
                        <strong>Lesson Wise:</strong> Choose a specific lesson or topic and practice questions from that
                        area. Great for focused learning on particular topics.
                    </p>
                    <p>
                        <strong>Past Papers:</strong> Practice with actual previous exam papers. Helps you understand
                        the exam pattern and difficulty level.
                    </p>
                    <p>
                        <strong>Live Exam:</strong> Official proctored examination with strict rules. Your performance
                        counts towards your final assessment.
                    </p>
                </div>
            </div>
        </div>
    )
}
