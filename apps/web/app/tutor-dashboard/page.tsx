"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { WelcomeBanner } from "./_components/welcome-banner"
import { StatsGrid } from "./_components/stats-grid"
import { RecentAssessments } from "./_components/recent-assessments"
import { tutorService, type TutorProfile } from "@/lib/services/tutor.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, GraduationCap, MessageSquare, BookOpen, Trophy } from "lucide-react"

export default function TutorDashboardPage() {
    const [profile, setProfile] = useState<TutorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return
                
                const data = await tutorService.getProfile(token)
                setProfile(data)
            } catch (error) {
                console.error("Dashboard Page Fetch Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    return (
        <div className="space-y-10 pb-12">
            {/* Welcome Banner */}
            <WelcomeBanner name={profile?.name} />

            {/* Stats Overview */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Overview</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Your key performance metrics at a glance</p>
                    </div>
                </div>
                <StatsGrid />
            </section>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Content: Recent Assessments */}
                <div className="lg:col-span-2 space-y-10">
                    <RecentAssessments />
                </div>

                {/* Sidebar Content: Quick Actions & Performance */}
                <div className="space-y-10">
                    {/* Quick Actions */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: "Create Assessment", desc: "Build a new exam with MCQ or Structured questions", icon: Rocket, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
                                { title: "Enrolled Students", desc: "Manage your student groups and enrollments", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                                { title: "Message Center", desc: "Broadcast announcements to your student base", icon: MessageSquare, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                                { title: "Resource Library", desc: "Upload and manage course materials/pdfs", icon: BookOpen, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
                            ].map((action, i) => (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                                >
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${action.color} group-hover:scale-110 transition-transform`}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white underline-offset-4 group-hover:underline">{action.title}</h4>
                                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                            {action.desc}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </section>

                    {/* Top Students / Leaderboard Peek */}
                    <Card className="rounded-[32px] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Top Students
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Month of April</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {[
                                { name: "Nuwan Perera", score: "98.5%", rank: 1 },
                                { name: "Amali Silva", score: "97.2%", rank: 2 },
                                { name: "Dasun Shanaka", score: "96.8%", rank: 3 },
                            ].map((student, i) => (
                                <div key={student.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-black shadow-sm">
                                            #{student.rank}
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.name}</p>
                                    </div>
                                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{student.score}</p>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                                View Full Leaderboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
