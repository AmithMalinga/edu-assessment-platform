import {
    Header,
    Features,
    HowItWorks,
    Stats,
    TutorSection,
    SinhalaHero,
    Testimonials, 
    FAQ,
    Footer, 
} from "@/components/landing"

export default function SinhalaLandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Header />
            <main className="flex-1 font-sinhala">
                <SinhalaHero />
                <Features lang="si" />
                <HowItWorks lang="si" />
                <Stats lang="si" />
                <TutorSection lang="si" />
                <Testimonials lang="si" />
                <FAQ lang="si" />
            </main>
            <Footer />
        </div>
    )
}
