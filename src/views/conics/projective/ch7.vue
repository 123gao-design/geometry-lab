<template>
  <ChPage :cur="7" title="配极关系回顾" sub="看见一条割线、一对切点或一束直线时，先辨认要用的点线关系。"
    :toc="[{ id: 'c7-method', t: '从调和到对偶' }, { id: 'c7-ex', t: '按已知条件选方法' }]">
    <h3 class="sec" id="c7-method">从调和到对偶</h3>
    <ol>
      <li><strong>先在一条线上配对。</strong> 二次曲线和实割线的两个交点 <Katex tex="U,V" /> 固定了调和的基点。<Katex tex="P" /> 在割线上的共轭点 <Katex tex="P'" /> 由交叉比 −1 唯一确定。</li>
      <li><strong>再把不同割线的结果连起来。</strong> 所有共轭点满足同一个线性条件 <Katex tex="B(P,X)=0" />。给定 <Katex tex="P" />，这是它的极线。给定一条直线，反向配极得到它的极点。</li>
      <li><strong>最后交换点与线。</strong> 对称关系 <Katex tex="B(P,Q)=B(Q,P)" /> 让共线与共点互换。用在一束弦上，能把切线交点的轨迹化为一条极线。用在六边形上，能把 Pascal 线化为 Brianchon 点。</li>
    </ol>

    <h3 class="sec" id="c7-ex">按已知条件选方法</h3>
    <table><thead><tr><th>已知条件</th><th>对应方法</th></tr></thead><tbody>
      <tr><td>实割线、两个曲线交点与一个极点</td><td>用调和分点公式求这条割线上的共轭点。若已经知道极线，直接求交。</td></tr>
      <tr><td>经过同一点并截出四个不同交点的两条实割线</td><td>用四点形构造另外两个对角点，连线得到共同割线交点的极线。</td></tr>
      <tr><td>曲线方程和一个点</td><td>用 <Katex tex="\ell=AP" /> 求极线。椭圆外点可以继续联立曲线求两个切点。</td></tr>
      <tr><td>曲线方程和一条线</td><td>用 <Katex tex="P=A^{-1}\ell" /> 求极点。过椭圆中心的线，其极点是方向点。</td></tr>
      <tr><td>要证明若干直线共点</td><td>给各条线取极点，检查这些点是否共线。反过来也可以用共点证明共线。</td></tr>
    </tbody></table>
    <p>同一配极公式也适用于无穷远点。选定仿射窗口后，实椭圆、抛物线、双曲线与无穷远直线分别具有零个、一个二重交点和两个不同的实交点。<router-link to="/projgeom/c2">二次曲线的射影分类</router-link></p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import Katex from '../../../components/Katex.vue';
</script>
