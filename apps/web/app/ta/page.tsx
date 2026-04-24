import {
    Header,
    Features,
    HowItWorks,
    Stats,
    TutorSection,
    Testimonials, 
    FAQ,
    Footer, 
} from "@/components/landing"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Play, CheckCircle2 } from "lucide-react"

function TamilHero() {
    return (
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden font-tamil">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950" />

            {/* Animated Mesh Gradient */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
                <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed" />
                <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-slow" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-left max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-8 shadow-sm">
                            <Sparkles className="h-4 w-4" />
                            <span>இலங்கையின் பெருமைக்குரிய தயாரிப்பு 🇱🇰</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-normal md:leading-snug">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                                உங்கள் பரீட்சைகளை நம்பிக்கையுடன்
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient inline-block mt-2">
                                வெல்லுங்கள்
                            </span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                            இலங்கை O/L மற்றும் A/L மாணவர்களுக்கான அதிநவீன மும்மொழித் தளம்.
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold"> உயர் பாதுகாப்புடன் நிகழ்நேர மதிப்பீடுகளை </span>
                            கொண்டுள்ளது.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link
                                href="/register"
                                className="group relative h-14 px-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <Play className="h-5 w-5 fill-current" />
                                பரீட்சையை முயற்சிக்குக
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                            </Link>
                            <Link href="/" className="h-14 px-8 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 font-sans">
                                🌐 English Version
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-800">
                                        <Image
                                            src={`/avatars/avatar${i}.png`}
                                            alt={`Student Avatar ${i}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                <div className="relative w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] z-10 font-sans">
                                    10k+
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                                <span>
                                    <span className="relative inline-block text-indigo-600 dark:text-indigo-400 font-black font-sans">
                                        10,000+
                                    </span> க்கும் மேற்பட்ட மாணவர்கள் இணைந்துள்ளனர்
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-200/50 dark:border-slate-800/50 p-2 bg-white/10 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-10" />
                            <Image
                                src="/mockup1.png"
                                alt="ExamMaster Dashboard Mockup"
                                fill
                                className="object-cover rounded-2xl"
                                priority
                            />
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">தேர்ச்சி விகிதம்</div>
                                <div className="text-xl font-black dark:text-white font-sans">98.2%</div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">கேள்விகள்</div>
                                <div className="text-xl font-black dark:text-white font-sans">50,000+</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

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
