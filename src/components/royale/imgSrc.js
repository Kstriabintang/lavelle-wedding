// Foto royale: nama-file (cl1-g09 → /img/mentahan/…jpeg) ATAU URL penuh
// (http/data/blob, dari portal) → apa adanya. Aditif, backward-compatible.
export function imgSrc(s) {
  return /^(https?:|data:|blob:)/.test(s || '') ? s : `/img/mentahan/${s}.jpeg`
}
