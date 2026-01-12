/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Disable server-side image optimization since we are static
    images: { unoptimized: true }
};

export default nextConfig;
