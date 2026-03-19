"use client"
import { useState } from "react"
import { studentService } from "@/lib/services/student.service"
import Link from "next/link"

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [educationalLevel, setEducationalLevel] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const errors: { [key: string]: string } = {};
        if (!name || name.length < 2) errors.name = "Name is required (min 2 chars).";
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email is required.";
        if (!phone || !/^\+?\d{7,15}$/.test(phone)) errors.phone = "Valid phone number is required.";
        if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) errors.age = "Valid age (10-100) required.";
        if (!educationalLevel) errors.educationalLevel = "Educational level is required.";
        if (!password || password.length < 6) errors.password = "Password must be at least 6 characters.";
        return errors;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const errors = validate();
        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) return;
        setLoading(true);
        try {
            const res = await studentService.register({
                name,
                email,
                phone,
                age: Number(age),
                educationalLevel,
                password
            });
            if (res.success) {
                setSuccess("Registration successful! Please login.");
                setName("");
                setEmail("");
                setPhone("");
                setAge("");
                setEducationalLevel("");
                setPassword("");
                setValidationErrors({});
            } else {
                setError(res.message || "Registration failed.");
            }
        } catch (err: any) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Register</h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.name && <div className="text-red-500 text-sm">{validationErrors.name}</div>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.email && <div className="text-red-500 text-sm">{validationErrors.email}</div>}
                    <input
                        type="text"
                        placeholder="Phone (+1234567890)"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.phone && <div className="text-red-500 text-sm">{validationErrors.phone}</div>}
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.age && <div className="text-red-500 text-sm">{validationErrors.age}</div>}
                    <input
                        type="text"
                        placeholder="Educational Level (e.g. Grade 10)"
                        value={educationalLevel}
                        onChange={e => setEducationalLevel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.educationalLevel && <div className="text-red-500 text-sm">{validationErrors.educationalLevel}</div>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {validationErrors.password && <div className="text-red-500 text-sm">{validationErrors.password}</div>}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">{success}</div>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <div className="mt-6 text-center text-slate-600 dark:text-slate-300">
                    Already have an account? <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    )
}
