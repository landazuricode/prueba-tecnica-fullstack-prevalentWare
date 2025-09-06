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
    return config;
  },
  // Configuración para Swagger UI
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
