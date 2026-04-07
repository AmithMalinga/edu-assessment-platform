import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseCardProps {
    id: string
    title: string
    instructor: string
    lessons: number
    progress: number
    image: string
    color: string
}

export function CourseCard({ id, title, instructor, lessons, progress, image, color }: CourseCardProps) {
    const router = useRouter()

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => router.push(`/dashboard/subjects/${id}`)}
            className="bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 group cursor-pointer active:scale-[0.98] transition-all"
        >
            <div className={cn(
                "relative aspect-[4/3] rounded-2xl overflow-hidden p-6 flex items-center justify-center transition-transform group-hover:scale-105 duration-500",
                color
            )}>
                <Image 
                    src={image} 
                    alt={title} 
                    fill
                    className="object-contain p-6 drop-shadow-lg"
                />
                <button className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white/80 hover:text-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{title}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Prof. {instructor}</p>
            </div>

            <div className="space-y-2 mt-auto">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Lessons left: {lessons}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">Completed: {progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    />
                </div>
            </div>
        </motion.div>
    )
}
