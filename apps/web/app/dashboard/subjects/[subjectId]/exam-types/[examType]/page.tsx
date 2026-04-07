"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { assessmentService, type AssessmentExamSummary } from "@/lib/services/assessment.service"
import { studentService, type StudentSubject } from "@/lib/services/student.service"

interface ExamTypeInfo {
    title: string
    accent: string
    description: string
    emptyMessage: string
}

const EXAM_TYPE_INFO: Record<string, ExamTypeInfo> = {
    "random-new": {
        title: "Random New",
        accent: "bg-blue-100 text-blue-700 border-blue-200",
        description: "Random questions from recent lessons for quick practice.",
        emptyMessage: "No random new exams are available yet for this subject.",
    },
    "lesson-wise": {
        title: "Lesson Wise",
        accent: "bg-violet-100 text-violet-700 border-violet-200",
        description: "Practice questions organized by lesson and topic.",
        emptyMessage: "No lesson-wise exams are available yet for this subject.",
    },
    "past-papers": {
        title: "Past Papers",
        accent: "bg-amber-100 text-amber-700 border-amber-200",
        description: "Previous paper style exams to improve exam readiness.",
        emptyMessage: "No past paper exams are available yet for this subject.",
    },
    live: {
        title: "Live Exam",
        accent: "bg-red-100 text-red-700 border-red-200",
        description: "Real-time assessments with strict exam conditions.",
        emptyMessage: "No live exams are available yet for this subject.",
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

    const renderAvailability = (exam: AssessmentExamSummary) => {
        const startsAt = exam.metadata?.startsAt
        const endsAt = exam.metadata?.endsAt

        if (!startsAt || !endsAt) {
            return <span className="text-xs font-medium text-emerald-700">Available anytime</span>
        }

        return (
            <span className="text-xs font-medium text-slate-600">
                {formatDate(startsAt)} - {formatDate(endsAt)}
            </span>
        )
    }

    if (loading) return <p>Loading exams...</p>

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

            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">{examTypeInfo?.title || "Exam Type"} Exams</h1>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${examTypeInfo?.accent || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {sortedExams.length} available
                    </span>
                </div>
                <p className="text-slate-600 mt-2">Subject: {subject?.name || "Unknown subject"}</p>
                <p className="text-sm text-slate-500 mt-2">{examTypeInfo?.description || "Select an exam to continue."}</p>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            {!error && exams.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">No exams found</h2>
                    <p className="text-sm text-slate-600 mb-4">{examTypeInfo?.emptyMessage || "No exams are available."}</p>
                    <button
                        onClick={() => router.push(`/dashboard/subjects/${subjectId}`)}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Back to Subject
                    </button>
                </div>
            ) : null}

            {sortedExams.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {sortedExams.map((exam) => (
                        <article
                            key={exam.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-lg font-semibold text-slate-900 leading-snug">{exam.title}</h2>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                    {exam.metadata?.examQuestionType || "MCQ"}
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 mt-2 min-h-[40px]">
                                {exam.description || "Practice exam ready to start."}
                            </p>

                            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                {renderAvailability(exam)}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-md border border-slate-200 bg-white p-2.5">
                                    <p className="text-slate-500">Questions</p>
                                    <p className="font-semibold text-slate-900">{exam.questionCount}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-white p-2.5">
                                    <p className="text-slate-500">Duration</p>
                                    <p className="font-semibold text-slate-900">{exam.duration} min</p>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-white p-2.5">
                                    <p className="text-slate-500">Passing Score</p>
                                    <p className="font-semibold text-slate-900">{exam.passingScore}%</p>
                                </div>
                                <div className="rounded-md border border-slate-200 bg-white p-2.5">
                                    <p className="text-slate-500">Updated</p>
                                    <p className="font-semibold text-slate-900">{formatDate(exam.updatedAt)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewExam(exam.id)}
                                className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                View & Take Exam
                            </button>
                        </article>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
