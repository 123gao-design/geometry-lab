<template>
  <ChPage :cur="4" no="C4" base="/functions/c" :chapters="C_CHAPTERS"
    title="分段函数与表示法：一个函数，几段表达式" sub="分段函数在不同区间使用不同表达式，分界点的归属由区间开闭决定。"
    :toc="[{ id: 'c4-def', t: '定义与三条要求' }, { id: 'c4-board', t: '三种形式（图 C4）' }, { id: 'c4-rep', t: '三种表示法' }, { id: 'c4-pit', t: '分段点的陷阱' }]">
    <div class="note good" id="c4-def"><strong>分段函数</strong>在定义域的不同部分使用不同表达式。定义域是各段区间的并集，值域是各段值域的并集。若两个表达式都适用于同一个分界点，它们必须给出相同的值。</div>

    <div class="board-wrap" id="c4-board">
      <BoardMount :factory="createStepLadder" />
      <div class="cap">图 C4 · <b>分段函数</b>。拖动探针，金色线段标出当前使用的规则。点「下一分界点」可精确比较端点：实心点表示取到，空心点表示这一段在这里不取值。</div>
    </div>

    <h3 class="sec" id="c4-rep">三种表示法</h3>
    <p>同一个邮资函数，可以用三种方式表示 —— 图 C4 的 ① 是图象法，紧凑解析法是 <Katex tex="y=4+4\lceil\tfrac{x}{100}\rceil\ (0&lt;x\le 500)" />（取上整记号课本不要求，写成分段更清楚），而列表法把每一行直接列出：</p>
    <table>
      <tr><th>重量 <Katex tex="x" />（g）</th><td><Katex tex="(0,100]" /></td><td><Katex tex="(100,200]" /></td><td><Katex tex="(200,300]" /></td><td><Katex tex="(300,400]" /></td><td><Katex tex="(400,500]" /></td></tr>
      <tr><th>邮资 <Katex tex="y" />（元）</th><td><Katex tex="8" /></td><td><Katex tex="12" /></td><td><Katex tex="16" /></td><td><Katex tex="20" /></td><td><Katex tex="24" /></td></tr>
    </table>
    <p>列表法适合档位少、离散的应用背景；图象法一眼看出跳变与连贯；解析法精确到开闭。画图时，<strong>分段点必须画出实心点与空心点</strong> —— 漏画空心点等于把 <Katex tex="x=100" /> 的邮资写成两个值，单值性被破坏。个税的解析法则可以将「段内一次、斜率递增」描述为：</p>
    <Katex tex="y=\begin{cases}0.03x &amp; 0\le x\le 3000\\[2pt] 90+0.10(x-3000) &amp; 3000&lt;x\le 12000\\[2pt] 990+0.20(x-12000) &amp; 12000&lt;x\le 25000\end{cases}" display />

    <h3 class="sec" id="c4-pit">分段点的陷阱</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：开闭重复或遗漏。</strong>各段区间在分段点处必须恰好归一段 —— 邮资把 <Katex tex="100" /> 归第一段 <Katex tex="(0,100]" />，第二段就得写成 <Katex tex="(100,200]" />；若两段都闭，<Katex tex="x=100" /> 有两个像，不满足单值性；若两段都开，<Katex tex="x=100" /> 没有像，不满足完整性 —— 都是 <RouterLink class="xref" to="/functions/c1">映射与函数：对应的纪律</RouterLink>的要求在分段处的体现。</li>
        <li><strong>提示二：求值不认段。</strong>求 <Katex tex="f(f(x))" />、解分段方程都要先判断所属段：先判断外层括号里的值落在哪一段，套对应的式子算出结果，再对结果重新判断所属段。图 C4 里把 <Katex tex="x" /> 拖到 <Katex tex="3000" />，两段在 <Katex tex="(3000,90)" /> 相接—— 连贯不等于可以随便跨界：<Katex tex="x=3000" /> 只属于第一段，<Katex tex="y=90" /> 只被计算一次。</li>
      </ul>
    </div>
    <p>回顾与预告：绝对值函数 <Katex tex="y=|x-1|+2" />（图 C4 ③）是最短的解析式分段，<RouterLink class="xref" to="/functions/e8">绝对值嵌套：三种折叠</RouterLink>将把 <Katex tex="|f(x)|" />、<Katex tex="f(|x|)" /> 整个家族按「翻折」展开；零点一组里找分段函数的零点必须逐段检查再并起来 —— 分段是「并集思维」的第一次实战；<RouterLink class="xref" to="/functions/v1">割线与切线：导数的诞生</RouterLink>的导数在分段点还要额外验左右斜率是否一致（③ 的尖点没有导数），这是分段函数在微积分一侧的情况。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createStepLadder } from '../../../boards/functions/concept/stepladder.js';
import { C_CHAPTERS } from './cnav.js';
</script>

<style src="./function-picker.css"></style>
