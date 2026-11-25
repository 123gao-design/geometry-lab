<template>
  <div class="pg">
    <div class="pg-bar">
      <div class="pg-group">
        <span class="pg-label">模式</span>
        <button v-for="m in modes" :key="m.id" class="btn" :class="{ on: mode === m.id }"
          @click="switchMode(m.id)">{{ m.nm }}</button>
      </div>
      <div class="pg-group">
        <span class="pg-label">示例</span>
        <button v-for="p in shown" :key="p.id" class="btn" :class="{ on: cur === p.id }"
          @click="apply(p)">{{ p.nm }}</button>
      </div>
      <button class="btn" @click="clearAll">清空</button>
      <span class="pg-sp" />
      <button v-if="incoming.length" class="btn" :class="{ on: showCmds }" @click="showCmds = !showCmds">
        章节带入 {{ incoming.length }} 条
      </button>
      <router-link class="btn pg-about" to="/playground/guide">说明</router-link>
      <router-link class="btn pg-about" to="/playground/about">关于</router-link>
    </div>

    <div class="pg-stage">
      <GeoGebraApp :key="mode + '-' + runId" ref="ggb" :app-name="appName" :commands="pending" fill
        :pane-ratio="0.2" @ready="onReady" />
      <div v-if="showCmds && incoming.length" class="pg-pop">
        <div class="pg-pop-head">
          <strong>来自章节的命令</strong>
          <button class="btn" @click="showCmds = false">收起</button>
        </div>
        <ol class="pg-cmds"><li v-for="(c, i) in incoming" :key="i"><code>{{ c }}</code></li></ol>
        <p class="pg-pop-tip">这些对象已经画在板上了，可以在代数栏里改参数、继续添加。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GeoGebraApp from '../components/GeoGebraApp.vue';

const route = useRoute();
const ggb = ref();
const mode = ref('graphing');
// 平面档用 classic（只开代数 + 图象两栏）：graphing 那一档指令集被裁过，
// Polygon、ApplyMatrix 这些都会报「未知的指令」，章节出口带过来的命令就跑不通
const appName = computed(() => (mode.value === '3d' ? '3d' : 'classic'));
const runId = ref(0);
const cur = ref('blank');
const incoming = ref([]);
const pending = ref([]);
const showCmds = ref(false);

const modes = [
  { id: 'graphing', nm: '平面' },
  { id: '3d', nm: '三维' },
];

const presets = [
  { id: 'blank', nm: '空白', mode: 'graphing', cmds: [] },
  {
    id: 'quad', nm: '二次函数', mode: 'graphing',
    cmds: ['a=1', 'b=-2', 'c=0.5', 'f(x)=a x^2+b x+c', 'A=(1,0)', 'f(A)'],
  },
  {
    id: 'conic', nm: '圆锥曲线', mode: 'graphing',
    cmds: ['a=2', 'b=0.8', 'c=1.2', 'eq1:a x^2+b x y+c y^2=1', 'eq2:x^2/4+y^2=1'],
  },
  {
    id: 'wave', nm: '三角函数', mode: 'graphing',
    cmds: ['A=1', 'w=2', 'p=0', 'f(x)=A sin(w x+p)', 'g(x)=cos(x)'],
  },
  {
    id: 'sphere', nm: '球与平面', mode: '3d',
    cmds: ['O=(0,0,0)', 's=Sphere(O,2)', 'pl:x+y+z=1'],
  },
  {
    id: 'vec3', nm: '空间向量', mode: '3d',
    cmds: ['u=(1,2,3)', 'v=(-1,1,0)', 'w=u+v', 's=u v'],
  },
];

const shown = computed(() => presets.filter(p => p.mode === mode.value));

function switchMode(id) {
  if (mode.value === id) return;
  mode.value = id;
  cur.value = 'blank';
  pending.value = [];
  incoming.value = [];
  showCmds.value = false;
  runId.value++;
}

function apply(p) {
  cur.value = p.id;
  incoming.value = [];
  showCmds.value = false;
  pending.value = p.cmds.slice();
  runId.value++;      // 换 key 重挂载，命令从干净状态重放
}

function clearAll() {
  cur.value = 'blank';
  incoming.value = [];
  pending.value = [];
  showCmds.value = false;
  ggb.value && ggb.value.reset && ggb.value.reset();
}

function onReady() {
  // 命令在组件内已重放，这里只留钩子给后续扩展
}

onMounted(() => {
  const q = route.query;
  if (q.mode === '3d') mode.value = '3d';
  if (typeof q.cmds === 'string' && q.cmds) {
    try {
      const list = JSON.parse(q.cmds);
      if (Array.isArray(list) && list.length) {
        incoming.value = list.filter(x => typeof x === 'string');
        pending.value = incoming.value.slice();
        cur.value = 'incoming';
      }
    } catch (e) { /* 参数坏了就退回空白板 */ }
  }
});
</script>

<style scoped>
/* 整页画板：破开 main 的居中宽度与左右内边距，高度顶到导航条下沿，页面本身不再滚动 */
.pg {
  width: 100vw; margin-left: calc(50% - 50vw);
  height: calc(100vh - 46px); height: calc(100dvh - 46px);
  display: flex; flex-direction: column;
  background: var(--bg);
}
.pg-bar {
  flex: none; display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; border-bottom: 1px solid var(--line);
  overflow-x: auto; scrollbar-width: none;
}
.pg-bar::-webkit-scrollbar { display: none; }
.pg-group { display: flex; align-items: center; gap: 6px; }
.pg-label { font-size: 12.5px; color: var(--mut); margin-right: 2px; white-space: nowrap; }
.pg-sp { flex: 1; }
.pg-about { text-decoration: none; }
.pg-stage { position: relative; flex: 1; min-height: 0; padding: 8px 10px 10px; }
.pg-pop {
  position: absolute; left: 10px; bottom: 10px; z-index: 5;
  width: min(520px, calc(100% - 20px)); max-height: 46%;
  overflow: auto; padding: 10px 14px;
  background: var(--card); border: 1px solid var(--line); border-radius: 10px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, .32);
}
.pg-pop-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pg-pop-head strong { font-size: 13.5px; }
.pg-cmds { margin: 6px 0 0; padding-left: 20px; line-height: 1.9; }
.pg-cmds code { font-family: var(--font-mono); font-size: 12.5px; color: var(--blue); }
.pg-pop-tip { font-size: 12.5px; color: var(--mut); margin: 6px 0 0; }

@media (max-width: 720px) {
  .pg-label { display: none; }
  .pg-bar { gap: 6px; padding: 6px 8px; }
}
@media print { .pg-bar { display: none; } .pg { height: auto; } }
</style>
