export default function Loading() {
    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="flex-1 p-8 lg:p-10 space-y-10 w-full animate-pulse">
                {/* Banner Placeholder */}
                <div className="h-64 rounded-[32px] bg-slate-200 dark:bg-slate-800" />
                
                {/* Content Placeholder */}
                <div className="space-y-6">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
