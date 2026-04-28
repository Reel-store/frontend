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
    // RAILS_BACKEND_URL: internal URL of the Rails server (not the public API path).
    // Dev default: http://localhost:3000
    // Production: set to e.g. https://api.yourapp.com
    const railsBackend = process.env.RAILS_BACKEND_URL || 'http://localhost:3000';
    return [
      {
        // Proxy Active Storage requests through Next.js so images work
        // regardless of WSL/network port visibility
        source: '/rails/:path*',
        destination: `${railsBackend}/rails/:path*`,
      },
    ];
  },
}

export default nextConfig
