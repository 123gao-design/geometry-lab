<template>
  <div class="chapter-nav">
    <router-link v-for="(t, i) in chapters" :key="i"
      :to="base + (i + 1)" :class="{ on: cur === i + 1 }">
      {{ i + 1 }}·{{ t }}<i v-if="isRead(base + (i + 1))" class="rd">✓</i></router-link>
    <span class="pg">
      <router-link v-if="cur > 1" :to="base + (cur - 1)">← 上一章</router-link>
      <router-link v-if="cur < chapters.length" :to="base + (cur + 1)">下一章 →</router-link>
    </span>
  </div>
</template>
<script setup>
import { isRead } from '../lib/progress.js';
import { DEFAULT_CHAPTERS, DEFAULT_BASE } from './nav-defaults.js';
defineProps({
  cur: { type: Number, required: true },
  chapters: { type: Array, default: () => DEFAULT_CHAPTERS },
  base: { type: String, default: DEFAULT_BASE },
});
</script>
