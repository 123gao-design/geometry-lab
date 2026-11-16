<template>
  <ChPage :cur="2" no="A2" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="从垂径定理到点差法" sub="圆的「平行弦中点共垂线」压扁后变成椭圆的「平行弦中点共轭直径」—— 代数上就是点差法，几何上正是 D5 的第三定义。"
    :toc="[{ id: 'a2-lab', t: '平行弦中点机（图 A2）' }, { id: 'a2-der', t: '点差法 · 两行推导' }, { id: 'a2-aff', t: '仿射解读：垂径定理的遗言' }, { id: 'a2-app', t: '实战与一个易错点' }]">
    <div class="note good"><strong>圆的垂径定理</strong>：一族平行弦的中点，全都落在一条过圆心、且与弦垂直的直径上（圆心与弦中点的连线垂直于弦）。椭圆没有"垂直"了 —— 但实验会告诉你，"中点共线、斜率乘积定值"这部分原封不动地活着。</div>

    <h3 class="sec" id="a2-lab">平行弦中点机</h3>
    <div class="board-wrap">
      <BoardMount :factory="createChordMid" />
      <div class="cap">图 A2 · <b>平行弦中点机</b>：红色是椭圆的一族平行弦（转 α 滑块换方向），金色中点严格排成一条过中心的直线 —— 共轭直径。虚线圆是"压扁前"的对照：那里中点直径与弦垂直（灰色的直角标记），压扁后只剩斜率乘积 <Katex tex="k_{\text{弦}}\cdot k_{\text{径}}=-\tfrac{b^2}{a^2}" />。「扫描一条弦」看中点沿直径爬行。</div>
    </div>
    <p>读数区是本讲的心脏：圆的世界里乘积恒为 −1（垂直），压扁后恒为 <Katex tex="-\tfrac{b^2}{a^2}" /> —— 与 D5 第三定义里的数一模一样。这不是巧合，是同一条定理。</p>

    <h3 class="sec" id="a2-der">点差法：两行推导</h3>
    <p>设弦两端 <Katex tex="P_1(x_1,y_1),\ P_2(x_2,y_2)" /> 都在椭圆上，中点 <Katex tex="M(x_0,y_0)" />。两点各自满足方程，<strong>相减</strong>：</p>
    <Katex tex="\frac{x_1^2-x_2^2}{a^2}+\frac{y_1^2-y_2^2}{b^2}=0\ \Longrightarrow\ \frac{(x_1+x_2)(x_1-x_2)}{a^2}=-\frac{(y_1+y_2)(y_1-y_2)}{b^2}" display />
    <p>用 <Katex tex="x_1+x_2=2x_0,\ y_1+y_2=2y_0" />（中点的定义）整理：</p>
    <Katex tex="\underbrace{\frac{y_1-y_2}{x_1-x_2}}_{k_{\text{弦}}}\cdot\underbrace{\frac{y_0}{x_0}}_{k_{OM}}=-\frac{b^2}{a^2}" display />
    <p>"平方相减"—— 所以叫点差法。它一炮给出三个考题模板：</p>
    <ul>
      <li><strong>知弦求中点轨迹</strong>：斜率 k 固定时，中点满足 <Katex tex="y_0=-\tfrac{b^2}{a^2k}x_0" /> —— 一条过中心的直线（共轭直径的方向）；</li>
      <li><strong>知中点求弦斜率</strong>：<Katex tex="k=-\tfrac{b^2x_0}{a^2y_0}" />（与 T1 切线斜率只差一个负号的对应 —— 切点也是"中点退化"的弦端）；</li>
      <li><strong>对称性问题</strong>：弦被点 M 平分 <Katex tex="\iff" /> 上式成立，配合直线方程即可解截距。</li>
    </ul>

    <h3 class="sec" id="a2-aff">仿射解读：垂径定理的遗言</h3>
    <p>为什么点差法的答案长得像垂径定理？因为它<strong>就是</strong>垂径定理被 <Katex tex="T_k" /> 压扁后的样子。圆内平行弦中点共线于垂直直径：<Katex tex="k_{\text{弦}}\cdot k_{\text{径}}=-1" />。<Katex tex="T_k" /> 下斜率变成原来的 k 倍（<Katex tex="\text{slope}=\tfrac{y}{x}\mapsto\tfrac{ky}{x}" />），于是</p>
    <Katex tex="\big(k\,k_{\text{弦}}\big)\cdot\big(k\,k_{\text{径}}\big)=k^2\cdot(-1)=-\frac{b^2}{a^2}" display />
    <p>垂直（乘积 −1）不再保持，乘积为常数（<Katex tex="-\tfrac{b^2}{a^2}" />）保持了下来 —— 仿射不变量的标准特征。而 D5 已经证明：斜率乘积 <Katex tex="-\tfrac{b^2}{a^2}" /> 的点全体恰好构成椭圆 ——<strong>第三定义（过两顶点的弦）与点差法（平行弦中点）是同一结论的两种形式</strong>：前者把弦端取在顶点，后者让弦自由平行。</p>
    <div class="note good"><strong>双曲线版</strong>：同样的两行相减给出 <Katex tex="k_{\text{弦}}\cdot k_{OM}=+\tfrac{b^2}{a^2}" />（差一个符号，正如 D5 里那样）；令 a = b 退回圆 = −1。三曲线共用一台"平行弦机器"。</div>

    <h3 class="sec" id="a2-app">实战，以及点差法最著名的易错点</h3>
    <p><strong>例（中点弦问题）</strong>：椭圆 <Katex tex="\tfrac{x^2}{4}+\tfrac{y^2}{3}=1" /> 的弦被点 M(1, 1) 平分，求弦所在直线方程。点差法两行：<Katex tex="k\cdot\tfrac{1}{1}=-\tfrac{3}{4}" />，得 <Katex tex="k=-\tfrac{3}{4}" />，直线 <Katex tex="y-1=-\tfrac34(x-1)" />，即 3x + 4y − 7 = 0。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示：点差法只给"必要条件"</strong>。上面 M(1, 1) 真好在椭圆内部，弦才存在；若把 M 换到椭圆外（比如 M(2, 2)），点差法仍会给出一条"斜率 −3/2 的直线"，但那条直线与椭圆根本不相交 —— 解并非实际存在。收尾必须<strong>回代验判别式</strong>（或验证中点确实在曲线"内部"）。点差法说"若弦存在则斜率如此"，从不说"弦一定存在"。</li>
      </ul>
    </div>
    <p>这套方法在下一讲再次使用：面积比不变量将把刘徽的割圆术推广到椭圆。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChordMid } from '../../../boards/conics/affine/chordmid.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
