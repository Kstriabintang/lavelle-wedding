<script setup>
// Halaman builder /portal/ — state `invite` (reaktif) + `theme` diikat ke form,
// dikirim ke iframe pratinjau (/portal/preview/) via postMessage → pratinjau live & skala persis HP.
// Fase 1a: form masih ringkas (header + pemilih tema). Seksi lengkap ditambah di task berikutnya.
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { sampleInvite } from '../data/sampleInvite.js'
import { THEMES, THEME_IDS } from '../data/themes.js'
import BuilderShell from '../components/builder/BuilderShell.vue'

const invite = reactive(structuredClone(sampleInvite))
const theme = ref('marun-emas')
const previewFrame = ref(null)

function pushPreview() {
  const w = previewFrame.value && previewFrame.value.contentWindow
  if (!w) return
  w.postMessage({ type: 'lavelle-preview', invite: JSON.parse(JSON.stringify(invite)), theme: theme.value }, '*')
}
watch([invite, theme], pushPreview, { deep: true })

function onReady(e) { if (e.data && e.data.type === 'lavelle-preview-ready') pushPreview() }
onMounted(() => window.addEventListener('message', onReady))
onUnmounted(() => window.removeEventListener('message', onReady))
</script>

<template>
  <BuilderShell>
    <template #form>
      <div class="pb">
        <header class="pb__brand">
          <span class="pb__logo">Lavelle</span>
          <span class="pb__sub">Portal Undangan</span>
        </header>

        <div class="pb__body">
          <h1 class="pb__h1">{{ invite.hero.bride }} &amp; {{ invite.hero.groom }}</h1>
          <p class="pb__lead">Pratinjau di sebelah kanan berubah langsung saat kamu mengedit.</p>

          <section class="pb__section">
            <p class="pb__label">Paket Warna</p>
            <div class="pb__themes">
              <button v-for="id in THEME_IDS" :key="id" type="button" class="pb__theme"
                      :class="{ 'is-on': theme === id }" @click="theme = id" :title="THEMES[id].label">
                <span class="pb__sw" :style="{ background: THEMES[id].swatch[0] }"></span>
                <span class="pb__sw" :style="{ background: THEMES[id].swatch[1] }"></span>
                <span class="pb__theme-label">{{ THEMES[id].label }}</span>
              </button>
            </div>
          </section>

          <p class="pb__hint">✎ Editor lengkap (mempelai, acara, galeri, foto) menyusul di langkah berikutnya.</p>
        </div>
      </div>
    </template>

    <template #preview>
      <iframe ref="previewFrame" class="pb__frame" src="/portal/preview/" title="Pratinjau undangan" @load="pushPreview"></iframe>
    </template>
  </BuilderShell>
</template>

<style scoped>
.pb { min-height: 100%; }
.pb__brand { display: flex; align-items: baseline; gap: .6rem; padding: 1.3rem 1.5rem; border-bottom: 1px solid #ece4d5; }
.pb__logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.3rem; color: #221d16; letter-spacing: .01em; }
.pb__sub { font-size: .68rem; text-transform: uppercase; letter-spacing: .2em; color: #a08e6f; }
.pb__body { padding: 1.5rem; }
.pb__h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.7rem; color: #221d16; line-height: 1.1; }
.pb__lead { margin-top: .5rem; color: #6d6152; font-size: .92rem; line-height: 1.5; }
.pb__section { margin-top: 1.8rem; }
.pb__label { font-size: .68rem; text-transform: uppercase; letter-spacing: .16em; color: #9a8b6f; margin-bottom: .7rem; }
.pb__themes { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.pb__theme {
  display: flex; align-items: center; gap: .5rem; padding: .6rem .7rem; cursor: pointer;
  border: 1px solid #e4dac7; border-radius: 12px; background: #fff; transition: border-color .2s, box-shadow .2s, transform .2s;
  font-family: inherit;
}
.pb__theme:hover { transform: translateY(-1px); }
.pb__theme.is-on { border-color: #c9a24b; box-shadow: 0 0 0 2px rgba(201, 162, 75, .28); }
.pb__sw { width: 16px; height: 16px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1); }
.pb__sw + .pb__sw { margin-left: -10px; }
.pb__theme-label { margin-left: .4rem; font-size: .82rem; color: #3d3428; }
.pb__hint { margin-top: 1.8rem; font-size: .8rem; color: #a89a80; font-style: italic; line-height: 1.5; }
.pb__frame { width: 100%; height: 100%; border: 0; display: block; background: #0b0906; }
</style>
