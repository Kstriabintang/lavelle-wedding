import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { slugs } from './src/data/blog.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
  // vite-ssg: pre-render tiap route jadi HTML statis (aman untuk SEO)
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes() {
      return ['/', '/blog/', '/panel/', '/demo/luxe/', ...slugs.map((s) => `/blog/${s}/`)]
    },
  },
})
