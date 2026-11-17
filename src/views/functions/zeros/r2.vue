<template>
  <ChPage :cur="2" no="R2" base="/functions/r" :chapters="R_CHAPTERS"
    title="存在性定理：端点异号必有零点" sub="连续 + $f(a)\cdot f(b)<0$ $\Rightarrow$ (a,b) 内必有零点 —— 只保证「有」：不给位置、不给个数、条件充分不必要。唯一性要另请单调。"
    :toc="[{ id: 'r2-thm', t: '定理与验证（图 R2）' }, { id: 'r2-why', t: '为什么连续不可少' }, { id: 'r2-ext', t: '三条拓展与易错点' }]">
    <div class="note good" id="r2-thm"><strong>零点存在性定理</strong>：若 <Katex tex="y=f(x)" /> 在闭区间 <Katex tex="[a,b]" /> 上连续，且 <Katex tex="f(a)\cdot f(b)<0" />（端点异号），则存在 <Katex tex="c\in(a,b)" /> 使 <Katex tex="f(c)=0" />。一句话：连续曲线从 x 轴下方走到上方（或反过来），中途必有穿轴点。三个「不」要记牢：<strong>不给位置</strong>（c 在哪另算）、<strong>不给个数</strong>（一个也行、三个也行 —— 图 R2 ① 实况 3 个）、<strong>条件不必不可少</strong>（同号也可能有零点 —— 图 R2 ②）。它的价值在于给算法兜底：只要异号区间在手上，R3 的二分法就有了依据。</div>
    <div class="board-wrap">
      <BoardMount :factory="createIvtWitness" />
      <div class="cap">图 R2 · <b>零点存在定理</b>：两个把手 a、b 锁在曲线上拖（只改横坐标），绿带就是区间、灰点是零点实况。① 连续异号 <Katex tex="\to"/> 存在，实况 3 个 —— 定理只承诺「至少一个」；② <Katex tex="x^2"/> 同号却有零点 —— 「充分不必要」现场；③ 分段函数在 0.5 处跳变 3 格：端点异号、区间内却无零点 —— 连续性被偷走，定理失效；④ <Katex tex="x^3+x-1"/> 严格单调 + 异号 <Katex tex="\to"/> 存在且唯一，实况恰好对上。</div>
    </div>

    <h3 class="sec" id="r2-why">为什么连续不可少</h3>
    <p>「连续」承担的是「不许跳跃」：连续意味着图象一笔不断，从负值要变到正值只能<strong>经过零</strong>。图 R2 ③ 把这条线剪断 —— 左支在 0.5 处仍是 +1.5，右支已经跳到 −1.5，中间的零被「跳过」而不是「经过」：端点照样异号，零点却不存在。做题时<strong>先验连续</strong>再引用定理：端点要有值（闭区间才有资格谈端点）、区间内不许有间断点、分段函数要查接头处。</p>

    <h3 class="sec" id="r2-ext">三条拓展与易错点</h3>
    <p><strong>拓展一（唯一性）</strong>：在定理条件上再加「f 在 [a,b] 上严格单调」，则零点<strong>存在且唯一</strong> —— 反证：若有两个零点 <Katex tex="c_1<c_2" />，则 <Katex tex="f(c_1)=f(c_2)=0" />，与严格单调（S1：任取两点函数值必不等）矛盾。唯一性的来源是单调，不是定理本身。<strong>拓展二（同号不等于无零点）</strong>：<Katex tex="f(x)=x^2" /> 在 <Katex tex="[-1,1]" /> 上端点同号，零点 0 却确实存在 —— R1 的提示三在这里上升为定理层面的表述：f(a)f(b)&lt;0 是「保证有」的充分条件，不是「有没有」的判据。<strong>拓展三（端点为零）</strong>：若 f(a)=0，a 自己就是零点，但它在区间端点、不在开区间内部 —— 所以定理写严格不等号 <Katex tex="f(a)\cdot f(b)<0" />，端点为零的情形不必动用定理（零点直接找到了）。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把「<Katex tex="<0"/>」写成「<Katex tex="\le 0"/>」。</strong>端点为零时零点就在端点上，用不着定理「保证存在」—— 严格不等号是给<strong>内部</strong>零点保留。</li>
        <li><strong>提示二：用定理前不验连续。</strong>定义域没含端点、分段接头断开（图 R2 ③）都会使定理失效。</li>
        <li><strong>提示三：把存在说成唯一。</strong>「由零点存在性定理，f 在 (a,b) 内有且仅有一个零点」是典型错误表述 —— 定理只给存在；要说唯一，必须补一句单调性。答题模板：连续 + 异号 <Katex tex="\Rightarrow"/> 存在；连续 + 异号 + 单调 <Katex tex="\Rightarrow"/> 存在且唯一。</li>
      </ul>
    </div>
    <p>回收与预告：S1 的单调性在这里给出「唯一性」；R1 的二重零点解释了为什么同号也可能有零点；定理只说「有」、不说「在哪」—— 下一讲 R3 的二分法把「有」变成「逐步逼近」：每一步都是在更小的区间上重新应用一次这一定理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIvtWitness } from '../../../boards/functions/zeros/ivtwitness.js';
import { R_CHAPTERS } from './znav.js';
</script>
