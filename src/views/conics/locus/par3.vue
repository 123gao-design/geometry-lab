<template>
  <ChPage :cur="3" no="P3" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="焦点弦与通径" sub="过焦点的弦有多长？先检查焦点是否在两个端点之间，再用同一条公式比较弦长和通径。"
    :toc="[{ id: 'p3-lab', t: '焦点弦（图 P3）' }, { id: 'p3-der', t: '弦长公式 · 极坐标两行' }, { id: 'p3-cor', t: '推论 · 调和平均与三态定理' }, { id: 'p3-par', t: '抛物线经典题清单' }]">
    <div class="note good"><strong>焦点弦</strong>：过焦点的弦。它是三种圆锥曲线共享的高频考点 —— 因为 D4 的极坐标公式 <Katex tex="r=\dfrac{ed}{1+e\cos\theta}" /> 在这里直接发挥作用。</div>

    <h3 class="sec" id="p3-lab">焦点弦</h3>
    <ConicFigure head="bottom" number="P3" title="以焦点弦为直径，比较圆与准线" :factory="createFocalChord"
      :legend="[['ink', '焦点弦'], ['gold', '直径圆'], ['mint', '准线', 'dashed'], ['pink', '圆心到准线的距离', 'dashed']]">
      金色光脉冲沿弦 P₁P₂ 穿过焦点；以焦点弦为直径的圆与准线的<strong>关系只由 e 决定</strong> —— 拖 e 滑块连续变形，看圆从与准线相离，跨过恰好相切，变成与准线相交。
    </ConicFigure>

    <h3 class="sec" id="p3-der">弦长公式：极坐标两行</h3>
    <p>弦与轴成角 θ，两端是一对"对径"方向：θ 与 θ+π。由 D4 的极坐标方程（焦准距 d，半通径 ed）：</p>
    <Katex tex="r_1=\frac{ed}{1+e\cos\theta},\qquad r_2=\frac{ed}{1-e\cos\theta}" display />
    <p>下面先讨论焦点在两端之间的情形，这要求两个分母都为正。双曲线图 P3 锁定在同支构型；异支焦点弦在图 P4 单独比较。这个条件下可以直接相加：</p>
    <Katex tex="L=r_1+r_2=ed\left(\frac{1}{1+e\cos\theta}+\frac{1}{1-e\cos\theta}\right)=\frac{2ed}{1-e^2\cos^2\theta}" display />
    <p>三个方向的检验：</p>
    <ul>
      <li><strong><Katex tex="\theta=90^\circ" />（通径）</strong>：<Katex tex="\cos\theta=0" />，<Katex tex="L=2ed" />（椭圆和双曲线可另写成 <Katex tex="2b^2/a" />）。分母 <Katex tex="1-e^2\cos^2\theta\le 1" /> 说明它<strong>最短</strong>（椭圆、抛物线全部弦；双曲线限定同支）—— 图 P3 的「⊥ 对准通径」按钮直奔它。D3 的"通径 = 2p"正是 e=1 特例（ed = p）。</li>
      <li><strong>θ → 0（沿轴）</strong>：<Katex tex="L\to\tfrac{2ed}{1-e^2}=2a" /> —— 弦长成最长的长轴（椭圆）；抛物线（e=1）分母趋 0，另一端趋向无穷；双曲线同支弦在 <Katex tex="|\cos\theta|=\tfrac1e" /> 处分母先归零 —— <strong>那正是渐近线方向</strong>，弦"伸到无穷"（D2 的渐近线以弦长的方式再次现身）。</li>
      <li><strong>对称性</strong>：只依赖 <Katex tex="\cos^2\theta" />，弦在轴上下对称 —— 同倾角镜像弦等长。</li>
    </ul>

    <h3 class="sec" id="p3-cor">推论：调和平均，与圆和准线的三态定理</h3>
    <p><strong>推论一（焦半径的倒数和）</strong>：把刚才的两个分母乘起来：</p>
    <Katex tex="r_1r_2=\frac{e^2d^2}{1-e^2\cos^2\theta}=\frac{ed}{2}\cdot L\ \Longrightarrow\ \frac1{r_1}+\frac1{r_2}=\frac{r_1+r_2}{r_1r_2}=\frac{2}{ed}=\frac{4}{\text{通径}}" display />
    <p>倒数和是与 θ 无关的<strong>常数</strong>（抛物线版： <Katex tex="\tfrac{1}{|FP_1|}+\tfrac{1}{|FP_2|}=\tfrac{2}{p}" /> 是最常考的形态）。用调和平均的语言说：两段焦半径的调和平均恒等于半通径 —— 弦长再怎么呼吸，"倒数的平均"纹丝不动。</p>
    <p><strong>推论二（圆与准线三态定理）</strong>：以焦点弦为直径作圆，M 为圆心。两端点到准线的距离是 <Katex tex="d_1=\tfrac{r_1}{e},\ d_2=\tfrac{r_2}{e}" />（统一定义），同侧相加取半：</p>
    <Katex tex="d(M,\,l)=\frac{d_1+d_2}{2}=\frac{r_1+r_2}{2e}=\frac{L}{2e}\quad\text{vs}\quad R_{\text{圆}}=\frac{L}{2}" display />
    <p>比较 <Katex tex="\tfrac{L}{2e}" /> 与 <Katex tex="\tfrac{L}{2}" />，一切只看 e：</p>
    <table>
      <tbody>
        <tr><th>离心率</th><th>d(M, l) vs R</th><th>圆与准线</th><th>对应曲线</th></tr>
        <tr><td>e &lt; 1</td><td>d &gt; R</td><td>相离</td><td>椭圆</td></tr>
        <tr><td>e = 1</td><td>d = R</td><td><strong>相切</strong></td><td>抛物线（经典题！）</td></tr>
        <tr><td>e &gt; 1</td><td>d &lt; R</td><td>相交</td><td>双曲线（同支弦）</td></tr>
      </tbody>
    </table>
    <p>抛物线的"相切"是教材名题：以焦点弦为直径的圆与准线相切。三态定理说它是同一个不等式在 e 的三个区间里的读数 —— 而 e 的分段正是 D4 里那条连续变形的滑块。<strong>统一定义从定义出发，最后又回归到 e。</strong></p>

    <h3 class="sec" id="p3-par">抛物线经典题清单（e=1 专页）</h3>
    <p>令 e = 1、ed = p（焦准距为 p，顶点到焦点的距离为 p/2），本讲公式全部"押韵"成教材款：</p>
    <ul>
      <li>弦长：<Katex tex="L=\dfrac{2p}{\sin^2\theta}" />（θ 与轴的夹角）—— 通径 <Katex tex="\theta=90^\circ" /> 时 2p 最短；</li>
      <li>倒数和：<Katex tex="\tfrac{1}{|FP_1|}+\tfrac{1}{|FP_2|}=\tfrac{2}{p}" /> —— 推论一的 e=1 版；</li>
      <li>以焦点弦为直径的圆与准线<strong>相切</strong> —— 三态定理的中段；</li>
      <li>参数版（P1）：弦端 <Katex tex="t_1, t_2" /> 满足 <Katex tex="t_1t_2=-\tfrac14" />（焦点 <Katex tex="\big(\tfrac{p}{2},0\big)" /> 代入弦方程 <Katex tex="(t_1+t_2)y=x+2pt_1t_2" />）。</li>
    </ul>
    <p>最后一点延伸留给整条主线：焦点弦把 D1（焦点）→ D4（极坐标）→ P1（参数）串成闭环 —— <strong>每一样工具最终都在别的章节里复发</strong>。这正是本专题反复出现的结构：结论互相回收，没有一条是孤岛。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFocalChord } from '../../../boards/conics/locus/focalchord.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
