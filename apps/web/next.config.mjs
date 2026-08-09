/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kod-raido/shared', '@kod-raido/ui', '@kod-raido/game-engine'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
  },
  eslint: {
    // We lint separately with our own workspace ESLint preset (`npm run lint`);
    // Next's built-in eslint-config-next is intentionally not installed.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
