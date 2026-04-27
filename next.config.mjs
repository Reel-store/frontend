/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://embed.figma.com https://www.figma.com;",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Proxy Active Storage requests through Next.js so images work
        // regardless of WSL/network port visibility
        source: '/rails/:path*',
        destination: 'http://localhost:3000/rails/:path*',
      },
    ];
  },
}

export default nextConfig
