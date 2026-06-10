/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  // Pin Turbopack's project root to this directory. Without it, Turbopack can
  // infer the parent folder as the root and fail to resolve `@import "tailwindcss"`
  // (Tailwind v4) from the wrong location in dev.
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
