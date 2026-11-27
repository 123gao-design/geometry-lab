<template>
  <ChPage :cur="3" no="S3" base="/functions/s" :chapters="S_CHAPTERS"
    title="奇偶性：镜像折叠" sub="偶函数关于 y 轴对称，奇函数关于原点对称，两种判定都要求定义域关于原点对称。"
    :toc="[{ id: 's3-def', t: '定义（图 S3）' }, { id: 's3-rule', t: '判定三步与运算性质' }, { id: 's3-warn', t: '三处易错' }]">
    <div class="note good" id="s3-def">设函数 <Katex tex="f" /> 的定义域为 <Katex tex="D" />。先检查定义域是否关于原点对称，即每个 <Katex tex="x\in D" /> 都满足 <Katex tex="-x\in D" />。在此前提下，若恒有 <Katex tex="f(-x)=f(x)" />，则为<strong>偶函数</strong>，图象关于 <Katex tex="y" /> 轴对称；若恒有 <Katex tex="f(-x)=-f(x)" />，则为<strong>奇函数</strong>，图象关于原点对称。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFoldMirror" />
      <div class="cap">图 S3 · <b>奇偶性的图象特征</b>。拖动金色点选择取样位置，再把变换进度推到末端。青色像点标出金色点变换后的位置，可与蓝色原图对照。</div>
    </div>

    <h3 class="sec" id="s3-rule">判定三步与运算性质</h3>
    <p>拿到 <Katex tex="f(x)=\lg(x^2)" /> 这类待判定对象，三步走：<strong>① 查定义域</strong>是否关于原点对称（不对称则直接排除，如 <Katex tex="f(x)=\sqrt{x}" />、<Katex tex="f(x)=x^2,\ x\in[-1,2]" />）；<strong>② 写出 <Katex tex="f(-x)" /></strong> 并化简；<strong>③ 与 <Katex tex="\pm f(x)" /> 对照</strong>：恒等于 <Katex tex="f(x)" /> 是偶，恒等于 <Katex tex="-f(x)" /> 是奇，都不等就非奇非偶。第 ② 步动笔：<Katex tex="f(-x)=\lg((-x)^2)=\lg(x^2)=f(x)" /> —— 偶；但 <Katex tex="g(x)=2\lg x" /> 定义域只剩一半（C2 已指出的情形），第 ① 步就不通过。</p>
    <p>常用性质直接背：<strong>奇函数若在 <Katex tex="x=0" /> 有定义，必有 <Katex tex="f(0)=0" /></strong>（<Katex tex="f(0)=-f(0)" /> 唯有零解 —— 图 S3 ② 的原点金圈）；运算律 <strong>奇±奇=奇、偶±偶=偶、奇×奇=偶、偶×偶=偶、奇×偶=奇</strong>；一次、三次、<Katex tex="1/x" />、<Katex tex="\sin x" /> 是奇，<Katex tex="x^2" />、<Katex tex="|x|" />、<Katex tex="\cos x" /> 是偶 —— 幂函数的奇偶随指数 α 一起改变，E3 再展开。</p>

    <h3 class="sec" id="s3-warn">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不看定义域就折叠。</strong><Katex tex="f(x)=\sqrt{x}" /> 图象看着「像半个偶函数」，但 <Katex tex="f(-1)" /> 无定义，<Katex tex="-x\in D" /> 不成立 —— 奇偶性是<strong>定义域整体</strong>的性质，不是图象形状的观感。图 S3 ④ 折过去金线悬空，就是这个下场。</li>
        <li><strong>提示二：检验全部自变量。</strong>有限取样可用于找反例。判定奇偶性时，先检查定义域关于原点对称，再证明 <Katex tex="f(-x)=f(x)" /> 或 <Katex tex="f(-x)=-f(x)" /> 在定义域上恒成立。</li>
        <li><strong>提示三：奇偶与单调混着报。</strong>「奇函数在对称区间上单调性相同」是结论不是定义，前提是区间关于原点对称；偶函数则恰恰相反（对称区间增减相反 —— 图 S1 ① 的等高回折就是偶性的病灶）。先用奇偶后谈单调，顺序不能反。</li>
      </ul>
    </div>
    <p>回收与预告：C2 的「同一函数」在这里成了口径来源（化简前先核对定义域）；S1 的任取两点与本章的任意 x 是同一种思想；下一讲 S4 谈「有界」—— 奇函数若有上界必有下界，想想为什么；S5 对称性专题把「沿 y 轴折拢」推广成 <Katex tex="f(a+x)=f(b-x)" /> 的任意对称轴 —— 由一半写另一半的表达式机在那里等着。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFoldMirror } from '../../../boards/functions/properties/foldmirror.js';
import { S_CHAPTERS } from './snav.js';
</script>

<style src="../concept/function-picker.css"></style>
