<template>
  <Transition name="cdm">
    <div v-if="open" class="cd-mask" @click="close" />
  </Transition>
  <Transition :name="side === 'right' ? 'cdr' : 'cdl'">
    <aside v-if="open" class="cd-panel" :class="side" role="dialog" aria-label="章节目录">
      <div class="cd-head">
        <strong>章节目录</strong>
        <span class="cd-sum">已读 {{ readTotal }} / {{ total }}</span>
        <button class="cd-x" type="button" title="收起目录" @click="close">收起</button>
      </div>
      <div class="cd-list">
        <router-link v-for="m in MODULES" :key="m.slug" class="cd-card" :class="{ cur: m.slug === curSlug }"
          :style="{ '--c': m.color }" :to="'/' + m.slug" @click="close">
          <div class="cd-row">
            <span class="cd-name">{{ m.name }}</span>
            <span class="cd-frac">{{ readOf(m.slug) }}/{{ totalOf[m.slug] }}</span>
          </div>
          <p class="cd-desc">{{ m.desc }}</p>
          <div class="cd-bar"><i :style="{ width: pctOf(m.slug) + '%' }" /></div>
        </router-link>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
// 顶栏「章节目录」拉出的抽屉：每个模块一张圆角卡，标题 + 一句概述 + 阅读进度条。
// 章节总数由路由表现算，已读从 progress.js 的 READ 集合取（key 是 route.path）。
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import routes from '../router.js';
import { READ } from '../lib/progress.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  side: { type: String, default: 'left' },   // left | right —— 设置页里可换
});
const emit = defineEmits(['update:open']);
const route = useRoute();

const MODULES = [
  { slug: 'sets', name: '集合与常用逻辑', desc: '元素与三性、子集与交并补，量词和四种命题的推理', color: 'var(--blue)' },
  { slug: 'functions', name: '函数与微积分初步', desc: '定义域与性质、零点与基本初等函数、图象变换与导数积分', color: 'var(--green)' },
  { slug: 'inequalities', name: '不等式', desc: '作差比较、二次与绝对值不等式、基本不等式与线性规划', color: 'var(--orange)' },
  { slug: 'trig', name: '三角函数与三角形', desc: '弧度制与单位圆、恒等变换、图象性质与解三角形', color: 'var(--purple)' },
  { slug: 'vectors', name: '向量与复数', desc: '线性运算、数量积与向量积、空间向量，复数的三角形式', color: 'var(--cyan)' },
  { slug: 'sequences', name: '数列', desc: '通项与递推、等差等比、求和方法与数学归纳法', color: 'var(--pink)' },
  { slug: 'linecircle', name: '直线与圆', desc: '直线方程、圆与位置关系、圆幂定理与综合应用', color: 'var(--yellow)' },
  { slug: 'polar', name: '极坐标与参数方程', desc: '极坐标与互化、曲线的极坐标方程、参数方程与轨迹最值', color: 'var(--blue)' },
  { slug: 'conics', name: '圆锥曲线', desc: '定义与标准方程、光学性质与切线、仿射变换、直线与曲线', color: 'var(--green)' },
  { slug: 'solid', name: '立体几何', desc: '几何体及其度量、空间位置关系、坐标系与向量算法', color: 'var(--orange)' },
  { slug: 'combinatorics', name: '组合与二项式定理', desc: '计数原理、排列组合、二项式定理与组合恒等式', color: 'var(--purple)' },
  { slug: 'probability', name: '概率与统计', desc: '事件与条件概率、随机变量与数字特征、统计推断与检验', color: 'var(--cyan)' },
  { slug: 'numeric', name: '数值计算', desc: '误差与传播、方程求根、数据拟合与数值积分', color: 'var(--pink)' },
  { slug: 'linalg', name: '线性代数初步', desc: '行列式与矩阵、向量空间与线性方程组、特征值与二次型', color: 'var(--yellow)' },
  { slug: 'calc1', name: '一元函数微积分', desc: '极限与连续、导数与微分、不定积分与定积分，微分方程与无穷级数', color: 'var(--blue)' },
  { slug: 'spacegeom', name: '空间解析几何', desc: '空间向量与三积、平面与直线的方程、柱面锥面与二次曲面', color: 'var(--green)' },
  { slug: 'calc2', name: '多元函数微积分', desc: '多元函数的极限与微分、重积分与坐标变换、曲线曲面积分', color: 'var(--orange)' },
  { slug: 'complexvar', name: '复变函数', desc: '复数的几何表示、解析函数与柯西定理、级数展开与留数定理', color: 'var(--purple)' },
  { slug: 'numtheory', name: '初等数论', desc: '整除与欧几里得算法、同余与数论定理、二次剩余与应用', color: 'var(--cyan)' },
  { slug: 'topology', name: '拓扑学基础', desc: '开集与连续映射、连通与紧致、商空间与基本群', color: 'var(--pink)' },
  { slug: 'fractal', name: '分形几何', desc: '自相似与维数、典型分形、迭代函数系统与海岸线', color: 'var(--yellow)' },
  { slug: 'projgeom', name: '高等几何（射影几何）', desc: '齐次坐标与交比、配极与帕斯卡定理、变换群与几何', color: 'var(--blue)' },
  { slug: 'algebra', name: '抽象代数', desc: '群环域与同态、子群陪集与置换群、图论六章', color: 'var(--green)' },
];

