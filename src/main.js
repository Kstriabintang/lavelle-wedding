import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { RESERVED } from './portal/lib/slug'
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
  ({ router }) => {
    // Routing berdasarkan HOSTNAME (khusus deploy portal + wildcard *.lavelle.my.id).
    // portal.lavelle.my.id → builder; nama-klien.lavelle.my.id → renderer undangan.
    // Subdomain eksplisit (fuji-ryan, www, dst) di daftar RESERVED → TAK terpengaruh.
    // Client-only (guard di-skip saat prerender) agar tak ganggu SSG situs utama.
    router.beforeEach((to) => {
      if (typeof window === 'undefined') return true
      const m = window.location.hostname.match(/^([a-z0-9-]+)\.lavelle\.my\.id$/i)
      if (!m) return true
      const sub = m[1].toLowerCase()
      if (sub === 'portal') return to.path === '/' ? '/portal/' : true
      if (!RESERVED.includes(sub) && !to.path.startsWith('/u/')) return `/u/${sub}`
      return true
    })
  },
)
