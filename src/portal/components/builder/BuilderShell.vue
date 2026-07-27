<script setup>
// Shell builder: dua panel (form kiri | pratinjau kanan dalam bingkai HP).
// Mobile: form penuh + tombol mengambang untuk beralih ke pratinjau layar penuh.
import { ref } from 'vue'
const showPreview = ref(false)
</script>

<template>
  <div class="bshell" :class="{ 'is-preview': showPreview }">
    <aside class="bshell__panel">
      <slot name="form" />
    </aside>

    <section class="bshell__stage">
      <div class="bshell__device">
        <div class="bshell__screen"><slot name="preview" /></div>
      </div>
    </section>

    <button class="bshell__fab" type="button" @click="showPreview = !showPreview">
      <span v-if="showPreview">✎ Edit</span>
      <span v-else>◉ Pratinjau</span>
    </button>
  </div>
</template>

<style scoped>
.bshell {
  --panel-w: 420px;
  display: grid; grid-template-columns: var(--panel-w) 1fr;
  height: 100vh; height: 100svh; overflow: hidden;
  font-family: 'Jost', system-ui, sans-serif;
  background: #0e0d0c;
}

/* Panel form (kiri) */
.bshell__panel {
  overflow-y: auto; overflow-x: hidden;
  background: #faf7f2; color: #221d16;
  border-right: 1px solid #e7dfd1;
}
.bshell__panel::-webkit-scrollbar { width: 8px; }
.bshell__panel::-webkit-scrollbar-thumb { background: #d8ccb6; border-radius: 8px; }

/* Panggung pratinjau (kanan) */
.bshell__stage {
  display: grid; place-items: center; padding: 24px;
  background:
    radial-gradient(120% 80% at 50% -10%, #2a2118 0%, transparent 60%),
    linear-gradient(180deg, #14110d, #0b0a08);
  overflow: hidden;
}
.bshell__device {
  width: min(400px, 94%); height: min(880px, calc(100svh - 48px));
  border-radius: 40px; padding: 12px;
  background: linear-gradient(160deg, #2c2c30, #131315);
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, .8), inset 0 1px 0 rgba(255, 255, 255, .06);
  border: 1px solid #34343a;
}
.bshell__screen {
  width: 100%; height: 100%; border-radius: 30px; overflow: hidden auto;
  background: #0b0906;
  /* transform → jadikan containing-block untuk elemen position:fixed di undangan
     (musik / progress / quick-nav) agar terkurung di layar HP, bukan viewport builder */
  transform: translateZ(0);
  -webkit-overflow-scrolling: touch;
}
.bshell__screen::-webkit-scrollbar { width: 0; height: 0; }

/* Tombol mengambang (khusus mobile) */
.bshell__fab {
  display: none; position: fixed; z-index: 50; left: 50%; bottom: 18px; transform: translateX(-50%);
  padding: .7rem 1.4rem; border: none; border-radius: 40px; cursor: pointer;
  background: #221d16; color: #f0e6d3; font-family: inherit; font-size: .85rem; letter-spacing: .04em;
  box-shadow: 0 14px 30px -12px rgba(0, 0, 0, .7);
}

@media (max-width: 900px) {
  .bshell { grid-template-columns: 1fr; }
  .bshell__stage { display: none; }
  .bshell__fab { display: block; }
  .bshell.is-preview .bshell__panel { display: none; }
  .bshell.is-preview .bshell__stage { display: grid; padding: 0; }
  .bshell.is-preview .bshell__device { width: 100%; height: 100svh; border-radius: 0; padding: 0; border: none; }
  .bshell.is-preview .bshell__screen { border-radius: 0; }
}
</style>
