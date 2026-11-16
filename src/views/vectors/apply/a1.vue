<template>
  <ChPage :cur="1" no="应1" base="/vectors/y" :chapters="VY_CHAPTERS"
    title="平面几何中的向量方法"
    sub="几何题的图形是静止的，向量的算式却可以逐项搬动。取两个不共线的向量作基底，把图上每条线段写成它们的倍数之和，平行、垂直、长度这三类条件就分别落成数乘关系、数量积为零与平方后的等式。"
    :toc="[{ id: 'a1-basis', t: '取基向量' }, { id: 'a1-mid', t: '中线与重心' }, { id: 'a1-para', t: '平行与垂直' }, { id: 'a1-pit', t: '等式、基底与方向' }]">
    <div class="note good">用向量解平面几何题，第一步是选一组<strong>基底</strong>：取两个不共线的向量 <Katex tex="\vec e_1" />、<Katex tex="\vec e_2" />，平面内任何一个向量都能写成 <Katex tex="\lambda_1\vec e_1+\lambda_2\vec e_2" />，而且系数唯一。常见做法是取三角形的两条边，或平行四边形的两条邻边。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGeometry" />
      <div class="cap">图 应1 · <b>三角形中线与重心</b>：以 <Katex tex="A" /> 为公共起点，记 <Katex tex="\overrightarrow{AB}=\vec a" />、<Katex tex="\overrightarrow{AC}=\vec b" />。金色虚线是 <Katex tex="BC" /> 边上的中线，紫、青两条是另外两条中线，红色点是三线交点 <Katex tex="G" />。看点：拖动 <Katex tex="B" />、<Katex tex="C" /> 改变三角形形状，三条中线始终交于一点，且 <Katex tex="AG:GM=2:1" /> 始终成立；④ 把三点拖成共线，中线重合，重心不再有意义。</div>
    </div>

    <h3 class="sec" id="a1-basis">取基向量</h3>
    <p>同一张图里的线段有各自的起点和终点，向量加法要求它们首尾相接，于是先给所有向量找同一个起点。<Katex tex="\triangle ABC" /> 中设</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{AB}=\vec a,\qquad \overrightarrow{AC}=\vec b," /></p>
    <p>则第三边由减法给出：<Katex tex="\overrightarrow{BC}=\overrightarrow{AC}-\overrightarrow{AB}=\vec b-\vec a" />。有了这一条，图上任何一个分点都能用 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 的倍数相加写出来，不必再画辅助线。</p>
    <p>取基底时唯一的要求是不共线。两个向量共线时，它们的倍数之和只能落在同一条直线上，表示不出平面里的其他方向；这也正是基1 的定理所强调的条件。</p>

    <h3 class="sec" id="a1-mid">中线与重心</h3>
    <p><Katex tex="BC" /> 的中点 <Katex tex="M" /> 满足 <Katex tex="\overrightarrow{AM}=\tfrac12(\vec a+\vec b)" />，这是中点公式：两个端点的向量相加再折半。把它代进图 应1，金色中线就是从 <Katex tex="A" /> 指向 <Katex tex="M" /> 的那一支。</p>
    <p>三条中线为什么交于一点？先猜出交点应当在 <Katex tex="\overrightarrow{AG}=\tfrac13(\vec a+\vec b)" /> 处，再验证它确实落在每一条中线上。<Katex tex="AC" /> 的中点记为 <Katex tex="N" />，则 <Katex tex="\overrightarrow{AN}=\tfrac12\vec b" />，从 <Katex tex="B" /> 出发的中线可以写成</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{BG}=\overrightarrow{AG}-\overrightarrow{AB}=\tfrac13(\vec a+\vec b)-\vec a=\tfrac13(\vec b-2\vec a)," /></p>
    <p>而 <Katex tex="\overrightarrow{BN}=\overrightarrow{AN}-\overrightarrow{AB}=\tfrac12\vec b-\vec a=\tfrac12(\vec b-2\vec a)=\tfrac32\overrightarrow{BG}" />。两者共线，说明 <Katex tex="G" /> 在 <Katex tex="BN" /> 上；对第三条中线同理。三线共点得证。</p>
    <p>比值也一并出来：<Katex tex="\overrightarrow{AM}=\tfrac12(\vec a+\vec b)" />，<Katex tex="\overrightarrow{AG}=\tfrac13(\vec a+\vec b)" />，所以 <Katex tex="\overrightarrow{AG}=\tfrac23\overrightarrow{AM}" />，即 <Katex tex="AG:GM=2:1" />。重心的坐标公式 <Katex tex="G=\tfrac{A+B+C}{3}" /> 就由这一条推广得到。</p>

    <h3 class="sec" id="a1-para">平行与垂直</h3>
    <p>几何里的三类条件在向量语言里各有一把钥匙：<strong>平行</strong>是存在实数 <Katex tex="\lambda" /> 使 <Katex tex="\vec u=\lambda\vec v" />；<strong>垂直</strong>是 <Katex tex="\vec u\cdot\vec v=0" />；<strong>长度</strong>平方后化成数量积，<Katex tex="|\vec u|^2=\vec u\cdot\vec u" />。证明题只要把待证的结论翻译成这三句中的一句，再代入基底展开。</p>
    <p>以中位线定理为例。<Katex tex="AB" />、<Katex tex="AC" /> 的中点分别是 <Katex tex="P" />、<Katex tex="Q" />，则 <Katex tex="\overrightarrow{AP}=\tfrac12\vec a" />，<Katex tex="\overrightarrow{AQ}=\tfrac12\vec b" />，于是</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{PQ}=\tfrac12\vec b-\tfrac12\vec a=\tfrac12(\vec b-\vec a)=\tfrac12\overrightarrow{BC}." /></p>
    <p>一个等式同时给出两条结论：系数 <Katex tex="\tfrac12" /> 说明平行，模再取绝对值说明长度是一半。用向量写证明的好处就在这里，平行与长度不必分开处理，一次展开全部落在同一个等式的系数里。</p>

    <h3 class="sec" id="a1-pit">等式、基底与方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：向量等式不能直接取模。</strong>由 <Katex tex="\vec u=\vec v" /> 可以推出 <Katex tex="|\vec u|=|\vec v|" />，反过来不成立——模相等的两个向量方向可以完全不同。遇到只给长度的条件，要先平方成数量积再展开，不能把长度当向量直接加减。</li>
        <li><strong>提示二：基底必须不共线。</strong>随手取两条平行边作基底，系数就不再唯一，后面的方程解出来也没有意义。图 应1 的 ④ 档把 <Katex tex="A" />、<Katex tex="B" />、<Katex tex="C" /> 拖成共线，<Katex tex="\vec a" /> 与 <Katex tex="\vec b" /> 退化成同一条直线上的向量，整个基底失效。</li>
        <li><strong>提示三：起点终点的顺序不能反。</strong><Katex tex="\overrightarrow{AB}=-\overrightarrow{BA}" />，把 <Katex tex="\overrightarrow{BC}" /> 写成 <Katex tex="\vec a+\vec b" /> 是最常见的符号错。写之前先在心里走一遍「从谁出发、到谁为止」，再决定用加法还是减法。</li>
        <li><strong>提示四：系数是相对于某组基底而言的。</strong>同一个点换一组基底，系数会变，但点的位置不变。写解答时先交代「设 <Katex tex="\overrightarrow{AB}=\vec a" />，<Katex tex="\overrightarrow{AC}=\vec b" />」，后面所有 <Katex tex="\lambda" />、<Katex tex="\mu" /> 才有确定的含义。</li>
      </ul>
    </div>
    <p>回收与预告：基1 给出基底的存在与唯一，基2、基3 把这一点运算搬到坐标里，积1 至积3 补上长度与夹角。这一页把这些工具合起来用在几何图上：设基底、写分点、比系数。应2 转向物理，力的合成与分解、速度的叠加、功的计算，用的是同一套向量加法与数量积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGeometry } from '../../../boards/vectors/apply/geometrylab.js';
import { VY_CHAPTERS } from './vynav.js';
</script>
