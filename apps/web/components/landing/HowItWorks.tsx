"use client"
import { motion } from "framer-motion"
import { UserPlus, BookOpen, GraduationCap } from "lucide-react"

const steps = [
    {
        icon: UserPlus,
        title: "Create Account",
        description: "Register for free in seconds. Set up your profile and select your grade level.",
        color: "from-blue-500 to-indigo-600"
    },
    {
        icon: BookOpen,
        title: "Choose Subject",
        description: "Select from a wide range of O/L and A/L subjects tailored to your curriculum.",
        color: "from-indigo-500 to-purple-600"
    },
    {
        icon: GraduationCap,
        title: "Master Your Skills",
        description: "Take real-time exams, track your progress, and get instant detailed analytics.",
        color: "from-purple-500 to-pink-600"
    }
]

export function HowItWorks() {
    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">
                        How It <span className="text-indigo-600 dark:text-indigo-400">Works</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Get started on your journey to exam excellence in three simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 relative group`}>
                                <step.icon className="text-white h-10 w-10" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800">
                                    {i + 1}
                                </div>
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} blur-lg opacity-40 group-hover:opacity-60 transition-opacity -z-10`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 dark:text-white">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
