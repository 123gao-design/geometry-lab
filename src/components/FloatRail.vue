<template>
  <div class="float-rail" aria-label="快捷按钮">
    <button v-if="canBack" class="fr-btn back" type="button" title="返回上一页" aria-label="返回上一页" @click="goBack">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H6.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M11.2 6.6 5.8 12l5.4 5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <router-link v-if="!isHome" to="/" class="fr-btn" title="回到首页" aria-label="回到首页">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.6 12 4l8 6.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.4 9.6V19h11.2V9.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </router-link>
    <button v-show="showTop" class="fr-btn" type="button" title="回到顶部" aria-label="回到顶部" @click="toTop">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M6.4 11.4 12 5.8l5.6 5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <router-link v-if="!isGames" to="/games" class="fr-btn games" title="数字游戏" aria-label="数字游戏">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
        <circle cx="9" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/>
      </svg>
    </router-link>
    <button v-if="showNotes" class="fr-btn notes" :class="{ on: notesOpen }" type="button"
      :title="notesOpen ? '收起笔记' : '在这一页记笔记'" aria-label="随页笔记" @click="$emit('update:notesOpen', !notesOpen)">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.8h8.2L18 7.6V20H6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M14 3.8V8h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M8.8 12h6.4M8.8 15.2h4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="fr-btn chat" :class="{ on: chatOpen }" type="button"
      :title="chatOpen ? '收起助手' : '和助手聊聊这道题'" aria-label="AI 助手" @click="$emit('update:chatOpen', !chatOpen)">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.2 11.4c0-3.5 3.5-6.3 7.8-6.3s7.8 2.8 7.8 6.3-3.5 6.3-7.8 6.3c-.9 0-1.8-.1-2.6-.35L5.6 19.2l.7-3.1c-1.3-1.1-2.1-2.6-2.1-4.7Z"
          fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="9.2" cy="11.5" r="1" fill="currentColor"/><circle cx="12" cy="11.5" r="1" fill="currentColor"/><circle cx="14.8" cy="11.5" r="1" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
// 左侧竖排圆按钮：返回上一页 / 回首页 / 回顶部 / 数字游戏 / 随页笔记 / 助手。
// 「返回上一页」只在站内确实有上一页出现（读 vue-router 写进 history.state 的 back），
// 直接打开链接或从站外进来时不显示，免得按一下跳出本站；首页上不显示「回首页」，
// 游戏页上不显示「数字游戏」，页面在顶部时不显示「回顶部」。
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineProps({
  chatOpen: { type: Boolean, default: false },
  notesOpen: { type: Boolean, default: false },
});
defineEmits(['update:chatOpen', 'update:notesOpen']);

const route = useRoute();
const router = useRouter();
const isHome = computed(() => route.path === '/');
const isGames = computed(() => route.path.startsWith('/games'));
// 随页笔记只挂在具体章节页上：首页和笔记页本身不显示这枚按钮
const showNotes = computed(() => route.path !== '/' && route.path !== '/notes');

const showTop = ref(false);
const onScroll = () => { showTop.value = window.scrollY > 320; };
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// 上一页：vue-router 每次导航都把上一页的完整路径写进 history.state.back（站点打开的第一页是 null）。
// 只认这个值——它一定是站内路径，按下去不会把用户带出站点。
const canBack = ref(false);
const syncBack = () => {
  try {
    const st = window.history.state;
    canBack.value = !!(st && typeof st.back === 'string' && st.back);
  } catch (_) { canBack.value = false; }
};
const goBack = () => {
  if (canBack.value) router.back();
  else router.push('/');
};
watch(() => route.fullPath, syncBack);

onMounted(() => { onScroll(); syncBack(); window.addEventListener('scroll', onScroll, { passive: true }); });
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.float-rail {
  position: fixed; left: 16px; bottom: 96px; z-index: 94;
  display: flex; flex-direction: column; gap: 10px;
}
.fr-btn {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--mut); background: color-mix(in srgb, var(--card) 82%, transparent);
  border: 1px solid var(--line); backdrop-filter: blur(8px); cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .18);
  transition: transform .16s ease, color .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease;
  text-decoration: none;
}
.fr-btn svg { width: 21px; height: 21px; }
.fr-btn:hover { color: var(--ink); border-color: var(--mut); transform: translateY(-2px); box-shadow: 0 10px 22px rgba(0, 0, 0, .24); }
.fr-btn.chat { color: var(--blue); border-color: color-mix(in srgb, var(--blue) 40%, transparent); }
.fr-btn.chat:hover { color: #fff; background: var(--blue); border-color: var(--blue); }
.fr-btn.chat.on { color: #fff; background: var(--blue); border-color: var(--blue); }
.fr-btn.games { color: var(--purple); border-color: color-mix(in srgb, var(--purple) 40%, transparent); }
.fr-btn.games:hover { color: #fff; background: var(--purple); border-color: var(--purple); }
.fr-btn.notes { color: var(--green); border-color: color-mix(in srgb, var(--green) 40%, transparent); }
.fr-btn.notes:hover, .fr-btn.notes.on { color: #fff; background: var(--green); border-color: var(--green); }
@media print { .float-rail { display: none !important; } }
@media (max-width: 900px) {
  .float-rail { left: 10px; bottom: 74px; gap: 8px; }
  .fr-btn { width: 40px; height: 40px; }
}
</style>
