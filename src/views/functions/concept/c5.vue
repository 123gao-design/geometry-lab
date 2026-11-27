<template>
  <ChPage :cur="5" no="C5" base="/functions/c" :chapters="C_CHAPTERS"
    title="机器观与位移：f(x)+h 与 f(x+h)" sub="在函数值上加 h 改变纵坐标，在自变量上加 h 改变对应点的横坐标。"
    :toc="[{ id: 'c5-machine', t: '机器观：两个改装端口' }, { id: 'c5-board', t: '双机器改装台（图 C5）' }, { id: 'c5-why', t: '左加右减的代数原理' }, { id: 'c5-dom', t: '定义域跟着谁走' }]">
    <div class="note good" id="c5-machine"><strong>机器观</strong>：把 f 想成一台机器 —— 喂进 x，吐出 f(x)。它有两个改装端口：<strong>输出端</strong>改装 <Katex tex="f(x)+h" /> 是在出口加装一台升降机，图象<strong>上下</strong>平移 |h|（上加下减）；<strong>输入端</strong>改装 <Katex tex="f(x+h)" /> 是在进口加装一台传送带，图象<strong>左右</strong>平移 |h|（左加右减）。同一个 +h，作用方向一竖一横 —— 这是本章要关注的唯一现象。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMachine" />
      <div class="cap">图 C5 · <b><Katex tex="f(x)+h" /> 与 <Katex tex="f(x+h)" /> 的图象</b>。拖动 <Katex tex="h" />，比对灰色原图、金色竖移和蓝色横移。用根式的起点检查横移后的定义域。</div>
    </div>

    <h3 class="sec" id="c5-why">左加右减的代数原理</h3>
    <p>设 <Katex tex="g(x)=f(x+h)" />。原图在 <Katex tex="b" /> 处的点对应新图在 <Katex tex="a=b-h" /> 处的点，因为 <Katex tex="a+h=b" /> 时，<Katex tex="g" /> 调用的是 <Katex tex="f" /> 在 <Katex tex="b" /> 处的值：</p>
    <Katex tex="a=b-h" display />
    <p><Katex tex="f" /> 的图象上每一个横坐标为 <Katex tex="b" /> 的点，在 <Katex tex="g" /> 的图象上出现在横坐标 <Katex tex="b-h" /> 处 —— <strong>所有点一致向左挪了 <Katex tex="h" /></strong>。输入端的加法之所以反直觉，是因为传送带的方向与位移方向恰好相反：<Katex tex="x+h" /> 是「提前 <Katex tex="h" /> 报到」，提前报到等于把队伍往左挪。</p>

    <h3 class="sec" id="c5-dom">定义域跟着谁走</h3>
    <p>两个端口对定义域的待遇完全不同 —— 图 C5 预设 ② 是活证。设 <Katex tex="g(x)=f(x+h)" />，则：</p>
    <Katex tex="D(g)=\{x\mid x+h\in D(f)\}=D(f)-h" display />
    <p>右端的「<Katex tex="-h" />」读作：定义域整体沿 <Katex tex="x" /> 轴平移 <Katex tex="-h" />（<Katex tex="h\gt0" /> 即左移 <Katex tex="h" />）。输出端改装 <Katex tex="f(x)+h" /> 只在输出端加常数，<strong>输入的 <Katex tex="x" /> 没变</strong>，定义域原封不动：<Katex tex="\sqrt{x}+h" /> 依然只能从 <Katex tex="x=0" /> 出发，只是起点升高了 <Katex tex="h" />。输入端改装 <Katex tex="f(x+h)=\sqrt{x+h}" /> 的输入规则变了，<Katex tex="x" /> 得满足 <Katex tex="x+h\ge0" />，起点挪到 <Katex tex="x=-h" /> —— <strong>定义域跟着输入端平移，跟输出端无关</strong>。预设 ③ 的渐近线同理：竖直渐近线来自输入端无定义的位置，只随输入端改装移动。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「左加右减」与直觉相反，就改成解方程。</strong>每次都问「<Katex tex="f" /> 的读数要对应到哪个输入」。</li>
        <li><strong>提示二：别把两个端口混用。</strong><Katex tex="f(x+h)+k" /> 是先左移再上移（两个端口串联），顺序在平移里可交换，但等到<RouterLink class="xref" to="/functions/g2">伸缩与翻折：横除纵乘</RouterLink>遇上伸缩就不可交换了；而 <Katex tex="f(2x)" />、<Katex tex="f(-x)" />、<Katex tex="|f(x)|" />、<Katex tex="f(|x|)" /> 是输入/输出端的另外四种改装（压缩、镜像、翻折），全部在<RouterLink class="xref" to="/functions/g1">平移：左加右减的代数原理</RouterLink>、<RouterLink class="xref" to="/functions/g2">伸缩与翻折：横除纵乘</RouterLink>与<RouterLink class="xref" to="/functions/e8">绝对值嵌套：三种折叠</RouterLink>里逐个上线。</li>
      </ul>
    </div>
    <p>回顾与预告：<RouterLink class="xref" to="/functions/c1">映射与函数：对应的纪律</RouterLink>里提到「把 <Katex tex="f" /> 读成一台机器」，本章实现；导数定义 <Katex tex="f'(x)=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}" /> 里那个 <Katex tex="x+h" /> 正是输入端的自变量提前量 —— <Katex tex="h" /> 收缩到 <Katex tex="0" /> 的极限就是<RouterLink class="xref" to="/functions/v1">割线与切线：导数的诞生</RouterLink>里的割线 → 切线。机器观至此成为全模块的通用语言：<RouterLink class="xref" to="/functions/s5">对称性专题：抽象式与翻译</RouterLink>的对称翻译、图象变换一组的变换流程、导数一组的变化率，都是它的续作。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMachine } from '../../../boards/functions/concept/machine.js';
import { C_CHAPTERS } from './cnav.js';
</script>

<style src="../properties/preset-row.css"></style>
