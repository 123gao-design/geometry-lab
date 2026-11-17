<template>
  <ChPage :cur="5" no="方5" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="二阶常系数线性方程"
    sub="代入 e^{λx} 就把方程换成关于 λ 的二次方程；判别式的三种情形对应三种截然不同的图像。"
    :toc="[{ id: 'o5-char', t: '特征方程' }, { id: 'o5-distinct', t: '两个不等实根' }, { id: 'o5-double', t: '重根' }, { id: 'o5-complex', t: '共轭复根' }]">

    <div class="note good" id="o5-char">方程 <Katex tex="y''+py'+qy=0" /> 中 <Katex tex="p" />、<Katex tex="q" /> 是常数。试解 <Katex tex="y=\mathrm{e}^{\lambda x}" />，代入后约去 <Katex tex="\mathrm{e}^{\lambda x}" />，得<b>特征方程</b> <Katex tex="\lambda^2+p\lambda+q=0" />。原方程的解的形状，完全由这个二次方程的根决定。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCharroots" />
      <div class="cap">图 方5 · <b>二阶常系数线性方程的特征根</b>：固定初始条件 <Katex tex="y(0)=1" />、<Katex tex="y'(0)=0" />，只拖 <Katex tex="p" /> 与 <Katex tex="q" />。右栏读特征根与判别式。<b>看点</b>：判别式由正变负那一刻，单调衰减的图像突然开始上下振荡——两种形状在同一条抛物线的临界处相接。</div>
    </div>

    <h3 class="sec" id="o5-distinct">两个不等实根：两个指数解相加</h3>
    <p>当 <Katex tex="\Delta=p^2-4q>0" />，特征方程给出两个不同实根 <Katex tex="\lambda_1" />、<Katex tex="\lambda_2" />，通解为</p>
    <p style="text-align:center"><Katex display tex="y=C_1\mathrm{e}^{\lambda_1 x}+C_2\mathrm{e}^{\lambda_2 x}" /></p>
    <p>两条指数族的任意叠加都是解，而它们又线性无关，于是这条式子就是全部解。图 方5 在 <Katex tex="p,q>0" /> 时两根都是负的，两条指数都衰减，曲线单调贴向横轴，不会振荡。若其中一根为正，对应的那一项会无限增大，解被推离零。</p>
    <p>把 <Katex tex="y(0)=1" />、<Katex tex="y'(0)=0" /> 代进去，解得 <Katex tex="C_1=-\lambda_2/(\lambda_1-\lambda_2)" />、<Katex tex="C_2=\lambda_1/(\lambda_1-\lambda_2)" />，这就是图 方5 画的曲线。两根相差越大，初始的下降或上升越陡；两根靠得很近，两条项几乎抵消，曲线贴着零走。</p>

    <h3 class="sec" id="o5-double">重根：临界情形</h3>
    <p>当 <Katex tex="\Delta=0" />，特征方程只有一个根 <Katex tex="\lambda=-p/2" />。此时 <Katex tex="\mathrm{e}^{\lambda x}" /> 只给出一条解，必须再找一个线性无关的解，它就是 <Katex tex="x\mathrm{e}^{\lambda x}" />。通解为</p>
    <p style="text-align:center"><Katex display tex="y=(C_1+C_2x)\mathrm{e}^{\lambda x}" /></p>
    <p>为什么乘一个 <Katex tex="x" /> 就成？把 <Katex tex="x\mathrm{e}^{\lambda x}" /> 代进 <Katex tex="y''+py'+qy" />，利用 <Katex tex="\lambda^2+p\lambda+q=0" /> 与 <Katex tex="2\lambda+p=0" />（重根条件）逐项消掉，结果为零。图 方5 把 <Katex tex="p" />、<Katex tex="q" /> 拖到抛物线上时，解的图像恰好从单调衰减过渡到振荡，这一线之隔就是阻尼的分类界线。</p>
    <p>在带阻尼的振动问题里，<Katex tex="\Delta>0" /> 叫过阻尼，<Katex tex="\Delta=0" /> 叫临界阻尼，<Katex tex="\Delta<0" /> 叫欠阻尼。临界阻尼的特点是回到平衡位置最快且不再越过，这正是很多工程设计中要调的参数点。</p>

    <h3 class="sec" id="o5-complex">共轭复根：振荡与包络</h3>
    <p>当 <Katex tex="\Delta<0" />，特征根是一对共轭复数 <Katex tex="\alpha\pm\beta\mathrm{i}" />，其中 <Katex tex="\alpha=-p/2" />、<Katex tex="\beta=\sqrt{4q-p^2}/2" />。通解写成</p>
    <p style="text-align:center"><Katex display tex="y=\mathrm{e}^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)" /></p>
    <p>复指数 <Katex tex="\mathrm{e}^{(\alpha+\beta\mathrm{i})x}" /> 拆开就是指数乘上三角函数，所以解由两条东西相乘而成：<Katex tex="\mathrm{e}^{\alpha x}" /> 是不断缩小的包络，<Katex tex="\cos\beta x" /> 与 <Katex tex="\sin\beta x" /> 给出来回摆动。摆动的频率由 <Katex tex="\beta" /> 定，衰减的快慢由 <Katex tex="\alpha" /> 定，两件事分开管。</p>
    <p>图 方5 的复根情形里，解从 1 出发、向下穿过零轴，随后每次穿过的高度都比上一次小；<Katex tex="\alpha" /> 越接近零，曲线越像等幅的正弦。<Katex tex="\alpha=0" /> 的那条垂直线（即 <Katex tex="p=0" />）是分界：跨过去，摆动就不再衰减，解成了纯粹的正弦与余弦。</p>
    <p>这条结构在方6 的简谐振动与方3 的通解结构里都能找到回声：非齐次方程的通解同样是「齐次部分的振荡 + 一个特别形状」，叠加这件事在不同阶数上反复出现。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：重根要补第二个解。</strong>只写 <Katex tex="C_1\mathrm{e}^{\lambda x}" /> 会漏掉一半解；第二个解是 <Katex tex="x\mathrm{e}^{\lambda x}" />，不是随便乘个常数。</li>
        <li><strong>提示二：复根要成对出现。</strong>实系数方程的特征根若出现复数，必定共轭成对，通解里的 <Katex tex="\cos" /> 与 <Katex tex="\sin" /> 都是实函数，不必写 <Katex tex="\mathrm{i}" />。</li>
        <li><strong>提示三：初始条件两个、只定一次。</strong>先写通解再代 <Katex tex="y(0)" />、<Katex tex="y'(0)" />，不要边积边定，容易把两个常数搞混。</li>
        <li><strong>提示四：非齐次时别忘特解。</strong>右端不为零的 <Katex tex="y''+py'+qy=f(x)" />，通解要在齐次通解之外再加一个特解，结构与方3 相同。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCharroots } from '../../../boards/calc1/ode/charroots.js';
import { ON_CHAPTERS } from './onav.js';
</script>
