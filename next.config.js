/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@crm360/shared', '@crm360/ui'],
  async redirects() {
    return [
      // Legacy CRM routes
      {
        source: '/companies',
        destination: '/crm/companies',
        permanent: true,
      },
      {
        source: '/contacts',
        destination: '/crm/contacts',
        permanent: true,
      },
      // Pipeline → Sales (Pipeline merged into Sales hub)
      {
        source: '/pipeline',
        destination: '/sales/deals',
        permanent: true,
      },
      {
        source: '/pipeline/deals',
        destination: '/sales/deals',
        permanent: true,
      },
      {
        source: '/pipeline/leads',
        destination: '/sales/leads',
        permanent: true,
      },
      {
        source: '/pipeline/products',
        destination: '/sales/products',
        permanent: true,
      },
      {
        source: '/pipeline/:path*',
        destination: '/sales/:path*',
        permanent: true,
      },
      // Tickets → Service (Tickets merged into Service hub)
      {
        source: '/tickets',
        destination: '/service/tickets',
        permanent: true,
      },
      {
        source: '/tickets/:path*',
        destination: '/service/tickets/:path*',
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
