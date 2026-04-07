"use client"
import { useEffect, useState } from "react"
import { studentService, type StudentProfile } from "@/lib/services/student.service"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, Calendar, GraduationCap, ShieldCheck, User, Zap } from "lucide-react"

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Not authenticated.")
                    setLoading(false)
                    router.push("/login")
                    return
                }
                const res = await studentService.getProfile(token)
                if (res && res.id) {
                    setProfile(res)
                } else {
                    setError((res as any).message || "Failed to load profile.")
                }
            } catch (err: any) {
                setError(err.message || "Failed to load profile.")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [router])

    return (
        <div className="p-8 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl">
                    <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="space-y-6">
                    {/* Skeleton ID Card */}
                    <div className="h-64 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                    {/* Skeleton Data Grids */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-80 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                        <div className="h-80 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                    </div>
                </div>
            ) : profile ? (
                <div className="space-y-8">
                    {/* Hero ID Card Container */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm relative"
                    >
                        <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                        </div>
                        
                        <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
                            {/* Avatar */}
                            <div className="relative h-32 w-32 rounded-full bg-white dark:bg-slate-900 p-2 shadow-xl shrink-0">
                                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-200">
                                    <Image 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=256`}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-3 right-3 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
                            </div>

                            {/* Headline */}
                            <div className="flex-1 text-center md:text-left mb-2">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.name}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-xs font-bold text-indigo-600 dark:text-indigo-400 capitalize tracking-wide">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {profile.role.toLowerCase()}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wide">
                                        <Zap className="h-3.5 w-3.5" />
                                        Pro Member
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Meta Grids */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-500" />
                                Personal Info
                            </h3>
                            <div className="space-y-6">
                                <InfoItem icon={Mail} label="Email Address" value={profile.email} />
                                <InfoItem icon={Phone} label="Phone Number" value={profile.phone || 'Not provided'} />
                                <InfoItem icon={Calendar} label="Age" value={`${profile.age} years old`} />
                            </div>
                        </motion.div>

                        {/* Academic Information */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-purple-500" />
                                Academic Detail
                            </h3>
                            <div className="space-y-6">
                                <InfoItem icon={GraduationCap} label="Educational Level" value={profile.educationalLevel} highlight />
                                <InfoItem icon={ShieldCheck} label="System Identifier" value={profile.id.substring(0, 12)} className="font-mono text-sm" />
                                <InfoItem 
                                    icon={Calendar} 
                                    label="Date Joined" 
                                    value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'} 
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

function InfoItem({ icon: Icon, label, value, highlight, className }: { icon: any, label: string, value: string, highlight?: boolean, className?: string }) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${highlight ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                <p className={`text-slate-900 dark:text-white font-medium truncate ${className || ''}`}>{value}</p>
            </div>
        </div>
    )
}
