<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '../lib/auth.js'
import { session, initSession } from '../lib/session.js'
import LavelleLogo from '../components/LavelleLogo.vue'

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

// Dust melayang — posisi/durasi deterministik (tanpa acak saat render)
function dustStyle(n) {
  const x = (n * 37) % 100
  const size = 1.5 + (n % 4)
  const delay = (n % 10) * 1.6
  const dur = 16 + (n % 8) * 2.4
  const drift = ((n % 5) - 2) * 14
  return { left: x + '%', width: size + 'px', height: size + 'px', animationDelay: delay + 's', animationDuration: dur + 's', '--drift': drift + 'px' }
}
</script>

<template>
  <div class="lg">
    <!-- KIRI — brand sinematik + background live -->
    <aside class="lg__brand">
      <div class="lg__bg" aria-hidden="true">
        <span class="lg__aurora lg__aurora--1"></span>
        <span class="lg__aurora lg__aurora--2"></span>
        <span class="lg__aurora lg__aurora--3"></span>
        <span v-for="n in 20" :key="n" class="lg__dust" :style="dustStyle(n)"></span>
      </div>
      <div class="lg__brandinner">
        <LavelleLogo class="lg__logo" />
        <h2 class="lg__name">Lavelle</h2>
        <p class="lg__tag">Studio Undangan Pernikahan Digital</p>
        <span class="lg__rule"></span>
        <p class="lg__quote">“Setiap kisah cinta layak dirayakan dengan indah.”</p>
      </div>
    </aside>

    <!-- KANAN — form -->
    <main class="lg__panel">
      <div class="lg__card">
        <LavelleLogo wordmark class="lg__cardbrand" />
        <h1 class="lg__title">Selamat datang kembali</h1>
        <p class="lg__sub">Masuk untuk mengelola & membuat undangan digital klien.</p>

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
          <button class="lg__btn" type="submit" :disabled="busy">
            <span>{{ busy ? 'Memeriksa…' : 'Masuk' }}</span>
          </button>
        </form>

        <p class="lg__foot">Akun dibuat oleh admin. Lupa password? Hubungi admin.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.lg { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: 1.05fr .95fr; font-family: 'Jost', system-ui, sans-serif; }

/* ---------- KIRI: brand sinematik ---------- */
.lg__brand { position: relative; overflow: hidden; display: grid; place-items: center; color: #ecd9a6; background: radial-gradient(130% 100% at 30% 10%, #241a0f 0%, transparent 60%), linear-gradient(160deg, #17120c, #0a0805); }
.lg__bg { position: absolute; inset: 0; }
.lg__aurora { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; will-change: transform; }
.lg__aurora--1 { width: 42vw; height: 42vw; left: -8%; top: -6%; background: radial-gradient(circle, rgba(201,162,75,.55), transparent 70%); animation: auroraA 17s ease-in-out infinite; }
.lg__aurora--2 { width: 34vw; height: 34vw; right: -6%; top: 30%; background: radial-gradient(circle, rgba(150,98,42,.5), transparent 70%); animation: auroraB 22s ease-in-out infinite; }
.lg__aurora--3 { width: 30vw; height: 30vw; left: 25%; bottom: -12%; background: radial-gradient(circle, rgba(236,201,127,.35), transparent 70%); animation: auroraA 26s ease-in-out infinite reverse; }
@keyframes auroraA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(6%,4%) scale(1.15); } }
@keyframes auroraB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-5%,-6%) scale(1.1); } }
.lg__dust { position: absolute; bottom: -10px; border-radius: 50%; background: rgba(236,201,127,.85); box-shadow: 0 0 6px rgba(236,201,127,.6); opacity: 0; animation-name: dust; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes dust { 0% { transform: translateY(0) translateX(0); opacity: 0; } 12% { opacity: .8; } 88% { opacity: .5; } 100% { transform: translateY(-104vh) translateX(var(--drift, 0)); opacity: 0; } }

.lg__brandinner { position: relative; z-index: 2; text-align: center; padding: 2rem; }
.lg__logo { font-size: 3.4rem; color: #ecd9a6; }
.lg__name { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(2.4rem, 4vw, 3.4rem); color: #f4ead0; margin-top: 1.1rem; letter-spacing: .01em; }
.lg__tag { margin-top: .5rem; font-size: .74rem; letter-spacing: .32em; text-transform: uppercase; color: #c9a24b; }
.lg__rule { display: block; width: 46px; height: 1px; margin: 1.6rem auto; background: linear-gradient(90deg, transparent, #c9a24b, transparent); }
.lg__quote { font-family: 'Fraunces', serif; font-style: italic; font-size: 1.05rem; color: #d8c8a4; max-width: 320px; margin: 0 auto; line-height: 1.6; }

/* ---------- KANAN: form ---------- */
.lg__panel { display: grid; place-items: center; padding: 2rem 1.4rem; background: radial-gradient(120% 90% at 70% 0%, #fffdf9, transparent 60%), linear-gradient(180deg, #f8f4ec, #f1e9da); }
.lg__card { width: 100%; max-width: 380px; }
.lg__cardbrand { color: #2a231b; margin-bottom: 2rem; }
.lg__cardbrand :deep(.llg__mark) { color: #b7893a; }
.lg__title { font-family: 'Fraunces', serif; font-size: clamp(1.8rem, 3vw, 2.3rem); color: #2a231b; line-height: 1.1; }
.lg__sub { margin-top: .6rem; color: #8b7e6a; font-size: .95rem; line-height: 1.5; }
.lg__form { margin-top: 1.9rem; display: flex; flex-direction: column; gap: 1.05rem; }
.lg__field { display: flex; flex-direction: column; gap: .38rem; }
.lg__field > span { font-size: .66rem; text-transform: uppercase; letter-spacing: .14em; color: #90836d; }
.lg__field input { width: 100%; padding: .82rem .9rem; border: 1px solid #e0d5be; border-radius: 12px; background: #fff; color: #2a231b; font-family: inherit; font-size: .95rem; transition: border-color .18s, box-shadow .18s; }
.lg__field input:focus { outline: none; border-color: #b7893a; box-shadow: 0 0 0 3px rgba(183,137,58,.16); }
.lg__err { color: #b0483f; font-size: .82rem; margin: -.2rem 0 0; }
.lg__btn { margin-top: .5rem; padding: .9rem 1rem; border: none; border-radius: 12px; cursor: pointer; color: #f6ecd6; font-family: inherit; font-size: .96rem; letter-spacing: .02em; background: linear-gradient(180deg, #2f271d, #211b13); box-shadow: 0 14px 30px -14px rgba(40,30,12,.6); transition: transform .15s, box-shadow .2s; }
.lg__btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 18px 36px -14px rgba(40,30,12,.7); }
.lg__btn:disabled { opacity: .6; cursor: default; }
.lg__foot { margin-top: 1.6rem; font-size: .78rem; color: #a89a80; text-align: center; line-height: 1.5; }

@media (max-width: 820px) {
  .lg { grid-template-columns: 1fr; }
  .lg__brand { min-height: 34vh; }
  .lg__brandinner { padding: 2.2rem 1.5rem; }
  .lg__logo { font-size: 2.6rem; }
  .lg__quote { display: none; }
  .lg__panel { padding: 2.4rem 1.4rem 3rem; }
}
@media (prefers-reduced-motion: reduce) {
  .lg__aurora, .lg__dust { animation: none !important; }
  .lg__dust { display: none; }
}
</style>
