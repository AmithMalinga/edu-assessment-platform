"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
    {
        question: "Is ExamMaster really free to use?",
        answer: "Yes! We offer a wide range of free resources and mock exams for O/L and A/L students. Some premium advanced features and specialized exam series may require a small subscription fee."
    },
    {
        question: "Does it support Sinhala and Tamil languages?",
        answer: "Absolutely. ExamMaster is designed specifically for Sri Lankan students. All exam questions, interfaces, and explanations are available in English, Sinhala, and Tamil."
    },
    {
        question: "Can I track my progress over time?",
        answer: "Yes, our platform provides detailed performance analytics. You can see your scores, time taken per question, and identify specific subject areas where you need more practice."
    },
    {
        question: "Are the exams based on the latest Sri Lankan curriculum?",
        answer: "Yes, our question bank is curated by experienced teachers and is strictly aligned with the latest National Institute of Education (NIE) syllabus for O/L and A/L."
    },
    {
        question: "How does the integrity protection work?",
        answer: "We use advanced browser-based monitoring to detect tab switching and unauthorized actions during exams to ensure a fair testing environment for everyone."
    }
]

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
        <section id="faq" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
                        <HelpCircle className="h-4 w-4" />
                        Common Questions
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black mb-4 dark:text-white">
                        Everything You Need <span className="text-indigo-600 dark:text-indigo-400">to Know</span>
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                                    activeIndex === i
                                        ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-xl shadow-indigo-500/10"
                                        : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                                }`}
                            >
                                <span className={`font-bold text-lg ${activeIndex === i ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-100"}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeIndex === i ? "rotate-180 text-indigo-500" : "text-slate-400"}`} />
                            </button>
                            <AnimatePresence>
                                {activeIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800 rounded-b-2xl border-x border-b border-slate-200 dark:border-slate-700 -mt-1">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
