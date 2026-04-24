"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { submissionService, type SubmissionWithExam } from "@/lib/services/submission.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, BarChart3, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function StudentProgressPage() {
    const router = useRouter()
    const params = useParams()
    const studentId = params.studentId as string
    
    const [submissions, setSubmissions] = useState<SubmissionWithExam[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [studentName, setStudentName] = useState("")

    useEffect(() => {
        loadStudentSubmissions()
    }, [studentId])

    const loadStudentSubmissions = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/auth/login")
                return
            }

            // Get submissions for this student
            const data = await submissionService.getStudentSubmissions(studentId, token)
            setSubmissions(data || [])
            
            // Try to get student name from first submission or from the URL
            if (data && data.length > 0) {
                // Student name will be extracted from submissions if available
                setStudentName(studentId)
            }
        } catch (err) {
            setError((err as Error).message)
            console.error("Failed to load student submissions:", err)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score: number, passingScore: number) => {
        if (score >= passingScore) return "text-emerald-600 dark:text-emerald-400"
        return "text-rose-600 dark:text-rose-400"
    }

    const getStatusIcon = (score: number, passingScore: number) => {
        if (score >= passingScore) {
            return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        }
        return <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Student Progress
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Track submissions and performance</p>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-sm font-medium"
                >
                    {error}
                </motion.div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading student progress...</p>
                </div>
            ) : submissions.length === 0 ? (
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Submissions Yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                This student hasn't submitted any exams yet. Their progress will appear here as they complete assessments.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission, index) => (
                        <motion.div
                            key={submission.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => router.push(`/tutor-dashboard/submission-review/${submission.id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                                    {submission.assessment?.title || "Assessment"}
                                                </h3>
                                                {getStatusIcon(submission.score || 0, submission.assessment?.passingScore || 50)}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                                                <span>
                                                    <span className="font-medium text-slate-600 dark:text-slate-400">Subject:</span>{" "}
                                                    {submission.assessment?.subject?.name || "N/A"}
                                                </span>
                                                <span>
                                                    <span className="font-medium text-slate-600 dark:text-slate-400">Submitted:</span>{" "}
                                                    {new Date(submission.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Score</p>
                                                    <p className={`text-2xl font-black ${getScoreColor(submission.score || 0, submission.assessment?.passingScore || 50)}`}>
                                                        {submission.score}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Passing</p>
                                                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                                                        {submission.assessment?.passingScore}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Taken</p>
                                                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                                                        {submission.timeTaken ? `${submission.timeTaken}m` : "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-indigo-600">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
