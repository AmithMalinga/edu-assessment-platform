"use client"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Users, BookOpen, Trophy, FileText } from "lucide-react"
import { landingService } from "@/lib/services/landing.service"

type StatItem = {
    icon: typeof Users
    value: number
    suffix: string
    label: string
}

const buildStats = (data: {
    activeStudents: number
    totalQuestions: number
    totalExams: number
    passRate: number
}): StatItem[] => [
    { icon: Users, value: data.activeStudents, suffix: "+", label: "Active Students" },
    { icon: BookOpen, value: data.totalQuestions, suffix: "+", label: "Questions" },
    { icon: Trophy, value: data.passRate, suffix: "%", label: "Pass Rate" },
    { icon: FileText, value: data.totalExams, suffix: "+", label: "Exams" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            const duration = 2000
            const steps = 60
            const increment = value / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= value) {
                    setCount(value)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(current))
                }
            }, duration / steps)

            return () => clearInterval(timer)
        }
    }, [isInView, value])

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export function Stats() {
    const [stats, setStats] = useState<StatItem[]>(buildStats({
        activeStudents: 0,
        totalQuestions: 0,
        totalExams: 0,
        passRate: 0,
    }))

    useEffect(() => {
        const loadStats = async () => {
            const data = await landingService.getStats()
            setStats(buildStats(data))
        }

        loadStats()
    }, [])

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-gradient" />

            {/* Overlay Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtMnYtMmgydi0ySDIydjJoMnYyaC0ydjJoMnY0aC0ydjJoMTR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-center text-white"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black mb-2">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-white/80 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
