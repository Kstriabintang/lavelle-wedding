<script setup>
import { wa, WA_1 } from '../data/site'
</script>

<template>
  <a :href="wa(WA_1)" class="wa-float" target="_blank" rel="noopener" aria-label="Chat WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>
</template>
