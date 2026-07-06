import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
  // vite-ssg: pre-render setiap route jadi HTML statis (aman untuk SEO)
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
})
