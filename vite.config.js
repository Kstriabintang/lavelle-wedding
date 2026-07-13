import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { slugs } from './src/data/blog.js'
import { adatSlugs } from './src/data/adat.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
  // vite-ssg: pre-render tiap route jadi HTML statis (aman untuk SEO)
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes() {
      return [
        '/', '/blog/', '/panel/', '/demo/', '/demo/luxe/', '/demo/royale/',
        ...adatSlugs.map((s) => `/demo/adat/${s}/`),
        ...slugs.map((s) => `/blog/${s}/`),
      ]
    },
  },
})
