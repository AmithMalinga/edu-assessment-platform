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

export function FAQ({ lang = 'en' }: { lang?: 'en' | 'si' | 'ta' }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const t = {
        badge: lang === 'si' ? "පොදු ප්‍රශ්න" : lang === 'ta' ? "பொதுவான கேள்விகள்" : "Common Questions",
        title1: lang === 'si' ? "ඔබ දැනගත යුතු " : lang === 'ta' ? "நீங்கள் தெரிந்து கொள்ள வேண்டிய " : "Everything You Need ",
        title2: lang === 'si' ? "සියල්ල" : lang === 'ta' ? "அனைத்தும்" : "to Know",
        faqs: faqs.map(f => ({
            ...f,
            question: lang === 'si' ? (
                f.question === "Is ExamMaster really free to use?" ? "ExamMaster භාවිතා කිරීමට ඇත්තටම නොමිලේ ද?" :
                f.question === "Does it support Sinhala and Tamil languages?" ? "මෙය සිංහල සහ දෙමළ භාෂාවලට සහාය දක්වයිද?" :
                f.question === "Can I track my progress over time?" ? "මට මගේ ප්‍රගතිය නිරීක්ෂණය කළ හැකිද?" :
                f.question === "Are the exams based on the latest Sri Lankan curriculum?" ? "විභාග නවතම ශ්‍රී ලාංකික විෂය නිර්දේශය මත පදනම් වී තිබේද?" :
                "ආරක්ෂක පද්ධතිය ක්‍රියාත්මක වන්නේ කෙසේද?"
            ) : lang === 'ta' ? (
                f.question === "Is ExamMaster really free to use?" ? "ExamMaster ஐப் பயன்படுத்துவது உண்மையிலேயே இலவசமா?" :
                f.question === "Does it support Sinhala and Tamil languages?" ? "இது சிங்களம் மற்றும் தமிழ் மொழிகளை ஆதரிக்கிறதா?" :
                f.question === "Can I track my progress over time?" ? "எனது முன்னேற்றத்தை நான் கண்காணிக்க முடியுமா?" :
                f.question === "Are the exams based on the latest Sri Lankan curriculum?" ? "பரீட்சைகள் சமீபத்திய இலங்கை பாடத்திட்டத்தை அடிப்படையாகக் கொண்டவையா?" :
                "பாதுகாப்பு அமைப்பு எவ்வாறு செயல்படுகிறது?"
            ) : f.question,
            answer: lang === 'si' ? (
                f.question === "Is ExamMaster really free to use?" ? "ඔව්! අපි O/L සහ A/L සිසුන් සඳහා නොමිලේ සම්පත් සහ පෙරහුරු විභාග රාශියක් ලබා දෙන්නෙමු." :
                f.question === "Does it support Sinhala and Tamil languages?" ? "නියත වශයෙන්ම. ExamMaster විශේෂයෙන්ම නිර්මාණය කර ඇත්තේ ශ්‍රී ලාංකික සිසුන් සඳහායි." :
                f.question === "Can I track my progress over time?" ? "ඔව්, අපගේ වේදිකාව සවිස්තරාත්මක කාර්ය සාධන විශ්ලේෂණ සපයයි." :
                f.question === "Are the exams based on the latest Sri Lankan curriculum?" ? "ඔව්, අපගේ ප්‍රශ්න බැංකුව අත්දැකීම් බහුල ගුරුවරුන් විසින් NIE නවතම විෂය නිර්දේශයට අනුව සකසා ඇත." :
                "විභාග අතරතුර අනවසර ක්‍රියාකාරකම් හඳුනා ගැනීමට අපි උසස් බ්‍රවුසර නිරීක්ෂණ ක්‍රම භාවිතා කරමු."
            ) : lang === 'ta' ? (
                f.question === "Is ExamMaster really free to use?" ? "ஆம்! O/L மற்றும் A/L மாணவர்களுக்கான பல இலவச வளங்களையும் மாதிரி பரீட்சைகளையும் நாங்கள் வழங்குகிறோம்." :
                f.question === "Does it support Sinhala and Tamil languages?" ? "நிச்சயமாக. ExamMaster இலங்கை மாணவர்களுக்காக பிரத்தியேகமாக வடிவமைக்கப்பட்டுள்ளது." :
                f.question === "Can I track my progress over time?" ? "ஆம், எங்கள் தளம் விரிவான செயல்திறன் பகுப்பாய்வுகளை வழங்குகிறது." :
                f.question === "Are the exams based on the latest Sri Lankan curriculum?" ? "ஆம், எங்கள் கேள்வி வங்கி அனுபவம் வாய்ந்த ஆசிரியர்களால் NIE சமீபத்திய பாடத்திட்டத்திற்கு இணங்க தயாரிக்கப்பட்டுள்ளது." :
                "பரீட்சைகளின் போது அங்கீகரிக்கப்படாத செயல்களைக் கண்டறிய மேம்பட்ட உலாவி கண்காணிப்பு முறைகளைப் பயன்படுத்துகிறோம்."
            ) : f.answer
        }))
    }

    return (
        <section id="faq" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className={`inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4 ${lang === 'si' ? 'font-sinhala' : lang === 'ta' ? 'font-tamil' : ''}`}>
                        <HelpCircle className="h-4 w-4" />
                        {t.badge}
                    </span>
                    <h2 className={`text-3xl md:text-5xl font-black mb-4 dark:text-white ${lang === 'si' ? 'font-sinhala leading-normal' : lang === 'ta' ? 'font-tamil leading-normal' : ''}`}>
                        {t.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t.title2}</span>
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {t.faqs.map((faq, i) => (
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
                                <span className={`font-bold text-lg ${activeIndex === i ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-100"} ${lang === 'si' ? 'font-sinhala' : lang === 'ta' ? 'font-tamil' : ''}`}>
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
                                        <div className={`p-6 text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800 rounded-b-2xl border-x border-b border-slate-200 dark:border-slate-700 -mt-1 ${lang === 'si' ? 'font-sinhala font-medium' : lang === 'ta' ? 'font-tamil font-medium' : ''}`}>
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