// 只数「模块/章节」两段式的叶子路由，跳转与通配路由不计
const totalOf = {};
for (const m of MODULES) {
  totalOf[m.slug] = routes.filter(r => {
    const p = r.path || '';
    if (!p.startsWith('/' + m.slug + '/')) return false;
    const rest = p.slice(m.slug.length + 2);
    return rest && !rest.includes('/') && !rest.includes(':') && !rest.includes('*');
  }).length;
}
const total = MODULES.reduce((s, m) => s + totalOf[m.slug], 0);

const readOf = slug => [...READ.set].filter(p => p.startsWith('/' + slug + '/')).length;
const pctOf = slug => (totalOf[slug] ? Math.round(readOf(slug) / totalOf[slug] * 100) : 0);
const readTotal = computed(() => [...READ.set].filter(p => MODULES.some(m => p.startsWith('/' + m.slug + '/'))).length);
const curSlug = computed(() => (route.path || '').split('/')[1] || '');

function close() { emit('update:open', false); }
function onKey(e) { if (e.key === 'Escape' && props.open) close(); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.cd-mask { position: fixed; inset: 46px 0 0 0; z-index: 108; background: rgba(0, 0, 0, .22); }
.cd-panel {
  position: fixed; top: 46px; bottom: 0; z-index: 110;
  width: min(384px, 92vw); display: flex; flex-direction: column;
  background: var(--bg2); border: 1px solid var(--line);
  box-shadow: 18px 0 44px rgba(0, 0, 0, .26);
}
.cd-panel.left { left: 0; border-left: none; border-radius: 0 16px 16px 0; }
.cd-panel.right { right: 0; border-right: none; border-radius: 16px 0 0 16px; box-shadow: -18px 0 44px rgba(0, 0, 0, .26); }
/* 弹出动画：遮罩淡入，面板从所在一侧滑进来 */
.cdm-enter-active, .cdm-leave-active { transition: opacity .2s ease; }
.cdm-enter-from, .cdm-leave-to { opacity: 0; }
.cdl-enter-active, .cdl-leave-active, .cdr-enter-active, .cdr-leave-active {
  transition: transform .26s cubic-bezier(.2, .7, .25, 1), opacity .2s ease;
}
.cdl-enter-from, .cdl-leave-to { transform: translateX(-102%); opacity: .4; }
.cdr-enter-from, .cdr-leave-to { transform: translateX(102%); opacity: .4; }
@media (prefers-reduced-motion: reduce) {
  .cdm-enter-active, .cdm-leave-active,
  .cdl-enter-active, .cdl-leave-active, .cdr-enter-active, .cdr-leave-active { transition: none; }
}
.cd-head {
  flex: none; display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-bottom: 1px solid var(--line);
}
.cd-head strong { font-size: 14.5px; letter-spacing: .4px; }
.cd-sum { font-size: 12.5px; color: var(--mut); }
.cd-x {
  margin-left: auto; font: inherit; font-size: 12.5px; color: var(--mut);
  background: transparent; border: 1px solid var(--line); border-radius: 99px;
  padding: 3px 11px; cursor: pointer;
}
.cd-x:hover { color: var(--ink); border-color: var(--mut); }
.cd-list { flex: 1; min-height: 0; overflow-y: auto; padding: 10px 12px 18px; }
.cd-card {
  display: block; margin: 0 0 8px; padding: 10px 12px 9px; border-radius: 12px;
  border: 1px solid var(--line); background: var(--card); color: inherit; text-decoration: none;
  transition: border-color .16s ease, transform .16s ease;
}
.cd-card:hover { border-color: var(--c); transform: translateX(2px); }
.cd-card.cur { border-color: var(--c); }
.cd-row { display: flex; align-items: baseline; gap: 10px; }
.cd-name { font-size: 14px; color: var(--ink); }
.cd-card.cur .cd-name { color: var(--c); }
.cd-frac { margin-left: auto; font-size: 12px; color: var(--faint); font-variant-numeric: tabular-nums; }
.cd-desc { margin: 3px 0 7px; font-size: 12px; line-height: 1.6; color: var(--mut); }
.cd-bar { height: 5px; border-radius: 3px; background: var(--line); overflow: hidden; }
.cd-bar i { display: block; height: 100%; border-radius: 3px; background: var(--c); opacity: .45; }
@media print { .cd-mask, .cd-panel { display: none !important; } }
</style>
