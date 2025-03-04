/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dodatkowa konfiguracja dla Codespaces
  webpackDevMiddleware: (config) => {
    // Pozwala na szybsze odświeżanie w środowisku Codespaces
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      },
    };
  },
  // Ustaw nagłówki HTTP dla CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
    ];
  },
}

module.exports = nextConfig