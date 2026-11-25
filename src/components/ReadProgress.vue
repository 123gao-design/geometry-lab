<template>
  <!-- 章节页顶部阅读进度：贴在 46px 顶栏下方。颜色由 global.css 用主题变量给，这里只算比例。 -->
  <div class="read-progress" :class="{ show: shown }" aria-hidden="true">
    <div class="rp-fill" :style="{ transform: 'scaleX(' + p + ')' }"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const p = ref(0);
const shown = ref(false);
let raf = 0, ro = null;

function measure() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (h <= 24) { p.value = 0; shown.value = false; return; }
  const v = Math.min(1, Math.max(0, window.scrollY / h));
  p.value = v;
  shown.value = v > 0.002;   // 顶部时隐去，别在刚进页面就画一条空槽
}

function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => { raf = 0; measure(); });
}

onMounted(() => {
  measure();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // KaTeX / 画板是异步长高的，页面高度变了要重新量一次，进度才准
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(onScroll);
    ro.observe(document.body);
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (raf) cancelAnimationFrame(raf);
  if (ro) ro.disconnect();
});
</script>
