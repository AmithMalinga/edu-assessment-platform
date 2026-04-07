"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { studentService, type StudentSubject } from "@/lib/services/student.service"

export default function SubjectDetailPage() {
    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()
    const params = useParams()
    const subjectId = params.subjectId as string

    useEffect(() => {
        const loadSubject = async () => {
            setLoading(true)
            setError("")

            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const subjects = await studentService.getSubjectsForStudent("", token)
                const found = subjects.find((s) => s.id === subjectId)
                
                if (!found) {
                    setError("Subject not found")
                } else {
                    setSubject(found)
                }
            } catch (err: any) {
                setError(err?.message || "Failed to load subject")
            } finally {
                setLoading(false)
            }
        }

        loadSubject()
    }, [router, subjectId])

    const handleTakeExam = (examType?: string) => {
        if (examType) {
            router.push(`/dashboard/subjects/${subjectId}/exam-types/${examType}`)
            return
        }

        router.push(`/dashboard/subjects/${subjectId}/exam-types`)
    }

    if (loading) return <p>Loading subject details...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!subject) return <p className="text-red-600">Subject not found</p>

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
                <p className="text-sm text-slate-500">{subject.grade?.name ?? `Grade ${subject.gradeId}`}</p>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">{subject.name}</h1>
                <p className="text-sm text-slate-500 mt-2">Subject ID: {subject.id}</p>
            </div>

            {/* Exam Types Section - MCQ */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">📝 MCQ Exam Types</h2>
                <p className="text-slate-600 mb-6">
                    Choose the type of MCQ exam you'd like to take for {subject.name}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Random New */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTakeExam("random-new")}>
                        <div className="text-3xl mb-2">🎲</div>
                        <h3 className="font-semibold text-blue-900 mb-1">Random New</h3>
                        <p className="text-sm text-blue-800 mb-3">
                            Random questions from recent lessons for quick practice.
                        </p>
                        <button className="w-full py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                            Take Exam
                        </button>
                    </div>

                    {/* Lesson Wise */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTakeExam("lesson-wise")}>
                        <div className="text-3xl mb-2">📚</div>
                        <h3 className="font-semibold text-purple-900 mb-1">Lesson Wise</h3>
                        <p className="text-sm text-purple-800 mb-3">
                            Practice questions organized by specific lessons and topics.
                        </p>
                        <button className="w-full py-2 px-3 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors">
                            Take Exam
                        </button>
                    </div>

                    {/* Past Papers */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTakeExam("past-papers")}>
                        <div className="text-3xl mb-2">📄</div>
                        <h3 className="font-semibold text-amber-900 mb-1">Past Papers</h3>
                        <p className="text-sm text-amber-800 mb-3">
                            Previous exam papers to practice with original questions.
                        </p>
                        <button className="w-full py-2 px-3 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors">
                            Take Exam
                        </button>
                    </div>

                    {/* Live */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTakeExam("live")}>
                        <div className="text-3xl mb-2">🔴</div>
                        <h3 className="font-semibold text-red-900 mb-1">Live Exam</h3>
                        <p className="text-sm text-red-800 mb-3">
                            Real-time proctored exam with strict monitoring.
                        </p>
                        <button className="w-full py-2 px-3 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
                            Take Exam
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Exam Options */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Other Options</h2>
                <button
                    onClick={() => router.push(`/dashboard/subjects/${subjectId}/exam-overview`)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                    View Exam Rules & Requirements
                </button>
            </div>
        </div>
    )
}
