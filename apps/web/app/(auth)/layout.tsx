import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 -z-20" />

            {/* Animated Mesh Gradient */}
            <div className="absolute inset-0 opacity-30 -z-10">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
                <div className="absolute bottom-0 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            {/* Logo / Header */}
            <header className="p-6">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        ExamMaster
                    </span>
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} ExamMaster. All rights reserved.</p>
            </footer>
        </div>
    )
}
