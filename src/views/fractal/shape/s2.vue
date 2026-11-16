<template>
  <ChPage :cur="2" no="形2" base="/fractal/s" :chapters="FX_CHAPTERS"
    title="科赫曲线"
    sub="每条线段三等分，中间一段折成等边三角形的两条边，如此反复。每一步长度乘 4/3，极限曲线处处连续、处处没有切线，围出的面积却收敛到一个有限值。"
    :toc="[{ id: 's2-build', t: '折线迭代' }, { id: 's2-length', t: '无穷的长度，有限的面积' }, { id: 's2-smooth', t: '连续但处处不可导' }, { id: 's2-tip', t: '四条提示' }]">
    <div class="note good">从单位线段起，每次把每条线段三等分、把中间一段换成等边三角形的两条边，极限曲线称为<b>科赫曲线</b>。第 <Katex tex="n" /> 层有 <Katex tex="4^n" /> 段，每段长 <Katex tex="3^{-n}" />，总长 <Katex tex="(4/3)^n\to\infty" />；相似维数为 <Katex tex="\ln4/\ln3\approx1.262" />。三条曲线首尾相接围成的闭曲线叫<b>科赫雪花</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createKoch" />
      <div class="cap">图 形2 · <b>科赫折线机</b>：拖动层数看折角逐层细化，切到雪花看闭合版本。看点：① 每层段数乘 4、每段长除 3，总长按 <Katex tex="(4/3)^n" /> 稳定上涨；② 层数 4 时曲线已占满一条带子，再折下去只是在同一带子里加细节；③ 雪花面积在层数增加时迅速稳定，周长却还在涨。</div>
    </div>

    <h3 class="sec" id="s2-build">折线迭代</h3>
    <p>把单位线段 <Katex tex="[0,1]" /> 三等分，中间那一段 <Katex tex="[1/3,2/3]" /> 换成两条边长为 <Katex tex="1/3" /> 的折线，形成向上凸的等边三角形缺底。第一步得到 4 段，每段长 <Katex tex="1/3" />，总长 <Katex tex="4/3" />。</p>
    <p>对每一段重复同样的动作，得到第 2 层、第 3 层。第 <Katex tex="n" /> 层的折线由 <Katex tex="4^n" /> 段组成，每段长 <Katex tex="3^{-n}" />。层数趋于无穷，折线在每一点都收敛——相邻两层的对应点距离不超过 <Katex tex="3^{-n}" />，是柯西列。</p>
    <p>极限曲线是自相似集：4 个缩到 <Katex tex="1/3" /> 的副本首尾相接。按相似维数公式，<Katex tex="D=\ln4/\ln3" />。</p>
    <p>雪花版本从正三角形出发，在三条边上各做一次科赫替换。因为同时保留了三角形内部的面积，围出的图形是闭曲线，适合讨论面积与周长。</p>

    <h3 class="sec" id="s2-length">无穷的长度，有限的面积</h3>
    <p>第 <Katex tex="n" /> 层总长 <Katex tex="L_n=(4/3)^n" />。底数大于 1，<Katex tex="L_n\to\infty" />：曲线在有限区域内盘绕出无限长的边界。</p>
    <p>雪花的面积却收敛。初始正三角形面积记为 <Katex tex="A_0=\sqrt3/4" />。第 <Katex tex="n" /> 步新增 <Katex tex="3\cdot4^{n-1}" /> 个小三角形，边长 <Katex tex="3^{-n}" />，面积为 <Katex tex="(\sqrt3/4)3^{-2n}" />。总和</p>
    <p style="text-align:center"><Katex display tex="A=A_0\left[1+\sum_{n=1}^{\infty}3\cdot4^{n-1}\cdot9^{-n}\right]=A_0\left[1+\frac13\cdot\frac{1}{1-4/9}\right]=\frac85A_0." /></p>
    <p>面积是初始三角形的 <Katex tex="8/5" />，约 1.6 倍；周长却是无穷大。边界长度与内部面积在这里彻底脱钩，这正是「海岸线可以无限长、岛屿面积却有限」的几何原型。</p>

    <h3 class="sec" id="s2-smooth">连续但处处不可导</h3>
    <p>科赫曲线是连续曲线：层数增加时整条折线一致收敛。但它没有一条切线。任取曲线上的点，放大任意倍数，看到的仍是折角——曲线在每一层都把方向改变 60 度，层数越深，折角越密。</p>
    <p>用差商说：取曲线上距离为 <Katex tex="h" /> 的两点，当 <Katex tex="h" /> 落在第 <Katex tex="n" /> 层某段的尺度上时，差商的绝对值至少有某个正常数，不会随 <Katex tex="h\to0" /> 收敛到一个极限。导数不存在，不是个别点，而是处处。</p>
    <p>十九世纪的数学家普遍认为连续函数最多在少数点不可导。魏尔斯特拉斯、科赫这类例子说明「连续」与「光滑」之间隔着很宽的地带，分形几何后来把这片地带系统化。</p>

    <h3 class="sec" id="s2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：长度乘的是 4/3，不是 1/3。</strong>每层段数乘 4、每段长乘 1/3，合起来长度乘 4/3。只盯着单段变短，会误以为总长在减。</li>
        <li><strong>提示二：雪花的周长与面积要分开算。</strong>周长趋于无穷，面积收敛到 <Katex tex="8A_0/5" />。两个结论不矛盾，量的是不同的东西。</li>
        <li><strong>提示三：维数 1.262 介于线与面之间。</strong>曲线不是直线段，也没填满面积，所以维数落在 1 与 2 之间。数值越接近 2，曲线在平面上盘得越满。</li>
        <li><strong>提示四：连续推不出可导。</strong>科赫曲线处处连续、处处不可导。判断光滑性要看差商的极限，不能凭「看起来连成一条」下结论。</li>
      </ul>
    </div>
    <p>回收与预告：科赫曲线用 4 个三分之一副本围出无限周长。把同样的「挖中间」搬到二维，让保留块数增长得更快，就得到谢尔宾斯基三角与地毯——面积趋于零，边界却越挖越长。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createKoch } from '../../../boards/fractal/shape/koch.js';
import { FX_CHAPTERS } from './fxnav.js';
</script>
