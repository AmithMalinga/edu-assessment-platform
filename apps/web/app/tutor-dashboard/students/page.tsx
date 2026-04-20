"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { tutorService } from "@/lib/services/tutor.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Plus, Users, QrCode, CheckCircle2, RefreshCw } from "lucide-react"

export default function MyStudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [tutorCode, setTutorCode] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            if (!token) return
            
            const [codeData, studentsData] = await Promise.all([
                tutorService.getTutorCode(token),
                tutorService.getTutorStudents(token)
            ])
            setTutorCode(codeData.tutorCode)
            setStudents(studentsData)
        } catch (error) {
            console.error("Failed to load students data:", error)
            setTutorCode("ERROR")
        } finally {
            setLoading(false)
        }
    }

    const shareLink = typeof window !== 'undefined' 
        ? `${window.location.origin}/dashboard/assign-tutor?code=${tutorCode}`
        : '';

    const handleCopyCode = () => {
        navigator.clipboard.writeText(tutorCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-8 pb-12">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Students</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Code & Sharing Section */}
                <div className="space-y-6">
                    <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                <QrCode className="h-5 w-5" />
                                Your Tutor Code
                            </CardTitle>
                            <CardDescription>Share this code with your students to automatically link them to your classes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {loading ? (
                                <div className="h-20 flex items-center justify-center">
                                    <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                        <div className="flex-1 px-4 py-3 font-mono text-lg font-bold tracking-widest text-center text-slate-700 dark:text-slate-300">
                                            {tutorCode}
                                        </div>
                                        <button 
                                            onClick={handleCopyCode}
                                            className="px-4 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-500"
                                            title="Copy code"
                                        >
                                            {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">Or share via link:</p>
                                        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                            <div className="flex-1 px-4 py-3 font-mono text-xs truncate text-slate-700 dark:text-slate-300 self-center">
                                                {shareLink}
                                            </div>
                                            <button
                                                onClick={handleCopyLink}
                                                className="px-4 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-500"
                                                title="Copy link"
                                            >
                                                {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900/30 flex justify-center">
                                        {/* QR Code Graphic placeholder */}
                                        <div className="p-4 bg-white dark:bg-white rounded-2xl shadow-sm border border-slate-200">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`} 
                                                alt="QR Code" 
                                                className="w-32 h-32"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Students List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-slate-500" />
                                    Enrolled Students
                                    {!loading && <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">{students.length}</span>}
                                </CardTitle>
                                <CardDescription>Students who have linked their account using your code.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No students yet</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">Share your tutor code or QR code with your students to have them appear here automatically.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {students.map((student, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={student.id} 
                                            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-100 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                                                        {student.name}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold leading-tight">
                                                        {student.educationalLevel}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                    <span>{student.email}</span>
                                                    {student.phone && <span>• {student.phone}</span>}
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-bold text-indigo-600"
                                                onClick={() => router.push(`/tutor-dashboard/student-progress/${student.id}`)}
                                            >
                                                View Progress
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}