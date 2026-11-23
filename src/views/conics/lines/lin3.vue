<template>
  <ChPage :cur="3" no="L3" base="/conics/lin" :chapters="LIN_CHAPTERS"
    title="点位与极线：一个公式的三种身份" sub="直线与曲线的关系看交点，点与曲线的关系看符号：F(M) 的符号一秒判内外，极线公式一式三用 —— 切点弦、切线、配极接口。它串联全站六条主线，也为大题备好判定依据。"
    :toc="[{ id: 'l3-lab', t: '点的内外与切线条数（图 L3）' }, { id: 'l3-judge', t: '推导 · 点的内外与切线条数' }, { id: 'l3-polar', t: '极线的三个角色' }, { id: 'l3-map', t: '总地图 · 六个子专题' }]">
    <div class="note good"><strong>本讲主角</strong>：点 M 与椭圆 <Katex tex="\tfrac{u^2}{a^2}+\tfrac{v^2}{b^2}=1" /> 的位置关系由 <Katex tex="F(M)=\tfrac{u_0^2}{a^2}+\tfrac{v_0^2}{b^2}-1" /> 的符号直接判定：内（&lt;0）、上（=0）、外（&gt;0）；而 T1 的极线 <Katex tex="\tfrac{u u_0}{a^2}+\tfrac{v v_0}{b^2}=1" /> 随 M 一起走，在三种位置上分别有三种含义。</div>

    <h3 class="sec" id="l3-lab">点的内外与切线条数</h3>
    <div class="board-wrap">
      <BoardMount :factory="createPointPolar" />
      <div class="cap">图 L3 · <b>点与圆锥曲线的位置关系</b>：拖 M 任意走。F(M) 的符号一秒分内外；M 在椭圆外时两条切线与<strong>切点弦</strong>自动现身 —— 切点弦的方程与金色极线逐字相同（La Hire）；把 M 放到曲线上，极线恰好塌成 <strong>M 处的切线</strong>；M 走进椭圆，切线消失、极线仍在。</div>
    </div>

    <h3 class="sec" id="l3-judge">推导：点的内外与切线条数</h3>
    <p>过 M 作方向一族直线，每条按 L1 的判别式给交点数 —— 把这些 Δ 拼起来，结论浓缩成 F(M) 的符号：M 在外，存在两条实切线；在上，恰一条；在内，零条。判别式一览（L1）的「线对曲线」由此翻译成「点对曲线」：<strong>内外之判就是切线之数</strong>。这与 D4 的统一定义遥相呼应 —— e&gt;1 的轨道才够得着准线之外的世界。</p>

    <h3 class="sec" id="l3-polar">极线的三个角色</h3>
    <p>T1 里极线公式 <Katex tex="\tfrac{u u_0}{a^2}+\tfrac{v v_0}{b^2}=1" /> 已经出现过（切点弦来源）。本讲把它正式展开：</p>
    <table>
      <tbody>
        <tr><th>M 的位置</th><th>极线 l 的身份</th><th>几何含义</th></tr>
        <tr><td>曲线外</td><td><strong>切点弦</strong></td><td>两条切线切点的连线（画板金色线与虚线切点逐字重合）</td></tr>
        <tr><td>曲线上</td><td><strong>切线本身</strong></td><td>极线公式退化为 T1 的点处切线（求法四回收）</td></tr>
        <tr><td>曲线内</td><td><strong>实直线（虚切点弦）</strong></td><td>切点无实解，但 l 仍是一条真直线 —— 代数结论不变</td></tr>
        <tr><td>中心</td><td>无穷远直线</td><td>极线跑出画布 —— 子专题六「无穷远」的再现</td></tr>
      </tbody>
    </table>
    <p>这正是子专题六的配极理论在高考工具箱里的落点：La Hire 定理（M 在 N 的极线上 <Katex tex="\iff" /> N 在 M 的极线上）保证「切点弦 = 极线」；调和共轭则说，M 与其极线上的点把弦端做成 <Katex tex="-1" /> 的交叉比 —— 射影几何与应试代数在此衔接。A4/A5 的仿射视角还补充一点：极线经仿射变换仍是极线（线性替换不动方程结构），所以圆的切点弦结论直接推广到全族曲线。</p>

    <h3 class="sec" id="l3-map">总地图：六个子专题</h3>
    <p>把全站六条主线互相引用的结论列一遍：</p>
    <table>
      <tbody>
        <tr><th>工具</th><th>来源</th><th>在本子专题中的用法</th></tr>
        <tr><td>判别式 / 切线</td><td>T1 四种求法</td><td>L1 的 Δ=0 特例、L3 的切线用法</td></tr>
        <tr><td>渐近线</td><td>D2</td><td>L1 第四态的发生地</td></tr>
        <tr><td>点差法 · 共轭</td><td>A2</td><td>L2 中点公式的减法版</td></tr>
        <tr><td>焦点弦</td><td>P3</td><td>L2 弦长公式的焦点特供</td></tr>
        <tr><td>极线 · 配极 · La Hire</td><td>子专题六 / T1</td><td>L3 的第一主角</td></tr>
        <tr><td>仿射变换</td><td>A1 / A4 / A5</td><td>极线与位置关系的推广途径</td></tr>
      </tbody>
    </table>
    <p>直线与曲线的联立消元，把这一切<strong>汇总起来</strong>：定义给曲线（子专题一），光学与切线给方向（二），仿射给视角（三），参数给轨道（四），本子专题给步骤（五）；射影视角（六）再把这一切收进同一套点线对偶的语言。补充：仿射家族的 A5「对勾函数」把 A4 的母曲线推广到高考函数，A6 再把任意二次方程化回标准形 —— 都值得顺带一读；后两讲（L4 曲线系、L5 大题三宝）就是带着这套结论进入大题。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPointPolar } from '../../../boards/conics/lines/pointpolar.js';
import { LIN_CHAPTERS } from './linnav.js';
</script>
