// Gabungan artikel blog: hasil ekstraksi lama + artikel manual baru.
// Artikel baru tampil paling atas (terbaru).
import { indexMeta, postList as generatedList, posts as generatedPosts } from './blog-generated'
import { manualPostList, manualPostsMap } from './blog-manual'

export { indexMeta }

export const postList = [...manualPostList, ...generatedList]
export const posts = { ...generatedPosts, ...manualPostsMap }
export const slugs = postList.map((p) => p.slug)
