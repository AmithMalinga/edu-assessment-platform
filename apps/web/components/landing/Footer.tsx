"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Github, Twitter, Linkedin, Mail, Instagram, ArrowRight, Globe, Sparkles } from "lucide-react"

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-[#1DA1F2]" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-white" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-[#0A66C2]" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-[#E4405F]" },
]

import { usePathname } from "next/navigation"

export function Footer() {
    const pathname = usePathname()
    const lang = pathname === '/si' ? 'si' : pathname === '/ta' ? 'ta' : 'en'

    const t = {
        title1: lang === 'si' ? "ඔබේ විභාග ගමන " : lang === 'ta' ? "உங்கள் பரீட்சை பயணத்தில் " : "Stay ahead in your ",
        title2: lang === 'si' ? "ඉදිරියෙන් සිටින්න" : lang === 'ta' ? "முன்னணியில் இருங்கள்" : "exam journey",
        subtitle: lang === 'si' 
            ? "විශේෂ අධ්‍යයන ඉඟි, වේදිකාවේ යාවත්කාලීන කිරීම් සහ දේශීය අධ්‍යාපනික පුවත් සෘජුවම ලබා ගන්න."
            : lang === 'ta'
            ? "பிரத்தியேக ஆய்வு உதவிக்குறிப்புகள், மேடை புதுப்பிப்புகள் மற்றும் உள்ளூர் கல்வி செய்திகளை நேரடியாகப் பெறுங்கள்."
            : "Get exclusive study tips, platform updates, and local educational news delivered straight to your inbox.",
        placeholder: lang === 'si' ? "ඔබේ ඊමේල් ලිපිනය ඇතුලත් කරන්න" : lang === 'ta' ? "உங்கள் மின்னஞ்சலை உள்ளிடவும்" : "Enter your email",
        subscribe: lang === 'si' ? "ලියාපදිංචි වන්න" : lang === 'ta' ? "பதிவு செய்க" : "Subscribe",
        joinText: lang === 'si' ? "දැනටමත් ලියාපදිංචි වී ඇති සිසුන් " : lang === 'ta' ? "ஏற்கனவே பதிவுசெய்துள்ள மாணவர்களுடன் " : "Join ",
        joinStudents: lang === 'si' ? "ක් සමඟ එක්වන්න." : lang === 'ta' ? "இணையுங்கள்." : " students already subscribed.",
        desc: lang === 'si' 
            ? "ශ්‍රී ලංකාවේ වඩාත්ම දියුණු ත්‍රිභාෂා ඇගයීම් වේදිකාව. බුද්ධිමත් පෙරහුරු විභාග සහ තත්‍ය කාලීන විශ්ලේෂණ හරහා අධ්‍යයන විශිෂ්ටත්වය ළඟා කර ගැනීමට සිසුන් සවිබල ගන්වයි."
            : lang === 'ta'
            ? "இலங்கையின் மிகவும் மேம்பட்ட மும்மொழி மதிப்பீட்டு தளம். புத்திசாலித்தனமான மாதிரி பரீட்சைகள் மற்றும் நிகழ்நேர பகுப்பாய்வு மூலம் கல்வியில் சிறந்து விளங்க மாணவர்களை மேம்படுத்துகிறது."
            : "The most advanced trilingual assessment platform in Sri Lanka. Empowering students to achieve academic excellence through intelligent mock exams and real-time analytics.",
        madeIn: lang === 'si' ? "ශ්‍රී ලංකාවේ ආඩම්බර නිෂ්පාදනයකි 🇱🇰" : lang === 'ta' ? "இலங்கையின் பெருமைக்குரிய தயாரிப்பு 🇱🇰" : "Made in Sri Lanka 🇱🇰",
        developedBy: lang === 'si' ? "විසින් නිර්මාණය කරන ලදී" : lang === 'ta' ? "உருவாக்கியது" : "Developed with ❤️ by",
        links: {
            Explore: {
                title: lang === 'si' ? "ගවේෂණය කරන්න" : lang === 'ta' ? "ஆராயுங்கள்" : "Explore",
                items: [
                    { name: lang === 'si' ? "මුල් පිටුව" : lang === 'ta' ? "முகப்பு" : "Home", href: "#home" },
                    { name: lang === 'si' ? "විශේෂාංග" : lang === 'ta' ? "அம்சங்கள்" : "Features", href: "#features" },
                    { name: lang === 'si' ? "ගුරුවරුන්" : lang === 'ta' ? "ஆசிரியர்கள்" : "Tutors", href: "#tutors" },
                    { name: lang === 'si' ? "අදහස්" : lang === 'ta' ? "சான்றுகள்" : "Testimonials", href: "#testimonials" }
                ]
            },
            Company: {
                title: lang === 'si' ? "සමාගම" : lang === 'ta' ? "நிறுவனம்" : "Company",
                items: [
                    { name: lang === 'si' ? "අප ගැන" : lang === 'ta' ? "எங்களை பற்றி" : "About Us", href: "#about" },
                    { name: lang === 'si' ? "මිල ගණන්" : lang === 'ta' ? "விலை" : "Pricing", href: "#pricing" }
                ]
            },
            Contact: {
                title: lang === 'si' ? "අපව අමතන්න" : lang === 'ta' ? "எங்களைத் தொடர்பு கொள்ளுங்கள்" : "Contact Us",
                items: [
                    { name: "info@exammaster.lk", href: "mailto:info@exammaster.lk", icon: Mail },
                    { name: "+94 11 234 5678", href: "tel:+94112345678", icon: Globe },
                    { name: "Colombo, Sri Lanka", href: "#", icon: Sparkles }
                ]
            }
        }
    }

    return (
        <footer className={`relative pt-24 pb-12 overflow-hidden bg-slate-950 border-t border-white/5 ${lang === 'si' ? 'font-sinhala' : lang === 'ta' ? 'font-tamil' : ''}`}>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Newsletter Section */}
                {/* <div className="relative mb-20 p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/5 border border-white/10 backdrop-blur-sm overflow-hidden group">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-700" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                                {t.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t.title2}</span>
                            </h2>
                            <p className="text-slate-400 text-lg">
                                {t.subtitle}
                            </p>
                        </div>
                        
                        <div className="w-full lg:w-auto min-w-[320px] md:min-w-[450px]">
                            <form className="flex flex-col sm:flex-row gap-3 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                                <input 
                                    type="email" 
                                    placeholder={t.placeholder}
                                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-0 font-sans"
                                    required
                                />
                                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 group/btn">
                                    {t.subscribe}
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            <p className="mt-3 text-[12px] text-slate-500 text-center lg:text-left ml-2">
                                {t.joinText} <span className="text-indigo-400 font-bold font-sans">5,000+</span> {t.joinStudents}
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <Link className="flex items-center gap-2.5 mb-8 group" href="/">
                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
                                <Zap className="text-white h-6 w-6 fill-current" />
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-black text-2xl text-white tracking-tighter font-sans">ExamMaster</span>
                        </Link>
                        <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-[15px]">
                            {t.desc}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ y: -4 }}
                                    className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:bg-white/10 hover:border-white/20`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(t.links).map(([key, category]) => (
                        <div key={key} className="col-span-1">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{category.title}</h3>
                            <ul className="space-y-4">
                                {category.items.map((link: any) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-indigo-400 transition-colors text-[15px] flex items-start gap-3 group"
                                        >
                                            {link.icon ? (
                                                <link.icon className="h-4 w-4 mt-1 text-indigo-500/50 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                            ) : (
                                                <span className="w-0 h-[1.5px] bg-indigo-500 mt-[10px] group-hover:w-3 transition-all duration-300 flex-shrink-0" />
                                            )}
                                            <span className="leading-relaxed">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                {t.madeIn}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            © 2026 ExamMaster. {t.developedBy} <span className="text-white font-medium font-sans">CodeTrio</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2 text-indigo-400 font-medium font-sans">
                            <Globe className="h-4 w-4" />
                            <span>EN / සිං / தமிழ்</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Glow at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </footer>
    )
}

