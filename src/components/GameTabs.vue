<template>
  <nav class="gm-tabs" aria-label="游戏分类">
    <router-link to="/games" class="gm-tab" :class="{ on: route.path === '/games' }">数字游戏</router-link>
    <router-link to="/games/2048" class="gm-tab" :class="{ on: route.path === '/games/2048' }">2048</router-link>
    <router-link to="/games/sudoku" class="gm-tab" :class="{ on: route.path === '/games/sudoku' }">数独</router-link>
  </nav>
</template>

<script setup>
// 游戏页的分类页签：数字游戏（24 点 / 华容道 / 速算 / 猜数字）｜ 2048 ｜ 数独
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.gm-tabs {
  display: inline-flex; gap: 4px; margin-top: 12px; padding: 4px;
  background: var(--bg2); border: 1px solid var(--line); border-radius: 99px;
}
.gm-tab {
  font-size: 13px; line-height: 1.6; color: var(--mut); text-decoration: none;
  padding: 4px 16px; border-radius: 99px; white-space: nowrap;
  transition: background .14s ease, color .14s ease;
}
.gm-tab:hover { color: var(--ink); }
.gm-tab.on { color: var(--ink); background: var(--card); box-shadow: 0 2px 8px rgba(0, 0, 0, .16); }
@media (max-width: 520px) {
  .gm-tabs { display: flex; }
  .gm-tab { flex: 1; text-align: center; }
}
</style>
