"use client"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    index: number
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-300"
        >
            {/* Gradient Border on Hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            <div className="absolute inset-[1px] rounded-3xl bg-white dark:bg-slate-800 -z-10" />

            {/* Icon Container */}
            <div className="relative w-14 h-14 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Icon className="h-7 w-7 text-white" />
                </div>
            </div>

            {/* Content */}
            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
            </p>

            {/* Decorative Arrow */}
            <div className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm">Learn more</span>
                <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    →
                </motion.span>
            </div>
        </motion.div>
    )
}
