<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import BlogNav from '../components/BlogNav.vue'
import BlogFooter from '../components/BlogFooter.vue'
import { posts } from '../data/blog'

const route = useRoute()
const post = computed(() => posts[route.params.slug])

useHead(() => {
  const p = post.value
  if (!p) return { title: 'Artikel tidak ditemukan — Lavelle' }
  return {
    title: p.title,
    link: [{ rel: 'canonical', href: p.canonical }],
    meta: [
      { name: 'description', content: p.description },
      { name: 'keywords', content: p.keywords },
      { name: 'author', content: 'Lavelle' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: p.ogTitle },
      { property: 'og:description', content: p.ogDescription },
      { property: 'og:url', content: p.canonical },
      { property: 'og:image', content: p.ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: p.ogTitle },
      { name: 'twitter:description', content: p.twitterDescription },
      { name: 'twitter:image', content: p.ogImage },
    ],
    script: [{ type: 'application/ld+json', innerHTML: p.jsonLd }],
  }
})
</script>

<template>
  <BlogNav />

  <template v-if="post">
    <article class="article">
      <nav class="breadcrumb"><a href="/">Beranda</a> &rsaquo; <a href="/blog/">Blog</a> &rsaquo; {{ post.breadcrumb }}</nav>

      <header class="article__head">
        <span class="article__cat">{{ post.category }}</span>
        <h1 class="article__title">{{ post.heading }}</h1>
        <p class="article__meta">{{ post.articleMeta }}</p>
      </header>

      <img class="article__cover" :src="post.cover" :alt="post.coverAlt" loading="lazy">

      <div class="prose" v-html="post.body"></div>
    </article>
  </template>

  <main v-else class="blog-wrap" style="text-align:center; padding:6rem 1.5rem;">
    <h1 style="font-family:var(--serif);">Artikel tidak ditemukan</h1>
    <p style="margin:1rem 0 2rem;">Maaf, artikel yang kamu cari tidak ada.</p>
    <a href="/blog/" class="btn btn--gold">Kembali ke Blog</a>
  </main>

  <BlogFooter />
</template>
