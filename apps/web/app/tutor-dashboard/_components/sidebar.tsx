"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    LineChart,
    Settings,
    LogOut,
    Zap,
    X,
    BookOpen,
    PlusCircle,
    Bell
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Overview", href: "/tutor-dashboard", icon: LayoutDashboard },
    { name: "My Exams", href: "/tutor-dashboard/exams", icon: ClipboardList },
    { name: "Students", href: "/tutor-dashboard/students", icon: Users },
    { name: "Analytics", href: "/tutor-dashboard/analytics", icon: LineChart },
    { name: "Notifications", href: "/tutor-dashboard/notifications", icon: Bell },
]

const footerNav = [
    { name: "Change Password", href: "/auth/change-password", icon: Settings },
    { name: "Log out", href: "/logout", icon: LogOut },
]

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function TutorSidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleConfirmLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("currentUser")
        setShowLogoutModal(false)
        router.replace("/")
    }

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={cn(
                "fixed left-0 top-0 bottom-0 w-72 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col z-[70] transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo Section */}
                <div className="p-8 flex items-center justify-between">
                    <Link href="/tutor-dashboard" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <Zap className="text-white h-5 w-5 fill-current" />
                            </div>
                        </div>
                        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            ExamMaster
                        </span>
                    </Link>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Create New Prompt Button */}
                <div className="px-6 mb-6">
                    <button 
                        onClick={() => router.push("/tutor-dashboard/exams/create")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        <PlusCircle className="h-5 w-5" />
                        Create New Exam
                    </button>
                </div>

                {/* Main Nav */}
                <nav className="flex-1 px-4 space-y-1 pt-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Main Menu
                    </p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm shadow-indigo-500/5"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer Nav */}
                <div className="p-6 space-y-1 border-t border-slate-100 dark:border-slate-800/50">
                    {footerNav.map((item) => {
                        if (item.name === "Log out") {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group"
                                >
                                    <item.icon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    {item.name}
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group"
                            >
                                <item.icon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </aside>

            {/* Logout Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 dark:border-slate-800 p-8"
                        >
                            <div className="text-center space-y-6">
                                <div className="mx-auto h-20 w-20 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-3xl flex items-center justify-center rotate-6 shadow-xl shadow-rose-500/10 border border-rose-100 dark:border-rose-800/50">
                                    <LogOut className="h-10 w-10" />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Sign Out
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        Are you sure you want to end your session?
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <button
                                        onClick={handleConfirmLogout}
                                        className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-500/25 transition-all active:scale-[0.98]"
                                    >
                                        Yes, Log me out
                                    </button>
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
