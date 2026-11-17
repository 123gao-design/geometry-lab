<template>
  <ChPage :cur="3" no="Z3" base="/trig/z" :chapters="Z_CHAPTERS"
    title="面积与范围：半底乘高的三角函数写法" sub="$S=\tfrac12 ab\sin\gamma$ —— 夹角把高写成 $a\sin\gamma$；范围问题一律「先定圆、再滑动」：同弦同角的家族里，面积与周长都在等腰处达到最大。"
    :toc="[{ id: 'z3-area', t: '面积公式：夹角写法' }, { id: 'z3-hump', t: '上界：$\\sin\\gamma\\le1$' }, { id: 'z3-race', t: '同弦同角对比：范围' }, { id: 'z3-alt', t: '变形与等价公式' }, { id: 'z3-pit', t: '等号条件与开闭' }]">
    <div class="note good" id="z3-def"><strong>三角形面积</strong>：<Katex tex="S=\frac12 ab\sin\gamma" />，也就是「底 × 高 ÷ 2」的夹角写法。已知两边及其夹角（SAS），面积一步到位；范围问题的关键是 <Katex tex="\sin\gamma\le1" /> 与「同弦同角先定圆」。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 Z3 · <b>三角形面积的取值范围</b>：<strong>模式一 · 夹角扫掠</strong> —— 底 b 平放、杆 a 绕 C 扫角 <Katex tex="\gamma"/>，高 <Katex tex="h=a\sin\gamma" /> 现场记录，右栏画出 <Katex tex="S(\gamma)"/> 的半周期驼峰，<Katex tex="\gamma=90^\circ"/> 达到最大；<strong>模式二 · 同弦同角对比</strong> —— 固定弦 a 与圆周角 <Katex tex="\alpha"/>，外接圆唯一确定（Z1 的结论），A 沿大弧滑动，S 与 <Katex tex="b+c"/> 两条读数<strong>同时在等腰 <Katex tex="b=c"/> 处达到最大</strong>，右栏双峰同顶曲线实时核验。</div>
    </div>

    <h3 class="sec" id="z3-area">面积公式：夹角写法</h3>
    <p>底乘高是基础公式，高在这里由夹角读数：从 B 向 CA 作垂线，高 <Katex tex="h=a\sin\gamma" />（Z2 竖直分量原样回收），于是 <Katex tex="S=\frac12 b\cdot a\sin\gamma" />。SAS 型面积题不必先解边：两邻边一夹角齐了即可直接求面积。反过来，面积已知也能倒推夹角（SSS + S 走 <Katex tex="\sin\gamma=\frac{2S}{ab}" />，两解互补按 Z1 的规则验证）。</p>

    <h3 class="sec" id="z3-hump">上界：<Katex tex="\sin\gamma\le1"/></h3>
    <p>固定 a、b 拖 γ，S 的曲线是半周期正弦驼峰：<Katex tex="\gamma\to0"/> 或 <Katex tex="\gamma\to\pi"/> 时三角形被压扁、<Katex tex="S\to0"/>（取不到 0），<Katex tex="\gamma=90^\circ"/> 时 <Katex tex="\sin\gamma=1" /> 达到最大，<Katex tex="S\le\frac12 ab" />。<strong>等号条件</strong>比结论本身更重要：均值链 <Katex tex="\sin\gamma\le1" /> 的等号只在 <Katex tex="\gamma=90^\circ"/> 决定。右栏驼峰把这句话画成了「单峰、峰在正中」的形状 —— <Katex tex="\gamma"/> 与 <Katex tex="\pi-\gamma"/> 同高，这也是 Z1 两解互补的又一次现身。</p>

    <h3 class="sec" id="z3-race">同弦同角对比：范围</h3>
    <p>经典题型：已知 a 与对角 α，求 <Katex tex="b+c" /> 与 S 的范围。关键是「先定圆」：<Katex tex="R=\frac{a}{2\sin\alpha}" />（Z1 对照表）把外接圆唯一确定，B、C 沉在弦上，A 沿大弧滑动 —— 家族里每个三角形都同弦同角。此时两个最大值一次读出：</p>
    <div class="display"><Katex tex="b+c=2R(\sin\beta+\sin\gamma)=4R\cos\tfrac\alpha2\cos\tfrac{\beta-\gamma}2\le4R\cos\tfrac\alpha2" display /></div>
    <p>中间一步正是 Q1 和差化积的原文回放（<Katex tex="\sin\beta+\sin\gamma=2\sin\tfrac{\beta+\gamma}2\cos\tfrac{\beta-\gamma}2" />），而 <Katex tex="\beta+\gamma=\pi-\alpha" /> 把 <Katex tex="\sin\tfrac{\beta+\gamma}2" /> 写成 <Katex tex="\cos\tfrac\alpha2" />；等号在 β=γ（等腰）成立。面积同法：<Katex tex="S=\frac12bc\sin\alpha\le R^2\sin\alpha(1+\cos\alpha)" />，等号也在等腰 —— 板上两条归一曲线<strong>双峰同顶</strong>，把「面积与周长在等腰处一起达到最大」一目了然。</p>

    <h3 class="sec" id="z3-alt">变形与等价公式</h3>
    <table>
      <tr><td>已知</td><td>公式</td><td>出处在哪章</td></tr>
      <tr><td>两边夹角</td><td><Katex tex="S=\frac12 ab\sin\gamma" /></td><td>本讲</td></tr>
      <tr><td>三边（海伦式）</td><td><Katex tex="S=\frac14\sqrt{(a+b+c)(-a+b+c)(a-b+c)(a+b-c)}" /></td><td>Z2 反演 + 配方</td></tr>
      <tr><td>三边 + 外接圆</td><td><Katex tex="S=\frac{abc}{4R}" /></td><td>Z1 的 2R 换入 <Katex tex="\sin\alpha=\frac{a}{2R}" /></td></tr>
      <tr><td>两边 + 一对角</td><td><Katex tex="S=\frac{a^2\sin\beta\sin\gamma}{2\sin\alpha}" /></td><td>正弦定理全换代入</td></tr>
    </table>
    <p>四条公式同出一源：都回到「底 <Katex tex="\times"/> 高 <Katex tex="\div"/> 2」，只是把不同的已知量翻译进来。考场上按「已知什么」选行，不要死记海伦 —— 它只是 Z2 反演的另一种形式。</p>

    <h3 class="sec" id="z3-pit">等号条件与开闭</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：结论有了、等号丢了。</strong>写 <Katex tex="S\le\frac12ab" /> 不注明「当且仅当 <Katex tex="\gamma=90^\circ"/>」、写 <Katex tex="b+c\le4R\cos\tfrac\alpha2" /> 不注明「当且仅当 <Katex tex="b=c"/>」—— 大题的关键得分在等号条件上。</li>
        <li><strong>提示二：开闭错判。</strong><Katex tex="\gamma\to0"/> 时 <Katex tex="S\to0"/> 但<strong>取不到 0</strong>（三角形退化时不成立），范围写 <Katex tex="(0,\ S_{max}]"/> 而非 <Katex tex="[0,\ S_{max}]"/>；同理 <Katex tex="b+c"/> 的下界也不是 <Katex tex="2a"/>（A 贴弧端时退化）。</li>
        <li><strong>提示三：钝角 <Katex tex="\alpha"/> 定错圆。</strong><Katex tex="\alpha>90^\circ"/> 时 A 在<strong>小弧</strong>上（圆周角定理：大弧对小角），「同弦同角」的滑动域要换侧。</li>
        <li><strong>提示四：均值与和差化积两证法的选择。</strong>用 <Katex tex="bc\le\left(\frac{b+c}2\right)^2" />（E7 均值）也能达到最大 S，但它的等号条件 <Katex tex="b=c"/> 与 <Katex tex="\cos\bigl((\beta-\gamma)/2\bigr)"/> 的等号 <Katex tex="\beta=\gamma"/> 是同一件事 —— 两种证法在同一点取得最大，卷面上写一种即可。</li>
      </ul>
    </div>
    <p>至此解三角形三大定理（正弦定理、余弦定理、面积与范围）全部列出。下一子专题把全模块收束：给值求角与三角方程、建模与最值 —— 弧度制、诱导公式、公式群与反三角在此汇合。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/solve/arealab.js';
import { Z_CHAPTERS } from './znav.js';
</script>
