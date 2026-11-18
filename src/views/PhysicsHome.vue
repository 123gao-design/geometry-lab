<template>
  <SubjectTabs active="physics" />

  <div class="card hero" style="margin-top:26px">
    <div class="hero-row">
      <svg class="home-logo" viewBox="0 0 48 48" aria-hidden="true">
        <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff9e4a"/><stop offset="1" stop-color="#ffd166"/>
        </linearGradient></defs>
        <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#pg)"/>
        <ellipse cx="24" cy="24" rx="15" ry="6.2" fill="none" stroke="#fff" stroke-width="2" opacity=".9"/>
        <ellipse cx="24" cy="24" rx="15" ry="6.2" fill="none" stroke="#fff" stroke-width="2" opacity=".9"
                 transform="rotate(60 24 24)"/>
        <ellipse cx="24" cy="24" rx="15" ry="6.2" fill="none" stroke="#fff" stroke-width="2" opacity=".9"
                 transform="rotate(120 24 24)"/>
        <circle cx="24" cy="24" r="3" fill="#fff"/>
      </svg>
      <h1 style="margin:0;font-size:clamp(26px,4vw,36px)">可视化物理</h1>
    </div>
    <p class="sub">把课本里的概念与公式做成可以拖动、可以实时读数的画面 —— 每一章的每个式子，都能在演示里对上一个数。</p>
  </div>

  <h3 class="sec">课程部分<span class="prog">{{ onAll }} / {{ total }} 章已上线</span></h3>
  <div class="topic-grid home-grid">
    <router-link v-for="p in COURSE" :key="p.id" class="topic-card" :class="{ soon: onOf(p) === 0 }"
                 :to="partPath(p)">
      <span class="tag">{{ tagOf(p) }}</span>
      <h3>{{ secOf(p.t) }}</h3>
      <p>{{ p.intro }}</p>
      <span class="prog-box">已读 {{ readOf(p) }} / {{ p.chapters.length }}</span>
    </router-link>
  </div>

  <template v-if="LABS.length">
    <h3 class="sec">实验部分<span class="prog">{{ LABS.length }} 台可交互</span></h3>
    <div class="topic-grid home-grid">
      <router-link v-for="x in LABS" :key="x.ch.id" class="topic-card" :to="pathOf(x.ch)">
        <span class="tag">{{ x.exp.dim === '3d' ? '三维' : '二维' }}</span>
        <h3>{{ x.ch.t }}</h3>
        <p>{{ x.exp.blurb }}</p>
        <span class="prog-box">可交互</span>
      </router-link>
    </div>
  </template>

  <p class="note">
    课程部分点进去是这一部分的目录：先按组列出章，章里再分节讲概念、推公式，末尾配一台推导演示。
    讲义章的写法和数学模块一致 —— 先给现象与定义，再按课本的次序推公式，关键一步都用演示验一遍；
    演示里的滑块能拖，读数跟着物体走。带「已上线」的章可以直接点开，其余章陆续补齐。
    实验部分这六台是已经做好的交互实验：参数能拖，读数跟着物体走，画面可以缩放、平移、看受力；
    它们同时也收在课程目录的「演示实验」一部分里，路由与用法都没有变。
  </p>
</template>

<script setup>
import SubjectTabs from '../components/SubjectTabs.vue';
import { ORDERED_PARTS, partPath, pathOf } from '../physics/plan.js';
import { EXPERIMENTS } from '../physics/index.js';
import { isRead } from '../lib/progress.js';

// 分两栏：课程部分（七个部分，各自一页目录）与实验部分（现有六台交互实验）。
// 次序仍在 plan.js 的 ORDERED_PARTS，「演示实验」是它排在最后的那一部分。
const COURSE = ORDERED_PARTS.filter(p => p.id !== 'demo');
const DEMO = ORDERED_PARTS.find(p => p.id === 'demo');
const LABS = DEMO ? DEMO.chapters.map(ch => ({ ch, exp: EXPERIMENTS.find(e => e.id === ch.id) || {} })) : [];

// 「一　力学」→「一 · 力学」，与数学首页的分节标题同一个写法；没有编号的部分原样。
// 入参是标题串（模板里写 secOf(p.t)），别写成收整个 part 对象。
const secOf = t => String(t || '').replace(/^([一二三四五六七八九十]+)[\s　]+/, '$1 · ');

const onOf = p => p.chapters.filter(c => c.on).length;
const readOf = p => p.chapters.filter(c => c.on && isRead(pathOf(c))).length;
const onAll = COURSE.reduce((n, p) => n + onOf(p), 0);
const total = COURSE.reduce((n, p) => n + p.chapters.length, 0);

// 卡片标签：演示实验单独标；课程部分按上线进度写，全线上写「已上线」、一台没有写「规划中」
const tagOf = p => {
  if (p.id === 'demo') return '演示实验';
  const on = onOf(p);
  if (!on) return '规划中';
  return on === p.chapters.length ? '已上线' : `已上线 ${on} 章`;
};
</script>

<style scoped>
/* 还没开讲的课程部分：标签转橙，卡片照常可点（里面的目录先摆出来） */
.soon .tag { color: var(--orange); border-color: color-mix(in srgb, var(--orange) 40%, transparent); }

.note {
  margin: 30px 0 34px;
  padding: 14px 18px;
  border-radius: 14px;
  border-left: 3px solid var(--orange);
  background: color-mix(in srgb, var(--orange) 7%, transparent);
  font-size: 13.4px;
  line-height: 1.9;
  color: var(--mut);
}

@media (max-width: 720px) {
  .home-logo { width: 44px; height: 44px; }
}
</style>
