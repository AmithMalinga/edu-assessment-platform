"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    LineChart,
    AlertTriangle,
    X,
    CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Subjects", href: "/dashboard/subjects", icon: Library },
    // { name: "Class Schedule", href: "/dashboard/schedule", icon: Calendar },
    // { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    // { name: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
    { name: "Results", href: "/dashboard/results", icon: Activity },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    // { name: "Resources", href: "/dashboard/resources", icon: FileText },
    // { name: "Certificates", href: "/dashboard/certificates", icon: Trophy },
]

const footerNav = [
    // { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Log out", href: "/login", icon: LogOut },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleConfirmLogout = () => {
        localStorage.removeItem("token")
        setShowLogoutModal(false)
        router.replace("/login")
    }

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
                {footerNav.map((item) => {
                    if (item.name === "Log out") {
                        return (
                            <button
                                key={item.name}
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-all group"
                            >
                                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                                {item.name}
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 transition-all group"
                        >
                            <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Logout Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="relative p-6 text-center space-y-6">
                                <button 
                                    onClick={() => setShowLogoutModal(false)}
                                    className="absolute top-4 right-4 h-8 w-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="mx-auto h-16 w-16 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mt-2 shadow-inner border border-red-100 dark:border-red-800/50">
                                    <LogOut className="h-7 w-7" />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Confirm Logout
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium px-2 leading-relaxed">
                                        Are you sure you want to log out of your account? You will need to sign in again to access your dashboard.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmLogout}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 text-sm"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    )
}
