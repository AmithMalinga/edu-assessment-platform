"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { studentService } from "@/lib/services/student.service"

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [educationalLevel, setEducationalLevel] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const errors: { [key: string]: string } = {};
        if (!name || name.length < 2) errors.name = "Name is required (min 2 chars).";
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required.";
        if (!phone || !/^\+?\d{7,15}$/.test(phone)) errors.phone = "Valid phone is required.";
        if (!age || Number.isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) errors.age = "Valid age required.";
        if (!educationalLevel) errors.educationalLevel = "Level is required.";
        if (!password || password.length < 6) errors.password = "Min 6 chars.";
        return errors;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const errors = validate();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;
        
        setIsLoading(true);
        try {
            const res = await studentService.register({
                name,
                email,
                phone,
                age: Number(age),
                educationalLevel,
                password
            });
            console.log("res", res);
            if (res.access_token || res.success) {
                setSuccess("Registration successful! Please login.");
                setName(""); setEmail(""); setPhone(""); setAge(""); setEducationalLevel(""); setPassword("");
                setValidationErrors({});
            } else {
                const errorMessage = Array.isArray(res.message) ? res.message[0] : res.message;
                setError(errorMessage || "Registration failed.");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-transparent rounded-2xl shadow-2xl relative">
            {/* Left Column: Form */}
            <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-950 rounded-2xl md:rounded-r-none md:rounded-l-2xl z-20 relative border border-slate-200/60 dark:border-slate-800/60 md:border-r-0">
                <div className="w-full max-w-[360px] mx-auto space-y-4">

                    {/* Inline Logo from Landing Page */}
                    <Link href="/" className="inline-flex items-center gap-2 group mb-0">
                        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 rounded-lg shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105 group-hover:rotate-6">
                            <Zap className="text-white h-4 w-4 fill-current" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            ExamMaster
                        </span>
                    </Link>

                    {/* Header */}
                    <div className="space-y-1 pt-1">
                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
                            Create account
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Join our community of exceptional learners.
                        </p>
                    </div>

                    {/* OAuth Providers */}
                    <div className="space-y-2">
                        <Button 
                            variant="outline" 
                            type="button"
                            className="w-full h-10 border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 font-semibold shadow-sm transition-colors rounded-lg" 
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Sign up with Google
                        </Button>
                    </div>

                    <div className="relative py-1 border-t-0">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="dark:bg-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 cursor-default">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-3">
                        
                        {/* Compact Row 1: Name & Phone */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Name<span className="text-indigo-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    disabled={isLoading}
                                    className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500'} rounded-lg`}
                                />
                                {validationErrors.name && <div className="text-red-500 text-[10px] font-semibold truncate">{validationErrors.name}</div>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Phone<span className="text-indigo-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    placeholder="+1234567"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    disabled={isLoading}
                                    className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.phone ? 'border-red-500' : ''} rounded-lg`}
                                />
                                {validationErrors.phone && <div className="text-red-500 text-[10px] font-semibold truncate">{validationErrors.phone}</div>}
                            </div>
                        </div>

                        {/* Full Width Row: Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Email<span className="text-indigo-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isLoading}
                                className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500'} rounded-lg`}
                            />
                            {validationErrors.email && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.email}</div>}
                        </div>

                        {/* Compact Row 2: Age & Education Level */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="age" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Age<span className="text-indigo-500">*</span>
                                </Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Age"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                    disabled={isLoading}
                                    className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.age ? 'border-red-500' : ''} rounded-lg`}
                                />
                                {validationErrors.age && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.age}</div>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="educationalLevel" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Education Level<span className="text-indigo-500">*</span>
                                </Label>
                                <Input
                                    id="educationalLevel"
                                    type="text"
                                    placeholder="E.g. Grade 10"
                                    value={educationalLevel}
                                    onChange={e => setEducationalLevel(e.target.value)}
                                    disabled={isLoading}
                                    className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors gap-0 ${validationErrors.educationalLevel ? 'border-red-500' : ''} rounded-lg`}
                                />
                                {validationErrors.educationalLevel && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.educationalLevel}</div>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Password<span className="text-indigo-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={isLoading}
                                className={`h-10 text-sm bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors ${validationErrors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-500'} rounded-lg`}
                            />
                            {validationErrors.password && <div className="text-red-500 text-[10px] font-semibold">{validationErrors.password}</div>}
                        </div>

                        {error && <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-red-600 text-[11px] font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50">{error}</motion.div>}
                        {success && <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="text-indigo-600 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">{success}</motion.div>}
                        
                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5" 
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign up
                            </Button>
                        </div>
                        
                        <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-2 pb-1">
                            By creating an account, you agree to our <span className="underline cursor-pointer">terms of use</span>.
                        </p>
                    </form>

                    <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4 transition-all tracking-wide">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column: Visual/Image with Custom Borders */}
            <div className="hidden md:flex md:w-1/2 relative bg-slate-50 dark:bg-slate-900/50 pl-0 py-4 pr-4 rounded-r-2xl border-y border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                <div className="relative w-full h-full rounded-tl-[80px] rounded-br-[60px] rounded-tr-[24px] rounded-bl-[24px] overflow-hidden group shadow-inner bg-indigo-900">
                    <Image 
                        src="/auth_hero_register.png" 
                        alt="Student inspired" 
                        fill 
                        priority
                        sizes="50vw"
                        className="object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-[1.5s]" 
                    />
                    
                    {/* Dark gradient overlay at the bottom for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 pointer-events-none">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl lg:text-4xl font-serif text-white mb-2 leading-tight drop-shadow-md"
                        >
                            Start <span className="italic text-indigo-300 font-light">thriving</span> with ExamMaster
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-sm font-medium drop-shadow"
                        >
                            Build your knowledge, challenge yourself, and reach new heights.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}
