"use client"

import { Search, Bell, Mail, ChevronDown, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import type { StudentProfile } from "@/lib/services/student.service"

interface TopBarProps {
    profile: StudentProfile | null;
    loading?: boolean;
    onMenuClick?: () => void;
}

export function DashboardTopBar({ profile, loading, onMenuClick }: TopBarProps) {
    const displayName = profile?.name || "Loading..."
    const displayRole = profile?.role ? `${profile.role} Student` : "Student"
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`

    return (
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 gap-4">
            {/* Mobile Menu & Search */}
            <div className="flex items-center w-full max-w-md gap-2">
                <button 
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl shrink-0"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search courses..." 
                        className="pl-10 h-10 bg-slate-100/50 dark:bg-slate-900/50 border-none focus-visible:ring-indigo-500 rounded-xl text-sm"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative">
                    <Mail className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-950" />
                </button>
                <button className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white dark:border-slate-950" />
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

                {/* Profile */}
                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors min-w-[44px]">
                    <div className="text-right hidden md:block">
                        {loading ? (
                            <div className="space-y-1.5 flex flex-col items-end">
                                <div className="h-3 w-24 bg-slate-200 animate-pulse rounded-full" />
                                <div className="h-2 w-16 bg-slate-100 animate-pulse rounded-full" />
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[150px]">{displayName}</p>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{displayRole}</p>
                            </>
                        )}
                    </div>
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shrink-0">
                        <div className="h-full w-full rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 overflow-hidden relative">
                             {profile?.name || !loading ? (
                                <Image 
                                    src={avatarUrl} 
                                    alt="Avatar" 
                                    fill
                                    className="object-cover"
                                 />
                             ) : (
                                <div className="h-full w-full bg-slate-200 animate-pulse" />
                             )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400 ml-1 hidden sm:block" />
                </button>
            </div>
        </header>
    )
}
