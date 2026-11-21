/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/sppu/index.html',
      },
      {
        source: '/sppu',
        destination: '/sppu/index.html',
      },
      {
        source: '/dashboard',
        destination: '/sppu/index.html',
      },
      {
        source: '/scopus',
        destination: '/sppu/index.html',
      },
    ];
  },
};

export default nextConfig;
