<template>
  <ChPage :cur="2" no="G2" base="/functions/g" :chapters="G_CHAPTERS"
    title="伸缩与翻折：横除纵乘" sub="$y=b\cdot f(ax)$ —— 横向压到 $1/a$、纵向拉到 $b$ 倍；负号自带翻折：$a<0$ 沿 y 轴、$b<0$ 沿 x 轴。横是除、纵是乘，又一对方向相反的算术。"
    :toc="[{ id: 'g2-law', t: '伸缩定理：为什么横是除（图 G2）' }, { id: 'g2-sign', t: '负号：翻折就是乘 −1' }, { id: 'g2-pit', t: '横纵混淆与易错点' }]">
    <div class="note good" id="g2-law"><strong>伸缩定理</strong>：<Katex tex="y=f(ax)" /> 把 <Katex tex="y=f(x)" /> 的图象横向变为原来的 <Katex tex="\dfrac{1}{a}" />（a&gt;1 压缩、0&lt;a&lt;1 拉伸）；<Katex tex="y=b\,f(x)" /> 纵向变为原来的 b 倍。图上的点 <Katex tex="(x_0,y_0)" /> 变到 <Katex tex="\left(\dfrac{x_0}{a},\ b\,y_0\right)" /> —— 横坐标除、纵坐标乘，方向相反。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFold" />
      <div class="cap">图 G2 · <b>伸缩翻折机</b>：原图 <Katex tex="\sqrt{x}"/> 固定，a、b 两个滑块从正拖到负 —— 曲线先塌缩再从另一侧展开，翻折由符号一并决定，无需另设开关。特征点 (1,1)、(4,2) 与它们的像实时核验；探针连线读出「横除纵乘」。</div>
    </div>

    <h3 class="sec" id="g2-law">伸缩定理：为什么横是除</h3>
    <p>纵向直觉顺畅：乘在输出端，几倍就是几倍高。横向别扭同 G1：变换写在输入端，就要<strong>反解</strong> —— 令 <Katex tex="ax=t" />，则 <Katex tex="x=\dfrac{t}{a}" />：要导出原来的输入 t，新图象只用到 x 轴上的 <Katex tex="\dfrac{1}{a}" /> 段 —— 所以 <Katex tex="f(2x)" /> 是把图象<strong>压扁</strong>一半，不是拉宽，更不是右移。验证最快：<Katex tex="y=\sqrt{2x}" /> 在 x=½ 处取到原 <Katex tex="x=1" /> 的值 1 —— 特征点 (1,1) 移到了 (½,1)，横向确实减半。图 G2 的探针连线把这个「除」画在图上：原图点横坐标 1.00，a=2 时像点横坐标 0.50。</p>
    <p>横纵记录对照 G1 一张表收齐：<strong>平移用加减（横内竖外）、伸缩翻折用乘除（横内竖外）</strong> —— 位置变用加减、形状变用乘除；写在括号里管横、写在括号外管纵。这两句把 G1+G2 的所有公式装订成册。</p>

    <h3 class="sec" id="g2-sign">负号：翻折就是乘 −1</h3>
    <p><Katex tex="f(-x)" />：a=−1 的横向伸缩 —— 输入端乘 −1，图象沿 <strong>y 轴</strong>翻折（S3 的偶函数判据、E8 的 <Katex tex="f(|x|)" /> 都是它的对应形式）；<Katex tex="-f(x)" />：b=−1 的纵向伸缩 —— 输出端乘 −1，图象沿 <strong>x 轴</strong>翻折（E8 的 <Katex tex="|f|" /> 翻上来的镜像对偶）。翻折不必单独背：它就是「乘 −1 的伸缩」，<strong>符号管镜像、绝对值管幅度</strong> —— 图 G2 把 a 从 2 拖到 −2，曲线连续地压扁、塌缩、再从左边展开，翻折是伸缩连续过渡的结果，不是另一次跳变。</p>

    <h3 class="sec" id="g2-pit">横纵混淆与易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：f(2x) 不是「横坐标乘 2」。</strong>输入端要反解 —— 横坐标<b>除以</b> 2；把它当「拉宽」或「右移」都是同一类错。</li>
        <li><strong>提示二：横缩后零点也移动。</strong><Katex tex="x^2\to(2x)^2=4x^2" />，零点位置没动，但 <Katex tex="(x-3)^2\to(2x-3)^2" /> 的零点从 3 移到 1.5 —— 横向变换对所有 x 记录，不只对特殊点。</li>
        <li><strong>提示三：a=0 或 b=0 是排除态。</strong><Katex tex="f(0\cdot x)=f(0)" /> 全线塌成常数、<Katex tex="0\cdot f(x)" /> 值域归零 —— 伸缩机要求系数非零，图 G2 拖到 0 会显示警告。</li>
      </ul>
    </div>
    <p>回收与预告：S3 折叠机的「绕原点转半圈」= 横竖同时乘 −1；E8 全族（|f|、f(|x|)）在翻折语义下复现；C4 的折线在横向压缩下阶梯宽度变短。往后 G3 把 G1 的平移与 G2 的伸缩串成多步流程 —— 顺序与提因子的规则是图象变换的最后一关，也是高考「由图反演」题的关键。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFold } from '../../../boards/functions/transforms/stretchfold.js';
import { G_CHAPTERS } from './gnav.js';
</script>
