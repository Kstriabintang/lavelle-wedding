<script setup>
import { wa, WA_1, WA_2, IG, EMAIL } from '../data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <a href="/#home" class="brand brand--light">
          <span class="brand__mark"><img src="/img/lavelle-logo.png" alt="Lavelle"></span>
          <span class="brand__name">Lavelle</span>
        </a>
        <p>Undangan pernikahan digital yang elegan, personal, dan berkelas — 100% online, melayani seluruh Indonesia.</p>
      </div>
      <div class="footer__col">
        <h4>Navigasi</h4>
        <a href="/#keunggulan">Keunggulan</a>
        <a href="/#paket">Paket &amp; Harga</a>
        <a href="/#demo">Demo</a>
        <a href="/#tentang">Tentang</a>
        <a href="/#faq">FAQ</a>
        <a href="/blog/">Blog</a>
      </div>
      <div class="footer__col">
        <h4>Kontak</h4>
        <a :href="wa(WA_1)" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Admin 1</a>
        <a :href="wa(WA_2)" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Admin 2</a>
        <a :href="IG" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Lavelle</a>
        <a :href="`mailto:${EMAIL}`"><i class="fa-regular fa-envelope"></i> {{ EMAIL }}</a>
      </div>
    </div>
    <div class="footer__bottom">
      <p>&copy; {{ year }} Lavelle &middot; lavelle.my.id — Undangan pernikahan digital yang elegan &amp; personal.</p>
    </div>
  </footer>
</template>
