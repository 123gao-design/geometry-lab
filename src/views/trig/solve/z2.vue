<template>
  <ChPage :cur="2" no="Z2" base="/trig/z" :chapters="Z_CHAPTERS"
    title="余弦定理：勾股定理的修正版" sub="$c^2=a^2+b^2-2ab\cos\gamma$ —— 勾股是零修正特例；锐角负修正、钝角正修正，修正项由角的余弦现场决定。"
    :toc="[{ id: 'z2-law', t: '定理与投影分解' }, { id: 'z2-proof', t: '推导：勾股 + 修正项' }, { id: 'z2-inv', t: '三边求角：arccos 反演' }, { id: 'z2-table', t: '解三角形分工表' }, { id: 'z2-pit', t: '符号与主值窗' }]">
    <div class="note good" id="z2-def"><strong>余弦定理</strong>：<Katex tex="c^2=a^2+b^2-2ab\cos\gamma" />；反过来 <Katex tex="\cos\gamma=\frac{a^2+b^2-c^2}{2ab}" />。任何三角形的对边平方 = 两邻边平方和 − 修正项；<Katex tex="\gamma=90^\circ"/> 时修正项归零，正是勾股定理。</div>
    <ConicFigure number="Z2" title="用投影分解证余弦定理" head="bottom" :factory="createLab">把角 γ 顶点摆到原点、b 沿横轴、a 仰角 γ —— 对边 AB 自动成为直角三角形的斜边：水平分量 <Katex tex="|b-a\cos\gamma|" />、竖直分量 <Katex tex="a\sin\gamma" />，勾股一勾即得 c²。拖 γ 从锐到钝：紫色投影 <Katex tex="a\cos\gamma" /> <strong>掉头反向</strong>，修正项从负过零变正；右栏两根横条对比 <Katex tex="a^2+b^2" /> 与 <Katex tex="c^2" />，缺口宽度就是修正项本身。板左下沿一行色标把三项分量实时读出，右栏底部三态指示始终亮着当前所处的锐 / 直 / 钝那一档。</ConicFigure>

    <h3 class="sec" id="z2-law">定理与投影分解</h3>
    <p>余弦定理的几何来历是一条<strong>投影分解</strong>：<Katex tex="B" /> 在底边 <Katex tex="CA" /> 所在直线上的投影 <Katex tex="D" /> 把图形拆成两段 —— <Katex tex="CD=a\cos\gamma" />（可正可负）与 <Katex tex="AD=b-a\cos\gamma" />，加上高 <Katex tex="BD=a\sin\gamma" />，<Katex tex="AB" /> 便是直角三角形的斜边：</p>
    <div class="display"><Katex tex="c^2=(b-a\cos\gamma)^2+(a\sin\gamma)^2=a^2+b^2-2ab\cos\gamma" display /></div>
    <p><RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>一节推导两角差的余弦公式时，用单位圆上弦 <Katex tex="|PQ|" /> 的两种算法消去角度差，其中把「余弦定理表达式」作为已知直接引用；本节补出它的证明。两者同源：同一条弦，按两点间距离公式展开与按余弦定理展开得到的是同一个量，令两式相等即得 <Katex tex="\cos(\alpha-\beta)" />。展开式中 <Katex tex="a^2" /> 的来源亦在此交代 —— <Katex tex="(b-a\cos\gamma)^2" /> 与 <Katex tex="(a\sin\gamma)^2" /> 分别含 <Katex tex="a^2\cos^2\gamma" /> 与 <Katex tex="a^2\sin^2\gamma" />，相加时由平方关系 <Katex tex="\sin^2\gamma+\cos^2\gamma=1" /> 归并为 <Katex tex="a^2" />，即<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>一节所证的恒等式在这里完成合并。</p>

    <h3 class="sec" id="z2-proof">推导：勾股 + 修正项</h3>
    <p>把展开式整理成三项：<Katex tex="a^2" />、<Katex tex="b^2" />、<Katex tex="-2ab\cos\gamma" />。前两项来自勾股定理，第三笔是<strong>修正项</strong> —— 它的符号完全由 <Katex tex="\cos\gamma"/> 决定：<Katex tex="\gamma"/> 锐角时 <Katex tex="\cos\gamma>0"/>，修正为负，<Katex tex="c^2<a^2+b^2" />（对边比勾股预言的短）；<Katex tex="\gamma=90^\circ"/> 零修正，勾股原样成立；<Katex tex="\gamma"/> 钝角时 <Katex tex="\cos\gamma<0"/>，修正为正，<Katex tex="c^2>a^2+b^2" />。板上右栏的对比条把这三态画成缺口：直角态缺口宽恰为零，锐角态 <Katex tex="c^2"/> 条短一截，钝角态反超一截。</p>

    <h3 class="sec" id="z2-inv">三边求角：arccos 反演</h3>
    <p>三边已知（SSS）时把定理反着用：<Katex tex="\gamma=\arccos\frac{a^2+b^2-c^2}{2ab}" />。这里 arccos 的主值窗 <Katex tex="[0,\ \pi]" /> 恰好一张地图覆盖三角形内角的全域（0 到 180°），不需要像 arcsin 那样讨论镜像改判 —— <RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>一节选窗时「覆盖优先」的道理在此得到验证。板上「反演 γ」读数实时把三边代回 arccos，与滑块角完全重合核验。验算：<Katex tex="a^2+b^2-c^2" /> 的符号直接给出 γ 的锐钝 —— 分子正则锐、零则直、负则钝，不必真开 arccos。</p>

    <h3 class="sec" id="z2-table">解三角形分工表</h3>
    <table>
      <tr><td>已知条件</td><td>走哪条定理</td><td>看点</td></tr>
      <tr><td>SSS（三边）</td><td>余弦定理反演</td><td>最大角配最大边，先验三边能否构成三角形</td></tr>
      <tr><td>SAS（两边夹角）</td><td>余弦定理正用</td><td>夹角即 γ，修正项直接决定</td></tr>
      <tr><td>ASA / AAS</td><td>正弦定理</td><td>比值关系 2R 直接求出全部边（见 <RouterLink class="xref" to="/trig/z1">正弦定理与 SSA 解的个数</RouterLink>）</td></tr>
      <tr><td>SSA（两边一对角）</td><td>正弦定理 + 数解</td><td>两解互补验 <Katex tex="\gamma_1+\gamma_2=180^\circ"/>（见 <RouterLink class="xref" to="/trig/z1">正弦定理与 SSA 解的个数</RouterLink>）</td></tr>
    </table>

    <h3 class="sec" id="z2-pit">符号与主值窗</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：修正项丢负号。</strong>钝角时 <Katex tex="\cos\gamma<0" />，<Katex tex="-2ab\cos\gamma" /> 是<strong>正</strong>修正 —— 把负号并入 cosγ 后再弄丢，c² 必错。</li>
        <li><strong>提示二：投影掉头忘看。</strong>γ&gt;90° 时 D 点落在 C 的反侧（板上紫箭头掉头），水平分量是 <Katex tex="b+|a\cos\gamma|" />，别照抄 <Katex tex="b-a\cos\gamma" /> 再当正数处理。</li>
        <li><strong>提示三：三边不验构成。</strong>最大边 ≥ 另两边之和时 arccos 的自变量跑出 [−1,1] —— <RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>一节的域外排除在此再次出现，先验 <Katex tex="a+b>c" /> 再动笔。</li>
        <li><strong>提示四：角与边对应错误。</strong>余弦定理的 γ 必须<strong>夹在 a、b 之间</strong>、对边才是 c；「边对角」错配是余弦定理版的第一大错。</li>
      </ul>
    </div>
    <p>有了两条定理的分工表，下一讲<RouterLink class="xref" to="/trig/z3">面积与范围</RouterLink>把面积与取值范围收进同一块画板 —— 面积公式 <Katex tex="S=\tfrac12 ab\sin\gamma" /> 正是本讲竖直分量 <Katex tex="a\sin\gamma" /> 的对折。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/solve/coslaw.js';
import { Z_CHAPTERS } from './znav.js';
</script>
