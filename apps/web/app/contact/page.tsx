"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    Send, 
    CheckCircle2, 
    AlertCircle, 
    Twitter, 
    Github, 
    Linkedin, 
    Instagram,
    Zap,
    ArrowRight,
    Loader2,
    ArrowLeft
} from "lucide-react"
import { isValidEmail } from "@/lib/validation"
import Link from "next/link"

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        value: "support@exammaster.lk",
        description: "Our team typically responds within 2-4 hours.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100"
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+94 112 345 678",
        description: "Available Mon-Fri from 8am to 6pm.",
        color: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100"
    },
    {
        icon: MapPin,
        title: "Visit Us",
        value: "Colombo, Sri Lanka",
        description: "Level 12, West Tower, Echelon Square.",
        color: "text-pink-600",
        bg: "bg-pink-50",
        border: "border-pink-100"
    }
]

const socials = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-[#1DA1F2] hover:bg-sky-50" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-black hover:bg-slate-100" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-[#0A66C2] hover:bg-blue-50" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-[#E4405F] hover:bg-rose-50" },
]

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const validate = () => {
        const errors: { [key: string]: string } = {}
        if (!name || name.length < 2) errors.name = "Name is required (min 2 chars)."
        if (!isValidEmail(email)) errors.email = "Valid email is required."
        if (!subject || subject.length < 3) errors.subject = "Subject is required."
        if (!message || message.length < 10) errors.message = "Message must be at least 10 characters."
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const errors = validate()
        setValidationErrors(errors)
        if (Object.keys(errors).length > 0) return
        
        setLoading(true)
        try {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, "");
            const response = await fetch(`${baseUrl}/landing/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSuccess(true)
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
            setValidationErrors({})
        } catch (err) {
            console.error("Failed to send message", err)
            setError("Something went wrong. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-white pt-24 pb-12 selection:bg-indigo-100">
            {/* Back Button */}
            <div className="absolute top-8 left-8 z-20">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
                >
                    <div className="p-2 rounded-full bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:inline">Back to Home</span>
                </Link>
            </div>

            {/* Soft Light Background Orbs */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
                <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-70" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Hero Header */}
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group bg-slate-100 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
                            <Zap className="h-4 w-4 text-indigo-600 fill-current" />
                            <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">ExamMaster Support</span>
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            Get in Touch with Our <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Expert Support Team</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Have questions about our exam engine, proctoring features, or specific 
                            educational content? We're here to help you excel.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto px-4 md:px-0">
                    {/* Left Column: Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="grid gap-6">
                            {contactInfo.map((item, idx) => (
                                <div 
                                    key={item.title}
                                    className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`p-3 rounded-2xl ${item.bg} ${item.border} group-hover:scale-110 transition-transform`}>
                                            <item.icon className={`h-6 w-6 ${item.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 font-bold text-xl mb-1">{item.title}</h3>
                                            <p className="text-slate-800 font-medium mb-1">{item.value}</p>
                                            <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links Box */}
                        <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-indigo-950 font-extrabold text-xl mb-4">Connect on Social</h3>
                                <p className="text-indigo-900/60 mb-6 text-sm">Follow us for latest updates, exam tips, and success stories.</p>
                                <div className="flex gap-4">
                                    {socials.map((social) => (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            whileHover={{ y: -4 }}
                                            className={`w-12 h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-slate-500 transition-all duration-300 shadow-sm ${social.color}`}
                                            aria-label={social.label}
                                        >
                                            <social.icon className="h-6 w-6" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-indigo-200/20 rounded-full blur-[60px]" />
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-7"
                    >
                        <div className="relative p-8 md:p-10 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <AnimatePresence mode="wait">
                                {!success ? (
                                    <motion.form 
                                        key="contact-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Ruwan Perera"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                                />
                                                {validationErrors.name && <div className="text-rose-600 text-xs mt-1 ml-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3.5 w-3.5" /> {validationErrors.name}</div>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="e.g. name@example.com"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                                />
                                                {validationErrors.email && <div className="text-rose-600 text-xs mt-1 ml-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3.5 w-3.5" /> {validationErrors.email}</div>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-600 ml-1">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="What is this regarding?"
                                                value={subject}
                                                onChange={e => setSubject(e.target.value)}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            />
                                            {validationErrors.subject && <div className="text-rose-600 text-xs mt-1 ml-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3.5 w-3.5" /> {validationErrors.subject}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-600 ml-1">Your Message</label>
                                            <textarea
                                                placeholder="Tell us how we can help..."
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[160px] resize-none"
                                            />
                                            {validationErrors.message && <div className="text-rose-600 text-xs mt-1 ml-1 flex items-center gap-1 font-medium"><AlertCircle className="h-3.5 w-3.5" /> {validationErrors.message}</div>}
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-2"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {error}
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 active:scale-[0.98] group/btn disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div 
                                        key="success-message"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12 px-4"
                                    >
                                        <div className="w-24 h-24 bg-green-50 rounded-full border-4 border-green-100 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100/50">
                                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Message Sent!</h2>
                                        <p className="text-slate-600 text-lg mb-10 max-w-sm mx-auto">
                                            Thank you for reaching out. We've received your inquiry and our 
                                            team will get back to you shortly.
                                        </p>
                                        <button 
                                            onClick={() => setSuccess(false)}
                                            className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                                        >
                                            Send another message <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Support Link */}
                <div className="mt-20 text-center">
                    <p className="text-slate-400 text-sm">
                        Prefer real-time chat? Check our <Link href="#" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">Community Discord</Link> or <Link href="#" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">Help Center</Link> for quicker answers.
                    </p>
                </div>
            </div>
        </main>
    )
}

