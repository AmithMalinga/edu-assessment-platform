"use client"

import { usePathname } from "next/navigation"
import { DashboardSidebar } from "./_components/sidebar"
import { DashboardTopBar } from "./_components/topbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Full-screen mode for exam — hide sidebar & topbar completely
    const isExamPage = pathname?.includes("/exam")

    if (isExamPage) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <DashboardSidebar />

            <div className="pl-64 flex flex-col min-h-screen">
                <DashboardTopBar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
