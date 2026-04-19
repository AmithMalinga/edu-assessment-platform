"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Menu, X } from "lucide-react"

const DEFAULT_NAV_ITEMS = [
    { label: "Features", href: "#features" },
    { label: "Tutors", href: "#tutor" },
    { label: "Solutions", href: "#solutions" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "/contact" },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dashboardHref, setDashboardHref] = useState("/dashboard")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userRaw = localStorage.getItem("currentUser")
        
        if (token) {
            setIsLoggedIn(true)
        }

        if (userRaw) {
            try {
                const user = JSON.parse(userRaw)
                if (user?.role === "TUTOR") {
                    setDashboardHref("/tutor-dashboard")
                } else {
                    setDashboardHref("/dashboard")
                }
            } catch (e) {
                console.error("Error parsing user for header:", e)
            }
        }
    }, [])

    const navItems = [...DEFAULT_NAV_ITEMS, { label: "Dashboard", href: dashboardHref }]

    return (
        <header className="px-6 lg:px-20 h-20 flex items-center border-b border-white/10 sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-50">
            <Link className="flex items-center gap-2.5 group" href="/">
                <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/25"
                >
                    <Zap className="text-white h-5 w-5 fill-current" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                </motion.div>
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    ExamMaster
                </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-auto hidden lg:flex gap-8 items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="relative text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
                {/* Language Switcher */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {["EN", "සිං", "Tag"].map((lang) => (
                        <button
                            key={lang}
                            className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${lang === "EN" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link
                        href={isLoggedIn ? dashboardHref : "/login"}
                        className="relative group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                    >
                        <span>{isLoggedIn ? "Dashboard" : "Get Started"}</span>
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            →
                        </motion.span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine overflow-hidden" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href={isLoggedIn ? dashboardHref : "/login"}
                                className="mt-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold"
                            >
                                {isLoggedIn ? "Dashboard" : "Get Started"}
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
