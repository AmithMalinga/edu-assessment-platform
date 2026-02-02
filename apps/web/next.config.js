/** @type {import('next').NextConfig} */
const nextConfig = {
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
