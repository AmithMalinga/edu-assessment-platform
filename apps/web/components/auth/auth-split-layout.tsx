"use client"

import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"

type AuthSplitLayoutProps = {
    children: ReactNode
    imageSrc: string
    imageAlt: string
    headline: ReactNode
    description: ReactNode
}

export function AuthSplitLayout({ children, imageSrc, imageAlt, headline, description }: AuthSplitLayoutProps) {
    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-transparent rounded-2xl shadow-2xl relative">
            <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-950 rounded-2xl md:rounded-r-none md:rounded-l-2xl z-20 relative border border-slate-200/60 dark:border-slate-800/60 md:border-r-0">
                <div className="w-full max-w-[360px] mx-auto space-y-5">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-2">
                        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 rounded-lg shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105 group-hover:rotate-6">
                            <Zap className="text-white h-4 w-4 fill-current" />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            ExamMaster
                        </span>
                    </Link>

                    {children}
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 relative bg-slate-50 dark:bg-slate-900/50 pl-0 py-4 pr-4 rounded-r-2xl border-y border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
                <div className="relative w-full h-full rounded-tl-[80px] rounded-br-[60px] rounded-tr-[24px] rounded-bl-[24px] overflow-hidden group shadow-inner bg-indigo-900">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        priority
                        sizes="50vw"
                        className="object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-[1.5s]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 pointer-events-none">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl lg:text-4xl font-serif text-white mb-2 leading-tight drop-shadow-md"
                        >
                            {headline}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-sm font-medium drop-shadow"
                        >
                            {description}
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}