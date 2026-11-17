<template>
  <ChPage :cur="1" no="群1" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="群的定义与例子"
    sub="四条公理只谈运算，不谈元素是什么。模 4 加法、克莱因四元群与三次对称群的运算表都满足同样的条件，交换性却各不相同。"
    :toc="[{ id: 'g1-def', t: '四条公理' }, { id: 'g1-ex', t: '三个例子' }, { id: 'g1-abel', t: '交换与非交换' }, { id: 'g1-tip', t: '四条提示' }]">
    <div class="note good">集合 <Katex tex="G" /> 上的二元运算若满足：① 封闭；② 结合律；③ 存在幺元 <Katex tex="e" />；④ 每个元素 <Katex tex="a" /> 有逆元 <Katex tex="a^{-1}" /> 使 <Katex tex="aa^{-1}=a^{-1}a=e" />，则称 <Katex tex="G" /> 为<b>群</b>。元素个数叫群的<b>阶</b>。若运算还满足交换律，称为<b>交换群</b>（阿贝尔群）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createExample" />
      <div class="cap">图 群1 · <b>运算表</b>：<Katex tex="\mathbb{Z}_4" />、<Katex tex="V_4" />、<Katex tex="S_3" /> 三张运算表轮流显示。看点：① 金格是结果为幺元的位置，每行每列恰有一个；② <Katex tex="V_4" /> 与 <Katex tex="S_3" /> 都非循环，阶与结构却不同；③ <Katex tex="S_3" /> 的表不关于对角线对称，是最小的非交换群。</div>
    </div>

    <h3 class="sec" id="g1-def">四条公理</h3>
    <p>封闭是说运算不越界；结合律让三重乘积可以不加括号；幺元是「乘了等于没乘」的元素；逆元是「乘回去抵消」的元素。四条缺一不可，缺哪条都得换名字：缺逆元叫幺半群，缺幺元只有半群。</p>
    <p>幺元与逆元都由元素唯一确定：幺元只有一个，每个元素的逆元也只有一个。求逆把群映到自己，且 <Katex tex="(ab)^{-1}=b^{-1}a^{-1}" />，顺序要反。</p>
    <p>有限群的运算表每行每列都是元素的一个排列，称为拉丁方性质。画板把这一性质画成「金格每行每列恰一个」，扫一眼就能核对。</p>

    <h3 class="sec" id="g1-ex">三个例子</h3>
    <p><Katex tex="\mathbb{Z}_4=\{0,1,2,3\}" /> 按模 4 加法成群，阶为 4。它由单个元素 1 反复相加生成，这样的群叫循环群；同阶循环群彼此同构。</p>
    <p>克莱因四元群 <Katex tex="V_4=\{e,a,b,c\}" /> 中每个非幺元都满足 <Katex tex="x^2=e" />，任意两个非幺元的积是第三个。它也交换，但不像 <Katex tex="\mathbb{Z}_4" /> 那样有一个阶 4 的元素。</p>
    <p><Katex tex="S_3" /> 是 <Katex tex="\{1,2,3\}" /> 上六个置换按复合构成的群，阶为 6。它包含三个阶 2 的换位与两个阶 3 的三轮换，运算不交换。</p>

    <h3 class="sec" id="g1-abel">交换与非交换</h3>
    <p>交换群里 <Katex tex="ab=ba" /> 恒成立，运算表的对角线两侧镜像对称。画板上 <Katex tex="S_3" /> 的表不对称，一眼就能看出哪个位置出问题。</p>
    <p>非交换群在几何里很常见：旋转与翻转复合依赖顺序，正多边形的对称群通常非交换。把书转 90 度再翻面，与先翻再转，结果不同。</p>
    <p>交换性是额外条件，不是群的定义。默认「群都交换」会把大量例子排除在外，也会把 <Katex tex="S_3" /> 这类关键例子误判。</p>

    <h3 class="sec" id="g1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：阶是元素个数。</strong>群的阶写作 <Katex tex="|G|" />，元素的阶是它自乘多少次回到幺元，两者别混用。</li>
        <li><strong>提示二：幺元依赖运算。</strong>模 4 加法群幺元是 0，模 4 乘法群幺元是 1。换运算就重新找幺元。</li>
        <li><strong>提示三：V₄ 与 Z₄ 不同构。</strong>两者阶都是 4，但 <Katex tex="\mathbb{Z}_4" /> 有阶 4 元素，<Katex tex="V_4" /> 没有。同阶不等于同构。</li>
        <li><strong>提示四：验证逆元要双向。</strong>只算出一边乘回幺元，还不足以断定逆元存在；两边同时成立才算。</li>
      </ul>
    </div>
    <p>回收与预告：群一旦确定，就可以在它里面挑一部分元素单独成团。子群与陪集把群切成等大的若干块，块的数目整除群的阶。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createExample } from '../../../boards/algebra/groupt/example.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
