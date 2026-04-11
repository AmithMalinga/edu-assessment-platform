/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL

if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
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
