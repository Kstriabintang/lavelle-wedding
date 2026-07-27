<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '../lib/auth.js'
import { session, initSession } from '../lib/session.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const err = ref('')
const busy = ref(false)

onMounted(async () => {
  await initSession()
  if (session.value) router.replace('/portal/')
})

async function submit() {
  if (busy.value || !email.value || !password.value) return
  err.value = ''; busy.value = true
  const { error } = await signIn(email.value, password.value)
  busy.value = false
  if (error) { err.value = 'Email atau password salah. Coba lagi.'; return }
  router.replace('/portal/')
}
</script>

<template>
  <div class="lg">
    <div class="lg__card">
      <div class="lg__brand">
        <span class="lg__logo">Lavelle</span>
        <span class="lg__eyebrow">Studio Undangan</span>
      </div>
      <h1 class="lg__title">Masuk</h1>
      <p class="lg__sub">Kelola & buat undangan digital untuk klien.</p>

      <form class="lg__form" @submit.prevent="submit">
        <label class="lg__field">
          <span>Email</span>
          <input v-model="email" type="email" autocomplete="email" placeholder="nama@lavelle.my.id" required>
        </label>
        <label class="lg__field">
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" placeholder="••••••••" required>
        </label>
        <p v-if="err" class="lg__err">{{ err }}</p>
        <button class="lg__btn" type="submit" :disabled="busy">{{ busy ? 'Memeriksa…' : 'Masuk' }}</button>
      </form>

      <p class="lg__foot">Akun dibuat oleh admin. Lupa password? Hubungi admin.</p>
    </div>
    <p class="lg__mark">Lavelle — undangan pernikahan digital</p>
  </div>
</template>

<style scoped>
.lg {
  min-height: 100vh; min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1.4rem; padding: 2rem 1.2rem; font-family: 'Jost', system-ui, sans-serif;
  background:
    radial-gradient(120% 80% at 50% -10%, #fff 0%, transparent 55%),
    linear-gradient(180deg, #f7f3ea, #efe7d6);
}
.lg__card {
  width: 100%; max-width: 400px; background: #fffdf9; border: 1px solid #ece3d2; border-radius: 20px;
  padding: 2.4rem 2rem; box-shadow: 0 40px 80px -40px rgba(80, 60, 20, .3);
}
.lg__brand { display: flex; align-items: baseline; gap: .55rem; margin-bottom: 1.6rem; }
.lg__logo { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.5rem; color: #2a231b; }
.lg__eyebrow { font-size: .62rem; text-transform: uppercase; letter-spacing: .24em; color: #b7893a; }
.lg__title { font-family: 'Fraunces', serif; font-size: 2rem; color: #2a231b; line-height: 1; }
.lg__sub { margin-top: .5rem; color: #8b7e6a; font-size: .92rem; }
.lg__form { margin-top: 1.7rem; display: flex; flex-direction: column; gap: 1rem; }
.lg__field { display: flex; flex-direction: column; gap: .35rem; }
.lg__field > span { font-size: .68rem; text-transform: uppercase; letter-spacing: .12em; color: #90836d; }
.lg__field input { width: 100%; padding: .75rem .85rem; border: 1px solid #e0d5be; border-radius: 11px; background: #fff; color: #2a231b; font-family: inherit; font-size: .95rem; transition: border-color .18s, box-shadow .18s; }
.lg__field input:focus { outline: none; border-color: #b7893a; box-shadow: 0 0 0 3px rgba(183, 137, 58, .16); }
.lg__err { color: #b0483f; font-size: .82rem; margin: -.2rem 0 0; }
.lg__btn { margin-top: .4rem; padding: .8rem 1rem; border: none; border-radius: 11px; background: #2a231b; color: #f4ead6; font-family: inherit; font-size: .95rem; letter-spacing: .02em; cursor: pointer; transition: background-color .2s, transform .15s; }
.lg__btn:hover:not(:disabled) { background: #3d3226; transform: translateY(-1px); }
.lg__btn:disabled { opacity: .6; cursor: default; }
.lg__foot { margin-top: 1.4rem; font-size: .76rem; color: #a89a80; text-align: center; line-height: 1.5; }
.lg__mark { font-family: 'Fraunces', serif; font-style: italic; color: #ad9f84; font-size: .82rem; }
</style>
