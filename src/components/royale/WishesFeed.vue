<script setup>
// 3.9 — Ucapan & Doa live feed. Seed 10 entri, form inline, animasi
// slide-in (TransitionGroup), auto-scroll ke ucapan terbaru.
// defineExpose(addWish) agar RSVP (3.7) bisa meneruskan ucapannya.
import { ref, reactive, onMounted, nextTick } from 'vue'

const props = defineProps({ seed: { type: Array, default: () => [] } })
const STORE = 'lavelle-royale-wishes'

const list = ref([...props.seed])
const listEl = ref(null)
const form = reactive({ name: '', hadir: 'Hadir', msg: '' })

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
function submit() {
  if (!form.name.trim() || !form.msg.trim()) return
  addWish({ name: form.name.trim(), hadir: form.hadir, msg: form.msg.trim() }, true)
  form.name = ''; form.msg = ''; form.hadir = 'Hadir'
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
          <select v-model="form.hadir">
            <option>Hadir</option><option>Tidak Hadir</option><option>Masih Ragu</option>
          </select>
        </div>
        <textarea v-model="form.msg" rows="2" placeholder="Tulis ucapan & doa…" required></textarea>
        <button class="r-btn r-btn--solid r-btn--sm" type="submit"><i class="fa-solid fa-paper-plane"></i> Kirim Ucapan</button>
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
          </li>
        </TransitionGroup>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.wf__form { padding: 1.2rem; display: flex; flex-direction: column; gap: .7rem; margin-bottom: 1.6rem; }
.wf__row { display: grid; grid-template-columns: 1.4fr 1fr; gap: .7rem; }
.wf__form input, .wf__form select, .wf__form textarea { width: 100%; padding: .8em 1em; border: 1px solid var(--line); border-radius: 10px; background: var(--bg); color: var(--ink); font-family: var(--font-sans); font-size: .92rem; }
.wf__form input:focus, .wf__form select:focus, .wf__form textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }

.wf__count { text-align: center; font-family: var(--font-serif); font-style: italic; color: var(--accent); margin-bottom: 1rem; }
.wf__count i { margin-right: .4em; }
.wf__list { list-style: none; margin: 0; padding: .2rem; display: flex; flex-direction: column; gap: .7rem; max-height: 420px; overflow-y: auto; }
.wf__list::-webkit-scrollbar { width: 6px; }
.wf__list::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 6px; }
.wf__item { display: flex; gap: .8rem; padding: .9rem 1rem; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.wf__ava { flex: none; width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-family: var(--font-display); font-weight: 600; color: var(--accent-ink); background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
.wf__head { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.wf__head strong { font-size: .94rem; color: var(--ink); }
.wf__tag { font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); border: 1px solid var(--accent); border-radius: 30px; padding: .1em .7em; }
.wf__tag.is-no { color: var(--ink-soft); border-color: var(--line); }
.wf__msg { font-family: var(--font-serif); font-size: .96rem; line-height: 1.5; color: var(--ink-soft); margin-top: .25rem; }

.wf-item-enter-active { transition: opacity .5s, transform .5s; }
.wf-item-enter-from { opacity: 0; transform: translateX(-24px); }

@media (max-width: 520px) { .wf__row { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .wf-item-enter-active { transition: opacity .3s; } .wf-item-enter-from { transform: none; } }
</style>
