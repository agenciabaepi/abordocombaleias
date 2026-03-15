/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Evita cache da página principal e dados — assim o site não fica “travado” na versão antiga
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/_next/data/:path*", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
    ];
  },
};

export default nextConfig;
