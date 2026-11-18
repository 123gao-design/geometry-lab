<template>
  <div v-if="p">
    <div class="chapter-head">
      <h1>{{ secOf(p.t) }}</h1>
      <p class="sub">{{ p.intro }}</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ p.chapters.length }} 章</div>
    </div>

    <template v-for="g in blocks" :key="g.t">
      <h3 v-if="blocks.length > 1" class="sec">
        {{ g.t }}<span class="prog">已读 {{ readOf(g) }} / {{ onOf(g) || g.chapters.length }}</span>
      </h3>
      <div class="chapter-grid" :class="{ solo: blocks.length === 1 }">
        <template v-for="c in g.chapters" :key="c.id">
          <router-link v-if="c.on" class="topic-card" :to="pathOf(c)">
            <span class="tag">{{ tagOf(c) }}</span><span v-if="isRead(pathOf(c))" class="tag done">✓</span>
            <h3>{{ c.t }}</h3>
            <p>{{ descOf(c) }}</p>
          </router-link>
          <span v-else class="topic-card dim">
            <span class="tag">规划中</span>
            <h3>{{ c.t }}</h3>
          </span>
        </template>
      </div>
    </template>

    <div class="pp-nav">
      <router-link to="/physics">← 全部部分</router-link>
      <router-link v-if="prev" :to="partPath(prev)">← {{ plain(prev.t) }}</router-link>
      <router-link v-if="next" class="pp-n" :to="partPath(next)">下一部分：{{ plain(next.t) }} →</router-link>
    </div>
  </div>

  <div v-else class="chapter-head">
    <h1>没有这个部分</h1>
    <p class="sub">目录里查不到这一段，回到<router-link to="/physics">可视化物理</router-link>从各部分进入。</p>
  </div>
</template>

<script setup>
// 部分页：物理首页 → 本页 → 章，与数学的「首页 → 模块主页 → 章」同一层。
// 组与章全部取自 plan.js（部分里的 groups / chapters），本页不另排次序。
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ORDERED_PARTS, partPath, partByRoute, pathOf, labelOf } from '../physics/plan.js';
import { EXPERIMENTS } from '../physics/index.js';
import { isRead } from '../lib/progress.js';

const route = useRoute();
const p = computed(() => partByRoute(route.path));

// 组与章一律取 part.chapters 里那一份（它带 group / part 引用，labelOf 要用）
const blocks = computed(() =>
  p.value ? p.value.groups.map(g => ({ t: g.t, chapters: p.value.chapters.filter(c => c.group === g) })) : []);

// 「一　力学」→「一 · 力学」（分节标题）与「力学」（翻页按钮里用）
const secOf = t => String(t || '').replace(/^([一二三四五六七八九十]+)[\s　]+/, '$1 · ');
const plain = t => String(t || '').replace(/^[一二三四五六七八九十]+[\s　]+/, '');

const onOf = g => g.chapters.filter(c => c.on).length;
const readOf = g => g.chapters.filter(c => c.on && isRead(pathOf(c))).length;
const readAll = computed(() => (p.value ? p.value.chapters.filter(c => c.on && isRead(pathOf(c))).length : 0));

// 实验章没有「力6」这样的章号，标签改标二维 / 三维；讲义章照旧读 labelOf
const expOf = c => EXPERIMENTS.find(e => e.id === c.id) || null;
const tagOf = c => (c.lab ? (expOf(c)?.dim === '3d' ? '三维' : '二维') : labelOf(c));
const descOf = c => (c.lab ? expOf(c)?.blurb || '' : c.d || '');

// 上一部分 / 下一部分按版面次序（课程部分在前、演示实验收在最后）
const idx = computed(() => (p.value ? ORDERED_PARTS.findIndex(x => x.id === p.value.id) : -1));
const prev = computed(() => (idx.value > 0 ? ORDERED_PARTS[idx.value - 1] : null));
const next = computed(() =>
  idx.value >= 0 && idx.value < ORDERED_PARTS.length - 1 ? ORDERED_PARTS[idx.value + 1] : null);
</script>

<style scoped>
/* 只有一组的 Part（演示实验）不铺组名，直接接卡片网格 */
.chapter-grid.solo { margin-top: 20px; }

.pp-nav {
  display: flex; flex-wrap: wrap; gap: 10px;
  margin: 26px 0 34px; padding-top: 16px;
  border-top: 1px dashed var(--line);
}
.pp-nav a {
  font-size: 13.5px; padding: 8px 16px; border-radius: 10px; text-decoration: none;
  color: var(--mut); border: 1px solid var(--line);
  transition: color .14s ease, border-color .14s ease, background .14s ease;
}
.pp-nav a:hover { color: var(--blue); border-color: var(--blue); background: color-mix(in srgb, var(--blue) 8%, transparent); }
.pp-nav .pp-n { margin-left: auto; }
</style>
