<template>
  <div>
    <div class="chapter-head">
      <h1>{{ p.t }}</h1>
      <p class="sub">{{ p.sub }}</p>
      <div class="readall">规划中 · 共 {{ total }} 章 —— 先列大纲，讲义与画板按章补齐</div>
    </div>

    <template v-for="(g, gi) in p.groups" :key="gi">
      <h3 class="sec">{{ CN[gi] }} · {{ g.name }}<span class="prog">{{ g.items.length }} 章</span></h3>
      <div class="chapter-grid">
        <div v-for="(c, i) in g.items" :key="i" class="topic-card plan-card">
          <span class="tag">{{ g.pre }}{{ i + 1 }}</span>
          <h3 v-html="texMix(c.t)"></h3>
          <p v-html="texMix(c.d)"></p>
        </div>
      </div>
    </template>

    <div class="note good">上面只是章目：每一章将来配一页讲义和一台可拖动的板，开写一章就把该章挂上路由。初等部分的模块可以先去首页另一栏看。</div>
  </div>
</template>
<script setup>
// 高等数学九个模块共用的「大纲页」：数据全部来自 lib/higherplan.js，加章不用改本页。
// 卡片用 div 不用 router-link——章页还没建，点不动；虚线框的章号标签与已上线的实线标签区分。
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { higherOf, chapterCount } from '../../lib/higherplan.js';
import { texMix } from '../../lib/board.js';

const route = useRoute();
const p = computed(() => higherOf(route.path.split('/')[1]) || { t: '高等数学', sub: '这一模块还没有登记大纲。', groups: [] });
const total = computed(() => chapterCount(p.value));
const CN = ['一', '二', '三', '四', '五', '六'];
</script>
<style scoped>
.plan-card { cursor: default; }
.plan-card:hover { transform: none; border-color: var(--line); }
.plan-card .tag { color: var(--orange); border-style: dashed; }
.note.good { margin-top: 26px; }
</style>
