<template>
  <ChPage :cur="2" no="型2" base="/linalg/q" :chapters="QL_CHAPTERS"
    title="转轴化标准形"
    sub="交叉项 bxy 的存在，意味着椭圆或双曲线的两条轴不在坐标轴上。把坐标轴转过一个恰当的角度，交叉项恰好消失，方程变成 λ₁x′² + λ₂y′² = 1，半轴也随之读到。这个角度就是特征方向与 x 轴的夹角。"
    :toc="[{ id: 'q2-rot', t: '转轴公式' }, { id: 'q2-angle', t: '转多少度' }, { id: 'q2-half', t: '标准形与半轴' }, { id: 'q2-pit', t: '转轴与符号' }]">

    <div class="note good" id="q2-rot">把坐标轴绕原点逆时针转 <Katex tex="\theta" />，同一个点的坐标按 <Katex tex="x=x'\cos\theta-y'\sin\theta" />、<Katex tex="y=x'\sin\theta+y'\cos\theta" /> 换算。代入 <Katex tex="ax^2+bxy+cy^2" /> 后，新的交叉项系数为 <Katex tex="(c-a)\sin2\theta+b\cos2\theta" />；令它为零即得 <Katex tex="\tan2\theta=\dfrac{b}{a-c}" />。此时二次型化为 <Katex tex="\lambda_1x'^2+\lambda_2y'^2" />，其中 <Katex tex="\lambda_1,\lambda_2" /> 是二次型矩阵的两个特征值。</div>

    <div class="board-wrap">
      <BoardMount :factory="createStdForm" />
      <div class="cap">图 型2 · <b>转轴化标准形</b>：蓝色曲线不变，金色 <Katex tex="x'" /> 轴与青色 <Katex tex="y'" /> 轴是新坐标系，橙色小弧标出转轴角 <Katex tex="\theta" />，金青两色圆点是半轴端点。看点：无论怎么拖 <Katex tex="a,b,c" />，两根新轴总与曲线的对称轴重合，而 <Katex tex="\theta" /> 随交叉项增大而增大；切到「轴已对齐」档，<Katex tex="\theta=0" />、方程本来就没有交叉项；切到「圆」档，两条轴等长，<Katex tex="\theta" /> 不再唯一。</div>
    </div>

    <h3 class="sec" id="q2-rot">转轴公式</h3>
    <p>转轴只是换一组基：新坐标 <Katex tex="(x',y')" /> 是同一个点在「转过的两根轴」上的分量。把 <Katex tex="x=x'\cos\theta-y'\sin\theta" />、<Katex tex="y=x'\sin\theta+y'\cos\theta" /> 代入二次型，用 <Katex tex="\cos^2\theta=\dfrac{1+\cos2\theta}{2}" />、<Katex tex="\sin^2\theta=\dfrac{1-\cos2\theta}{2}" />、<Katex tex="\sin\theta\cos\theta=\dfrac{\sin2\theta}{2}" /> 合并同类项，得到</p>
    <p style="text-align:center"><Katex tex="a'=\dfrac{a+c}{2}+\dfrac{a-c}{2}\cos2\theta+\dfrac{b}{2}\sin2\theta,\qquad b'=(c-a)\sin2\theta+b\cos2\theta" display /></p>
    <p>两件事实值得单独指出。第一，<Katex tex="a'+c'=a+c" />，即系数之和不变——这条与迹不变是同一句话。第二，令 <Katex tex="b'=0" /> 总有解，因为 <Katex tex="\sin2\theta" /> 与 <Katex tex="\cos2\theta" /> 不同时为零。于是任何二次型都能通过转轴消去交叉项。</p>
    <p>去掉交叉项后 <Katex tex="a'" /> 与 <Katex tex="c'" /> 正好是两个特征值。这一点不必重算：转轴不改变二次型的取值集合，而在特征基下它已经是 <Katex tex="\lambda_1x'^2+\lambda_2y'^2" />，两种做法给出同一组系数。</p>

    <h3 class="sec" id="q2-angle">转多少度</h3>
    <p><Katex tex="\tan2\theta=\dfrac{b}{a-c}" /> 给出两个相差 <Katex tex="90^\circ" /> 的解，对应两条互相垂直的轴——选哪一根当 <Katex tex="x'" /> 只影响 <Katex tex="\lambda_1,\lambda_2" /> 的排列，不改变曲线。约定取 <Katex tex="\theta\in(-45^\circ,45^\circ]" /> 的那一个，图 型2 里的橙色小弧就落在这个范围内。</p>
    <p>两个特殊情形要单独处理：<Katex tex="b=0" /> 时 <Katex tex="\tan2\theta=0" />，取 <Katex tex="\theta=0" />，轴本来就在坐标轴上；<Katex tex="a=c" /> 时右端分母为零，公式失效，但此时交叉项 <Katex tex="b\sin2\theta" /> 只需 <Katex tex="\theta=45^\circ" /> 就能消掉（若 <Katex tex="b\ne0" />）。图 型2 用 <Katex tex="\theta" /> 的反正切按案例逐个算，不直接套公式。</p>
    <p>几何上 <Katex tex="\theta" /> 就是特征方向与 <Katex tex="x" /> 轴的夹角。这说明「求转轴角」与「求特征向量」是同一件事——转过 <Katex tex="\theta" /> 之后，两根新轴各自成了一个特征方向，而沿特征方向自变量之间没有交叉项。</p>

    <h3 class="sec" id="q2-half">标准形与半轴</h3>
    <p>转轴之后，曲线写作 <Katex tex="\lambda_1x'^2+\lambda_2y'^2=1" />。若两个特征值同正，移项得</p>
    <p style="text-align:center"><Katex tex="\dfrac{x'^2}{1/\lambda_1}+\dfrac{y'^2}{1/\lambda_2}=1,\qquad a=\sqrt{\dfrac{1}{\lambda_1}},\quad b=\sqrt{\dfrac{1}{\lambda_2}}" display /></p>
    <p>半轴与特征值成反比：<Katex tex="\lambda" /> 越大，这个方向被压得越紧，半轴越短。这与 型1 里椭圆被夹在两轴之间的画面一致——大特征值的方向正是短轴方向。若两者异号，则一项带负号，得到 <Katex tex="\dfrac{x'^2}{a^2}-\dfrac{y'^2}{b^2}=1" />，正号那一项给出实半轴。</p>
    <p>标准形的用处在于把「认曲线」变成「看两个数」。原方程 <Katex tex="ax^2+bxy+cy^2=1" /> 里三个系数互相纠缠，转轴后只剩两个独立的信息：<Katex tex="\lambda_1" /> 与 <Katex tex="\lambda_2" />。这也解释了为什么 型1 的分类判据只用迹与行列式——它们恰好是这两个数之和与乘积。</p>

    <h3 class="sec" id="q2-pit">转轴与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：转轴不是转图形。</strong>曲线本身固定不动，转动的是坐标轴（等价地，换成新的坐标写法）。图 型2 里蓝色曲线在拖动时位置不变，变的只有金青两根轴。</li>
        <li><strong>提示二：<Katex tex="\tan2\theta" /> 有两个解，相差 <Katex tex="90^\circ" />。</strong>两者都合格，只是把 <Katex tex="\lambda_1" /> 与 <Katex tex="\lambda_2" /> 互换。写成「转 <Katex tex="\theta+90^\circ" /> 也行」并不算错。</li>
        <li><strong>提示三：<Katex tex="a=c" /> 时公式分母为零。</strong>不是无解，而是要回到 <Katex tex="b'=(c-a)\sin2\theta+b\cos2\theta" /> 直接看：此时只剩 <Katex tex="b\cos2\theta" />，取 <Katex tex="\theta=45^\circ" /> 即可。</li>
        <li><strong>提示四：转轴消不掉一次项。</strong>方程里若还带着 <Katex tex="dx+ey" />，需要先配方平移（移轴）把中心挪到原点，再转轴消交叉项。本章的二次型没有一次项，所以只需转轴这一步。</li>
      </ul>
    </div>
    <p>回收与预告：特2 的 <Katex tex="A=PDP^{-1}" /> 在坐标层面就是一次转轴，<Katex tex="P" /> 的两列正是新的坐标轴方向；型1 的半轴 <Katex tex="1/\sqrt{\lambda}" /> 在这里被写成标准形的分母。下一章把这两个特征值的符号单拎出来做成分区图，一眼看出曲线属于哪一类。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createStdForm } from '../../../boards/linalg/quad/stdform.js';
import { QL_CHAPTERS } from './qlnav.js';
</script>
