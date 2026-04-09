import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementCardProps {
    title: string
    type: string
    color: string
    iconColor: string
}

export function AchievementCard({ title, type, color, iconColor }: AchievementCardProps) {
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className={cn(
                "rounded-3xl p-5 flex items-center gap-4 border border-white/20 shadow-sm min-w-[280px]",
                color
            )}
        >
            <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                iconColor
            )}>
                <Trophy className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 leading-tight truncate">{title}</h4>
                <p className="text-[10px] uppercase font-heavy tracking-widest text-slate-500/80 mt-0.5">{type}</p>
            </div>

            <button className="px-4 py-2 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md rounded-xl text-xs font-bold text-slate-900 border border-white/40 hover:bg-white transition-colors">
                View
            </button>
        </motion.div>
    )
}
