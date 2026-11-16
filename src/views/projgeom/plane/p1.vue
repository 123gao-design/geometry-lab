<template>
  <ChPage :cur="1" no="射1" base="/projgeom/p" :chapters="PRJ_CHAPTERS"
    title="齐次坐标"
    sub="把平面上的点写成三元数组 [x:y:z]，三个数同乘一个非零常数仍是同一点。z≠0 时回到普通坐标，z=0 时多出一整条无穷远线——平行线在那里相交。"
    :toc="[{ id: 'p1-hom', t: '三元数组与比例' }, { id: 'p1-aff', t: '仿射坐标卡' }, { id: 'p1-inf', t: '无穷远线' }, { id: 'p1-tip', t: '四条提示' }]">
    <div class="note good">射影平面 <Katex tex="\mathbb P^2" /> 的点是三元组 <Katex tex="[x:y:z]" /> 的非零比例类：<Katex tex="[x:y:z]\sim[\lambda x:\lambda y:\lambda z]" />，<Katex tex="\lambda\neq0" />。<Katex tex="z\neq0" /> 的点与仿射平面一一对应，记 <Katex tex="(x/z,y/z)" />；<Katex tex="z=0" /> 的点构成<b>无穷远线</b> <Katex tex="l_\infty" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createHomog" />
      <div class="cap">图 射1 · <b>齐次坐标机</b>：拖动 <Katex tex="x" />、<Katex tex="y" /> 移动点，拖动 <Katex tex="\lambda" /> 只改三元组的写法。看点：① <Katex tex="[x:y:1]" /> 与 <Katex tex="[\lambda x:\lambda y:\lambda]" /> 始终标在同一点；② 切到「落到无穷远」，<Katex tex="z" /> 变成 0，点不再有仿射坐标；③ 两条平行线在同一个方向汇合，那个方向就是无穷远点。</div>
    </div>

    <h3 class="sec" id="p1-hom">三元数组与比例</h3>
    <p>欧氏坐标里一个点就是一对数。射影几何把点写成三对比例：<Katex tex="[x:y:z]" /> 只认比值，不认具体数值。<Katex tex="[1:2:1]" />、<Katex tex="[2:4:2]" />、<Katex tex="[-1:-2:-1]" /> 是同一个点，<Katex tex="[0:0:0]" /> 不对应任何点。</p>
    <p>这样写的好处是方程齐次。平面上的直线 <Katex tex="ax+by+c=0" /> 在齐次坐标里写成</p>
    <p style="text-align:center"><Katex tex="ax+by+cz=0." /></p>
    <p>点 <Katex tex="[x:y:z]" /> 在直线上，当且仅当三个数代入左边等于零。点与线都用三元数组表示，方程形式对称，对偶原理由此而来。</p>

    <h3 class="sec" id="p1-aff">仿射坐标卡</h3>
    <p>取 <Katex tex="z\neq0" /> 的部分，把三元组归一化成 <Katex tex="[x/z:y/z:1]" />，就得到普通平面上的点 <Katex tex="(x/z,y/z)" />。这张「坐标卡」覆盖了除无穷远线以外的全部点。</p>
    <p>不同的卡可以拼成整个射影平面。例如取 <Katex tex="x\neq0" /> 归一化成 <Katex tex="[1:y/x:z/x]" />，覆盖另一大块。卡与卡之间由分式线性变换过渡，这正是射影变换的原型。</p>
    <p>计算时先选一张卡，把齐次坐标变成普通坐标，算完再写回三元组。分母为零的位置就是要当心的无穷远点。</p>

    <h3 class="sec" id="p1-inf">无穷远线</h3>
    <p><Katex tex="z=0" /> 的点 <Katex tex="[x:y:0]" /> 没有仿射坐标，却对应平面上的一个方向：<Katex tex="[x:y:0]" /> 与 <Katex tex="[2x:2y:0]" /> 是同一个点。<Katex tex="z=0" /> 的全体是一条直线 <Katex tex="l_\infty" />。</p>
    <p>两条平行线 <Katex tex="ax+by+c=0" /> 与 <Katex tex="ax+by+c'=0" /> 在仿射平面上没有交点。齐次化后联立，得 <Katex tex="(c-c')z=0" />，于是 <Katex tex="z=0" />，交点是 <Katex tex="[b:-a:0]" />——正是它们的公共方向。平行线在无穷远处相交，这句话在射影平面里是字面成立的。</p>
    <p>从此「平行」不再是例外，而是「交点在无穷远线」的特殊位置。圆锥曲线的椭圆、抛物线、双曲线之分，也由它与 <Katex tex="l_\infty" /> 的交点个数决定。</p>

    <h3 class="sec" id="p1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：三个零不是点。</strong><Katex tex="[0:0:0]" /> 不能归一化，也不对应任何方向，射影坐标里要排除。</li>
        <li><strong>提示二：同乘负数仍是同一点。</strong><Katex tex="[x:y:z]" /> 与 <Katex tex="[-x:-y:-z]" /> 的比例相同。只在其中一两个分量上加负号，才是另一个点。</li>
        <li><strong>提示三：仿射坐标要除 z。</strong>普通坐标是 <Katex tex="(x/z,y/z)" />，不是 <Katex tex="(x,y)" />。忘了除 <Katex tex="z" />，缩放后的三元组会算出不同的点。</li>
        <li><strong>提示四：无穷远点也有方向。</strong><Katex tex="[x:y:0]" /> 与 <Katex tex="[-x:-y:0]" /> 是同一点，方向不分正反；<Katex tex="[1:0:0]" /> 与 <Katex tex="[0:1:0]" /> 是两个不同的无穷远点。</li>
      </ul>
    </div>
    <p>回收与预告：坐标写好了，接下来看变换。射影变换由可逆三阶矩阵给出，矩阵差一个倍数仍是同一个变换；它把直线映成直线，把无穷远线也映成某条直线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHomog } from '../../../boards/projgeom/plane/homog.js';
import { PRJ_CHAPTERS } from './prjnav.js';
</script>
