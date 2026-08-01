// Antrean toast global (module-singleton) → konsisten lintas halaman portal.
import { ref } from 'vue'

const toasts = ref([])
let seq = 0

export function pushToast(type, msg, opts = {}) {
  const id = ++seq
  toasts.value.push({ id, type, msg, retry: opts.retry || null })
  const ttl = opts.ttl != null ? opts.ttl : (type === 'error' ? 6000 : 3500)
  if (ttl > 0 && typeof setTimeout === 'function') setTimeout(() => dismiss(id), ttl)
  return id
}
export function dismiss(id) { toasts.value = toasts.value.filter((t) => t.id !== id) }
export function _reset() { toasts.value = []; seq = 0 }   // hanya untuk tes

export function useToast() {
  return {
    toasts,
    success: (msg, o) => pushToast('success', msg, o),
    error: (msg, o) => pushToast('error', msg, o),
    info: (msg, o) => pushToast('info', msg, o),
    dismiss,
  }
}
