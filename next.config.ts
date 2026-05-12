/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://app.tablecrm.com/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;