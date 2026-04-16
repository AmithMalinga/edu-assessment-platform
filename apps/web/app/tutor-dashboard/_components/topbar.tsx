"use client"

import { Search, Menu, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react"
import { TutorProfile } from "@/lib/services/tutor.service"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface TopBarProps {
    profile: TutorProfile | null;
    loading: boolean;
    onMenuClick: () => void;
}

export function TutorTopBar({ profile, loading, onMenuClick }: TopBarProps) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("currentUser")
        router.push("/")
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 h-20 flex items-center px-4 md:px-8">
            <div className="flex-1 flex items-center justify-between gap-4">
                {/* Mobile Menu Button */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search students, exams, or reports..."
                        className="w-full h-11 pl-11 pr-4 bg-slate-100/50 dark:bg-slate-900/50 border-transparent focus:bg-white dark:focus:bg-slate-900 border-2 focus:border-indigo-500/50 rounded-2xl text-sm font-medium transition-all outline-none"
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950" />
                    </button>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 p-1.5 pl-3 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl transition-all group">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                                        {loading ? "Loading..." : profile?.name}
                                    </p>
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
                                        Tutor Professional
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg group-hover:rotate-3 transition-transform">
                                    <div className="h-full w-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                        {profile?.avatar ? (
                                            <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                {profile?.name?.charAt(0).toUpperCase() || "T"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100 dark:border-slate-800">
                            <DropdownMenuLabel className="px-3 py-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Account</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 cursor-pointer group">
                                <User className="h-4 w-4 text-slate-400 group-focus:text-indigo-600 transition-colors" />
                                <span className="font-bold">Edit Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 cursor-pointer group">
                                <Settings className="h-4 w-4 text-slate-400 group-focus:text-indigo-600 transition-colors" />
                                <span className="font-bold">Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                            <DropdownMenuItem 
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-50 dark:focus:bg-rose-900/20 text-rose-600 cursor-pointer group"
                            >
                                <LogOut className="h-4 w-4 group-focus:translate-x-1 transition-transform" />
                                <span className="font-bold">Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
