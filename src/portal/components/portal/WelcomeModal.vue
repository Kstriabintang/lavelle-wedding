<script setup>
defineProps({ open: { type: Boolean, default: false }, name: { type: String, default: '' } })
const emit = defineEmits(['close'])
const STEPS = [
  { n: '1', t: 'Isi seksi undangan', d: 'Buka tiap seksi (Mempelai, Acara, dst). Bar progres di editor menandai yang sudah/belum diisi.' },
  { n: '2', t: 'Cek pratinjau langsung', d: 'Panel kanan menampilkan hasil real-time — bisa dilihat mode HP atau Desktop.' },
  { n: '3', t: 'Atur alamat & terbitkan', d: 'Tentukan alamat (mis. dina-agus), lalu klik Terbitkan. Subdomain aktif otomatis.' },
]
</script>

<template>
  <transition name="wm">
    <div v-if="open" class="wm" @click.self="emit('close')">
      <div class="wm__box" role="dialog" aria-modal="true" aria-label="Selamat datang">
        <p class="wm__kicker">Selamat datang{{ name ? ', ' + name : '' }} 👋</p>
        <h2 class="wm__title">Bikin undangan dalam 3 langkah</h2>
        <ul class="wm__steps">
          <li v-for="s in STEPS" :key="s.n" class="wm__step">
            <span class="wm__n">{{ s.n }}</span>
            <span><b class="wm__st">{{ s.t }}</b><span class="wm__sd">{{ s.d }}</span></span>
          </li>
        </ul>
        <div class="wm__row">
          <button type="button" class="wm__skip" @click="emit('close')">Lewati</button>
          <button type="button" class="wm__ok" @click="emit('close')">Mengerti, mulai</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.wm { position: fixed; inset: 0; z-index: 65; display: grid; place-items: center; padding: 1.2rem; background: rgba(6,4,2,.7); backdrop-filter: blur(5px); }
.wm__box { width: min(94vw, 460px); background: #14100b; border: 1px solid rgba(201,162,75,.28); border-radius: 18px; padding: 1.6rem 1.6rem 1.4rem; box-shadow: 0 30px 70px -24px rgba(0,0,0,.85); }
.wm__kicker { font-size: .78rem; color: #d8b25e; }
.wm__title { font-family: 'Fraunces', serif; font-size: 1.4rem; color: #f1e7cf; margin-top: .25rem; }
.wm__steps { list-style: none; margin: 1.1rem 0 0; padding: 0; display: flex; flex-direction: column; gap: .9rem; }
.wm__step { display: flex; gap: .8rem; }
.wm__n { flex: none; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg,#e9c97e,#d3ad55); color: #201907; font-family: 'Fraunces', serif; font-size: .85rem; display: grid; place-items: center; }
.wm__st { display: block; color: #f1e7cf; font-family: 'Jost', sans-serif; font-size: .92rem; }
.wm__sd { display: block; color: #b6ab8a; font-family: 'Jost', sans-serif; font-size: .8rem; line-height: 1.5; margin-top: .15rem; }
.wm__row { display: flex; justify-content: flex-end; gap: .6rem; margin-top: 1.5rem; }
.wm__skip { min-height: 42px; padding: .5rem 1.1rem; border: 1px solid rgba(201,162,75,.3); border-radius: 10px; background: none; color: #a99d80; font-family: 'Jost', sans-serif; font-size: .86rem; cursor: pointer; }
.wm__ok { min-height: 42px; padding: .5rem 1.4rem; border: none; border-radius: 10px; background: #d3ad55; color: #201907; font-family: 'Jost', sans-serif; font-weight: 600; font-size: .86rem; cursor: pointer; }
.wm__skip:focus-visible, .wm__ok:focus-visible { outline: 2px solid #e9c97e; outline-offset: 2px; }
.wm-enter-active, .wm-leave-active { transition: opacity .25s; }
.wm-enter-from, .wm-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .wm-enter-active, .wm-leave-active { transition: none; } }
</style>
