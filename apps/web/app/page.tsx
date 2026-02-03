"use client"
import { Header, Hero, Features, Stats, Testimonials, Footer } from "@/components/landing"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Header />
            <main className="flex-1">
                <Hero />
                <Features />
                <Stats />
                <Testimonials />
            </main>
            <Footer />
        </div>
    )
}