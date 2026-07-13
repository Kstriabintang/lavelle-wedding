<script setup>
// FASE B — Ucapan & Doa live feed. Seed + form inline dengan STICKER PICKER,
// animasi slide-in (TransitionGroup), auto-scroll ke ucapan terbaru.
// defineExpose(addWish) agar RSVP bisa meneruskan ucapannya.
import { ref, reactive, onMounted, nextTick } from 'vue'

const props = defineProps({ seed: { type: Array, default: () => [] } })
const STORE = 'lavelle-royale-wishes'
const STICKERS = ['🤍', '💍', '💐', '🕊️', '🎉', '🌷', '🥂', '✨']

const list = ref([...props.seed])
const listEl = ref(null)
const form = reactive({ name: '', hadir: 'Hadir', msg: '', sticker: '' })

function persist() {
  const saved = list.value.filter((w) => w._own).slice(0, 40)
  try { localStorage.setItem(STORE, JSON.stringify(saved)) } catch { /* diabaikan */ }
}
function addWish(entry, own = false) {
  if (!entry || !entry.name || !entry.msg || entry.msg === '—') return
  list.value.unshift({ ...entry, _own: own })
  if (own) persist()
  nextTick(() => { if (listEl.value) listEl.value.scrollTop = 0 })
}
function pickSticker(s) { form.sticker = form.sticker === s ? '' : s }
function submit() {
  if (!form.name.trim() || !form.msg.trim()) return
  addWish({ name: form.name.trim(), hadir: form.hadir, msg: form.msg.trim(), sticker: form.sticker }, true)
  form.name = ''; form.msg = ''; form.hadir = 'Hadir'; form.sticker = ''
}
defineExpose({ addWish })

onMounted(() => {
  let saved = []
  try { saved = JSON.parse(localStorage.getItem(STORE) || '[]') } catch { saved = [] }
  if (saved.length) list.value = [...saved, ...props.seed]
})
</script>

<template>
  <section id="ucapan" class="r-section wf">
    <div class="r-container r-container--narrow">
      <p class="r-kicker r-reveal">Kirimkan Untuk Kami</p>
      <h2 class="r-title r-reveal">Ucapan &amp; Doa</h2>
      <div class="r-divider r-reveal"><span></span><i class="fa-regular fa-comment-dots"></i><span></span></div>

      <form class="wf__form r-card r-reveal" @submit.prevent="submit">
        <div class="wf__row">
          <input v-model="form.name" type="text" placeholder="Nama Anda" required>
          <select v-model="form.hadir" aria-label="Kehadiran">
            <option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option>
          </select>
        </div>
        <textarea v-model="form.msg" rows="2" placeholder="Tulis ucapan & doa…" required></textarea>

        <!-- Sticker picker -->
        <div class="wf__stickers" role="group" aria-label="Pilih stiker">
          <button v-for="s in STICKERS" :key="s" type="button" class="wf__sticker"
                  :class="{ 'is-on': form.sticker === s }" @click="pickSticker(s)">{{ s }}</button>
        </div>

        <button class="r-btn r-btn--solid r-btn--sm wf__send" type="submit"><i class="fa-solid fa-paper-plane"></i> Kirim Ucapan</button>
      </form>

      <p class="wf__count r-reveal"><i class="fa-solid fa-comments"></i> {{ list.length }} Ucapan &amp; Doa</p>
      <ul ref="listEl" class="wf__list r-reveal">
        <TransitionGroup name="wf-item">
          <li v-for="(w, i) in list" :key="w.name + i + w.msg.slice(0, 8)" class="wf__item">
            <span class="wf__ava">{{ w.name.charAt(0).toUpperCase() }}</span>
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

.wf__stickers { display: flex; flex-wrap: wrap; gap: .4rem; }
.wf__sticker { width: 42px; height: 42px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); font-size: 1.2rem; line-height: 1; cursor: pointer; transition: transform .25s, border-color .25s, background-color .25s; }
.wf__sticker:hover { transform: translateY(-2px); }
.wf__sticker.is-on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, transparent); transform: translateY(-2px) scale(1.05); }
.wf__send { align-self: flex-start; }

.wf__count { text-align: center; font-family: var(--font-serif); font-style: italic; color: var(--accent); margin-bottom: 1.1rem; }
.wf__count i { margin-right: .4em; }
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

@media (max-width: 520px) { .wf__row { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .wf-item-enter-active { transition: opacity .3s; } .wf-item-enter-from { transform: none; } .wf__sticker, .wf__sticker.is-on { transition: none; } }
</style>
