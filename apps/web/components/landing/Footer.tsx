"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Github, Twitter, Linkedin, Mail, Instagram, ArrowRight, Globe, Sparkles } from "lucide-react"

const footerLinks = {
    Product: [
        { name: "Core Features", href: "#features" },
        { name: "Exam Engine", href: "#engine" },
        { name: "Proctoring", href: "#proctoring" },
        { name: "Pricing", href: "#pricing" }
    ],
    Company: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Success Stories", href: "#success" },
        { name: "Contact", href: "/contact" }
    ],
    Resources: [
        { name: "Documentation", href: "#docs" },
        { name: "Help Center", href: "#help" },
        { name: "API Reference", href: "#api" },
        { name: "Community", href: "#community" }
    ],
    Legal: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "Security", href: "#security" }
    ]
}

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-[#1DA1F2]" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-white" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-[#0A66C2]" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-[#E4405F]" },
]

export function Footer() {
    return (
        <footer className="relative pt-24 pb-12 overflow-hidden bg-slate-950 border-t border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Newsletter Section */}
                <div className="relative mb-20 p-8 md:p-12 rounded-[2.5rem] bg-indigo-600/5 border border-white/10 backdrop-blur-sm overflow-hidden group">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-700" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                                Stay ahead in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">exam journey</span>
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Get exclusive study tips, platform updates, and local educational news delivered straight to your inbox.
                            </p>
                        </div>
                        
                        <div className="w-full lg:w-auto min-w-[320px] md:min-w-[450px]">
                            <form className="flex flex-col sm:flex-row gap-3 p-2 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-0"
                                    required
                                />
                                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 group/btn">
                                    Subscribe
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            <p className="mt-3 text-[12px] text-slate-500 text-center lg:text-left ml-2">
                                Join <span className="text-indigo-400 font-bold">5,000+</span> students already subscribed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link className="flex items-center gap-2.5 mb-8 group" href="/">
                            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
                                <Zap className="text-white h-6 w-6 fill-current" />
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-black text-2xl text-white tracking-tighter">ExamMaster</span>
                        </Link>
                        <p className="text-slate-400 mb-8 max-w-sm leading-relaxed text-[15px]">
                            The most advanced trilingual assessment platform in Sri Lanka. 
                            Empowering students to achieve academic excellence through 
                            intelligent mock exams and real-time analytics.
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
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="col-span-1">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">{title}</h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-indigo-400 transition-colors text-[15px] flex items-center group"
                                        >
                                            <span className="w-0 h-[1.5px] bg-indigo-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                                            {link.name}
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
                                Made in Sri Lanka 🇱🇰
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            © 2026 ExamMaster. Developed with ❤️ by <span className="text-white font-medium">CodeTrio</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2 text-indigo-400 font-medium">
                            <Globe className="h-4 w-4" />
                            <span>EN / සිං / Tag</span>
                        </div>
                        <div className="hidden md:flex gap-6">
                            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
                            <Link href="#" className="hover:text-white transition-colors">Trust Center</Link>
                            <Link href="#" className="hover:text-white transition-colors">Status</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Glow at bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </footer>
    )
}

