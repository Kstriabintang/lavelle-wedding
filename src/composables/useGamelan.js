// Ambient gamelan-inspired generator — original, copyright-safe, no audio files.
// Gentle pentatonic bell tones synthesized with the Web Audio API. Each suku uses
// a different scale/tempo so every invitation "bermusik" with its own character.
// SSR-safe: nothing touches AudioContext until start() is called from a user gesture.

// Pentatonik per suku (Hz). Slendro/pelog-ish tanpa meniru rekaman apa pun.
const SCALES = {
  minang: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5], // talempong — cerah
  jawa: [440.0, 493.88, 587.33, 659.25, 783.99, 880.0], // slendro — teduh
  sunda: [587.33, 659.25, 739.99, 880.0, 987.77, 1174.7], // degung — melayang
  bugis: [523.25, 622.25, 698.46, 783.99, 932.33, 1046.5], // pelog-ish
}
const TEMPO = { minang: 620, jawa: 820, sunda: 720, bugis: 700 } // ms antar nada

// Pola deterministik (indeks nada dalam skala) — tanpa Math.random.
const PATTERN = [0, 2, 4, 3, 1, 4, 2, 5, 3, 1, 0, 2, 4, 5, 3, 1]

export function useGamelan(getSuku) {
  let ctx = null
  let master = null
  let lp = null
  let drone = null
  let droneGain = null
  let timer = null
  let step = 0
  let playing = false

  function ensureCtx() {
    if (ctx) return ctx
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2600
    lp.Q.value = 0.6
    lp.connect(master)
    master.connect(ctx.destination)
    return ctx
  }

  // Satu nada bel: dua sinus (fundamental + harmonik) dengan envelope decay panjang.
  function pluck(freq, when, gain = 0.16) {
    const o1 = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    o1.type = 'sine'
    o2.type = 'sine'
    o1.frequency.value = freq
    o2.frequency.value = freq * 2.01 // sedikit inharmonik → warna logam lembut
    const g = ctx.createGain()
    const g2 = ctx.createGain()
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(gain, when + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, when + 2.6)
    g2.gain.value = 0.28
    o1.connect(g)
    o2.connect(g2)
    g2.connect(g)
    g.connect(lp)
    o1.start(when)
    o2.start(when)
    o1.stop(when + 2.8)
    o2.stop(when + 2.8)
  }

  function startDrone(scale) {
    drone = ctx.createOscillator()
    droneGain = ctx.createGain()
    drone.type = 'sine'
    drone.frequency.value = scale[0] / 2 // oktaf bawah sebagai pad
    droneGain.gain.value = 0.05
    drone.connect(droneGain)
    droneGain.connect(lp)
    drone.start()
  }

  function scheduleLoop() {
    const suku = getSuku()
    const scale = SCALES[suku] || SCALES.minang
    const tempo = TEMPO[suku] || 700
    const idx = PATTERN[step % PATTERN.length]
    const freq = scale[idx % scale.length]
    pluck(freq, ctx.currentTime + 0.02, 0.15)
    // Sesekali tambahkan nada harmoni satu oktaf/kuint untuk tekstur.
    if (step % 4 === 0) pluck(scale[(idx + 2) % scale.length] * 2, ctx.currentTime + 0.14, 0.06)
    step++
    timer = setTimeout(scheduleLoop, tempo)
  }

  async function start() {
    if (playing) return true
    if (!ensureCtx()) return false
    try {
      if (ctx.state === 'suspended') await ctx.resume()
    } catch { /* diabaikan */ }
    const suku = getSuku()
    const scale = SCALES[suku] || SCALES.minang
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime)
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.4) // ambient, tidak mengganggu
    if (!drone) startDrone(scale)
    step = 0
    scheduleLoop()
    playing = true
    return true
  }

  function stop() {
    if (!ctx) return
    playing = false
    if (timer) { clearTimeout(timer); timer = null }
    try {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
    } catch { /* diabaikan */ }
  }

  function dispose() {
    stop()
    try { if (drone) drone.stop() } catch { /* diabaikan */ }
    try { if (ctx) ctx.close() } catch { /* diabaikan */ }
    ctx = null; drone = null
  }

  return { start, stop, dispose, get playing() { return playing } }
}
