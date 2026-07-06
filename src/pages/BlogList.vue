<script setup>
import { useHead } from '@unhead/vue'
import BlogNav from '../components/BlogNav.vue'
import BlogFooter from '../components/BlogFooter.vue'
import { indexMeta, postList } from '../data/blog'
import { posts } from '../data/blog'

// Schema Blog dibuat dari daftar lengkap (artikel lama + baru)
const blogSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://lavelle.my.id/blog/',
  name: 'Blog Lavelle',
  description: 'Tips, panduan, dan inspirasi seputar undangan pernikahan digital.',
  publisher: { '@type': 'Organization', name: 'Lavelle', logo: { '@type': 'ImageObject', url: 'https://lavelle.my.id/img/lavelle-logo.png' } },
  blogPost: postList.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    url: `https://lavelle.my.id/blog/${p.slug}/`,
    image: (posts[p.slug] && posts[p.slug].ogImage) || `https://lavelle.my.id${p.image}`,
    author: { '@type': 'Organization', name: 'Lavelle' },
  })),
})

useHead({
  title: indexMeta.title,
  link: [{ rel: 'canonical', href: 'https://lavelle.my.id/blog/' }],
  meta: [
    { name: 'description', content: indexMeta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: indexMeta.title },
    { property: 'og:description', content: indexMeta.description },
    { property: 'og:url', content: 'https://lavelle.my.id/blog/' },
    { property: 'og:image', content: indexMeta.ogImage },
  ],
  script: [{ type: 'application/ld+json', innerHTML: blogSchema }],
})
</script>

<template>
  <BlogNav />
  <header class="blog-hero">
    <span class="eyebrow">Blog Lavelle</span>
    <h1>Tips &amp; Inspirasi Undangan Digital</h1>
    <p>Panduan praktis dan ide untuk merangkai undangan pernikahan digital yang elegan — dari memilih desain hingga
      menulis kata-kata undangan.</p>
  </header>

  <main class="blog-wrap">
    <div class="post-grid">
      <a v-for="p in postList" :key="p.slug" class="post-card" :href="`/blog/${p.slug}/`">
        <div class="post-card__img" :style="{ backgroundImage: `url('${p.image}')` }"></div>
        <div class="post-card__body">
          <span class="post-card__cat">{{ p.category }}</span>
          <h2 class="post-card__title">{{ p.title }}</h2>
          <p class="post-card__excerpt">{{ p.excerpt }}</p>
          <span class="post-card__meta">{{ p.meta }}</span>
        </div>
      </a>
    </div>
  </main>

  <BlogFooter />
</template>
