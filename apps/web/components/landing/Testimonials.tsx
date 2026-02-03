"use client"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
    {
        name: "Kavindi Perera",
        role: "A/L Student, Colombo",
        avatar: "KP",
        rating: 5,
        text: "ExamMaster helped me score straight A's in my A/L Combined Maths. The real-time exam simulations prepared me perfectly for the actual exam pressure."
    },
    {
        name: "Arun Kumar",
        role: "O/L Student, Jaffna",
        avatar: "AK",
        rating: 5,
        text: "Finally a platform with proper Tamil support! The questions are exactly like the real O/L papers. My confidence has improved so much."
    },
    {
        name: "Nadeesha Silva",
        role: "Teacher, Royal College",
        avatar: "NS",
        rating: 5,
        text: "I recommend ExamMaster to all my students. The progress tracking helps me identify which topics need more attention in class."
    }
]

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900" />

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
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Loved by Students
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Across Sri Lanka
                        </span>
                    </h2>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Quote className="h-5 w-5 text-white fill-current" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, j) => (
                                    <Star key={j} className="h-5 w-5 text-amber-400 fill-current" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
