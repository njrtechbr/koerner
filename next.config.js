/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para Next.js 15
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  // Configurações para Vercel
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Configuração para uploads de arquivos
  serverRuntimeConfig: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  publicRuntimeConfig: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
}

module.exports = nextConfig