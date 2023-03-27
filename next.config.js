/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
}


module.exports = removeImports({
  experimental: { esmExternals: true },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
});
// module.exports = nextConfig
