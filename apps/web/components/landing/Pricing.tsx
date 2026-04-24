"use client"
import { motion } from "framer-motion"
import { Check, Zap, Star, Shield } from "lucide-react"

const plans = [
    {
        name: "Standard",
        price: "Free",
        desc: "Perfect for getting started",
        features: ["Access to Demo Exams", "Limited Questions", "Basic Performance Tracking"],
        icon: Zap,
        color: "slate",
        button: "Get Started"
    },
    {
        name: "Pro Student",
        price: "₨ 1,200",
        desc: "Everything you need to ace it",
        features: ["Unlimited Practice Exams", "Real-time AI Feedback", "Trilingual Support", "Detailed Weakness Analysis"],
        icon: Star,
        color: "indigo",
        button: "Go Pro Now",
        popular: true
    },
    {
        name: "Exam Center",
        price: "Custom",
        desc: "For schools and tuition centers",
        features: ["Bulk User Management", "Custom Exam Builder", "Full Integrity Protection", "Priority Support"],
        icon: Shield,
        color: "slate",
        button: "Contact Sales"
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 dark:text-white">
                        Simple, <span className="text-indigo-600 dark:text-indigo-400">Transparent</span> Pricing
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Choose the plan that fits your learning journey. From self-study to classroom management.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-[2.5rem] border ${
                                plan.popular 
                                ? "border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-900 shadow-2xl scale-105 z-10" 
                                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                            } transition-transform duration-500`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl ${plan.popular ? "bg-indigo-600 p-3 text-white" : "bg-slate-200 dark:bg-slate-800 p-3 text-slate-600 dark:text-slate-400"} mb-6`}>
                                    <plan.icon className="w-full h-full" />
                                </div>
                                <h3 className="text-xl font-black mb-2 dark:text-white">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black dark:text-white">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-slate-500 font-bold">/term</span>}
                                </div>
                                <p className="text-sm text-slate-500 font-bold mt-2">{plan.desc}</p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 items-start">
                                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full h-14 rounded-2xl font-black transition-all ${
                                plan.popular 
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20" 
                                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}>
                                {plan.button}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
