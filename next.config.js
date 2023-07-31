/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  optimizeFonts: false,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: [
      'siingio-stage.s3.eu-west-3.amazonaws.com',
      'siingio-stage.s3.amazonaws.com',
      'staging.fameworx.com',
      's3.me-central-1.amazonaws.com',
      'images.unsplash.com',
      'www.fameworx.com',
      'wallpapercave.com',
      'pluspng.com',
      'example.com',
      'www.gravatar.com',
      'randomuser.me',
      's3.me-central-1.amazonaws.com'
    ],
  },
};

module.exports = nextConfig;
