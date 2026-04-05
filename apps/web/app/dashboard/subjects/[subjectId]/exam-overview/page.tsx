"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { studentService, type StudentSubject } from "@/lib/services/student.service"
import { assessmentService, examCategoryToLabel, type AssessmentExamDetail } from "@/lib/services/assessment.service"

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

                let resolvedExamId = examId
                if (!resolvedExamId) {
                    const exams = await assessmentService.getAvailableExamsForSubject(subjectId, examType)
                    if (exams.length === 0) {
                        setError("No exams available for this type yet.")
                        return
                    }
                    resolvedExamId = exams[0].id
                }

                const examDetails = await assessmentService.getExamById(resolvedExamId)
                setExam(examDetails)
            } catch (err) {
                console.error("Failed to load subject:", err)
                setError("Failed to load exam details")
            } finally {
                setLoading(false)
            }
        }

        loadSubject()
    }, [router, subjectId, examId, examType])

    const handleStartExam = () => {
        if (!exam) return
        router.push(`/dashboard/subjects/${subjectId}/exam?type=${examType}&examId=${exam.id}`)
    }

    if (loading) return <p>Loading exam details...</p>

    if (error) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => router.back()}
                    className="text-sm text-blue-600 hover:text-blue-700"
                >
                    ← Back
                </button>
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    if (!exam) return <p className="text-red-600">Exam not found</p>

    const rules = exam.metadata?.rules?.length
        ? exam.metadata.rules
        : [
              `You have ${exam.duration} minutes to complete this exam.`,
              "Once the exam starts, the timer cannot be paused.",
              "You can navigate between questions and review before final submit.",
          ]
    const totalMarks = exam.metadata?.totalMarks ?? exam.examQuestions.reduce((sum, item) => sum + item.marks, 0)

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <button
                    onClick={() => router.back()}
                    className="mb-4 text-sm text-blue-600 hover:text-blue-700"
                >
                    ← Back
                </button>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">Exam Overview</h1>
                <p className="text-slate-600 mt-1">Subject: {subject?.name || "Loading..."}</p>
                <p className="text-sm text-slate-500 mt-1">Exam Type: {examCategoryToLabel(exam.metadata?.examTypeCategory)}</p>
            </div>

            {/* Exam Details */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Exam Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Total Questions</p>
                        <p className="text-lg font-semibold text-slate-900">{exam.examQuestions.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Time Allocated</p>
                        <p className="text-lg font-semibold text-slate-900">{exam.duration} minutes</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Marks</p>
                        <p className="text-lg font-semibold text-slate-900">{totalMarks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Passing Score</p>
                        <p className="text-lg font-semibold text-slate-900">{exam.passingScore}%</p>
                    </div>
                </div>
            </div>

            {/* Exam Rules */}
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-4">Exam Rules & Instructions</h2>
                <ul className="space-y-3 text-sm text-amber-900">
                    {rules.map((rule, index) => (
                        <li key={`${rule}-${index}`} className="flex gap-3">
                            <span className="font-semibold">{index + 1}.</span>
                            <span>{rule}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Important Note */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h3 className="text-sm font-semibold text-red-900 mb-2">⚠️ Important</h3>
                <p className="text-sm text-red-800">
                    Please read all instructions carefully before starting. Once you click "Start Exam", the timer will begin immediately. Make sure you are ready and have a stable internet connection.
                </p>
            </div>

            {/* Start Button */}
            <div className="flex gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex-1 rounded-md border border-slate-300 px-6 py-3 text-base font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleStartExam}
                    className="flex-1 rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors"
                >
                    Start Exam
                </button>
            </div>
        </div>
    )
}
