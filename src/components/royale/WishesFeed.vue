<script setup>
// FASE B — Ucapan & Doa: BUKU TAMU live via backend Google Sheet (Apps Script).
// GET feed (JSONP, aman lintas-domain) + POST ucapan (text/plain, tanpa preflight).
// Batas 1 ucapan/orang (token device) + bisa di-edit. Fallback ke seed bila `api` kosong.
import { ref, reactive, onMounted, nextTick, computed } from 'vue'

const props = defineProps({
  seed: { type: Array, default: () => [] },
  api: { type: String, default: '' },     // URL web-app Apps Script (…/exec)
})

const STORE = 'lavelle-wish-own'
const IDKEY = 'lavelle-guest-id'

const list = ref([])
const listEl = ref(null)
const form = reactive({ name: '', hadir: 'Hadir', msg: '', sticker: '' })
const sent = ref(false)
const sending = ref(false)
const STICKERS = ['🤍', '💖', '💍', '💐', '🌷', '🌸', '🕊️', '🤲', '🎉', '🥂', '✨', '💫']
const firstName = computed(() => (form.name.trim().split(' ')[0] || 'Sahabat'))

function guestId() {
  try {
    let id = localStorage.getItem(IDKEY)
    if (!id) { id = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem(IDKEY, id) }
    return id
  } catch { return 'g' + Date.now().toString(36) }
}

let jn = 0
function jsonpGet(url) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') { resolve(null); return }
    const cb = 'wcb_' + Date.now() + '_' + (++jn)
    const s = document.createElement('script')
    let done = false
    const cleanup = () => { try { delete window[cb] } catch { window[cb] = undefined } s.remove() }
    window[cb] = (data) => { if (!done) { done = true; cleanup(); resolve(data) } }
    s.onerror = () => { if (!done) { done = true; cleanup(); resolve(null) } }
    s.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + cb
    document.head.appendChild(s)
    setTimeout(() => { if (!done) { done = true; cleanup(); resolve(null) } }, 8000)
  })
}

async function refresh() {
  if (!props.api) return
  const data = await jsonpGet(props.api)
  if (data && data.ok && Array.isArray(data.wishes)) list.value = data.wishes  // apa adanya (kosong = kosong)
}

function pickSticker(s) { form.sticker = form.sticker === s ? '' : s }

// dipakai RSVP (parent) untuk menampilkan ucapannya secara optimistik di feed lokal
function addWish(entry, own = false) {
  if (!entry || !entry.name || !entry.msg || entry.msg === '—') return
  list.value.unshift({ ...entry, _own: own })
  nextTick(() => { if (listEl.value) listEl.value.scrollTop = 0 })
}
defineExpose({ addWish })

async function submit() {
  if (!form.name.trim() || !form.msg.trim() || sending.value) return
  const entry = { id: guestId(), name: form.name.trim(), hadir: form.hadir, msg: form.msg.trim(), sticker: form.sticker }
  sending.value = true
  try {
    if (props.api) {
      // POST fire-and-forget (respons tak bisa dibaca lintas-domain — itu wajar)
      fetch(props.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(entry), redirect: 'follow' }).catch(() => {})
    }
    // optimistik: tampilkan langsung + tandai sudah kirim (batas 1/orang)
    const idx = list.value.findIndex((w) => w._id === entry.id)
    const shown = { name: entry.name, hadir: entry.hadir, msg: entry.msg, sticker: entry.sticker, _own: true, _id: entry.id }
    if (idx >= 0) list.value.splice(idx, 1, shown); else list.value.unshift(shown)
    try { localStorage.setItem(STORE, JSON.stringify(entry)) } catch { /* ok */ }
    sent.value = true
    setTimeout(refresh, 1600)   // sinkron dgn server
  } finally { sending.value = false }
}

function edit() { sent.value = false }

onMounted(() => {
  // pulihkan ucapan sendiri (mode edit) dari device
  try {
    const own = JSON.parse(localStorage.getItem(STORE) || 'null')
    if (own && own.name) { form.name = own.name; form.hadir = own.hadir || 'Hadir'; form.msg = own.msg; form.sticker = own.sticker || ''; sent.value = true }
  } catch { /* ok */ }
  if (props.api) refresh(); else list.value = [...props.seed]   // demo (tanpa api) → tampilkan seed
})
</script>

