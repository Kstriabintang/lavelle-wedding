import { describe, it, expect } from 'vitest'
import { slugify, validateSlug, RESERVED } from './slug.js'

describe('slugify', () => {
  it('menormalkan spasi & kapital', () => { expect(slugify('Fuji Ryan')).toBe('fuji-ryan') })
  it('membuang karakter aneh', () => { expect(slugify('Dina & Agus!!')).toBe('dina-agus') })
})
describe('validateSlug', () => {
  it('menerima slug valid', () => { expect(validateSlug('dina-agus').ok).toBe(true) })
  it('menolak terlalu pendek', () => { expect(validateSlug('ab').ok).toBe(false) })
  it('menolak karakter ilegal', () => { expect(validateSlug('Dina_Agus').ok).toBe(false) })
  it('menolak reserved', () => {
    expect(RESERVED).toContain('fuji-ryan')
    expect(validateSlug('portal').ok).toBe(false)
    expect(validateSlug('fuji-ryan').ok).toBe(false)
  })
})
