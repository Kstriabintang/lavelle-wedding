/* Ekstraksi konten blog HTML lama -> data Vue (src/data/blog.js).
   Sekali jalan saat migrasi. Jalankan: node scripts/extract-blog.mjs */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG = join(__dirname, '..', 'public', 'blog')

const pick = (re, s, d = '') => { const m = s.match(re); return m ? m[1].trim() : d }
// Perbaiki link relatif artikel -> absolut situs
const fixLinks = (html) => html
  .replaceAll('../../', '/')
  .replaceAll('../', '/blog/')

// ---- 1) Daftar kartu dari index.html ----
const indexHtml = readFileSync(join(BLOG, 'index.html'), 'utf8')
const cardRe = /<a class="post-card" href="\.\/(.*?)\/">[\s\S]*?background-image:url\('(.*?)'\)[\s\S]*?<span class="post-card__cat">(.*?)<\/span>[\s\S]*?<h2 class="post-card__title">([\s\S]*?)<\/h2>[\s\S]*?<p class="post-card__excerpt">([\s\S]*?)<\/p>[\s\S]*?<span class="post-card__meta">([\s\S]*?)<\/span>/g
const list = []
for (const m of indexHtml.matchAll(cardRe)) {
  list.push({
    slug: m[1],
    image: m[2].replace('../img/', '/img/'),
    category: m[3].trim(),
    title: m[4].replace(/\s+/g, ' ').trim(),
    excerpt: m[5].replace(/\s+/g, ' ').trim(),
    meta: m[6].replace(/\s+/g, ' ').trim(),
  })
}

// Meta halaman index blog
const indexMeta = {
  title: pick(/<title>([\s\S]*?)<\/title>/, indexHtml),
  description: pick(/<meta name="description"\s+content="([\s\S]*?)">/, indexHtml),
  ogImage: pick(/<meta property="og:image" content="(.*?)">/, indexHtml),
  jsonLd: pick(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, indexHtml),
}

// ---- 2) Isi tiap artikel ----
const slugs = readdirSync(BLOG, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

const posts = {}
for (const slug of slugs) {
  const file = join(BLOG, slug, 'index.html')
  if (!existsSync(file)) continue
  const h = readFileSync(file, 'utf8')
  const prose = pick(/<div class="prose">([\s\S]*)<\/div>\s*<\/article>/, h)
  posts[slug] = {
    slug,
    title: pick(/<title>([\s\S]*?)<\/title>/, h),
    description: pick(/<meta name="description"\s+content="([\s\S]*?)">/, h),
    keywords: pick(/<meta name="keywords" content="(.*?)">/, h),
    canonical: pick(/<link rel="canonical" href="(.*?)">/, h),
    ogTitle: pick(/<meta property="og:title" content="(.*?)">/, h),
    ogDescription: pick(/<meta property="og:description" content="(.*?)">/, h),
    ogImage: pick(/<meta property="og:image" content="(.*?)">/, h),
    twitterDescription: pick(/<meta name="twitter:description" content="(.*?)">/, h),
    category: pick(/<span class="article__cat">(.*?)<\/span>/, h),
    heading: pick(/<h1 class="article__title">([\s\S]*?)<\/h1>/, h).replace(/\s+/g, ' ').trim(),
    articleMeta: pick(/<p class="article__meta">([\s\S]*?)<\/p>/, h).replace(/\s+/g, ' ').trim(),
    breadcrumb: pick(/&rsaquo;\s*<a href="\.\.\/">Blog<\/a>\s*&rsaquo;\s*([\s\S]*?)<\/nav>/, h).replace(/\s+/g, ' ').trim(),
    cover: pick(/<img class="article__cover"\s+src="(.*?)"/, h).replace('../../img/', '/img/'),
    coverAlt: pick(/<img class="article__cover"[\s\S]*?alt="(.*?)"/, h),
    jsonLd: pick(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, h),
    body: fixLinks(prose).trim(),
  }
}

const out = `// DIHASILKAN OTOMATIS oleh scripts/extract-blog.mjs — jangan edit tangan.
export const indexMeta = ${JSON.stringify(indexMeta, null, 2)}

export const postList = ${JSON.stringify(list, null, 2)}

export const posts = ${JSON.stringify(posts, null, 2)}

export const slugs = postList.map((p) => p.slug)
`
writeFileSync(join(__dirname, '..', 'src', 'data', 'blog.js'), out)
console.log(`OK: ${list.length} kartu, ${Object.keys(posts).length} artikel -> src/data/blog.js`)
