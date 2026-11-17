<template>
  <ChPage :cur="2" no="射2" base="/projgeom/p" :chapters="PRJ_CHAPTERS"
    title="射影变换"
    sub="一个可逆三阶矩阵作用在齐次坐标上，就是一次射影变换。矩阵差一个非零倍数仍是同一个变换；它把直线映成直线，把平行线映成共点线。"
    :toc="[{ id: 'p2-mat', t: '矩阵与比例' }, { id: 'p2-line', t: '直线映成直线' }, { id: 'p2-aff', t: '仿射子群与透视' }, { id: 'p2-tip', t: '四条提示' }]">
    <div class="note good">射影变换由可逆矩阵 <Katex tex="M\in GL(3,\mathbb R)" /> 给出：<Katex tex="[x']=M[x]" />，其中 <Katex tex="[x]" /> 为齐次坐标列向量。<Katex tex="M" /> 与 <Katex tex="\lambda M" />（<Katex tex="\lambda\neq0" />）表示同一个变换，所有射影变换构成群 <Katex tex="PGL(3,\mathbb R)" />。共线点仍映成共线点，交比不变。</div>

    <div class="board-wrap">
      <BoardMount :factory="createProjMap" />
      <div class="cap">图 射2 · <b>射影变换与灭点</b>：变换 <Katex tex="(x,y)\mapsto(x,y)/(1+kx)" /> 把网格整体压向灭点。看点：① 网格线弯不了，仍是直线；② 原来平行的横线，变换后一起挤向红点 <Katex tex="V" />；③ 正方形变成一般四边形，边长与角度都变了，共线与交比没变。</div>
    </div>

    <h3 class="sec" id="p2-mat">矩阵与比例</h3>
    <p>点写成列向量 <Katex tex="(x,y,z)^{\mathsf T}" />，变换就是矩阵乘法。因为齐次坐标只认比例，<Katex tex="M" /> 与 <Katex tex="\lambda M" /> 作用后得到的两组坐标仍成比例，表示同一点，所以要把相差非零倍数的矩阵视为一体。</p>
    <p>矩阵可逆是关键。不可逆的矩阵会把平面压扁：整个平面映到一条直线上，点与线的对应不再是一一。射影变换要求双射，逆变换由 <Katex tex="M^{-1}" /> 给出。</p>
    <p>矩阵有 9 个元素，去掉一个整体比例，剩 8 个自由度。确定一个射影变换需要四对对应点（每对给两个方程），且其中任意三点不共线。</p>

    <h3 class="sec" id="p2-line">直线映成直线</h3>
    <p>设直线由行向量 <Katex tex="l" /> 给出，点 <Katex tex="x" /> 在线上即 <Katex tex="l x=0" />。变换后 <Katex tex="x'=Mx" />，代入得 <Katex tex="l M^{-1}x'=0" />，所以像直线的坐标是 <Katex tex="l'=lM^{-1}" />。</p>
    <p>直线仍是直线，共线关系被完整保留。这也解释了画板上网格为何只能整体透视，不会弯成曲线：射影变换的代数形式决定了它只能做线性分式变换。</p>
    <p>由此射影变换保持交点、保持「三点共线」这类只涉及关联的性质。长度、角度、面积都不在保留之列。</p>

    <h3 class="sec" id="p2-aff">仿射子群与透视</h3>
    <p>若矩阵最后一行是 <Katex tex="(0,0,1)" />，变换把 <Katex tex="z=0" /> 映到自身，无穷远线不动，这就是<b>仿射变换</b>。它保持平行：平行线有同一个无穷远交点，变换后仍共点于无穷远。</p>
    <p>更一般的射影变换会把无穷远线移到有限处。中心投影是典型例子：把一张平面从一点投到另一张平面，远处的点可能落到有限位置，平行线在像里汇聚。</p>
    <p>不动的点叫<b>不动点</b>，由特征向量给出。实特征值不一定存在，所以射影变换未必有实不动点；复不动点总有两个（计重数）。</p>

    <h3 class="sec" id="p2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：矩阵可差一个倍数。</strong>把所有元素乘 2，变换完全不变。比较两个射影变换是否相同，要先归一化，例如令某个非零元素为 1。</li>
        <li><strong>提示二：不可逆矩阵不是射影变换。</strong>行列式为零会把平面压到一条线或一个点上，不是双射。判断前先算行列式。</li>
        <li><strong>提示三：分母为零处映到无穷远。</strong>分式写法里分母为零的点没有有限像，它被送到无穷远线；这不是漏洞，正是射影平面比仿射平面多出来的部分。</li>
        <li><strong>提示四：射影变换不保平行。</strong>只有最后一行为 <Katex tex="(0,0,1)" /> 的仿射子群才保平行。一般射影变换把平行线变成共点线。</li>
      </ul>
    </div>
    <p>回收与预告：长度与角度都被射影变换破坏了，还剩什么可量？答案是交比——四个共线点的某个比值，在一切射影变换下保持不变，是射影几何自己的「距离」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createProjMap } from '../../../boards/projgeom/plane/projmap.js';
import { PRJ_CHAPTERS } from './prjnav.js';
</script>
