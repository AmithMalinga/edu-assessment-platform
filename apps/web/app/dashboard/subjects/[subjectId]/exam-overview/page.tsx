"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { studentService, type StudentSubject } from "@/lib/services/student.service"

interface ExamInfo {
    id: string
    title: string
    description: string
    duration: number // in minutes
    totalQuestions: number
    totalMarks: number
    passingScore: number
}

export default function ExamOverviewPage() {
    const router = useRouter()
    const params = useParams()
    const subjectId = params.subjectId as string
    const [subject, setSubject] = useState<StudentSubject | null>(null)
    const [loading, setLoading] = useState(true)

    // Dummy exam data
    const examInfo: ExamInfo = {
        id: `exam-${subjectId}`,
        title: `${subject?.name || "Subject"} Examination`,
        description: `Comprehensive exam covering all topics from ${subject?.name || "the subject"}.`,
        duration: 120, // 2 hours
        totalQuestions: 50,
        totalMarks: 100,
        passingScore: 60,
    }

    useEffect(() => {
        const loadSubject = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const subjects = await studentService.getSubjectsForStudent("", token)
                const found = subjects.find((s) => s.id === subjectId)
                setSubject(found || null)
            } catch (err) {
                console.error("Failed to load subject:", err)
            } finally {
                setLoading(false)
            }
        }

        loadSubject()
    }, [router, subjectId])

    const handleStartExam = () => {
        router.push(`/dashboard/subjects/${subjectId}/exam-types`)
    }

    if (loading) return <p>Loading exam details...</p>

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
            </div>

            {/* Exam Details */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Exam Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Total Questions</p>
                        <p className="text-lg font-semibold text-slate-900">{examInfo.totalQuestions}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Time Allocated</p>
                        <p className="text-lg font-semibold text-slate-900">{examInfo.duration} minutes</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Marks</p>
                        <p className="text-lg font-semibold text-slate-900">{examInfo.totalMarks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Passing Score</p>
                        <p className="text-lg font-semibold text-slate-900">{examInfo.passingScore}%</p>
                    </div>
                </div>
            </div>

            {/* Exam Rules */}
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                <h2 className="text-lg font-semibold text-amber-900 mb-4">Exam Rules & Instructions</h2>
                <ul className="space-y-3 text-sm text-amber-900">
                    <li className="flex gap-3">
                        <span className="font-semibold">1.</span>
                        <span>You have <strong>{examInfo.duration} minutes</strong> to complete the exam from the moment you start.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">2.</span>
                        <span>Once you start the exam, the timer will begin and cannot be paused.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">3.</span>
                        <span>You can navigate between questions using the <strong>Next</strong> and <strong>Previous</strong> buttons.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">4.</span>
                        <span>You can review all questions before submitting. Use the question panel to jump to any question.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">5.</span>
                        <span>Once submitted, you cannot modify your answers. Review carefully before submitting.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">6.</span>
                        <span>You need to score at least <strong>{examInfo.passingScore}%</strong> to pass the exam.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">7.</span>
                        <span>Ensure you have a stable internet connection before starting the exam.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-semibold">8.</span>
                        <span>Do not close your browser or refresh the page during the exam.</span>
                    </li>
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
