/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@crm360/shared', '@crm360/ui'],
  async redirects() {
    return [
      {
        source: '/companies',
        destination: '/crm/companies',
        permanent: true,
      },
      {
        source: '/pipeline',
        destination: '/pipeline/deals',
        permanent: true,
      },
      {
        source: '/contacts',
        destination: '/crm/contacts',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'crm360-assets.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'api.nexoraos.pro' },
      { protocol: 'https', hostname: 'nexoraos.pro' },
      { protocol: 'https', hostname: 'nexora-assets-prod.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'nexoraos.pro'],
    },
  },
  // env: {
  //   // Use VPS API (production backend) - Commented out to allow .env.local to override
  //   NEXT_PUBLIC_API_URL: 'https://api.nexoraos.pro/api/v1',
  //   NEXT_PUBLIC_WS_URL: 'https://api.nexoraos.pro',
  // },
};

module.exports = nextConfig;
