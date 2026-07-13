<script setup>
// Diorama animatif per suku — latar sinematik berlapis dengan parallax (kesan 3D)
// dan gerak ambient terus-menerus. Warna mengikuti CSS var --gold/--gold-soft dari induk.
// SSR-safe: parallax pointer hanya dipasang di onMounted (klien).
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  suku: { type: String, default: 'minang' },
  variant: { type: String, default: 'cover' }, // 'cover' (penuh) | 'ambient' (redup, di belakang isi)
})

const root = ref(null)
let raf = 0
let tx = 0, ty = 0

function onMove(e) {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  tx = ((e.clientX - r.left) / r.width - 0.5) * 2
  ty = ((e.clientY - r.top) / r.height - 0.5) * 2
  if (raf) return
  raf = requestAnimationFrame(() => {
    el.style.setProperty('--mx', tx.toFixed(3))
    el.style.setProperty('--my', ty.toFixed(3))
    raf = 0
  })
}

onMounted(() => {
  if (props.variant !== 'cover') return
  if (typeof window === 'undefined') return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  window.addEventListener('pointermove', onMove, { passive: true })
})
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('pointermove', onMove)
  if (raf) cancelAnimationFrame(raf)
})

// Partikel deterministik (tanpa Math.random / Date.now — aman untuk SSG)
const dust = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 4.7 + (i % 5) * 3) % 100,
  bottom: (i % 4) * 6,
  delay: -((i % 9) * 1.6),
  dur: 9 + (i % 6) * 2.4,
  size: 2 + (i % 4),
  drift: (i % 2 ? 1 : -1) * (12 + (i % 3) * 10),
  op: 0.3 + (i % 4) * 0.16,
}))
</script>

