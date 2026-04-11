import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'ExamMaster',
    description: 'Advanced Examination Platform',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-3HVCM2SYG0"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-3HVCM2SYG0');
                    `}
                </Script>
            </head>
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>{children}</body>
        </html>
    )
}
