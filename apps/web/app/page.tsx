"use client"
import { Header, Hero, Features, Stats, Testimonials, Footer, TutorSection } from "@/components/landing"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FAQ } from "@/components/landing/FAQ"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Header />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <TutorSection />
                <Stats />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    )
}