<template>
  <div ref="root" class="ascene" :class="[`ascene--${variant}`, `ascene--${suku}`]" aria-hidden="true">

    <!-- ================= MINANGKABAU ================= -->
    <template v-if="suku === 'minang'">
      <div class="layer" style="--d:5">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <circle cx="600" cy="230" r="150" fill="var(--gold-soft)" opacity=".10" />
          <path d="M0 560 L180 470 L360 545 L540 440 L720 545 L900 455 L1080 545 L1200 500 L1200 800 L0 800Z" fill="currentColor" opacity=".14" />
          <path d="M0 620 L230 525 L450 605 L670 505 L890 605 L1110 525 L1200 585 L1200 800 L0 800Z" fill="currentColor" opacity=".2" />
        </svg>
      </div>
      <div class="layer" style="--d:13">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <g class="drift drift--slow" fill="currentColor" opacity=".28">
            <ellipse cx="220" cy="170" rx="90" ry="20" /><ellipse cx="300" cy="180" rx="70" ry="16" /><ellipse cx="150" cy="185" rx="60" ry="14" />
            <ellipse cx="880" cy="130" rx="100" ry="22" /><ellipse cx="960" cy="142" rx="70" ry="16" /><ellipse cx="800" cy="145" rx="60" ry="14" />
          </g>
        </svg>
      </div>
      <div class="layer" style="--d:26">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <g fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
            <!-- Rumah Gadang: badan + atap gonjong (tanduk) -->
            <path d="M300 710 V566 H900 V710" />
            <path d="M330 566 V500 M420 566 V486 M510 566 V480 M600 566 V476 M690 566 V480 M780 566 V486 M870 566 V500" stroke-opacity=".5" />
            <path d="M262 566
                     Q 330 548 360 470 Q 372 512 384 470 Q 396 384 408 340
                     Q 420 470 452 500 Q 486 486 500 468 Q 512 388 524 344
                     Q 540 486 570 502 Q 592 492 600 470 Q 600 356 600 318
                     Q 600 356 600 470 Q 608 492 630 502 Q 660 486 676 344
                     Q 688 388 700 468 Q 714 486 748 500 Q 780 470 792 344
                     Q 804 384 816 470 Q 828 512 840 470 Q 870 548 938 566 Z" />
            <!-- songket band -->
            <path d="M300 566 H900" stroke-width="5" stroke-opacity=".7" />
            <path d="M330 640 h60 M450 640 h60 M570 640 h60 M690 640 h60 M810 640 h60" stroke-opacity=".45" />
          </g>
        </svg>
      </div>
      <div class="layer" style="--d:46">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <g stroke="currentColor" stroke-width="3" class="sway">
            <line x1="150" y1="760" x2="150" y2="470" />
            <path d="M150 480 L232 500 L150 520 Z" fill="currentColor" fill-opacity=".4" />
            <path d="M150 528 L216 544 L150 560 Z" fill="currentColor" fill-opacity=".3" />
          </g>
          <g stroke="currentColor" stroke-width="3" class="sway sway--alt">
            <line x1="1050" y1="760" x2="1050" y2="470" />
            <path d="M1050 480 L968 500 L1050 520 Z" fill="currentColor" fill-opacity=".4" />
            <path d="M1050 528 L984 544 L1050 560 Z" fill="currentColor" fill-opacity=".3" />
          </g>
        </svg>
      </div>
    </template>

    <!-- ================= JAWA ================= -->
    <template v-else-if="suku === 'jawa'">
      <div class="layer" style="--d:5">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <circle cx="600" cy="250" r="170" fill="var(--gold-soft)" opacity=".08" />
          <g class="batik" stroke="currentColor" stroke-width="2.4" fill="none" opacity=".14">
            <path d="M-60 780 C 60 660 60 620 -60 520 M60 780 C 180 660 180 620 60 520 M180 780 C 300 660 300 620 180 520 M300 780 C 420 660 420 620 300 520 M420 780 C 540 660 540 620 420 520 M540 780 C 660 660 660 620 540 520 M660 780 C 780 660 780 620 660 520 M780 780 C 900 660 900 620 780 520 M900 780 C 1020 660 1020 620 900 520 M1020 780 C 1140 660 1140 620 1020 520 M1140 780 C 1260 660 1260 620 1140 520" />
          </g>
        </svg>
      </div>
      <div class="layer" style="--d:12">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <!-- Joglo kiri & kanan -->
          <g fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round">
            <path d="M120 720 V600 H360 V720 M150 600 L240 470 L330 600 M180 600 L240 512 L300 600" opacity=".7" />
            <path d="M840 720 V600 H1080 V720 M870 600 L960 470 L1050 600 M900 600 L960 512 L1020 600" opacity=".7" />
          </g>
        </svg>
      </div>
      <div class="layer" style="--d:24">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <!-- Gunungan / Kayon -->
          <g fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
            <path d="M600 250
                     C 470 300 452 420 470 520
                     C 486 610 560 650 560 700 L640 700
                     C 640 650 714 610 730 520
                     C 748 420 730 300 600 250 Z" />
            <path d="M600 250 V186" stroke-linecap="round" />
            <circle cx="600" cy="176" r="10" fill="currentColor" fill-opacity=".3" />
            <!-- gapura + kala -->
            <path d="M560 700 V560 H640 V700" stroke-opacity=".7" />
            <path d="M548 560 Q600 500 652 560" stroke-opacity=".7" />
            <path d="M576 600 q24 -20 48 0" stroke-opacity=".5" />
            <circle cx="588" cy="620" r="4" /><circle cx="612" cy="620" r="4" />
            <path d="M512 470 q30 -26 44 6 M688 470 q-30 -26 -44 6" stroke-opacity=".5" />
          </g>
        </svg>
      </div>
      <div class="layer" style="--d:40">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <g class="smoke" stroke="currentColor" stroke-width="2.4" fill="none" opacity=".3">
            <path d="M300 720 q-14 -50 8 -96 q22 -46 -6 -92" />
            <path d="M900 720 q14 -50 -8 -96 q-22 -46 6 -92" />
          </g>
        </svg>
      </div>
    </template>

    <!-- ================= SUNDA ================= -->
    <template v-else-if="suku === 'sunda'">
      <div class="layer" style="--d:5">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <circle cx="600" cy="240" r="150" fill="var(--gold-soft)" opacity=".1" />
          <path d="M0 600 L280 470 L360 510 L520 470 L820 600 L1200 500 L1200 800 L0 800Z" fill="currentColor" opacity=".16" />
        </svg>
      </div>
      <!-- Mega mendung: lapis awan berundak yang bergerak -->
      <div class="layer" style="--d:10">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMin slice">
          <path class="drift drift--slow" d="M-40 120 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0 q40 -60 80 0"
                fill="none" stroke="currentColor" stroke-width="3" opacity=".3" />
        </svg>
      </div>
      <div class="layer" style="--d:18">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMin slice">
          <path class="drift drift--med" d="M-60 180 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0 q50 -70 100 0"
                fill="none" stroke="currentColor" stroke-width="3.4" opacity=".4" />
        </svg>
      </div>
      <div class="layer" style="--d:34">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <!-- Sawah terasering -->
          <g fill="none" stroke="currentColor" stroke-width="2.6">
            <path d="M-20 640 Q 300 600 600 640 T 1220 640" opacity=".5" />
            <path d="M-20 690 Q 320 645 600 690 T 1220 690" opacity=".4" />
            <path d="M-20 745 Q 280 695 600 745 T 1220 745" opacity=".32" />
          </g>
          <!-- Bambu -->
          <g stroke="currentColor" stroke-width="3" class="sway sway--soft" opacity=".5">
            <path d="M110 760 C 96 640 120 560 104 470" fill="none" />
            <path d="M150 760 C 138 650 160 580 148 500" fill="none" />
            <path d="M92 560 h26 M132 590 h26 M100 640 h26 M140 670 h26" />
          </g>
          <g stroke="currentColor" stroke-width="3" class="sway sway--soft sway--alt" opacity=".5">
            <path d="M1090 760 C 1104 640 1080 560 1096 470" fill="none" />
            <path d="M1050 760 C 1062 650 1040 580 1052 500" fill="none" />
            <path d="M1082 560 h-26 M1042 590 h-26 M1074 640 h-26 M1034 670 h-26" />
          </g>
        </svg>
      </div>
    </template>

    <!-- ================= BUGIS–MAKASSAR ================= -->
    <template v-else>
      <div class="layer" style="--d:5">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <circle cx="600" cy="300" r="130" fill="var(--gold-soft)" opacity=".12" />
          <circle cx="600" cy="300" r="130" fill="none" stroke="var(--gold-soft)" stroke-width="2" opacity=".2" />
        </svg>
      </div>
      <div class="layer" style="--d:22">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
          <!-- Perahu Phinisi -->
          <g class="bob" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
            <path d="M330 590 Q 600 660 900 578 L 862 626 Q 600 690 372 632 Z" />
            <!-- tiang -->
            <path d="M498 590 V250 M726 590 V250" stroke-width="3.4" />
            <path d="M498 250 L726 250" stroke-opacity=".5" />
            <!-- layar -->
            <path d="M498 300 L410 560 L498 540 Z" fill-opacity=".16" />
            <path d="M498 300 L586 540 L498 520 Z" fill-opacity=".1" />
            <path d="M726 300 L640 560 L726 538 Z" fill-opacity=".16" />
            <path d="M726 300 L812 540 L726 520 Z" fill-opacity=".1" />
            <path d="M498 250 L590 250 L560 320 L498 320 Z" fill-opacity=".14" />
            <path d="M726 250 L634 250 L664 320 L726 320 Z" fill-opacity=".14" />
          </g>
        </svg>
      </div>
      <!-- Ombak berlapis -->
      <div class="layer" style="--d:12">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice">
          <path class="drift drift--med" d="M-60 120 q45 -34 90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 V200 H-60Z"
                fill="currentColor" opacity=".16" />
        </svg>
      </div>
      <div class="layer" style="--d:30">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice">
          <path class="drift drift--fast drift--rev" d="M-60 150 q50 -30 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V200 H-60Z"
                fill="currentColor" opacity=".24" />
        </svg>
      </div>
    </template>

    <!-- Partikel emas melayang (semua suku) -->
    <div class="ascene__dust">
      <span v-for="(d, i) in dust" :key="i" class="dust"
            :style="{ left: d.left + '%', bottom: d.bottom + '%', width: d.size + 'px', height: d.size + 'px',
                      animationDelay: d.delay + 's', animationDuration: d.dur + 's', '--drift': d.drift + 'px', '--op': d.op }" />
    </div>
  </div>
