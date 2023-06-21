/** @type {import('next').NextConfig} */
module.exports = {
  productionBrowserSourceMaps: false,
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    BACKEND_URL: process.env.BACKEND_URL,
    PAGINATION: process.env.PAGINATION,
    COMPANY: process.env.COMPANY,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/Dashboard',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
