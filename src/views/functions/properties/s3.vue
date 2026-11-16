<template>
  <ChPage :cur="3" no="S3" base="/functions/s" :chapters="S_CHAPTERS"
    title="奇偶性：镜像折叠" sub="偶函数沿 y 轴折拢、奇函数绕原点转半圈 —— 折过去完全重合，才是定义里的「任意 x」答应过的话。"
    :toc="[{ id: 's3-def', t: '定义（图 S3）' }, { id: 's3-rule', t: '判定三步与运算性质' }, { id: 's3-warn', t: '三处易错' }]">
    <div class="note good" id="s3-def"><strong>偶函数</strong>：设 f(x) 定义域为 D，若对任意 <Katex tex="x\in D" /> 都有 <Katex tex="-x\in D" /> 且 <Katex tex="f(-x)=f(x)" />，则 f 为偶函数，图象关于 <strong>y 轴对称</strong>；<strong>奇函数</strong>：把等号右边换成 <Katex tex="f(-x)=-f(x)" />，图象关于<strong>原点中心对称</strong>。两个前提固定口径：<strong>−x 也得在定义域里</strong>（D 必须关于原点对称），且是<strong>任意 x</strong> —— 和 S1 的「任取」同一含义。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFoldMirror" />
      <div class="cap">图 S3 · <b>奇偶折叠机</b>：滑块 t 把 <Katex tex="x>0" /> 的半张图折过去 —— 金线是折叠过程，蓝线是左半的「对照组」；① <Katex tex="x^2" /> 沿 y 轴折拢完全重合（偶），② <Katex tex="x^3" /> 绕原点转半圈完全重合（奇），③ <Katex tex="1/x" /> 连渐近线都关于原点对称，④ <Katex tex="\sqrt{x}" /> 折过去对面空无一物 —— <strong>定义域不关于原点对称，前提就不满足</strong>；⑤ <Katex tex="x^2+x" /> 定义域对称却折不拢：非奇非偶。折毕徽章做逐点验收（最大偏差），折叠只是演示，验收才是定义。</div>
    </div>

    <h3 class="sec" id="s3-rule">判定三步与运算性质</h3>
    <p>拿到 <Katex tex="f(x)=\lg(x^2)" /> 这类待判定对象，三步走：<strong>① 查定义域</strong>是否关于原点对称（不对称则直接排除，如 <Katex tex="f(x)=\sqrt{x}" />、<Katex tex="f(x)=x^2,\ x\in[-1,2]" />）；<strong>② 写出 f(−x)</strong> 并化简；<strong>③ 与 ±f(x) 对照</strong>：等于 f(x) 是偶，等于 −f(x) 是奇，都不等就非奇非偶。第 ② 步动笔：<Katex tex="f(-x)=\lg((-x)^2)=\lg(x^2)=f(x)" /> —— 偶；但 <Katex tex="g(x)=2\lg x" /> 定义域只剩一半（C2 已指出的情形），第 ① 步就不通过。</p>
    <p>常用性质直接背：<strong>奇函数若在 x=0 有定义，必有 f(0)=0</strong>（<Katex tex="f(0)=-f(0)" /> 唯有零解 —— 图 S3 ② 的原点金圈）；运算律 <strong>奇±奇=奇、偶±偶=偶、奇×奇=偶、偶×偶=偶、奇×偶=奇</strong>；一次、三次、<Katex tex="1/x" />、<Katex tex="\sin x" /> 是奇，<Katex tex="x^2" />、<Katex tex="|x|" />、<Katex tex="\cos x" /> 是偶 —— 幂函数的奇偶随指数 α 一起改变，E3 再展开。</p>

    <h3 class="sec" id="s3-warn">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不看定义域就折叠。</strong><Katex tex="f(x)=\sqrt{x}" /> 图象看着「像半个偶函数」，但 f(−1) 不存在，<Katex tex="-x\in D" /> 不成立 —— 奇偶性是<strong>定义域整体</strong>的性质，不是图象形状的观感。图 S3 ④ 折过去金线悬空，就是这个下场。</li>
        <li><strong>提示二：抽查当判定。</strong>验证 <Katex tex="f(1)=f(-1)" />、<Katex tex="f(2)=f(-2)" /> 就宣布「偶」，和 S1 的两点抽查同罪 —— 定义要的是任意 x。作差/代换化简到 <Katex tex="f(-x)=\pm f(x)" /> 恒成立才算数，图 S3 的折叠验收（逐点算最大偏差）演示的就是「全查」。</li>
        <li><strong>提示三：奇偶与单调混着报。</strong>「奇函数在对称区间上单调性相同」是结论不是定义，前提是区间关于原点对称；偶函数则恰恰相反（对称区间增减相反 —— 图 S1 ① 的等高回折就是偶性的病灶）。先用奇偶后谈单调，顺序不能反。</li>
      </ul>
    </div>
    <p>回收与预告：C2 的「同一函数」在这里成了口径来源（化简前先核对定义域）；S1 的任取两点与本章的任意 x 是同一种思想；下一讲 S4 谈「有界」—— 偶函数若有上界必有下界，想想为什么；S5 对称性专题把「沿 y 轴折拢」推广成 <Katex tex="f(a+x)=f(b-x)" /> 的任意对称轴 —— 由一半写另一半的表达式机在那里等着。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFoldMirror } from '../../../boards/functions/properties/foldmirror.js';
import { S_CHAPTERS } from './snav.js';
</script>
