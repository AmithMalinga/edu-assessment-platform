"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { TutorSidebar } from "./_components/sidebar"
import { TutorTopBar } from "./_components/topbar"
import { tutorService, type TutorProfile } from "@/lib/services/tutor.service"

export default function TutorDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [profile, setProfile] = useState<TutorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                const currentUser = localStorage.getItem("currentUser")
                
                if (!token || !currentUser) {
                    setIsAuthorized(false)
                    router.push("/auth/tutor-login")
                    return
                }

                const user = JSON.parse(currentUser)
                if (user.role !== "TUTOR") {
                    setIsAuthorized(false)
                    router.push("/login")
                    return
                }

                const data = await tutorService.getProfile(token)
                setProfile(data)
                setIsAuthorized(true)
            } catch (error) {
                console.error("Tutor Layout Profile Fetch Error:", error)
                setIsAuthorized(false)
                router.push("/auth/tutor-login")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                    <p className="text-slate-500 animate-pulse font-medium">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    if (isAuthorized === false) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background elements to match Hero design */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl animate-float-delayed" />
            </div>

            <TutorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:pl-72 flex flex-col min-h-screen relative z-10 transition-all duration-300">
                <TutorTopBar 
                    profile={profile} 
                    loading={loading} 
                    onMenuClick={() => setIsSidebarOpen(true)} 
                />
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
