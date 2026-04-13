"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Globe, Zap, BarChart3 } from "lucide-react"

const features = [
    {
        icon: ShieldCheck,
        title: "Exam Integrity",
        description: "Tab-visibility detection and Fullscreen API to ensure fair play during exams.",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100/50 dark:bg-blue-900/20"
    },
    {
        icon: Globe,
        title: "Trilingual System",
        description: "Native support for Sinhala, Tamil, and English languages across all content.",
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100/50 dark:bg-indigo-900/20"
    },
    {
        icon: Zap,
        title: "Real-Time Mode",
        description: "Simulate actual exam pressure with live countdowns and timed sessions.",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-100/50 dark:bg-amber-900/20"
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description: "Persistent performance analytics to identify weak areas and track improvement.",
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100/50 dark:bg-purple-900/20"
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 dark:to-transparent -z-10" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-4">
                        Platform Features
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black mb-4 dark:text-white">
                        Everything You Need to <span className="text-indigo-600 dark:text-indigo-400 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Succeed</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Built specifically for Sri Lankan students with high-performance features that make exam preparation effective.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 relative z-10`}>
                                <feature.icon className={`h-7 w-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 dark:text-white relative z-10">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">
                                {feature.description}
                            </p>
                            
                            {/* Decorative background circle */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${feature.bg} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
