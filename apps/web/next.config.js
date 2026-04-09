/** @type {import('next').NextConfig} */
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
                destination: 'http://localhost:3001/:path*',
            },
        ]
    },
}

module.exports = nextConfig
