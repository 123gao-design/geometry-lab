<template>
  <div class="anatomy-view">
    <div class="av-bar">
      <router-link class="av-back" to="/physics/p/demo">← 演示实验</router-link>
      <strong>{{ title }}</strong>
      <a v-if="ok" class="av-open" :href="src" target="_blank" rel="noopener">新标签页打开 ↗</a>
    </div>
    <iframe v-if="ok" class="av-frame" :src="src" :title="title"></iframe>
    <div v-else class="av-miss">没有这台演示。</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const MAP = { balance: '托盘天平', pendulum: '单摆（摆钟）' };
const id = computed(() => String(route.params.id || ''));
const title = computed(() => MAP[id.value] || '');
const ok = computed(() => Boolean(MAP[id.value]));
const src = computed(() => `${import.meta.env.BASE_URL}anatomy/${id.value}.html`);
</script>

<style scoped>
.anatomy-view { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.av-bar { display: flex; align-items: center; gap: 14px; font-size: 14px; }
.av-back { color: var(--blue); }
.av-bar strong { font-size: 16px; }
.av-open { margin-left: auto; color: var(--mut); }
.av-frame { width: 100%; height: calc(100dvh - 128px); border: 1px solid var(--line); border-radius: 16px; background: #f5f5f2; }
.av-miss { padding: 40px; color: var(--mut); }
</style>
