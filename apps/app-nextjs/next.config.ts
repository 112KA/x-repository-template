import type { NextConfig } from 'next'
import { join } from 'node:path'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      x: join(__dirname, '../../../packages/x/src/index.ts'),
    }
  },
}

export default nextConfig
