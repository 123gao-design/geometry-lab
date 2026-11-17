<template>
  <ChPage :cur="8" no="E8" base="/functions/e" :chapters="E_CHAPTERS"
    title="绝对值嵌套：三种折叠" sub="|f(x)| 沿 x 轴翻上（零点不变）、f(|x|) 沿 y 轴折拢（必偶）—— 两道折缝、三种嵌套，一台折叠机看清三种组合。"
    :toc="[{ id: 'e8-fold', t: '两道折缝（图 E8）' }, { id: 'e8-zeros', t: '零点核验：不变与翻倍' }, { id: 'e8-solve', t: '解绝对值方程与不等式' }]">
    <div class="note good" id="e8-fold"><strong>三种嵌套</strong>（原图 f）：<Katex tex="y=|f(x)|" /> —— x 轴下方部分翻上来，值域下界抬到 0；<Katex tex="y=f(|x|)" /> —— 右半图象原样、左半是右半关于 y 轴的<strong>镜像复制</strong>（必偶）；<Katex tex="y=|f(|x|)|" /> —— 先折拢再翻上，两道一起。分层口诀：<strong>里层的 |x| 管定义域（横向折叠），外层的 |·| 管值域（纵向翻折）</strong> —— 由内向外逐层剥。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFold" />
      <div class="cap">图 E8 · <b>|f(x)| 与 f(|x|) 的图象</b>：蓝线 = 原图，金线 = 变形过程中的像，金虚线 = 折缝（x 轴或 y 轴）。折叠滑块 t 从 0 拖到 1 看连续变形：|f| 把下方压平再翻上、f(|x|) 把左半先压向 y 轴再贴成镜像。预设 ③ 直线 x−1 是巧合现场：两种折法给出同一个 V。</div>
    </div>

    <h3 class="sec" id="e8-zeros">零点核验：不变与翻倍</h3>
    <p><strong><Katex tex="|f|" /> 的零点不多不少</strong>：<Katex tex="|f(x)|=0\iff f(x)=0" /> —— 翻折不产生新零点，也不消灭旧零点（变的是符号与值域：<Katex tex="|f|\ge 0" /> 恒成立）。<strong><Katex tex="f(|x|)" /> 的零点可能翻倍</strong>：右半的零点 <Katex tex="z" /> 会翻印出左半的 <Katex tex="-z" /> —— 原图 <Katex tex="x-1" /> 的零点 <Katex tex="\{1\}" /> 变成 {<Katex tex="|x|-1" /> 的} <Katex tex="\{-1,\ 1\}" />；但若原图本身偶（如 <Katex tex="x^2-2" />），<Katex tex="f(|x|)=f" />，零点完全不变。图 E8 的「零点核验」徽章把这两条结论记成实时读数。对称性同理：<Katex tex="f(|x|)" /> <strong>必偶</strong>（S5 的 y 轴对称随之成立），而 <Katex tex="|f|" /> 该对称才对称 —— 翻折不负责对称。</p>

    <h3 class="sec" id="e8-solve">解绝对值方程与不等式</h3>
    <p>代数上，绝对值本质是<strong>分段函数</strong>（C4 回收）：<Katex tex="|f|=\begin{cases}f, & f\ge 0\\ -f, & f&lt;0\end{cases}" />，<Katex tex="f(|x|)=\begin{cases}f(x), & x\ge 0\\ f(-x), & x&lt;0\end{cases}" /> —— 「按符号分段、逐段求解、并回验段条件」是标准流程。几何上则用图 E8 的折缝读答案：解 <Katex tex="|f(x)|&lt;g(x)" /> 型（g(x)&gt;0）等价于 <Katex tex="-g(x)&lt;f(x)&lt;g(x)" /> —— 上界 g 与下界 −g 两条曲线夹出的竖直带；数形结合时「带里取横坐标」比逐段开平方快得多。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：以为 <Katex tex="|f|" /> 会多出零点。</strong>不会 —— <Katex tex="|f|=0\iff f=0" />；多零点的是 <Katex tex="f(|x|)" />（图 E8 核验徽章为准）。</li>
        <li><strong>提示二：<Katex tex="f(|x|)" /> 当成 f 乘个绝对值。</strong>里层换的是<strong>输入</strong>：先算 <Katex tex="|x|" /> 再代入 f，图象层面是「右半覆盖左半」，不是值的翻折。</li>
        <li><strong>提示三：去绝对值不验段。</strong>分段解完后必须检查每段解落在该段的符号前提内 —— 增根都藏在这一步（R1 的定义域检验同样适用）。</li>
      </ul>
    </div>
    <p>回收与预告：C4 的分段函数是绝对值的代数本质；S3/S5 的奇偶与对称管 <Katex tex="f(|x|)" /> 的必偶；S4 的值域下界（<Katex tex="|f|\ge 0" />）也是已有结论。G 系列将把「沿 x 轴翻、沿 y 轴折」推广成一般图象变换（<Katex tex="y=-f" />、<Katex tex="y=f(-x)" /> 全族），E8 是它们的绝对值特例。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFold } from '../../../boards/functions/elementary/absfold.js';
import { E_CHAPTERS } from './enav.js';
</script>
