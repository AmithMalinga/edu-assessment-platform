"use client"
import { motion } from "framer-motion"
import { Users, BookOpen, BarChart, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const tutorBenefits = [
    {
        icon: BookOpen,
        title: "Create Smarter Exams",
        description: "Build comprehensive assessment papers using our intuitive exam builder with support for multiple question types.",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
        icon: BarChart,
        title: "Deep Analytics",
        description: "Get detailed insights into student performance, identifying common struggle areas and tracking progress over time.",
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
        icon: Users,
        title: "Expand Your Reach",
        description: "Connect with students from all across Sri Lanka, breaking geographical barriers and growing your teaching brand.",
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
        icon: Globe,
        title: "Trilingual Access",
        description: "Deliver your content in Sinhala, Tamil, or English, ensuring no student is left behind due to language barriers.",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30"
    }
]

export function TutorSection() {
    return (
        <section id="tutor" className="py-24 bg-slate-50 dark:bg-slate-900/20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content Side */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-6">
                                For Educators
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 dark:text-white leading-tight">
                                Empower Your Teaching with <span className="text-indigo-600 dark:text-indigo-400 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ExamMaster</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed">
                                Join a community of professional tutors and transform the way you assess student progress. Our platform provides the tools you need to create, manage, and analyze exams effectively.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 mb-10">
                                {tutorBenefits.map((benefit, i) => (
                                    <div key={benefit.title} className="flex gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center`}>
                                            <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{benefit.title}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link 
                                    href="/auth/tutor-register"
                                    className="group relative h-14 px-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-lg shadow-indigo-600/20"
                                >
                                    <span>Join as a Tutor</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                                </Link>
                                <Link 
                                    href="#features"
                                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Side */}
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative z-10"
                        >
                            <div className="relative rounded-[2rem] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
                                <Image 
                                    src="/tutor_landing.png" 
                                    alt="Tutor using ExamMaster platform" 
                                    width={800} 
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
                            </div>

                            {/* Floating Stats Card 1 */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                                        <p className="text-xl font-bold dark:text-white">1,500+</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stats Card 2 */}
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-6 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl z-20 hidden md:block border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                        <BarChart className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Score</p>
                                        <p className="text-xl font-bold dark:text-white">85.4%</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Background Blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] -z-10 rounded-full shrink-0" />
                    </div>
                </div>
            </div>
        </section>
    )
}
