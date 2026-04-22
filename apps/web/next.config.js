/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL

if (!backendUrl) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: NEXT_PUBLIC_API_URL is not configured. API requests will fail at runtime.')
}

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
            },
        ],
    },
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