<template>
  <section id="ucapan" class="r-section wf">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Kirimkan Untuk Kami</p>
      <h2 class="r-title r-reveal">Ucapan &amp; Doa</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-comment-dots"></i><span></span></div>

      <transition name="wf-swap" mode="out-in">
        <form v-if="!sent" key="form" class="wf__form r-card" @submit.prevent="submit">
          <div class="wf__row">
            <input v-model="form.name" type="text" placeholder="Nama Anda" required>
            <select v-model="form.hadir" aria-label="Kehadiran">
              <option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option>
            </select>
          </div>
          <textarea v-model="form.msg" rows="2" placeholder="Tulis ucapan & doa…" required></textarea>

          <div class="wf__stickers" role="group" aria-label="Pilih stiker">
            <button v-for="s in STICKERS" :key="s" type="button" class="wf__sticker"
                    :class="{ 'is-on': form.sticker === s }" @click="pickSticker(s)">{{ s }}</button>
          </div>

          <button class="r-btn r-btn--solid r-btn--sm wf__send" type="submit" :disabled="sending">
            <i class="fa-solid fa-paper-plane"></i> {{ sending ? 'Mengirim…' : 'Kirim Ucapan' }}
          </button>
        </form>

        <div v-else key="done" class="wf__done r-card">
          <span class="wf__check"><i class="fa-solid fa-check"></i></span>
          <h3>Terima kasih, {{ firstName }}!</h3>
          <p>Ucapan &amp; doamu telah kami terima. Semoga menjadi doa yang baik untuk kami berdua.</p>
          <button class="r-btn r-btn--ghost r-btn--sm" type="button" @click="edit"><i class="fa-solid fa-pen"></i> Edit Ucapan</button>
        </div>
      </transition>

      <p class="wf__count"><i class="fa-solid fa-comments"></i> {{ list.length }} Ucapan &amp; Doa</p>
      <p v-if="!list.length" class="wf__empty">Belum ada ucapan &amp; doa. Jadilah yang pertama memberi doa untuk kami. 🤍</p>
      <ul v-else ref="listEl" class="wf__list">
        <TransitionGroup name="wf-item">
          <li v-for="(w, i) in list" :key="w.name + i + (w.msg || '').slice(0, 8)" class="wf__item">
            <span class="wf__ava">{{ (w.name || '?').charAt(0).toUpperCase() }}</span>
            <div class="wf__body">
              <p class="wf__head"><strong>{{ w.name }}</strong><span class="wf__tag" :class="{ 'is-no': w.hadir === 'Tidak Hadir' }">{{ w.hadir }}</span></p>
              <p class="wf__msg">{{ w.msg }}</p>
            </div>
            <span v-if="w.sticker" class="wf__sticker-badge" aria-hidden="true">{{ w.sticker }}</span>
          </li>
        </TransitionGroup>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.wf__form { padding: 1.4rem; display: flex; flex-direction: column; gap: .8rem; margin-bottom: 1.8rem; }
.wf__row { display: grid; grid-template-columns: 1.4fr 1fr; gap: .7rem; }
.wf__form input, .wf__form select, .wf__form textarea { width: 100%; padding: .85em 1em; border: 1px solid var(--line); border-radius: 10px; background: var(--bg); color: var(--ink); font-family: var(--font-sans); font-size: .92rem; }
.wf__form input:focus, .wf__form select:focus, .wf__form textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }

.wf__stickers { display: grid; grid-template-columns: repeat(6, 1fr); gap: .5rem; }
.wf__sticker { width: 100%; height: 44px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); font-size: 1.2rem; line-height: 1; cursor: pointer; transition: transform .25s, border-color .25s, background-color .25s; }
.wf__sticker:hover { transform: translateY(-2px); }
.wf__sticker.is-on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, transparent); transform: translateY(-2px) scale(1.05); }
.wf__send { align-self: flex-start; }
.wf__send:disabled { opacity: .6; cursor: default; }

.wf__done { padding: 2.4rem 1.6rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .6rem; margin-bottom: 1.8rem; }
.wf__check { width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); font-size: 1.4rem; margin-bottom: .3rem; }
.wf__done h3 { font-family: var(--font-display); font-size: 1.5rem; color: var(--ink); }
.wf__done p { font-family: var(--font-serif); color: var(--ink-soft); max-width: 420px; line-height: 1.6; }

.wf__count { text-align: center; font-family: var(--font-serif); font-style: italic; color: var(--accent); margin-bottom: 1.1rem; }
.wf__count i { margin-right: .4em; }
.wf__empty { text-align: center; font-family: var(--font-serif); font-style: italic; color: var(--ink-soft); padding: 1.4rem 1rem 2rem; line-height: 1.6; }
.wf__list { list-style: none; margin: 0; padding: .2rem; display: flex; flex-direction: column; gap: .8rem; max-height: 440px; overflow-y: auto; }
.wf__list::-webkit-scrollbar { width: 6px; }
.wf__list::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 6px; }
.wf__item { position: relative; display: flex; gap: .9rem; padding: 1rem 1.1rem; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
.wf__ava { flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-family: var(--font-display); font-weight: 600; color: var(--accent-ink); background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
.wf__body { flex: 1; min-width: 0; }
.wf__head { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.wf__head strong { font-size: .96rem; color: var(--ink); }
.wf__tag { font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); border: 1px solid var(--accent); border-radius: 30px; padding: .1em .7em; }
.wf__tag.is-no { color: var(--ink-soft); border-color: var(--line); }
.wf__msg { font-family: var(--font-serif); font-size: .98rem; line-height: 1.55; color: var(--ink-soft); margin-top: .3rem; }
.wf__sticker-badge { position: absolute; top: .8rem; right: .9rem; font-size: 1.25rem; line-height: 1; }

.wf-item-enter-active { transition: opacity .5s, transform .5s; }
.wf-item-enter-from { opacity: 0; transform: translateX(-24px); }
.wf-swap-enter-active, .wf-swap-leave-active { transition: opacity .35s, transform .35s; }
.wf-swap-enter-from { opacity: 0; transform: translateY(12px); }
.wf-swap-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 520px) { .wf__row { grid-template-columns: 1fr; } .wf__stickers { grid-template-columns: repeat(4, 1fr); } }
@media (prefers-reduced-motion: reduce) { .wf-item-enter-active, .wf-swap-enter-active, .wf-swap-leave-active { transition: opacity .3s; } .wf-item-enter-from, .wf-swap-enter-from, .wf-swap-leave-to { transform: none; } .wf__sticker, .wf__sticker.is-on { transition: none; } }
</style>
