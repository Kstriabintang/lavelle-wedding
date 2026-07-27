import { describe, it, expect } from 'vitest'
import { fitDimensions } from './compressImage.js'

describe('fitDimensions', () => {
  it('mengecilkan sisi terpanjang ke maxEdge (landscape)', () => {
    expect(fitDimensions(3200, 1600, 1600)).toEqual({ w: 1600, h: 800 })
  })
  it('mengecilkan potrait', () => {
    expect(fitDimensions(1600, 3200, 1600)).toEqual({ w: 800, h: 1600 })
  })
  it('tidak memperbesar gambar kecil', () => {
    expect(fitDimensions(800, 600, 1600)).toEqual({ w: 800, h: 600 })
  })
})
