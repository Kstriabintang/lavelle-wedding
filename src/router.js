import Home from './pages/Home.vue'
import BlogList from './pages/BlogList.vue'
import BlogPost from './pages/BlogPost.vue'

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/blog/', name: 'blog', component: BlogList },
  { path: '/blog/:slug/', name: 'blog-post', component: BlogPost },
  { path: '/panel/', name: 'panel', component: () => import('./pages/PanelEditor.vue') },
]
