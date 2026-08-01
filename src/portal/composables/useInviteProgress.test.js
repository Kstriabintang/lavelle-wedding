import { describe, it, expect } from 'vitest'
import { computeProgress } from './useInviteProgress.js'
import { defaultInvite } from '../data/schema.js'

describe('computeProgress', () => {
  it('undangan kosong → 0 dari 7 seksi inti', () => {
    const p = computeProgress(defaultInvite())
    expect(p.coreTotal).toBe(7)
    expect(p.filledCore).toBe(0)
    expect(p.pct).toBe(0)
  })
  it('mempelai terisi bila nama pasangan + tanggal ada', () => {
    const d = defaultInvite(); d.hero.bride = 'Dina'; d.hero.groom = 'Agus'; d.hero.date = '2027-05-15'
    const s = computeProgress(d).sections.find((x) => x.k === 'mempelai')
    expect(s.filled).toBe(true)
  })
  it('mempelai belum terisi bila salah satu nama kosong', () => {
    const d = defaultInvite(); d.hero.bride = 'Dina'; d.hero.date = '2027-05-15'
    expect(computeProgress(d).sections.find((x) => x.k === 'mempelai').filled).toBe(false)
  })
  it('galeri terisi bila ada minimal 1 foto', () => {
    const d = defaultInvite(); d.gallery = [{ src: 'x.jpg' }]
    expect(computeProgress(d).sections.find((x) => x.k === 'galeri').filled).toBe(true)
  })
  it('musik terisi via link YouTube', () => {
    const d = defaultInvite(); d.music.link = 'https://youtu.be/abc'
    expect(computeProgress(d).sections.find((x) => x.k === 'musik').filled).toBe(true)
  })
  it('tema & gaya bukan seksi inti', () => {
    const secs = computeProgress(defaultInvite()).sections
    expect(secs.find((x) => x.k === 'tema').core).toBe(false)
    expect(secs.find((x) => x.k === 'gaya').core).toBe(false)
  })
  it('7 inti terisi → pct 1', () => {
    const d = defaultInvite()
    d.hero.bride = 'Dina'; d.hero.groom = 'Agus'; d.hero.date = '2027-05-15'
    d.story[0].title = 'Bertemu'
    d.events[0].place = 'Gedung A'
    d.gallery = [{ src: 'x.jpg' }]
    d.family.note = 'Turut mengundang'
    d.gifts = [{ bank: 'BCA', number: '123', name: 'Dina' }]
    d.music.link = 'https://youtu.be/abc'
    const p = computeProgress(d)
    expect(p.filledCore).toBe(7)
    expect(p.pct).toBe(1)
  })
})
