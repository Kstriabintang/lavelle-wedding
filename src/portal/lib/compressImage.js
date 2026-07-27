// Kompres foto di browser sebelum diunggah → hemat storage, tetap tajam.
// fitDimensions = fungsi murni (diuji). compressImage butuh canvas asli (verifikasi manual).
export function fitDimensions(w, h, maxEdge) {
  const longest = Math.max(w, h)
  if (longest <= maxEdge) return { w, h }
  const s = maxEdge / longest
  return { w: Math.round(w * s), h: Math.round(h * s) }
}

export function compressImage(file, opts = {}) {
  const { maxEdge = 1600, quality = 0.82, type = 'image/jpeg' } = opts
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const { w, h } = fitDimensions(img.naturalWidth, img.naturalHeight, maxEdge)
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h
      cv.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      cv.toBlob((b) => (b ? resolve(b) : reject(new Error('kompres gagal'))), type, quality)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('gambar tak terbaca')) }
    img.src = url
  })
}
