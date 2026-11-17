<template>
  <ChPage :cur="4" no="C4" base="/functions/c" :chapters="C_CHAPTERS"
    title="分段函数与表示法：一个函数，几段表达式" sub="分段函数是一个函数，不是一个函数群 —— 分段点的开闭与衔接，是它的全部要点。"
    :toc="[{ id: 'c4-def', t: '定义与三条要求' }, { id: 'c4-board', t: '三种形式（图 C4）' }, { id: 'c4-rep', t: '三种表示法' }, { id: 'c4-pit', t: '分段点的陷阱' }]">
    <div class="note good" id="c4-def"><strong>分段函数</strong>：在定义域的不同部分，用<strong>不同的解析式</strong>表示的<strong>同一个</strong>函数。整体定义域是各段区间的<strong>并集</strong>，值域是各段值域的并集；每个自变量取值时，按它落在哪一段选用对应法则。判断它仍是"一个函数"的标准没变 —— 还是 C1 那两条纪律：每个 x 都有像（各段不重不漏），且像唯一（任何 x 只属于一段）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createStepLadder" />
      <div class="cap">图 C4 · <b>分段函数</b>：三个预设展示分段函数的三种形式 —— ① 邮资：每 100g 跳一档的<strong>台阶</strong>（分段点跳变，左段实心、右段空心）；② 个税：累进税率的<strong>折线</strong>（分段点衔接连惯，但斜率 3% → 10% → 20% 突变）；③ |x−1|+2：解析式写出来的分段（绝对值展开，见 E8）。把 x 拖到分段点附近，徽章直接验明"跳变 +4 元"还是"左 = 右，连贯"。看点：实心点 / 空心点不是装饰 —— 它们在替区间开闭发声。</div>
    </div>

    <h3 class="sec" id="c4-rep">三种表示法</h3>
    <p>同一个邮资函数，可以用三种方式表示 —— 图 C4 的 ① 是图象法，紧凑解析法是 <Katex tex="y=4+4\lceil\tfrac{x}{100}\rceil\ (0&lt;x\le 500)" />（取上整记号课本不要求，写成分段更清楚），而列表法把每一行直接列出：</p>
    <table>
      <tr><th>重量 x (g)</th><td>(0, 100]</td><td>(100, 200]</td><td>(200, 300]</td><td>(300, 400]</td><td>(400, 500]</td></tr>
      <tr><th>邮资 y (元)</th><td>8</td><td>12</td><td>16</td><td>20</td><td>24</td></tr>
    </table>
    <p>列表法适合档位少、离散的应用背景；图象法一眼看出跳变与连贯；解析法精确到开闭。画图时，<strong>分段点必须画出实心点与空心点</strong> —— 漏画空心点等于把 x=100 的邮资写成两个值，单值性被破坏。个税的解析法则可以将"段内一次、斜率递增"描述为：</p>
    <Katex tex="y=\begin{cases}0.03x &amp; 0\le x\le 3000\\[2pt] 90+0.10(x-3000) &amp; 3000&lt;x\le 12000\\[2pt] 990+0.20(x-12000) &amp; 12000&lt;x\le 25000\end{cases}" display />

    <h3 class="sec" id="c4-pit">分段点的陷阱</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：开闭重复或遗漏。</strong>各段区间在分段点处必须恰好归一段 —— 邮资把 100 归第一段 (0,100]，第二段就得写成 (100,200]；若两段都闭，x=100 有两个像，不满足单值性；若两段都开，x=100 没有像，不满足完整性 —— 都是 C1 要求在分段处的体现。</li>
        <li><strong>提示二：求值不认段。</strong>求 f(f(x))、解分段方程都要先判断所属段：先判断外层括号里的值落在哪一段，套对应的式子算出结果，再对结果重新判断所属段。图 C4 里把 x 拖到 3000，徽章会显示"左 90 = 右 90" —— 连贯不等于可以随便跨界：x=3000 只属于第一段，y=90 只被计算一次。</li>
      </ul>
    </div>
    <p>回收与预告：绝对值函数 <Katex tex="y=|x-1|+2" />（图 C4 ③）是最短的解析式分段，E8 将把 |f(x)|、f(|x|) 整个家族按"翻折"展开；R1 找分段函数的零点必须逐段检查再并起来 —— 分段是"并集思维"的第一次实战；V1 的导数在分段点还要额外验左右斜率是否一致（③ 的尖点没有导数），这是分段函数在微积分侧的下场。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createStepLadder } from '../../../boards/functions/concept/stepladder.js';
import { C_CHAPTERS } from './cnav.js';
</script>
