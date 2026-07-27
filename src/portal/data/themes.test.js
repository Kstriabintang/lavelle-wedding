import { describe, it, expect } from 'vitest'
import { THEMES, THEME_IDS, themeVars } from './themes.js'

const REQUIRED = ['--bg', '--ink', '--ink-soft', '--surface', '--line', '--accent', '--accent-2', '--accent-ink', '--marun']

describe('themes', () => {
  it('punya minimal 4 paket', () => { expect(THEME_IDS.length).toBeGreaterThanOrEqual(4) })
  it('tiap tema punya semua CSS var wajib', () => {
    for (const id of THEME_IDS) for (const k of REQUIRED) expect(THEMES[id].vars[k]).toBeTruthy()
  })
  it('themeVars fallback ke tema pertama bila id salah', () => {
    expect(themeVars('ngawur')).toEqual(THEMES[THEME_IDS[0]].vars)
  })
})
