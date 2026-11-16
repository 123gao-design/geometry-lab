<template>
  <ChPage :cur="2" no="N2" base="/trig/n" :chapters="N_CHAPTERS"
    title="半角与升降幂" sub="把倍角倒着用 —— 降幂：$\sin^2\alpha=(1-\cos2\alpha)/2$，换写法不换数值但周期折半；半角：开方带 $\pm$，符号由象限确定。"
    :toc="[{ id: 'n2-half', t: '周期折半：平方把负半波翻上来' }, { id: 'n2-down', t: '降幂与升幂：改写的收益' }, { id: 'n2-halfang', t: '半角 ± 与象限判定' }, { id: 'n2-pit', t: '周期误判与 ± 漏判' }]">
    <div class="note good" id="n2-law"><strong>升降幂与半角</strong>：<Katex tex="\sin^2\alpha=\tfrac{1-\cos2\alpha}{2}" />，<Katex tex="\cos^2\alpha=\tfrac{1+\cos2\alpha}{2}" />（降幂）；<Katex tex="1-\cos2\alpha=2\sin^2\alpha" />，<Katex tex="1+\cos2\alpha=2\cos^2\alpha" />（升幂）；<Katex tex="\sin\tfrac\alpha2=\pm\sqrt{\tfrac{1-\cos\alpha}{2}}" />，<Katex tex="\cos\tfrac\alpha2=\pm\sqrt{\tfrac{1+\cos\alpha}{2}}" />（半角，<Katex tex="\pm"/> 由半角所在象限定）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 N2 · <b>升降幂验证机</b>：蓝实线 <Katex tex="y=\sin^2x"/> 与金虚线 <strong><Katex tex="(1-\cos2x)/2"/></strong> 完全重合 —— 同一条曲线的两种记法；灰虚母波 sin x 对照，可见<strong>平方把负半波翻上来</strong>：周期折半成 <Katex tex="\pi"/>。探针 <Katex tex="x_0"/> 处两种写法同高（蓝金双点叠影），<Katex tex="x_0+\pi"/> 处空心点等高 —— 平移 <Katex tex="\pi"/> 完全重合，半角徽章直接判定 <Katex tex="\pm"/>。</div>
    </div>

    <h3 class="sec" id="n2-half">周期折半：平方把负半波翻上来</h3>
    <p>sin x 的负半波（<Katex tex="x\in(\pi,2\pi)"/>）经过平方全部翻成正的 —— 与正半波拼成一座座等高的拱，<strong>周期从 <Katex tex="2\pi"/> 折半成 <Katex tex="\pi"/></strong>。板上把探针拨到任意位置，<Katex tex="x_0"/> 与 <Katex tex="x_0+\pi"/> 处的两个点恒等高：这就是「<Katex tex="\sin^2x"/> 的周期是 <Katex tex="\pi"/>」的图上证据。降幂写法 <Katex tex="(1-\cos2x)/2"/> 里那个「<Katex tex="2x"/>」正是周期折半的代数指纹 —— 频率加倍，周期减半（即 F1 的 ω 旋钮）。</p>
    <p>值域同时被压成 [0,1]：平方非负，在 kπ 处（sin 过零的地方）函数值贴着 x 轴取得最小值 0，原来的峰与谷都映射为最大值 1。</p>

    <h3 class="sec" id="n2-down">降幂与升幂：改写的收益</h3>
    <p>降幂把<strong>二次的三角式</strong>改写成<strong>一次的三角式</strong>，代价是角度翻倍：</p>
    <p><Katex display tex="\sin^2\alpha=\frac{1-\cos2\alpha}{2}\quad\text{（由 } \cos2\alpha=1-2\sin^2\alpha \text{ 移项）}" /></p>
    <p>主要用途：① <strong>化简求值</strong> —— <Katex tex="\sin^215^\circ+\cos^215^\circ"/> 直接走平方关系得 1，绕开具体数值；② <strong>为积分铺路</strong> —— <Katex tex="\int\sin^2x\,dx" /> 必须先降幂（V8 黎曼机的后话）；③ <strong>升幂反向</strong> —— 要「乘开角度」时用 <Katex tex="1-\cos2\alpha=2\sin^2\alpha"/>，积化和差（Q1）遇到二次也依赖它化简。方向口诀：<strong>降幂缩角、升幂扩角</strong>，升降之间周期对半。</p>

    <h3 class="sec" id="n2-halfang">半角 <Katex tex="\pm"/> 与象限判定</h3>
    <p>把 N1 的第二面 <Katex tex="\cos\alpha=1-2\sin^2\tfrac\alpha2" /> 移项开方，得半角公式：</p>
    <p><Katex display tex="\sin\frac{\alpha}{2}=\pm\sqrt{\frac{1-\cos\alpha}{2}},\qquad \cos\frac{\alpha}{2}=\pm\sqrt{\frac{1+\cos\alpha}{2}}" /></p>
    <p><Katex tex="\pm"/> 由 <strong><Katex tex="\alpha/2"/> 所在的象限</strong>判定 —— 与 U2 的开方判定同一套流程：sin 在一、二象限取正，cos 在一、四象限取正。板上「半角 <Katex tex="\pm"/>」徽章随探针实时报出取号与象限：<Katex tex="x_0=\pi/3"/> 时 <Katex tex="x_0/2=\pi/6"/> 在第一象限，取「＋」；<Katex tex="x_0=4\pi/3"/> 时 <Katex tex="x_0/2=2\pi/3"/> 在第二象限，sin 仍取「＋」—— 但 cos 就要取「−」了。半角公式的价值：知道<strong>整角</strong>的余弦就能算<strong>半角</strong>的正余弦，不必解二次方程。</p>

    <h3 class="sec" id="n2-pit">周期误判与 <Katex tex="\pm"/> 漏判</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\sin^2x"/> 的周期被误当 <Katex tex="2\pi"/>。</strong>板上平移 <Katex tex="\pi"/> 完全重合 —— 周期是 <Katex tex="\pi"/>；凡是「平方后的三角式」，先想周期是否折半、图象是否整体上移（<Katex tex="\cos^2x"/> 是 <Katex tex="\sin^2x"/> 平移 <Katex tex="\pi/2"/>，值域同样 <Katex tex="[0,1]"/>）。</li>
        <li><strong>提示二：半角 <Katex tex="\pm"/> 漏判象限。</strong>默认取正是大忌 —— 先定 <Katex tex="\alpha/2"/> 的象限再定号；题目只给 <Katex tex="\alpha"/> 的范围时，半角范围要除以 2 后再判定（端点开闭别跟着除错）。</li>
        <li><strong>提示三：降幂后忘了角度已翻倍。</strong><Katex tex="(1-\cos2\alpha)/2"/> 里是 <Katex tex="2\alpha"/> 不是 <Katex tex="\alpha"/> —— 代入求值时角度要同步翻倍。</li>
      </ul>
    </div>
    <p>倍角、半角、升降幂是同一组恒等式的三种形式。下一阶段回到 M1 的两行公式 —— <strong>相加减还能导出新公式</strong>：积化和差（Q1）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/double/powlab.js';
import { N_CHAPTERS } from './nnav.js';
</script>
