"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
    Product: ["Features", "Pricing", "Demo", "Updates"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy", "Terms", "Cookie Policy"],
    Resources: ["Documentation", "Help Center", "Community", "API"]
}

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
]

export function Footer() {
    return (
        <footer className="relative pt-20 pb-10 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

            {/* Decorative Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="grid lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link className="flex items-center gap-2.5 mb-6" href="/">
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-xl">
                                <Zap className="text-white h-5 w-5 fill-current" />
                            </div>
                            <span className="font-extrabold text-2xl text-white">ExamMaster</span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                            Empowering Sri Lankan students with the best exam preparation platform. Practice, learn, and excel in your O/L and A/L examinations.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="font-bold text-white mb-4">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2026 ExamMaster. Developed with ❤️ by CodeTrio.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-indigo-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
