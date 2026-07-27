<script setup>
// ORNAMENT KIT (portal) — motif halus (SVG inline) sebagai signature template.
// Dekoratif → aria-hidden. Warna mengikuti --accent tema. Committable (versi portal).
//   kind="divider" → rule + belah ketupat di tengah
//   kind="frame"   → deretan gonjong samar
//   kind="band"    → pita anyaman low-opacity
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, default: 'divider' },
  width: { type: [String, Number], default: null },
})
const wStyle = computed(() =>
  props.width == null ? null : { width: typeof props.width === 'number' ? props.width + 'px' : props.width })
</script>

<template>
  <svg v-if="kind === 'divider'" class="orn orn--divider" :style="wStyle"
       viewBox="0 0 240 24" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <line x1="6" y1="12" x2="96" y2="12" stroke="currentColor" stroke-width="1" />
    <line x1="144" y1="12" x2="234" y2="12" stroke="currentColor" stroke-width="1" />
    <circle cx="102" cy="12" r="1.5" fill="currentColor" />
    <circle cx="138" cy="12" r="1.5" fill="currentColor" />
    <path d="M120 2.5 L129 12 L120 21.5 L111 12 Z" stroke="currentColor" stroke-width="1" fill="none" />
    <path d="M120 8 L124 12 L120 16 L116 12 Z" fill="currentColor" />
  </svg>

  <svg v-else-if="kind === 'frame'" class="orn orn--frame" :style="wStyle"
       viewBox="0 0 300 44" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <path d="M12 42 Q 42 22 72 42" stroke="currentColor" stroke-width="1" />
    <path d="M58 42 Q 92 11 126 42" stroke="currentColor" stroke-width="1" />
    <path d="M108 42 Q 150 2 192 42" stroke="currentColor" stroke-width="1.1" />
    <path d="M174 42 Q 208 11 242 42" stroke="currentColor" stroke-width="1" />
    <path d="M228 42 Q 258 22 288 42" stroke="currentColor" stroke-width="1" />
    <line x1="150" y1="2" x2="150" y2="-4" stroke="currentColor" stroke-width="1.1" />
  </svg>

  <div v-else class="orn orn--band" aria-hidden="true"></div>
</template>

<style scoped>
.orn { display: block; color: var(--accent, #c9a24b); }
.orn--divider { width: min(240px, 62%); margin: 0 auto; opacity: .72; overflow: visible; }
.orn--frame { width: min(300px, 70%); margin: 0 auto; opacity: .5; overflow: visible; }
.orn--band {
  width: 100%; height: 20px; opacity: .085;
  background-image:
    repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 12px),
    repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 12px);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
}
</style>
