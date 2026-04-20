"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { tutorService } from "@/lib/services/tutor.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, UserCheck, BookOpen, Mail, Loader2, AlertCircle } from "lucide-react"

interface Tutor {
    id: string
    name: string
    email: string
    subject: string
    username: string
    assignedAt: string
    consentGiven: boolean
}

export default function MyTutorsPage() {
    const [tutors, setTutors] = useState<Tutor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [removingId, setRemovingId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        loadTutors()
    }, [])

    const loadTutors = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/auth/login")
                return
            }

            const data = await tutorService.getStudentTutors(token)
            setTutors(data || [])
        } catch (err) {
            setError((err as Error).message)
            console.error("Failed to load tutors:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveTutor = async (tutorId: string, tutorName: string) => {
        if (!window.confirm(`Are you sure you want to remove ${tutorName} as your tutor?`)) {
            return
        }

        setRemovingId(tutorId)
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/auth/login")
                return
            }

            await tutorService.removeTutor(tutorId, token)
            setTutors(tutors.filter(t => t.id !== tutorId))
            setSuccessMessage(`${tutorName} has been removed`)
            setTimeout(() => setSuccessMessage(null), 3000)
        } catch (err) {
            setError((err as Error).message)
            console.error("Failed to remove tutor:", err)
        } finally {
            setRemovingId(null)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Tutors</h1>
                <p className="text-slate-500 text-sm mt-2">Manage the tutors assigned to you</p>
            </div>

            <AnimatePresence mode="wait">
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2"
                    >
                        <UserCheck className="h-5 w-5" />
                        {successMessage}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-sm font-medium flex items-center gap-2"
                    >
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading your tutors...</p>
                </div>
            ) : tutors.length === 0 ? (
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm border-dashed">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UserCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Tutors Yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                                You haven't been assigned to any tutors yet. Ask your tutor for their code to get started!
                            </p>
                            <Button 
                                onClick={() => router.push('/dashboard/assign-tutor')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Assign a Tutor
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutors.map((tutor, index) => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 hover:shadow-lg transition-shadow h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-indigo-900 dark:text-indigo-300 text-lg">
                                                {tutor.name}
                                            </CardTitle>
                                            <CardDescription className="text-indigo-700 dark:text-indigo-400">
                                                @{tutor.username}
                                            </CardDescription>
                                        </div>
                                        <div className="p-2 rounded-lg bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300">
                                            <UserCheck className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-slate-600 dark:text-slate-400">Subject</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">{tutor.subject}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-slate-600 dark:text-slate-400">Email</p>
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">{tutor.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <p>Assigned on {new Date(tutor.assignedAt).toLocaleDateString()}</p>
                                            {tutor.consentGiven && (
                                                <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1">✓ Consent given to share details</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 justify-start gap-2 font-bold"
                                            onClick={() => handleRemoveTutor(tutor.id, tutor.name)}
                                            disabled={removingId === tutor.id}
                                        >
                                            {removingId === tutor.id ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Removing...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove Tutor
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 shadow-sm">
                <CardHeader>
                    <CardTitle>Want to add another tutor?</CardTitle>
                    <CardDescription>
                        Get a tutor code from someone who is already teaching and add them to your learning path.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={() => router.push('/dashboard/assign-tutor')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Assign New Tutor
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
