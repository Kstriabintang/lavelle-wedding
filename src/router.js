import Home from './pages/Home.vue'
import BlogList from './pages/BlogList.vue'
import BlogPost from './pages/BlogPost.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/blog/', name: 'blog', component: BlogList },
  { path: '/blog/:slug/', name: 'blog-post', component: BlogPost },
  { path: '/panel/', name: 'panel', component: () => import('./pages/PanelEditor.vue') },
  { path: '/demo/', name: 'demo-gallery', component: () => import('./pages/DemoGallery.vue') },
  { path: '/demo/luxe/', name: 'demo-luxe', component: () => import('./pages/DemoLuxe.vue') },
  { path: '/demo/adat/:suku/', name: 'demo-adat', component: () => import('./pages/DemoAdat.vue') },
  { path: '/demo/royale/', name: 'demo-royale', component: () => import('./pages/DemoRoyale.vue') },
  // PREVIEW LOCAL client-001 (foto & data asli client) — file di-gitignore,
  // JANGAN commit baris ini. Tidak masuk SSG includedRoutes (vite.config.js).
  { path: '/demo/client-001/', name: 'client-001', component: () => import('./pages/DemoClient001Index.vue') },
  { path: '/demo/client-001/opsi-1/', name: 'client-001-opsi-1', component: () => import('./pages/DemoClient001Opsi1.vue') },
  { path: '/demo/client-001/opsi-2/', name: 'client-001-opsi-2', component: () => import('./pages/DemoClient001Opsi2.vue') },
  { path: '/demo/client-001/opsi-3/', name: 'client-001-opsi-3', component: () => import('./pages/DemoClient001Opsi3.vue') },
  { path: '/demo/client-001/opsi-4/', name: 'client-001-opsi-4', component: () => import('./pages/DemoClient001Opsi4.vue') },
  { path: '/demo/client-001/opsi-5/', name: 'client-001-opsi-5', component: () => import('./pages/DemoClient001Opsi5.vue') },
  { path: '/demo/client-001/galeri/', name: 'client-001-galeri', component: () => import('./pages/DemoClient001Galeri.vue') },
  // Undangan REAL (root subdomain fuji-ryan.lavelle.my.id → /undangan/). Tema Sinema.
  { path: '/undangan/', name: 'undangan', component: () => import('./pages/DemoClient001Opsi5.vue') },
  { path: '/undangan/galeri/', name: 'undangan-galeri', component: () => import('./pages/DemoClient001Galeri.vue') },
  // PORTAL (portal.lavelle.my.id) — SPA (tak masuk includedRoutes → tak di-prerender).
  { path: '/portal/', name: 'portal-dashboard', component: () => import('./portal/pages/PortalDashboard.vue') },
  { path: '/portal/login/', name: 'portal-login', component: () => import('./portal/pages/PortalLogin.vue') },
  { path: '/portal/edit/:id/', name: 'portal-edit', component: () => import('./portal/pages/PortalEditor.vue') },
  { path: '/portal/profile/', name: 'portal-profile', component: () => import('./portal/pages/PortalProfile.vue') },
  { path: '/portal/preview/', name: 'portal-preview', component: () => import('./portal/pages/PortalPreview.vue') },
  // Renderer undangan per-subdomain (nama-klien.lavelle.my.id → /u/:slug via guard hostname)
  { path: '/u/:slug/', name: 'invite-render', component: () => import('./portal/pages/InviteRender.vue') },
]
