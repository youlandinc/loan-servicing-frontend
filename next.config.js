/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    PREFIX_URL: process.env.PREFIX_URL,
    PREFIX_ALAMEDA_URL: process.env.PREFIX_ALAMEDA_URL,
  },
  reactStrictMode: false,
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        statusCode: 301,
      },
      {
        source: '/loan',
        destination: '/portfolio',
        statusCode: 301,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['youland-common-images.s3.us-west-1.amazonaws.com'],
  },
};
