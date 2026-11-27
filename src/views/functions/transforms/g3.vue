<template>
  <ChPage :cur="3" no="G3" base="/functions/g" :chapters="G_CHAPTERS"
    title="变换顺序与由图反演" sub="把 ax−h 写成 a(x−h/a)，即可读出横向伸缩比例与位移。"
    :toc="[{ id: 'g3-fact', t: '提因子纪律（图 G3）' }, { id: 'g3-order', t: '顺序可换、平移量必换算' }, { id: 'g3-detect', t: '由图反演：读图三步' }]">
    <div class="note good"><strong>先提取横坐标的系数。</strong>在 <Katex tex="f(ax+b)" /> 中，令 <Katex tex="ax+b=0" />，可读出有向位移 <Katex tex="-b/a" />。画板取 <Katex tex="a,b>0" />。从原图得到 <Katex tex="y=b f(a(x-h))+k" /> 时，先将横坐标变为原来的 <Katex tex="1/a" /> 倍，再平移 <Katex tex="h" />；纵坐标先乘 <Katex tex="b" />，再加 <Katex tex="k" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createOrder" />
      <div class="cap">图 G3 · <b>变换的先后顺序</b>。对照两种读法的起点。切到反演模式，先对齐两条曲线的起点，再比较向右一个单位时的高度变化。</div>
    </div>

    <h3 class="sec" id="g3-fact">提因子纪律</h3>
    <p>经典易错现场：<Katex tex="y=f(2x-2)" /> 右移多少？把「−2」直接读成右移 2 就错了 —— <Katex tex="2x-2=2(x-1)" />，真平移量是 1。误读线与正确线在图 G3 模式一同框：当 <Katex tex="a=2,h=1,k=0" /> 时，金线从 <Katex tex="x=1" /> 起笔，红线从 <Katex tex="x=1/2" /> 起笔。判据只有一条：<strong>平移量必须从「x 的完整代数式」里读</strong>，括号里不是单独的 x，就得先把 a 提出去。提完因子，G1 的定理原样适用。</p>
    <p>为什么提因子是合法的？因为复合本身就是分步：<Katex tex="f(2x-2)" /> 可以是「先把图象右移 2 得 <Katex tex="f(x-2)" />，再横向压一半」，也可以是「先压一半得 <Katex tex="f(2x)" />，再右移 1 得 <Katex tex="f(2(x-1))" />」—— 两条流程终点相同。但注意平移量需换算：先移后压要移 2，先压后移只移 1（被压回一半）。</p>

    <h3 class="sec" id="g3-order">顺序可换、平移量必换算</h3>
    <p>两类横向变换之间（压与移），<strong>顺序可交换，但平移量必须换算</strong>：<Katex tex="\dfrac{h}{a}" /> 是先平移 h、再横向缩放后的有向位移。横与竖之间则天然互不干扰（输入端与输出端各自记录），先竖后横与先横后竖结果相同且无需换算 —— <Katex tex="f(2x)+3" /> 无论先压后升还是先升后压都一样。真正不可交换的，是「压与移」换算错误：那不是顺序错了，是<strong>没提因子</strong>。图 G3 的红虚线就是这一换算错误的图象化。</p>

    <h3 class="sec" id="g3-detect">由图反演：读图三步</h3>
    <p>先读金线最左边的端点 <Katex tex="(h,k)" />，再向右走一个单位。此处的高度比端点增加了 <Katex tex="c=b\sqrt a" />，因为 <Katex tex="b\sqrt{a(x-h)}+k=c\sqrt{x-h}+k" />。这样就能写出整条曲线的方程，也可以用另一个横坐标复核。</p>
    <p>最后试着反推缩放参数。取 <Katex tex="a=2,b=1" /> 或 <Katex tex="a=1/2,b=2" />，两次得到的 <Katex tex="c" /> 都是 <Katex tex="\sqrt 2" />。保持端点相同，画板会接受这两组解。若还标明原图上 <Katex tex="(1,1)" /> 对应哪个像点，就可以从该点的横、纵位移分别求出 <Katex tex="a,b" />。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：f(2x−2) 右移 2。</strong>提因子后是右移 1 —— 全章最大的易错点，模式一的红虚线专治它。</li>
        <li><strong>提示二：以为「先压再移」与「先移再压」结果不同。</strong>结果相同，只是平移量差 a 倍 —— 说「结果不同」时其实是有一边忘了换算。</li>
        <li><strong>提示三：检查参数能否分别确定。</strong>根式图象给出端点和合成的缩放系数。两条曲线完全重合时，滑块读数仍可能不同。</li>
      </ul>
    </div>
    <p>由图求式时，先找能独立确定参数的特征，如端点、对称轴、水平渐近线，再用其他点验证。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOrder } from '../../../boards/functions/transforms/orderlab.js';
import { G_CHAPTERS } from './gnav.js';
</script>

<style src="../properties/preset-row.css"></style>
