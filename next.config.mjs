/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Suprimir warnings específicos de Swagger UI
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suprimir warnings de React en desarrollo
      config.ignoreWarnings = [
        /UNSAFE_componentWillReceiveProps/,
        /componentWillReceiveProps/,
        /ModelCollapse/,
        /OperationContainer/,
      ];
    }

    // Configuración para manejar módulos de Node.js en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        sqlite: false,
        'node:sqlite': false,
        'better-sqlite3': false,
      };
    }

    return config;
  },
  // Configuración para Swagger UI
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
