<template>
  <ChPage :cur="5" no="C5" base="/functions/c" :chapters="C_CHAPTERS"
    title="机器观与位移：f(x)+h 与 f(x+h)" sub="把 f 想成一台机器：输出端改装让图竖着走，输入端改装让图横着走 —— 「左加右减」不再靠死记。"
    :toc="[{ id: 'c5-machine', t: '机器观：两个改装端口' }, { id: 'c5-board', t: '双机器改装台（图 C5）' }, { id: 'c5-why', t: '左加右减的代数原理' }, { id: 'c5-dom', t: '定义域跟着谁走' }]">
    <div class="note good" id="c5-machine"><strong>机器观</strong>：把 f 想成一台机器 —— 喂进 x，吐出 f(x)。它有两个改装端口：<strong>输出端</strong>改装 <Katex tex="f(x)+h" /> 是在出口加装一台升降机，图象<strong>上下</strong>平移 |h|（上加下减）；<strong>输入端</strong>改装 <Katex tex="f(x+h)" /> 是在进口加装一台传送带，图象<strong>左右</strong>平移 |h|（左加右减）。同一个 +h，作用方向一竖一横 —— 这是本章要关注的唯一现象。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMachine" />
      <div class="cap">图 C5 · <b>双机器改装台</b>：一个 h 滑块同时驱动两条变形曲线 —— 金色 <strong><Katex tex="f(x)+h" /></strong> 竖着走、蓝色 <strong><Katex tex="f(x+h)" /></strong> 横着走，灰色虚线是基准 f。三个基准切换：① 抛物线看<strong>顶点</strong>：金点沿 y 轴爬、蓝点沿 x 轴滑；② <Katex tex="\sqrt{x}" /> 看<strong>端点</strong>：输出端改装定义域纹丝不动，输入端改装把整个定义域抬走（蓝端点横着走）；③ <Katex tex="1/x" /> 看<strong>渐近线</strong>：输入端改装挪动竖直渐近线，输出端改装挪动水平渐近线 —— 各自只动自己那一侧。</div>
    </div>

    <h3 class="sec" id="c5-why">左加右减的代数原理</h3>
    <p>「+h 却左移」不是约定，是解方程解出来的。设 <Katex tex="g(x)=f(x+h)" />，问：f 原来在 b 处的读数，现在出现在哪里？只要 <Katex tex="g(a)=f(b)" />，即 <Katex tex="a+h=b" />，所以：</p>
    <Katex tex="a=b-h" display />
    <p>f 的图象上每一个横坐标为 b 的点，在 g 的图象上出现在横坐标 b − h 处 —— <strong>所有点一致向左挪了 h</strong>。输入端的加法之所以"反直觉"，是因为传送带的方向与位移方向恰好相反：x+h 是"提前 h 报到"，提前报到等于把队伍往左挪。</p>

    <h3 class="sec" id="c5-dom">定义域跟着谁走</h3>
    <p>两个端口对定义域的待遇完全不同 —— 图 C5 预设 ② 是活证。设 <Katex tex="g(x)=f(x+h)" />，则：</p>
    <Katex tex="D(g)=\{x\mid x+h\in D(f)\}=D(f)-h" display />
    <p>右端的 "−h" 读作：定义域整体沿 x 轴平移 −h（h &gt; 0 即左移 h）。输出端改装 <Katex tex="f(x)+h" /> 只在输出端加常数，<strong>输入的 x 没变</strong>，定义域原封不动：√x + h 依然只能从 x = 0 出发，只是起点升高了 h。输入端改装 <Katex tex="f(x+h)=\sqrt{x+h}" /> 的输入规则变了，x 得满足 x + h ≥ 0，起点挪到 x = −h —— <strong>定义域跟着输入端平移，跟输出端无关</strong>。预设 ③ 的渐近线同理：竖直渐近线来自输入端无定义的位置，只随输入端改装移动。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「左加右减」背反直觉，就改成解方程。</strong>每次都问「f 的读数要抄到哪去」。</li>
        <li><strong>提示二：别把两个端口混用。</strong><Katex tex="f(x+h)+k" /> 是先左移再上移（两台机器串联），顺序在平移里可交换，但等到 G2 遇上伸缩就不可交换了；而 <Katex tex="f(2x)" />、<Katex tex="f(-x)" />、<Katex tex="|f(x)|" />、<Katex tex="f(|x|)" /> 是输入/输出端的另外四种改装（压缩、镜像、翻折），全部装备在 G1–G2 与 E8 逐个上线。</li>
      </ul>
    </div>
    <p>回收与预告：C1 承诺过"把 f 读成一台机器"，本章实现；导数定义 <Katex tex="f'(x)=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}" /> 里那个 x+h 正是输入端的自变量提前量 —— h 收缩到 0 的极限就是 V1 的割线 → 切线。机器观至此成为全模块的通用语言：S5 的对称翻译机、G 组的变换流程、V 组的变化率机，全是它的续作。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMachine } from '../../../boards/functions/concept/machine.js';
import { C_CHAPTERS } from './cnav.js';
</script>
