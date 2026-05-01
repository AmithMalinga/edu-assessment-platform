import {
    Header,
    Features,
    HowItWorks,
    Stats,
    TutorSection,
    TamilHero,
    Testimonials, 
    FAQ,
    Footer, 
} from "@/components/landing"

export default function TamilLandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Header />
            <main className="flex-1 font-tamil">
                <TamilHero />
                <Features lang="ta" />
                <HowItWorks lang="ta" />
                <Stats lang="ta" />
                <TutorSection lang="ta" />
                <Testimonials lang="ta" />
                <FAQ lang="ta" />
            </main>
            <Footer />
        </div>
    )
}
