import type { Metadata } from 'next'
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSansSinhala = Noto_Sans_Sinhala({ subsets: ['sinhala'], variable: '--font-sinhala' })
const notoSansTamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-tamil' })

export const metadata: Metadata = {
    title: 'ExamMaster',
    description: 'Advanced Examination Platform',
    verification: {
        google: 'JACmNDgXZawPVd-NwgbJJgT712JADxUjU-zIStSblJs',
    },
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
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, notoSansSinhala.variable, notoSansTamil.variable)}>{children}</body>
        </html>
    )
}
