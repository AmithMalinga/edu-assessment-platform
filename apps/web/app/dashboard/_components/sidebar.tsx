"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    Calendar, 
    BookOpen, 
    ClipboardList, 
    FileText, 
    Trophy, 
    Settings, 
    LogOut,
    Zap,
    User,
    Library,
    Activity,
    LineChart
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Subjects", href: "/dashboard/subjects", icon: Library },
    // { name: "Class Schedule", href: "/dashboard/schedule", icon: Calendar },
    // { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    // { name: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
    { name: "Results", href: "/dashboard/results", icon: Activity },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    // { name: "Resources", href: "/dashboard/resources", icon: FileText },
    // { name: "Certificates", href: "/dashboard/certificates", icon: Trophy },
]

const footerNav = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Log out", href: "/login", icon: LogOut },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-110 group-hover:rotate-6">
                        <Zap className="text-white h-5 w-5 fill-current" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        ExamMaster
                    </span>
                </Link>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-4 space-y-1.5 pt-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                                isActive 
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" 
                                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Nav */}
            <div className="p-4 space-y-1.5 border-t border-slate-100 dark:border-slate-900">
                {footerNav.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-all group"
                    >
                        <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        {item.name}
                    </Link>
                ))}
            </div>
        </aside>
    )
}
