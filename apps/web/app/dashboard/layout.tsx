"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DashboardSidebar } from "./_components/sidebar"
import { DashboardTopBar } from "./_components/topbar"
import { studentService, type StudentProfile } from "@/lib/services/student.service"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [profile, setProfile] = useState<StudentProfile | null>(null)
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
                if (!token) {
                    setIsAuthorized(false)
                    router.push("/login")
                    return
                }
                const data = await studentService.getProfile(token)
                setProfile(data)
                setIsAuthorized(true)
            } catch (error) {
                console.error("Layout Profile Fetch Error:", error)
                setIsAuthorized(false)
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if (isAuthorized === false) return null

    // Full-screen mode for exam — hide sidebar & topbar completely
    const isExamPage = pathname?.endsWith("/exam")

    if (isExamPage) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="md:pl-64 flex flex-col min-h-screen">
                <DashboardTopBar profile={profile} loading={loading} onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
