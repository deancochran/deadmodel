import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const config = defineConfig({
  base: `${process.env.PAGES_BASE_PATH || ''}/`,
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // Ship one prerendered storefront. Its sections and dialogs need no routes.
    tanstackStart({ prerender: { enabled: true, failOnError: true, crawlLinks: false } }),
    viteReact(),
  ],
})

export default config
