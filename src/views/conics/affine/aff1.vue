<template>
  <ChPage :cur="1" no="A1" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="伸缩变换：把圆压扁就是椭圆" sub="圆是椭圆的 k=1 特例；仿射变换保相切、保平行、保中点、保面积比 —— 一大批椭圆结论可以回圆里秒证。"
    :toc="[{ id: 'a1-lab', t: '伸缩变换（图 A1）' }, { id: 'a1-der', t: '推导：圆的像与切线的像' }, { id: 'a1-inv', t: '不变量清单' }, { id: 'a1-why', t: '为什么「回到圆」合法' }]">
    <div class="note good"><strong>本讲主角</strong>：竖直伸缩变换 <Katex tex="T_k:\ (x,\,y)\mapsto(x,\ k\,y)" />（<Katex tex="k>0" />）。它把每个点竖直方向按比例 k 挪动，水平不动。取 <Katex tex="k=\tfrac{b}{a}" />，它把圆 <Katex tex="x^2+y^2=a^2" /> 压成椭圆 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" /> —— 椭圆不过是"拍了张被压扁的圆的照片"。</div>

    <h3 class="sec" id="a1-lab">伸缩变换</h3>
    <div class="board-wrap">
      <BoardMount :factory="createStretch" />
      <div class="cap">图 A1 · <b>伸缩变换</b>：左侧圆及其切线，右侧是压缩后的像。拖动圆上的 Q（或按「同步扫描」），像点 <Katex tex="Q'" /> 与像切线同步运动 —— 注意读数区：圆切线方程里把 <Katex tex="\sin\theta" /> 换成 <Katex tex="\sin\theta/k" />，就逐字得到椭圆切线方程。k 拖到 1 时两个世界完全重合。</div>
    </div>
    <p>这里值得注意的一点：<strong>切线变成切线</strong>。圆的切线只与椭圆碰一下（相切），压扁后这条直线的像也只与椭圆的像碰一下 —— "只碰一下"这件事没有被压扁破坏。</p>

    <h3 class="sec" id="a1-der">推导：圆的像与切线的像</h3>
    <p>设圆上点 <Katex tex="Q=(a\cos\theta,\ a\sin\theta)" />，其像为 <Katex tex="Q'=(a\cos\theta,\ ka\sin\theta)" />。令 <Katex tex="b=ka" />，消 <Katex tex="\theta" />（用 <Katex tex="\cos^2\theta+\sin^2\theta=1" />）得像的轨迹：</p>
    <Katex tex="\left(\frac{x}{a}\right)^2+\left(\frac{y}{b}\right)^2=1" display />
    <p>圆在 Q 处的切线是 <Katex tex="x\cos\theta+y\sin\theta=a" />（半径 OQ 与切线垂直）。直线 <Katex tex="\alpha x+\beta y=\gamma" /> 在 <Katex tex="T_k" /> 下的像是 <Katex tex="\alpha x+\tfrac{\beta}{k}y=\gamma" />（把 <Katex tex="y" /> 换回 <Katex tex="y/k" />），于是像切线为</p>
    <Katex tex="x\cos\theta+\frac{\sin\theta}{k}\,y=a\quad\Longleftrightarrow\quad \frac{x\cos\theta}{a}+\frac{y\sin\theta}{b}=1" display />
    <p>右端正是 T1 速查表里椭圆在 <Katex tex="\big(a\cos\theta,\ b\sin\theta\big)" /> 处的切线公式 <Katex tex="\dfrac{xx_0}{a^2}+\dfrac{yy_0}{b^2}=1" />。<strong>整个切线速查表，就是圆的切线被 T_k 平移后的抄写</strong>。</p>

    <h3 class="sec" id="a1-inv">不变量清单（证题的工具箱）</h3>
    <table>
      <tbody>
        <tr><th>性质</th><th>T_k 下保持吗</th><th>在椭圆里的读法</th></tr>
        <tr><td>相切 / 相交次数</td><td>✓ 保持</td><td>圆的切线 ↔ 椭圆的切线（判别式不改变符号）</td></tr>
        <tr><td>共线、平行</td><td>✓ 保持</td><td>圆的平行弦族 ↔ 椭圆的平行弦族</td></tr>
        <tr><td>线段比例、中点</td><td>✓ 保持</td><td>圆的弦中点 ↔ 椭圆的弦中点（下一讲点差法的基础）</td></tr>
        <tr><td>面积比</td><td>✓ 保持（恒为 k）</td><td>圆内图形与像的面积之比恒 k → 椭圆面积 πab（A3）</td></tr>
        <tr><td>长度、角度、垂直</td><td>✗ 不保持</td><td>圆的"半径⊥切线"被压成"共轭直径"；光学性质无法这样保持</td></tr>
      </tbody>
    </table>
    <p>一句话记忆：<strong>仿射变换保持"发生关系"（相交、相切、共线、平行、比例），不保持"量出多少"（长度、角度、面积的具体值）</strong>。</p>

    <h3 class="sec" id="a1-why">为什么"回到圆"是合法的</h3>
    <p>担心循环论证？合法性来自一个代数事实：直线与二次曲线联立的方程组在可逆线性替换下<strong>不改变根的重数</strong> —— 相切（二重根）搬过去还是相切，交于两点还是两点。所以"先在圆里证明，再变换回椭圆"与直接在椭圆里计算，得到的是同一条定理的两个版本；前者往往快十倍。唯一要当心的是<strong>方向的滥用</strong>：凡结论里出现"垂直""等长""角度"，仿射变换就失效 —— 那是度量性质，得回到子专题二的度量世界去证。本讲后续两章就是这套"变换方法"的两次实战。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createStretch } from '../../../boards/conics/affine/stretch.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
