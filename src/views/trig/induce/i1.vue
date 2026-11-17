<template>
  <ChPage :cur="1" no="I1" base="/trig/i" :chapters="I_CHAPTERS"
    title="诱导公式：镜像五组" sub="锐角三角函数值一张表就够 —— 诱导公式负责把任意角「诱导」回锐角：先减整圈（B1 的终边相同角），再选一面镜子照回第一象限。旋转整圈、x 轴、y 轴、原点三面镜子，五组公式全部是单位圆对称的坐标关系：函数名不变，符号看新角的象限。"
    :toc="[{ id: 'i1-why', t: '为什么要诱导' }, { id: 'i1-mirror', t: '三面镜子与一整圈' }, { id: 'i1-pit', t: '符号与象限' }]">
    <div class="note good" id="i1-law"><strong>诱导公式（镜像五组）</strong>：<Katex tex="\sin(\alpha+2k\pi)=\sin\alpha" />；<Katex tex="\sin(-\alpha)=-\sin\alpha,\ \cos(-\alpha)=\cos\alpha" />；<Katex tex="\sin(\pi-\alpha)=\sin\alpha,\ \cos(\pi-\alpha)=-\cos\alpha" />；<Katex tex="\sin(\pi+\alpha)=-\sin\alpha,\ \cos(\pi+\alpha)=-\cos\alpha" />；<Katex tex="\sin(2\pi-\alpha)=-\sin\alpha,\ \cos(2\pi-\alpha)=\cos\alpha" />。<strong>口诀：函数名不变，符号看象限</strong>（新角 β 的象限）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createMirror" />
      <div class="cap">图 I1 · <b>诱导公式与对称</b>：拖 P 换角、点 ①..⑤ 换镜子 —— 金色点 P′ 是 P 的像，两条坐标读数并排挂着；盯住「谁的坐标变了号」：五组公式不过是三面镜子加一整圈的记录。</div>
    </div>

    <h3 class="sec" id="i1-why">为什么要诱导</h3>
    <p>锐角三角函数有精确表可查（U1 的特殊角），可任意角的三角函数值千千万 —— 好在它们不必逐个算。B1 已证明任意角都能减整圈化回 <Katex tex="[0,2\pi)" /> 的余数；剩下的任务，是把第二、三、四象限的角再「照」回第一象限。以 <Katex tex="\sin\frac{14\pi}{3}" /> 为例走一遍步骤：先减整圈 <Katex tex="\frac{14\pi}{3}-2\times2\pi=\frac{2\pi}{3}" />（B1 的对照表），再用镜子 <Katex tex="\frac{2\pi}{3}=\pi-\frac{\pi}{3}" />，于是 <Katex tex="\sin\frac{14\pi}{3}=\sin\frac{2\pi}{3}=\sin\frac{\pi}{3}=\frac{\sqrt{3}}{2}" /> —— 两步之后，查表即得。「诱导」就是把任意角逐步化回锐角。</p>

    <h3 class="sec" id="i1-mirror">三面镜子与一整圈</h3>
    <p>单位圆上的点由坐标确定（U1：<Katex tex="P(\cos\alpha,\sin\alpha)" />），而镜子只做一件事 —— <strong>变号</strong>。关于 x 轴对称（② <Katex tex="-\alpha" />）：横坐标不动、纵坐标变号，所以 <Katex tex="\cos(-\alpha)=\cos\alpha" /> 而 sin 变号；关于 y 轴对称（③ <Katex tex="\pi-\alpha" />）：横变纵不变，cos 变号、sin 不动；关于原点对称（④ <Katex tex="\pi+\alpha" />）：横纵双变号，sin、cos 全变。板上 P 与 P′ 的两条坐标读数就是这组对应：哪个坐标变了号，哪个函数就变号 —— 公式不必背，由坐标直接写出。⑤ <Katex tex="2\pi-\alpha" /> 与 ② 是同一面 x 轴镜子（因为 <Katex tex="2\pi-\alpha\equiv-\alpha" />，回收 B1 的终边相同角），只是把负角补写成正角 —— 两行公式自然全同。① 的旋转整圈连号都不用变：终边回到原位，坐标原样照抄。tan 呢？商数关系（U2）<Katex tex="\tan\beta=\frac{\sin\beta}{\cos\beta}" /> 自动跟进：分子分母各按各的镜子变号，符号 = 两个符号之积。</p>

    <h3 class="sec" id="i1-pit">符号与象限</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：sin(π−α) 不变号。</strong>y 轴镜子不翻纵坐标 —— 把 <Katex tex="\sin(\pi-\alpha)" /> 记成 <Katex tex="-\sin\alpha" /> 是诱导公式最高频笔误，板上点 ③ 立刻核验出这个错误。</li>
        <li><strong>提示二：「符号看象限」看的是新角 β。</strong><Katex tex="\sin(\pi+\alpha)" /> 取负号，因为 <Katex tex="\pi+\alpha" />（按 α 锐角说）落在第三象限、正弦为负 —— 不是因为「π 是负的」。</li>
        <li><strong>提示三：2π−α 别套两层负号。</strong>它就是 <Katex tex="-\alpha" /> 的正角写法，先按 −α 记一遍再「翻一次」等于把符号翻了两次。</li>
        <li><strong>提示四：诱导公式不换函数名。</strong>五组全是 sin 到 sin、cos 到 cos 的平移；换名的 <Katex tex="\frac{\pi}{2}\pm\alpha" /> 在下一章，混记必错。</li>
        <li><strong>提示五：tan 的符号没有新表。</strong>= sin 与 cos 符号之积（U2 商数关系），多背一张表没有必要。</li>
      </ul>
    </div>
    <p>五面镜子只解决了「象限角」；真正的换名发生在 <Katex tex="\frac{\pi}{2}\pm\alpha" /> —— 下一章让镜面转 45°，看 sin 与 cos 如何直接互换名称。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMirror } from '../../../boards/trig/induce/mirror.js';
import { I_CHAPTERS } from './inav.js';
</script>
