"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { studentService, type StudentProfile } from "@/lib/services/student.service"

const getInitials = (name: string) => {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) return "NA"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Profile", href: "/dashboard/profile" },
    { label: "My Subjects", href: "/dashboard/subjects" },
]

export default function StudentDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false)
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            try {
                const data = await studentService.getProfile(token)
                setProfile(data)
            } catch {
                localStorage.removeItem("token")
                router.push("/login")
            }
        }

        fetchProfile()
    }, [router])

    const initials = getInitials(profile?.name ?? "")

    return (
        <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-7xl gap-4">
                <aside
                    className={`shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 ${
                        collapsed ? "w-20" : "w-full max-w-xs"
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                        {collapsed ? "Expand" : "Collapse"}
                    </button>

                    <div className="flex items-center gap-3 rounded-xl p-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                            {initials}
                        </div>
                        {!collapsed ? (
                            <div>
                                <p className="font-medium text-slate-900">{profile?.name ?? "Student"}</p>
                                <p className="text-sm text-slate-500">{profile?.educationalLevel ?? "-"}</p>
                            </div>
                        ) : null}
                    </div>

                    <nav className="mt-5 space-y-1">
                        {navItems.map((item) => {
                            const active = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                        active
                                            ? "bg-slate-100 font-medium text-slate-900"
                                            : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {collapsed ? item.label.charAt(0) : item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">{children}</section>
            </div>
        </main>
    )
}
