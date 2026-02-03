"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Globe, Zap, BarChart3 } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
    {
        icon: ShieldCheck,
        title: "Exam Integrity",
        description: "Tab-visibility detection and Fullscreen API to ensure fair play during exams."
    },
    {
        icon: Globe,
        title: "Trilingual System",
        description: "Native support for Sinhala, Tamil, and English languages across all content."
    },
    {
        icon: Zap,
        title: "Real-Time Mode",
        description: "Simulate actual exam pressure with live countdowns and timed sessions."
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        description: "Persistent performance analytics to identify weak areas and track improvement."
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950" />

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Everything You Need to
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Succeed in Exams
                        </span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Built specifically for Sri Lankan students with features that make exam preparation effective and engaging.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
