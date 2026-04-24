"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { tutorService } from "@/lib/services/tutor.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    Trash2, 
    UserCheck, 
    BookOpen, 
    Mail, 
    Loader2, 
    AlertCircle, 
    Users, 
    Plus,
    Calendar,
    ArrowRight,
    ShieldCheck,
    Star,
    Check,
    Copy,
    AlertTriangle,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
    const [showRemoveModal, setShowRemoveModal] = useState(false)
    const [tutorToRemove, setTutorToRemove] = useState<{ id: string; name: string } | null>(null)
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

    const handleRemoveTutor = (tutorId: string, tutorName: string) => {
        setTutorToRemove({ id: tutorId, name: tutorName })
        setShowRemoveModal(true)
    }

    const confirmRemoveTutor = async () => {
        if (!tutorToRemove) return

        const { id: tutorId, name: tutorName } = tutorToRemove
        setShowRemoveModal(false)
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
            setTutorToRemove(null)
        }
    }

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email)
        setCopiedEmail(email)
        setTimeout(() => setCopiedEmail(null), 2000)
    }

    return (
        <div className="p-6 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header - Consistent with Assign Tutor & Analytics */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Active Mentorships</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage your currently assigned educators and learning paths.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[14px] shadow-sm border border-slate-100 dark:border-slate-800">
                    <button className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs">Overview</button>
                    <button 
                        onClick={() => router.push('/dashboard/assign-tutor')}
                        className="px-4 py-1.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl text-xs flex items-center gap-1.5"
                    >
                        <Plus className="h-3 w-3" />
                        Find Tutor
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-400 text-sm font-black flex items-center gap-3 shadow-sm"
                    >
                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        {successMessage}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl text-rose-700 dark:text-rose-400 text-sm font-black flex items-center gap-3 shadow-sm"
                    >
                        <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="space-y-10 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] bg-slate-200/50 dark:bg-slate-800/50 rounded-[28px]" />
                        ))}
                    </div>
                    <div className="h-48 bg-slate-100 dark:bg-slate-900/50 rounded-[32px]" />
                </div>
            ) : tutors.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden rounded-[32px]">
                        <CardContent className="py-20">
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-indigo-100 dark:border-indigo-800 shadow-inner">
                                    <Users className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Your Circle is Empty</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                        Build your learning inner-circle by connecting with expert educators today.
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => router.push('/dashboard/assign-tutor')}
                                    className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                                >
                                    Add Your First Tutor
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {tutors.map((tutor, index) => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-[28px] overflow-hidden flex flex-col h-full border-b-4 border-b-transparent">
                                <CardHeader className="p-6 pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-black text-xl border border-white dark:border-slate-800 shadow-sm">
                                            {tutor.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg font-black text-slate-900 dark:text-white truncate">
                                                {tutor.name}
                                            </CardTitle>
                                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                                @{tutor.username}
                                            </p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Star className="h-4 w-4" />
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="p-6 space-y-6 flex-1">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-indigo-500">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Discipline</p>
                                                <p className="text-xs font-black text-slate-700 dark:text-slate-200">{tutor.subject}</p>
                                            </div>
                                        </div>
                                        
                                         <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between group/row hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-emerald-500">
                                                        <Mail className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Channel</p>
                                                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">{tutor.email}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopyEmail(tutor.email)}
                                                    className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover/row:scale-110 opacity-0 group-hover/row:opacity-100 transition-all"
                                                    title="Copy Email"
                                                >
                                                    {copiedEmail === tutor.email ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                    </div>

                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-[10px] font-bold">Linked: {new Date(tutor.assignedAt).toLocaleDateString()}</span>
                                        </div>
                                        {tutor.consentGiven && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                <ShieldCheck className="h-3 w-3" />
                                                <span className="text-[9px] font-black uppercase">Verified Access</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 border-t border-slate-50 dark:border-slate-800 mt-auto">
                                    <div className="flex items-center gap-2 w-full pt-4">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 h-12 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-black text-[11px] uppercase tracking-widest transition-all"
                                            onClick={() => handleRemoveTutor(tutor.id, tutor.name)}
                                            disabled={removingId === tutor.id}
                                        >
                                            {removingId === tutor.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Terminate
                                                </div>
                                            )}
                                        </Button>
                                        <Button
                                            className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-[11px] uppercase tracking-widest transition-all"
                                            onClick={() => router.push(`/dashboard/analytics?tutor=${tutor.id}`)}
                                        >
                                            View Progress
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Bottom Promo Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    <Card className="relative border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <CardHeader className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Expand Your Knowledge Network</h2>
                                    <p className="text-slate-500 text-base max-w-xl font-medium">
                                        Need help with a different subject? Link with specialized tutors to get trilingual support and customized resources.
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => router.push('/dashboard/assign-tutor')}
                                    className="h-16 px-10 bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black rounded-2xl transition-all flex items-center gap-3 shadow-xl"
                                >
                                    Add New Mentor
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </motion.div>

            {/* Termination Modal */}
            <AnimatePresence>
                {showRemoveModal && tutorToRemove && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="relative p-8 text-center space-y-6">
                                <button 
                                    onClick={() => setShowRemoveModal(false)}
                                    className="absolute top-6 right-6 h-10 w-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full flex items-center justify-center transition-all active:scale-90"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="mx-auto h-20 w-20 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-[24px] flex items-center justify-center mt-4 shadow-inner border border-rose-100 dark:border-rose-800/50">
                                    <AlertTriangle className="h-10 w-10" />
                                </div>
                                
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Terminate Mentorship?
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium px-4 leading-relaxed">
                                        Are you sure you want to remove <span className="text-slate-900 dark:text-white font-black">{tutorToRemove.name}</span>? You will lose immediate access to their specialized resources and academic support.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        onClick={() => setShowRemoveModal(false)}
                                        className="h-14 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                                    >
                                        Keep Access
                                    </button>
                                    <button
                                        onClick={confirmRemoveTutor}
                                        className="flex items-center justify-center gap-2 h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg shadow-rose-600/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Terminate
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
