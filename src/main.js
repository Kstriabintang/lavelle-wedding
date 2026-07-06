import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './assets/tailwind.css'
import './assets/design.css'
import './assets/blog.css'

// ViteSSG: pre-render tiap route ke HTML statis saat build (SEO aman),
// lalu di-hydrate jadi app Vue interaktif di browser.
export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to) {
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  },
)
