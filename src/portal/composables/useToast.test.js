import { describe, it, expect, beforeEach } from 'vitest'
import { useToast, _reset } from './useToast.js'

describe('useToast', () => {
  beforeEach(() => _reset())
  it('success menambah 1 toast bertipe success', () => {
    const t = useToast(); t.success('Tersimpan')
    expect(t.toasts.value.length).toBe(1)
    expect(t.toasts.value[0].type).toBe('success')
    expect(t.toasts.value[0].msg).toBe('Tersimpan')
  })
  it('dismiss menghapus toast by id', () => {
    const t = useToast(); const id = t.error('Gagal', { ttl: 0 })
    expect(t.toasts.value.length).toBe(1)
    t.dismiss(id)
    expect(t.toasts.value.length).toBe(0)
  })
  it('error menyimpan callback retry', () => {
    const t = useToast(); let ran = false
    t.error('Gagal', { ttl: 0, retry: () => { ran = true } })
    t.toasts.value[0].retry()
    expect(ran).toBe(true)
  })
})
