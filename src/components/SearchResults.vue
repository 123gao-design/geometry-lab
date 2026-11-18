<template>
  <div class="sr">
    <div v-if="!q.trim()" class="sp-tip">
      <span class="sp-lb">常用</span>
      <router-link v-for="s in SUGGEST" :key="s.to" :to="s.to" class="sp-chip" @click="$emit('pick', s.to)">{{ s.t }}</router-link>
      <span class="sp-say">Ctrl K 随时呼出</span>
    </div>

    <div v-else-if="loading" class="sp-empty">正在装载索引…</div>
    <div v-else-if="!hits.length" class="sp-empty">没找到「{{ q }}」，换个说法试试——章节名、定理名、结论里的一句话都行</div>
    <ul v-else class="sp-list">
      <li v-for="(it, i) in hits" :key="it.to + '#' + i">
        <router-link :to="it.to" class="sp-row" :class="{ on: i === cur }"
          @click="$emit('pick', it.to)" @mouseenter="$emit('hover', i)">
          <span class="sp-k">{{ it.k }}</span>
          <span class="sp-main">
            <span class="sp-t">{{ it.t }}</span>
            <span v-if="it.d" class="sp-d">{{ it.d }}</span>
            <span v-else-if="it.s" class="sp-s">{{ it.s }}</span>
          </span>
          <span v-if="it.tag" class="sp-tag">{{ it.tag }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
// 搜索结果的公共一块：顶栏展开的结果浮层与弹窗模式的对话框共用（布局差别只在外壳，列表本身一模一样）
defineProps({
  q: { type: String, default: '' },
  hits: { type: Array, default: () => [] },
  cur: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
});
defineEmits(['pick', 'hover']);

const SUGGEST = [
  { t: '定理速查', to: '/cheatsheet' },
  { t: '自由画板', to: '/playground' },
  { t: '笔记', to: '/notes' },
  { t: '使用说明', to: '/guide' },
  { t: '设置', to: '/settings' },
];
</script>

<style scoped>
.sr { display: flex; flex-direction: column; min-height: 0; }
.sp-tip { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 14px; }
.sp-lb { font-size: 12px; color: var(--mut); }
.sp-chip {
  padding: 5px 11px; border: 1px solid var(--line); border-radius: 99px; background: none;
  color: var(--mut); font: inherit; font-size: 12.5px; cursor: pointer; text-decoration: none;
}
.sp-chip:hover { color: var(--blue); border-color: color-mix(in srgb, var(--blue) 50%, transparent); }
.sp-say { margin-left: auto; font-size: 12px; color: var(--mut); opacity: .8; }
.sp-empty { padding: 22px 16px 26px; font-size: 13.5px; color: var(--mut); text-align: center; }
.sp-list { margin: 0; padding: 6px; list-style: none; overflow-y: auto; min-height: 0; }
.sp-row {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px;
  color: var(--ink); text-decoration: none;
}
.sp-row.on { background: color-mix(in srgb, var(--blue) 13%, transparent); }
.sp-k {
  flex: none; width: 52px; text-align: center; padding: 2px 0; border-radius: 6px;
  font-size: 11px; color: var(--mut); border: 1px solid var(--line);
}
.sp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.sp-t { font-size: 14px; }
.sp-d, .sp-s {
  font-size: 12px; color: var(--mut);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sp-tag { flex: none; font-size: 11px; color: var(--blue); opacity: .85; }
</style>