</template>

<style scoped>
.ascene { position: absolute; inset: 0; overflow: hidden; color: var(--gold); pointer-events: none; perspective: 900px; }
.ascene--ambient { opacity: .5; }
.layer {
  position: absolute; inset: -4%; will-change: transform;
  transform: translate3d(calc(var(--mx, 0) * var(--d, 0) * 1px), calc(var(--my, 0) * var(--d, 0) * .6px), 0);
  transition: transform .5s cubic-bezier(.2, .8, .2, 1);
}
.layer svg { position: absolute; inset: 0; width: 100%; height: 100%; }

/* --- Gerak ambient --- */
.drift { animation: drift 26s ease-in-out infinite alternate; }
.drift--slow { animation-duration: 34s; }
.drift--med { animation-duration: 20s; }
.drift--fast { animation-duration: 13s; }
.drift--rev { animation-direction: alternate-reverse; }
@keyframes drift { from { transform: translateX(-40px); } to { transform: translateX(40px); } }

.sway { transform-box: fill-box; transform-origin: bottom center; animation: sway 6s ease-in-out infinite; }
.sway--alt { animation-delay: -3s; }
.sway--soft { animation-duration: 8s; }
@keyframes sway { 0%, 100% { transform: rotate(-2.4deg); } 50% { transform: rotate(2.4deg); } }

.bob { transform-box: fill-box; transform-origin: center; animation: bob 7s ease-in-out infinite; }
@keyframes bob { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-14px) rotate(1deg); } }

.smoke { transform-box: fill-box; transform-origin: bottom center; animation: smoke 9s ease-in-out infinite; }
@keyframes smoke { 0%, 100% { transform: translateY(6px) scaleY(.98); opacity: .18; } 50% { transform: translateY(-6px) scaleY(1.04); opacity: .34; } }

.batik { animation: batik 40s linear infinite; }
@keyframes batik { to { transform: translateX(120px); } }

.ascene__dust { position: absolute; inset: 0; }
.dust {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--gold-soft), var(--gold2));
  opacity: var(--op, .5); animation-name: dustRise; animation-timing-function: ease-in-out;
  animation-iteration-count: infinite; box-shadow: 0 0 6px var(--gold-soft);
}
@keyframes dustRise {
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  12% { opacity: var(--op, .5); }
  88% { opacity: var(--op, .5); }
  100% { transform: translate3d(var(--drift, 20px), -84vh, 0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .drift, .sway, .bob, .smoke, .batik, .dust { animation: none; }
  .ascene__dust { display: none; }
}
</style>
