"use client"
import { useState } from "react"

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const isValidEmail = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed || trimmed.includes(" ")) return false

        const atIndex = trimmed.indexOf("@")
        if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@") || atIndex === trimmed.length - 1) {
            return false
        }

        const local = trimmed.slice(0, atIndex)
        const domain = trimmed.slice(atIndex + 1)

        if (!local || !domain || domain.startsWith(".") || domain.endsWith(".")) return false
        if (!domain.includes(".")) return false

        const domainParts = domain.split(".")
        if (domainParts.some((part) => part.length === 0)) return false

        return true
    }

    const validate = () => {
        const errors: { [key: string]: string } = {}
        if (!name || name.length < 2) errors.name = "Name is required (min 2 chars)."
        if (!isValidEmail(email)) errors.email = "Valid email is required."
        if (!subject || subject.length < 3) errors.subject = "Subject is required (min 3 chars)."
        if (!message || message.length < 10) errors.message = "Message must be at least 10 characters."
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        const errors = validate()
        setValidationErrors(errors)
        if (Object.keys(errors).length > 0) return
        setLoading(true)
        try {
            // TODO: Replace with actual API call
            await new Promise(res => setTimeout(res, 1000))
            setSuccess("Your message has been sent! Admins will contact you soon.")
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
            setValidationErrors({})
        } catch (err: any) {
            setError("Failed to send message. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-full max-w-lg p-8 rounded-3xl shadow-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.name && <div className="text-red-500 text-sm">{validationErrors.name}</div>}
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.email && <div className="text-red-500 text-sm">{validationErrors.email}</div>}
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.subject && <div className="text-red-500 text-sm">{validationErrors.subject}</div>}
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                    />
                    {validationErrors.message && <div className="text-red-500 text-sm">{validationErrors.message}</div>}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    )
}
