<template>
  <ChPage :cur="1" no="Z1" base="/trig/z" :chapters="Z_CHAPTERS"
    title="正弦定理：大边对大角，比值相等" sub="$a/\sin\alpha=b/\sin\beta=c/\sin\gamma=2R$ —— 每条边与它的对角之比都等于外接圆直径；SSA（边边角）到底几解，画一个圆、比一次垂距，直接判定。"
    :toc="[{ id: 'z1-law', t: '定理与外接圆直径' }, { id: 'z1-ssa', t: 'SSA 铰链：解的个数' }, { id: 'z1-two', t: '两解互补与同高改判' }, { id: 'z1-use', t: '应用：两边一对角' }, { id: 'z1-pit', t: '大边对大角先验数' }]">
    <div class="note good" id="z1-def"><strong>正弦定理</strong>：在任意 △ABC 中，<Katex tex="\frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}=2R" />（R 为外接圆半径）。每条边与它对角的正弦之比都是同一笔常数 —— 边越大、对角越大，但「边 : 对角正弦」这个比值全员恒等。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 Z1 · <b>SSA 铰链机</b>：已知底边 c、角 α 与对边 a —— 以 B 为圆心、a 为半径画紫圆，看它与角 A 的另一条边交出几个点：交几点、三角形就有几解。金色虚线是 B 到射线的垂距 <Katex tex="h=c\sin\alpha" />，a 与它比大小即定无解/一解/两解；右栏把 <Katex tex="a/\sin\alpha" />、<Katex tex="b/\sin\beta" />、<Katex tex="c/\sin\gamma" />、<Katex tex="2R" /> 画成对照表条 —— <strong>四条等高，就是正弦定理本身</strong>。</div>
    </div>

    <h3 class="sec" id="z1-law">定理与外接圆直径</h3>
    <p>正弦定理里的常数不是导出的：把 △ABC 放进外接圆（板上橙色虚圆），弦 BC 对圆心张出 a 的弧、对圆周上的 A 张出角 α，而 <Katex tex="a=2R\sin\alpha" /> 正是「弦长 = 直径 × 半弦角」—— W1 单位圆里 <Katex tex="\sin" /> 的定义（对边/斜边）在直径上放大一倍就是它。所以三个比值其实都在量同一根直径：比恒等、值就是 <Katex tex="2R" />。几何证法只须一条高：从 C 向 AB 作垂线，高在两个小直角三角形里分别读作 <Katex tex="b\sin\alpha" /> 与 <Katex tex="a\sin\beta" /> —— 同一条高、两笔读数，相除即得。</p>

    <h3 class="sec" id="z1-ssa">SSA 铰链：解的个数</h3>
    <table>
      <tr><td>对边 <Katex tex="a"/> 与 <Katex tex="h=c\sin\alpha"/>、<Katex tex="c"/> 的关系</td><td>解的个数</td><td>现场看点</td></tr>
      <tr><td><Katex tex="a<c\sin\alpha" /></td><td>0 解</td><td>紫圆与射线不相交</td></tr>
      <tr><td><Katex tex="a=c\sin\alpha" /></td><td>1 解</td><td>相切 → 直角三角形</td></tr>
      <tr><td><Katex tex="c\sin\alpha<a<c" /> 且 <Katex tex="\alpha"/> 锐角</td><td><strong>2 解</strong></td><td>近解 <Katex tex="C_1"/> 金、远解 <Katex tex="C_2"/> 橙</td></tr>
      <tr><td><Katex tex="a\ge c" />（或 α 钝角）</td><td>1 解</td><td>圆只交射线一次</td></tr>
    </table>
    <p>SSS、SAS、ASA 都唯一确定三角形（全等的保证），唯独 SSA 要现场数交点 —— 板上四个预设按钮把四种状态各演一遍。「大边对大角」是第一道验数关：若 a 是最长边而 α 不是最大角，或对角对应矛盾，直接判无解，不必动手画圆。</p>

    <h3 class="sec" id="z1-two">两解互补与同高改判</h3>
    <p>两解的根源是 <Katex tex="\sin\gamma_1=\sin\gamma_2" /> 而两个 <Katex tex="\gamma"/> 都合法 —— 这正是 H2 折叠机中已见过的情形：正弦同高、窗外改判 <Katex tex="\gamma_2=\pi-\gamma_1" />。板上「两解互补」徽章实时验 <Katex tex="\gamma_1+\gamma_2=180^\circ" />。几何上看，<Katex tex="C_1"/> 与 <Katex tex="C_2"/> 同在射线上且同距 B —— 到 B 等距的点是同一根弦上的对称点，两个三角形拼成一个等腰梯形，底角自然互补。</p>

    <h3 class="sec" id="z1-use">应用：两边一对角</h3>
    <p>解三角形流程定式：已知「边 + 对角」先走正弦定理。例如 <Katex tex="a=4.5,\ \alpha=40^\circ,\ c=6" />（板预设②）：由 <Katex tex="\sin\gamma=\frac{c\sin\alpha}{a}" /> 得 <Katex tex="\gamma_1\approx59^\circ"/>、<Katex tex="\gamma_2\approx121^\circ"/>，两解各回代 <Katex tex="\beta=\pi-\alpha-\gamma" /> 再用正弦定理收 b —— 右栏对照表条把两解的 <Katex tex="b/\sin\beta"/>、<Katex tex="c/\sin\gamma"/> 全部记齐，任何一解都过同一根 <Katex tex="2R"/>。</p>

    <h3 class="sec" id="z1-pit">大边对大角先验数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：SSA 忘数解。</strong>算出 <Katex tex="\sin\gamma" /> 后直接写 <Katex tex="\gamma=\arcsin" /> 就结束 —— 等腰改判 <Katex tex="\pi-\gamma" /> 常被漏（两解漏一解是 SSA 最高频扣分点）。</li>
        <li><strong>提示二：不验无解。</strong><Katex tex="\sin\gamma>1" /> 说明 a 太短、圆与射线不相交，不能直接用 arcsin（H1 的超出范围在这里复发）。</li>
        <li><strong>提示三：钝角取值。</strong>α 是钝角时 <Katex tex="t_-=c\cos\alpha-\sqrt{a^2-h^2}<0" />，圆只交一次 —— 「钝 SSA 必一解」。</li>
        <li><strong>提示四：比值常数别混用。</strong>正弦定理的对照表只认「边 : <strong>对角</strong>正弦」，边配邻角就会用错。</li>
      </ul>
    </div>
    <p>正弦定理管「边 : 对角」的比值关系；真正解三角形大题的主要工具是下一讲的余弦定理 —— M1 弦长两式机里的「余弦定理表达式」，现在正式推导。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/solve/ssalab.js';
import { Z_CHAPTERS } from './znav.js';
</script>
