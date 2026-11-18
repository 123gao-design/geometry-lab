<template>
  <nav class="subj" aria-label="学科切换">
    <router-link class="sj" :class="{ on: active === 'math' }" to="/">
      <span class="sj-ic">∑</span>数学
    </router-link>
    <router-link class="sj" :class="{ on: active === 'physics' }" to="/physics">
      <span class="sj-ic">⚛</span>物理
    </router-link>
  </nav>
</template>

<script setup>
defineProps({
  active: { type: String, default: 'math' },
});
</script>

<style scoped>
.subj {
  display: inline-flex;
  gap: 4px;
  margin-top: 16px;
  padding: 4px;
  border-radius: 99px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 70%, transparent);
  backdrop-filter: blur(8px);
}
.sj {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 22px;
  border-radius: 99px;
  font-size: 14px;
  letter-spacing: .5px;
  text-decoration: none;
  color: var(--mut);
  transition: color .16s ease, background .16s ease;
}
.sj:hover { color: var(--ink); }
.sj-ic { font-size: 15px; opacity: .8; }
.sj.on {
  color: #fff;
  background: linear-gradient(135deg, var(--blue), color-mix(in srgb, var(--cyan) 70%, var(--blue)));
  box-shadow: 0 4px 14px color-mix(in srgb, var(--blue) 30%, transparent);
}
.sj.on .sj-ic { opacity: 1; }

@media (max-width: 720px) {
  .sj { padding: 5px 16px; font-size: 13px; }
}
</style>
