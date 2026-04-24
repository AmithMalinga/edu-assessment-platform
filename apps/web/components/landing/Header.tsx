"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { Zap, Menu, X, Globe, ChevronRight } from "lucide-react"

const DEFAULT_NAV_ITEMS = [
    { label: "Features", href: "#features" },
    { label: "Tutors", href: "#tutor" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "/contact" },
]

export function Header() {
    const pathname = usePathname()
    const lang = pathname === '/si' ? 'si' : pathname === '/ta' ? 'ta' : 'en'

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dashboardHref, setDashboardHref] = useState("/dashboard")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [scrolled, setScrolled] = useState(false)

    // Dynamic styles based on scroll
    useEffect(() => {
        const updateScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", updateScroll)
        updateScroll() // Initial check
        return () => window.removeEventListener("scroll", updateScroll)
    }, [])

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
        const userRaw = typeof window !== 'undefined' ? localStorage.getItem("currentUser") : null
        
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

    const t = {
        Features: lang === 'si' ? "විශේෂාංග" : lang === 'ta' ? "அம்சங்கள்" : "Features",
        Tutors: lang === 'si' ? "ගුරුවරුන්" : lang === 'ta' ? "ஆசிரியர்கள்" : "Tutors",
        Testimonials: lang === 'si' ? "සාක්ෂි" : lang === 'ta' ? "சான்றுகள்" : "Testimonials",
        Contact: lang === 'si' ? "අමතන්න" : lang === 'ta' ? "தொடர்பு" : "Contact",
        Dashboard: lang === 'si' ? "උපකරණ පුවරුව" : lang === 'ta' ? "கட்டுப்பாட்டு அறை" : "Dashboard",
        GetStarted: lang === 'si' ? "ආරම්භ කරන්න" : lang === 'ta' ? "தொடங்குங்கள்" : "Get Started",
    }

    const navItems = [
        { label: t.Features, href: "#features" },
        { label: t.Tutors, href: "#tutor" },
        { label: t.Testimonials, href: "#testimonials" },
        { label: t.Contact, href: "/contact" },
        { label: t.Dashboard, href: dashboardHref }
    ]

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${lang === 'si' ? 'font-sinhala' : lang === 'ta' ? 'font-tamil' : ''} ${
                scrolled 
                ? "h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50 shadow-sm" 
                : "h-24 bg-transparent border-transparent"
            }`}
        >
            <div className="max-w-[1440px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
                <Link className="flex items-center gap-3 group relative" href="/">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20 relative z-10">
                            <Zap className="text-white h-5 w-5 fill-current" />
                        </div>
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
                    </motion.div>
                    <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-sans">
                        ExamMaster
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                    {navItems.filter(item => item.href !== dashboardHref).map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`relative px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors`}
                        >
                            <span className="relative z-10">{item.label}</span>
                            {hoveredItem === item.label && (
                                <motion.div
                                    layoutId="nav_pill"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-6">
                    {/* Language Switcher - Premium Look */}
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 font-sans">
                        <Link 
                            href="/" 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-full shadow-sm transition-all ${
                                pathname !== '/si' && pathname !== '/ta' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                        >
                            <Globe className="h-3 w-3" />
                            EN
                        </Link>
                        <Link 
                            href="/si" 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-full shadow-sm transition-all font-sinhala ${
                                pathname === '/si' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                        >
                            සිං
                        </Link>
                        <Link 
                            href="/ta" 
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-full shadow-sm transition-all font-tamil ${
                                pathname === '/ta' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }`}
                        >
                            தமிழ்
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link
                        href={isLoggedIn ? dashboardHref : "/login"}
                        className="relative group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[position:100%_0] transition-all duration-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                    >
                        <span>{isLoggedIn ? t.Dashboard : t.GetStarted}</span>
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </motion.span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine overflow-hidden" />
                    </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2.5 rounded-xl transition-all ${
                            mobileMenuOpen 
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute ${scrolled ? "top-16" : "top-24"} left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 lg:hidden shadow-2xl z-50`}
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.filter(item => item.href !== dashboardHref).map((item) => (
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
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20"
                            >
                                {isLoggedIn ? t.Dashboard : t.GetStarted}
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
