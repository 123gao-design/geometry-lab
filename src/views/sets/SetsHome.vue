<template>
  <div>
    <div class="chapter-head">
      <h1>集合与常用逻辑</h1>
      <p class="sub">从「确定的对象汇成整体」出发：集合的语言（∈ 与描述法）、集合间的关系（⊆ 与 <Katex tex="2^n"/> 家族）、集合的运算（∩∪∁ 与德摩根）、常用逻辑（量词、命题与充要条件）四步走完，全部配可拖动的元素实验台 —— 集合与逻辑在「<Katex tex="A\subseteq B\iff p\Rightarrow q"/>」处合流。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 12 章</div>
    </div>

    <h3 class="sec">子专题一 · 集合的语言（元素与表示）<span class="prog">已读 {{ cnt(js, '/sets/j') }}/{{ js.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in js" :key="i" class="topic-card" :to="'/sets/j' + (i + 1)">
        <span class="tag">J{{ i + 1 }}</span><span v-if="isRead('/sets/j' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 集合间的关系<span class="prog">已读 {{ cnt(xs, '/sets/x') }}/{{ xs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in xs" :key="i" class="topic-card" :to="'/sets/x' + (i + 1)">
        <span class="tag">X{{ i + 1 }}</span><span v-if="isRead('/sets/x' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 集合的运算<span class="prog">已读 {{ cnt(ys, '/sets/y') }}/{{ ys.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ys" :key="i" class="topic-card" :to="'/sets/y' + (i + 1)">
        <span class="tag">Y{{ i + 1 }}</span><span v-if="isRead('/sets/y' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 常用逻辑（量词、命题与条件）<span class="prog">已读 {{ cnt(os, '/sets/o') }}/{{ os.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in os" :key="i" class="topic-card" :to="'/sets/o' + (i + 1)">
        <span class="tag">O{{ i + 1 }}</span><span v-if="isRead('/sets/o' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：集合与逻辑是全站的基础语言，在这里可以进一步加深 —— ① 德摩根律是逻辑变形的枢纽，<Katex tex="\complement_U(A\cup B)=\complement_UA\cap\complement_UB"/> 与 <Katex tex="\neg(p\vee q)=\neg p\wedge\neg q"/> 同构，之后的证明（反证、否定含量词的命题）都从这里起算；② 真值表（p→q 只在 p 真 q 假时为假）可以自行推广到「或、且、非」的复合命题，与 Y3 的集合运算互为表里；③ 量词与集合的对接：<Katex tex="\forall x\in A,\ p(x)\iff A\subseteq\{x:\ p(x)\}"/>，反例即“挖掉”补集里的元素，这在解不等式解集、函数定义域值域（C3）时会反复出现；④ 可进一步补充：容斥原理（<Katex tex="|A\cup B|=|A|+|B|-|A\cap B|"/>）、幂集与其基数 <Katex tex="2^n"/>、集合相等的第三种证法（同中求异）。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
import Katex from '../../components/Katex.vue';
const js = [
  { t: '元素与集合：∈ 与 ∉', d: '三性立规矩（确定、互异、无序），数系 ℕ⊂ℤ⊂ℚ⊂ℝ 逐层检验 —— 0 的归属、互异性参数题、22/7 与 π 的区分直接验证。' },
  { t: '集合的表示：列举、描述与图示', d: '描述法拆成「代表元 + 前置集合 + 条件」三部件，探针先过前置集合再验条件；端点判断准确、开闭直接可见。' },
];
const xs = [
  { t: '子集与真子集：⊆、⊊ 与 =', d: '判定只看元素：金圈压向蓝圈，元素全被罩住才 ⊆、找到一个反例就 ⊈；外延性双向验证 A=B，含参题先查空集。' },
  { t: '子集的个数：2ⁿ 家族', d: '每个元素「留/去」二选一，乘法原理清点 $2^n$；按元素个数分行恰是杨辉三角一行 —— 真子集、非空、非空真子集各减各的。' },
];
const ys = [
  { t: '交集与并集：∩ 与 ∪', d: '∧∨ 的集合实现：九个元素随手拖、区域着色实时重算；包含链、吸收律与差集不交换一次看全。' },
  { t: '补集与全集：∁ 与差集', d: '推一堵右墙看补集依赖全集：圈外元素从「不存在」到「纳入全集」；A∖B=A∩∁U B、双重否定回到本身。' },
  { t: '运算律：德摩根与分配', d: '左式按定义直译、右式按恒等式右端搭 —— 八元素逐个核验、同真同假；集合运算律与逻辑等价式同一张原图。' },
  { t: '数轴上的运算', d: '上轴摆区间拖把手、切端点开闭，下轴实时输出交并补 —— 断口只在两端都开时留下，取等检验落实到每个端点。' },
];
const os = [
  { t: '全称量词与存在量词：∀ 与 ∃', d: '量词把开句变成命题；真假判据不对称 —— 全称要真须证明一切、要假只须一个反例，存在要真只须一个见证。' },
  { t: '量词命题的否定：真假互补', d: '否定 = 量词翻转 + 结论取反，与原命题永远一真一假；只否结论量词不动，多数场合同真同假、起不到否定的作用。' },
  { t: '四种命题：互为逆否', d: '原、逆、否、逆否共享两个「唯一假组合」：原 $\\iff$ 逆否、逆 $\\iff$ 否，永远同真假；难证的原命题改证逆否。' },
  { t: '充分条件与必要条件', d: '真值集观点：$A\\subseteq B\\iff p\\Rightarrow q$，四类条件按包含关系对号；探针进 A∖B 即读出反例元素。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/sets/')).length;
</script>
