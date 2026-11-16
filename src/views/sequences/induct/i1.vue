<template>
  <ChPage :cur="1" no="归1" base="/sequences/i" :chapters="IQ_CHAPTERS"
    title="数学归纳法的原理与书写"
    sub="要证明一个涉及正整数的命题对一切 n 成立，验证第一项并且证明「前一成立则后一成立」，两步就够了。这条推理的依据是自然数的顺序结构。"
    :toc="[{ id: 'i1-two', t: '两步' }, { id: 'i1-why', t: '为什么两步够' }, { id: 'i1-format', t: '书写格式' }, { id: 'i1-pit', t: '起点、假设与跨步' }]">
    <div class="note good">设 <Katex tex="P(n)" /> 是关于正整数 <Katex tex="n" /> 的命题。<strong>数学归纳法</strong>：① 证明 <Katex tex="P(1)" /> 成立；② 假设 <Katex tex="P(k)" /> 成立（<Katex tex="k" /> 为任意正整数），证明 <Katex tex="P(k+1)" /> 也成立。两步齐备，则 <Katex tex="P(n)" /> 对一切正整数 <Katex tex="n" /> 成立。</div>
    <div class="board-wrap">
      <BoardMount :factory="createDomino" />
      <div class="cap">图 归1 · <b>递推链机</b>：每张卡片是一个命题 <Katex tex="P(n)" />。绿色是已经成立的，金色是正在推的下一张，箭头是「由 <Katex tex="P(k)" /> 推出 <Katex tex="P(k+1)" />」。拖动滑块或按「推进一步」，看已证的范围怎样一节一节延长。第一步保证链有起点，第二步保证每一节都能接上。</div>
    </div>

    <h3 class="sec" id="i1-two">两步</h3>
    <p><strong>第一步（奠基）。</strong>验证 <Katex tex="n" /> 取第一个值（通常是 1）时命题成立。这一步通常只是一个简单的代入，但不能省。</p>
    <p><strong>第二步（递推）。</strong>假设 <Katex tex="n=k" /> 时命题成立，由此证明 <Katex tex="n=k+1" /> 时命题也成立。这一步是整个证明的主体，要把「<Katex tex="P(k)" />」这个假设真的用进推导里。</p>
    <p>两步合起来的效果，就是图 归1 的链条：第一张立住，之后每一张都由前一张推出来，于是整排卡片依次成立。归纳法不是「验证很多项后下结论」，而是「一次性地证明了一个可以逐节传递的推理」。</p>
    <p>这里的 <Katex tex="k" /> 是任意的：第二步必须对一般的 <Katex tex="k" /> 成立，而不能只对某几个具体的 <Katex tex="k" /> 验算。若把第二步写成「<Katex tex="k=1" /> 时成立推 <Katex tex="k=2" /> 时成立」，那只是又做了一次奠基，接不成链。</p>

    <h3 class="sec" id="i1-why">为什么两步够</h3>
    <p>用反证法说明。设两步都已证明，但存在某个正整数使命题不成立。取其中最小的一个，记为 <Katex tex="N" />。由第一步，<Katex tex="N\ne1" />，所以 <Katex tex="N-1" /> 仍是正整数。由于 <Katex tex="N" /> 是使命题不成立的最小者，<Katex tex="N-1" /> 处命题成立；再由第二步，<Katex tex="N" /> 处命题也成立，与假设矛盾。</p>
    <p>这里用到的是自然数的一个基本性质：任意非空的正整数集合都有最小元素。归纳法的合理性就建立在这一点上，它与「可以无限地数下去」是同一件事的两种说法。</p>
    <p>反过来说，两步中缺任何一步都不行。只证第一步，命题只在一个点上成立；只证第二步，推理链没有起点，什么也推不出来。图 归1 把这两种缺陷画成「孤零零一张绿卡」与「一排灰卡中间断掉」两种状态。</p>

    <h3 class="sec" id="i1-format">书写格式</h3>
    <p>规范的写法分四段，每一段都不能少：</p>
    <p style="text-align:center">① 奠基：当 <Katex tex="n=1" /> 时，左边 <Katex tex="=\dots" />，右边 <Katex tex="=\dots" />，等式成立。</p>
    <p style="text-align:center">② 假设：假设当 <Katex tex="n=k" />（<Katex tex="k\in\mathbb{N}^*" />）时命题成立，即 <Katex tex="\dots" />。</p>
    <p style="text-align:center">③ 推证：当 <Katex tex="n=k+1" /> 时，由假设得 <Katex tex="\dots" />，化简得 <Katex tex="\dots" />，命题也成立。</p>
    <p style="text-align:center">④ 结论：由 ①② 知，对一切正整数 <Katex tex="n" />，命题成立。</p>
    <p>第 ③ 段是唯一需要动脑的部分，其余三段是固定格式。写第 ③ 段时，要紧扣「<Katex tex="n=k+1" /> 时的目标式」，把假设代进去，朝目标式化简，而不是从假设出发随意变形。方向反了，容易绕不出来。</p>
    <p>常见的目标式有两类：等式（把 <Katex tex="n=k+1" /> 时的左右两边分别算出来对照），与递推关系（把 <Katex tex="a_{k+1}" /> 用 <Katex tex="a_k" /> 表示，再代入假设）。后者见 归2。</p>

    <h3 class="sec" id="i1-pit">起点、假设与跨步</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：起点不一定是 1。</strong>命题从 <Katex tex="n=2" /> 或 <Katex tex="n=3" /> 才有意义时（例如多边形内角和），奠基要验对应的第一个值，结论也只覆盖从那一点起的正整数。</li>
        <li><strong>提示二：第二步必须用到假设。</strong>如果推证过程中一次也没用到「<Katex tex="P(k)" /> 成立」，那么这一步实际上直接证明了「对一切 <Katex tex="k" />，<Katex tex="P(k+1)" /> 成立」，与归纳无关。这样的写法要么是另有隐情，要么是漏了步骤。</li>
        <li><strong>提示三：跨步归纳要验两个起点。</strong>若递推只能跨两步（由 <Katex tex="P(k)" /> 与 <Katex tex="P(k+1)" /> 推 <Katex tex="P(k+2)" />），奠基必须验 <Katex tex="n=1" /> 与 <Katex tex="n=2" /> 两个值，否则链会缺一环。</li>
        <li><strong>提示四：验算有限项不等于证明。</strong>验了前十项都成立，只能说明前十项成立。归纳法的力量在于第二步对任意 <Katex tex="k" /> 都成立，这与「多验几项」有本质区别。</li>
        <li><strong>提示五：<Katex tex="k" /> 的范围要写清。</strong>第二步中的 <Katex tex="k" /> 必须是「任意正整数」或「不小于起点的整数」，不能默认它取某个特定值。写「假设 <Katex tex="k=3" /> 时成立」就把归纳退化成了特例验证。</li>
      </ul>
    </div>
    <p>回收与预告：归纳法的两步与 递1 的递推式结构相同——一个起点加一条传递规则。归2 讲「先算几项猜出通项，再用归纳法证明」的完整流程，把猜测与证明接起来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDomino } from '../../../boards/sequences/induct/domino.js';
import { IQ_CHAPTERS } from './inav.js';
</script>
