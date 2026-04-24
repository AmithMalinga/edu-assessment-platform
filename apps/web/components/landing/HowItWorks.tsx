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

export function HowItWorks({ lang = 'en' }: { lang?: 'en' | 'si' | 'ta' }) {
    const t = {
        title1: lang === 'si' ? "ක්‍රියාත්මක වන " : lang === 'ta' ? "இது எவ்வாறு " : "How It ",
        title2: lang === 'si' ? "ආකාරය" : lang === 'ta' ? "செயல்படுகிறது" : "Works",
        desc: lang === 'si' 
            ? "සරල පියවර තුනකින් ඔබේ විභාග සූදානම අරඹන්න."
            : lang === 'ta'
            ? "மூன்று எளிய படிகளில் உங்கள் பரீட்சை தயாரிப்பைத் தொடங்குங்கள்."
            : "Get started on your journey to exam excellence in three simple steps.",
        steps: steps.map(s => ({
            ...s,
            title: lang === 'si' ? (
                s.title === "Create Account" ? "ගිණුමක් සාදන්න" :
                s.title === "Choose Subject" ? "විෂය තෝරන්න" : "ඔබේ කුසලතා වර්ධනය කරන්න"
            ) : lang === 'ta' ? (
                s.title === "Create Account" ? "கணக்கை உருவாக்குங்கள்" :
                s.title === "Choose Subject" ? "பாடத்தை தேர்ந்தெடுங்கள்" : "உங்கள் திறன்களை வளர்க்கவும்"
            ) : s.title,
            description: lang === 'si' ? (
                s.title === "Create Account" ? "නොමිලේ ලියාපදිංචි වන්න. ඔබේ පැතිකඩ සකසා ශ්‍රේණිය තෝරන්න." :
                s.title === "Choose Subject" ? "ඔබේ විෂය නිර්දේශයට ගැලපෙන O/L සහ A/L විෂයයන් තෝරන්න." : "සජීවී විභාගවලට මුහුණ දෙන්න, ප්‍රගතිය නිරීක්ෂණය කරන්න."
            ) : lang === 'ta' ? (
                s.title === "Create Account" ? "இலவசமாக பதிவு செய்யுங்கள். உங்கள் சுயவிவரத்தை அமைத்து தரத்தை தேர்ந்தெடுங்கள்." :
                s.title === "Choose Subject" ? "உங்கள் பாடத்திட்டத்திற்கு ஏற்ற O/L மற்றும் A/L பாடங்களை தேர்ந்தெடுங்கள்." : "நேரடி பரீட்சைகளை எதிர்கொள்ளுங்கள், முன்னேற்றத்தை கண்காணிக்கவும்."
            ) : s.description
        }))
    }

    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-5xl font-black mb-4 ${lang === 'si' ? 'font-sinhala leading-normal' : lang === 'ta' ? 'font-tamil leading-normal' : ''}`}>
                        {t.title1} <span className="text-indigo-600 dark:text-indigo-400">{t.title2}</span>
                    </h2>
                    <p className={`text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg ${lang === 'si' ? 'font-sinhala font-medium' : lang === 'ta' ? 'font-tamil font-medium' : ''}`}>
                        {t.desc}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />

                    {t.steps.map((step, i) => (
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
                            <h3 className={`text-xl font-bold mb-3 dark:text-white ${lang === 'si' ? 'font-sinhala' : lang === 'ta' ? 'font-tamil' : ''}`}>{step.title}</h3>
                            <p className={`text-slate-600 dark:text-slate-400 leading-relaxed ${lang === 'si' ? 'font-sinhala font-medium' : lang === 'ta' ? 'font-tamil font-medium' : ''}`}>
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
