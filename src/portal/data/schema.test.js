import { describe, it, expect } from 'vitest'
import { defaultInvite, mergeInvite } from './schema.js'

describe('defaultInvite', () => {
  it('punya struktur inti', () => {
    const d = defaultInvite()
    expect(d.hero).toBeTruthy()
    expect(Array.isArray(d.events)).toBe(true)
    expect(Array.isArray(d.gallery)).toBe(true)
    expect(d.music).toHaveProperty('start')
  })
  it('mengembalikan salinan baru tiap panggil', () => {
    const a = defaultInvite(); a.hero.bride = 'X'
    expect(defaultInvite().hero.bride).not.toBe('X')
  })
})
describe('mergeInvite', () => {
  it('menimpa dalam tanpa menghapus field lain', () => {
    const m = mergeInvite({ hero: { bride: 'Fuji' } })
    expect(m.hero.bride).toBe('Fuji')
    expect(m.hero).toHaveProperty('groom')
  })
  it('array diganti penuh', () => {
    const m = mergeInvite({ events: [{ tag: 'Akad' }] })
    expect(m.events).toHaveLength(1)
  })
})
