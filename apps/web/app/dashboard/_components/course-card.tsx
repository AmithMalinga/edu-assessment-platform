import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseCardProps {
    id: string
    title: string
    category?: string
    color: string
}

export function CourseCard({ id, title, category, color }: CourseCardProps) {
    const router = useRouter()

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/dashboard/subjects/${id}`)}
            className="bg-white dark:bg-slate-900 rounded-[24px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 group cursor-pointer active:scale-[0.98] transition-all"
        >
            <div className={cn(
                "relative aspect-[16/9] sm:aspect-[4/3] rounded-[16px] overflow-hidden flex items-start p-4 transition-transform group-hover:scale-[1.03] duration-500 bg-gradient-to-br",
                color
            )}>
                {/* SVG Polygon Pattern Overlay */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px',
                    }}
                />
                
                {/* Additional large soft geometric shapes overlay */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rotate-45 z-0" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/5 rotate-12 z-0" />

                {category && (
                    <div className="relative z-10 bg-indigo-950/80 backdrop-blur-md text-white/90 text-[10px] font-black px-3 py-1.5 rounded-[10px] uppercase tracking-wider shadow-sm">
                        {category}
                    </div>
                )}
                
                <button className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 backdrop-blur-md text-white/90 hover:text-white transition-colors z-10">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white truncate" title={title}>{title}</h3>
            </div>
        </motion.div>
    )
}
