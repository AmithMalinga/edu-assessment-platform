"use client"
import { motion } from "framer-motion"

const schools = [
    "Royal College", "Visakha Vidyalaya", "Ananda College", "Musaeus College",
    "St. Thomas' College", "Ladies' College", "Nalanda College", "Bishop's College",
    "Richmond College", "Mahinda College", "Kingswood College", "Dharmaraja College"
]

export function Marquee() {
    return (
        <div className="py-12 bg-white dark:bg-slate-950/50 border-y border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
            <div className="container mx-auto px-6 mb-8 text-center">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Empowering Students From Top Institutions
                </p>
            </div>
            
            <div className="flex relative items-center">
                <motion.div 
                    className="flex whitespace-nowrap gap-12 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                >
                    {[...schools, ...schools].map((school, i) => (
                        <div 
                            key={i} 
                            className="text-2xl md:text-3xl font-black text-slate-300 dark:text-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-default select-none"
                        >
                            {school}
                        </div>
                    ))}
                </motion.div>
                
                {/* Visual Fades */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
            </div>
        </div>
    )
}
