import Link from "next/link"

export default function TutorAuthLayout({
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

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full">
                <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} ExamMaster. All rights reserved.</p>
            </footer>
        </div>
    )
}
