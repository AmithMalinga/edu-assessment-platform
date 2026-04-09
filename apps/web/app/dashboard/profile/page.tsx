"use client"
import { useEffect, useState } from "react"
import { studentService, type StudentProfile } from "@/lib/services/student.service"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, Calendar, GraduationCap, ShieldCheck, User, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

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
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Student Profile</h1>
                <p className="text-slate-500 font-medium">Manage your personal information and academic details.</p>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="space-y-6">
                    {/* Skeleton ID Card */}
                    <div className="h-72 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                    {/* Skeleton Data Grids */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-80 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                        <div className="h-80 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-pulse" />
                    </div>
                </div>
            ) : profile ? (
                <div className="space-y-6">
                    {/* Hero ID Card Container */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
                    >
                        {/* Ambient Background */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-center gap-6">
                            {/* Avatar Wrapper */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 scale-110" />
                                <div className="relative h-24 w-24 rounded-[20px] bg-white dark:bg-slate-800 p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-slate-200">
                                        <Image 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4f46e5&color=fff&size=256&bold=true`}
                                            alt={profile.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-7 h-7 flex items-center justify-center bg-emerald-500 rounded-[10px] border-4 border-white dark:border-slate-800 shadow-sm text-white">
                                        <ShieldCheck className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>

                            {/* Headline */}
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                                        {profile.name}
                                    </h2>
                                    {/* <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-[10px]">
                                        System ID: {profile.id.substring(0, 12)}
                                    </p> */}
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold text-[11px] border border-indigo-100 dark:border-indigo-800/50">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        <span className="capitalize">{profile.role.toLowerCase()}</span>
                                    </div>
                                    {/* <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-100 dark:border-amber-800/50">
                                        <Zap className="h-3.5 w-3.5" />
                                        <span>Pro Access</span>
                                    </div> */}
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
                            className="bg-white dark:bg-slate-900 rounded-[24px] p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <User className="w-32 h-32" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-[14px] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <User className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Personal Info</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact details</p>
                                </div>
                            </div>

                            <div className="space-y-3">
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
                            className="bg-white dark:bg-slate-900 rounded-[24px] p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                <GraduationCap className="w-32 h-32" />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-[14px] bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-900 dark:text-white">Academic Detail</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current standing</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <InfoItem icon={GraduationCap} label="Educational Level" value={profile.educationalLevel} highlight />
                                <InfoItem 
                                    icon={Calendar} 
                                    label="Date Joined" 
                                    value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'} 
                                />
                                <InfoItem icon={ShieldCheck} label="Account Status" value="Active & Verified" className="text-emerald-500 font-black" />
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
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 border border-transparent",
            highlight ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
        )}>
            <div className={cn(
                "h-10 w-10 shrink-0 rounded-[14px] flex items-center justify-center shadow-sm",
                highlight ? "bg-indigo-500 text-white" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500"
            )}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className={cn("text-slate-900 dark:text-white font-bold truncate text-sm", className)}>{value}</p>
            </div>
        </div>
    )
}
