/* Ekstraksi konten blog HTML lama -> data Vue (src/data/blog.js).
   Sekali jalan saat migrasi. Jalankan: node scripts/extract-blog.mjs */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG = join(__dirname, '..', 'public', 'blog')

// Decode HTML entity umum -> teks bersih (untuk field yang ditampilkan sbg teks)
const ENT = { '&amp;': '&', '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…', '&rsaquo;': '›', '&lsaquo;': '‹', '&quot;': '"', '&nbsp;': ' ', '&copy;': '©', '&times;': '×', '&raquo;': '»', '&laquo;': '«', '&infin;': '∞', '&#39;': "'", '&apos;': "'" }
const decode = (s) => String(s).replace(/&[a-z#0-9]+;/gi, (m) => ENT[m] ?? m)
const pickT = (re, s, d = '') => decode(pick(re, s, d))
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
    category: decode(m[3].trim()),
    title: decode(m[4].replace(/\s+/g, ' ').trim()),
    excerpt: decode(m[5].replace(/\s+/g, ' ').trim()),
    meta: decode(m[6].replace(/\s+/g, ' ').trim()),
  })
}

// Meta halaman index blog
const indexMeta = {
  title: pickT(/<title>([\s\S]*?)<\/title>/, indexHtml),
  description: pickT(/<meta name="description"\s+content="([\s\S]*?)">/, indexHtml),
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
    title: pickT(/<title>([\s\S]*?)<\/title>/, h),
    description: pickT(/<meta name="description"\s+content="([\s\S]*?)">/, h),
    keywords: pickT(/<meta name="keywords" content="(.*?)">/, h),
    canonical: pick(/<link rel="canonical" href="(.*?)">/, h),
    ogTitle: pickT(/<meta property="og:title" content="(.*?)">/, h),
    ogDescription: pickT(/<meta property="og:description" content="(.*?)">/, h),
    ogImage: pick(/<meta property="og:image" content="(.*?)">/, h),
    twitterDescription: pickT(/<meta name="twitter:description" content="(.*?)">/, h),
    category: pickT(/<span class="article__cat">(.*?)<\/span>/, h),
    heading: decode(pick(/<h1 class="article__title">([\s\S]*?)<\/h1>/, h).replace(/\s+/g, ' ').trim()),
    articleMeta: decode(pick(/<p class="article__meta">([\s\S]*?)<\/p>/, h).replace(/\s+/g, ' ').trim()),
    breadcrumb: decode(pick(/&rsaquo;\s*<a href="\.\.\/">Blog<\/a>\s*&rsaquo;\s*([\s\S]*?)<\/nav>/, h).replace(/\s+/g, ' ').trim()),
    cover: pick(/<img class="article__cover"\s+src="(.*?)"/, h).replace('../../img/', '/img/'),
    coverAlt: pickT(/<img class="article__cover"[\s\S]*?alt="(.*?)"/, h),
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
