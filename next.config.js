/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: [
      "res.cloudinary.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "localhost:3000",
      "public.blob.vercel-storage.com",
      "www.google.com",
      "flag.vercel.app",
      "illustrations.popsy.co",
    ],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client"],
    serverActions: true,
  },
  reactStrictMode: false,
  swcMinify: false, // Required to fix: https://nextjs.org/docs/messages/failed-loading-swc
};
