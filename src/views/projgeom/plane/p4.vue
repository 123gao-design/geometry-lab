<template>
  <ChPage :cur="4" no="射4" base="/projgeom/p" :chapters="PRJ_CHAPTERS"
    title="对偶原理"
    sub="射影平面里点与线地位对等：把「点」与「线」、「共线」与「共点」整体对调，真命题仍是真命题。一条定理自动带出一条对偶定理，不必另证。"
    :toc="[{ id: 'p4-dual', t: '点与线互换' }, { id: 'p4-coord', t: '坐标里的对偶' }, { id: 'p4-quad', t: '完全四边形与对偶命题' }, { id: 'p4-tip', t: '四条提示' }]">
    <div class="note good">射影平面的公理对点与线完全对称。把命题中的「点」换成「线」、「线」换成「点」，「共线」换成「共点」、「共点」换成「共线」，得到的<b>对偶命题</b>与原命题同真假。坐标里，点 <Katex tex="[a:b:c]" /> 与线 <Katex tex="ax+by+cz=0" /> 由同一个三元组表示，关联条件 <Katex tex="ax+by+cz=0" /> 对两者对称。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDual" />
      <div class="cap">图 射4 · <b>对偶机</b>：左边四点两两连线，右边四线两两相交，拖动「对应元素」逐组对照。看点：① 左边一对点的连线，对应右边一对线的交点；② 左边共有 6 条连线，右边共有 6 个交点；③ 「三线共点」与「三点共线」在两边互为镜像，配置一一对应。</div>
    </div>

    <h3 class="sec" id="p4-dual">点与线互换</h3>
    <p>射影平面的公理只说关联：两点确定一条线，两线确定一个点（平行线也有交点，交在无穷远）。把话里的「点」与「线」对调，句子仍然通顺，公理仍然成立。</p>
    <p>既然公理对称，由公理推出的每一条定理也必然对称。原定理的证明逐字对调，就是对偶定理的证明。这是射影几何独有的省力方式：证明一条，得到两条。</p>
    <p>举例：「不共线三点确定一个三角形，三边两两相交于三点」对偶成「不共点三线确定一个三角形，三顶点两两连线成三线」。同一个图形，读法不同。</p>

    <h3 class="sec" id="p4-coord">坐标里的对偶</h3>
    <p>点用列向量 <Katex tex="x" />，线用行向量 <Katex tex="l" />，关联条件是 <Katex tex="lx=0" />。这个式子对 <Katex tex="x" /> 与 <Katex tex="l" /> 对称：固定 <Katex tex="x" /> 看，是过该点的所有线；固定 <Katex tex="l" /> 看，是该线上的所有点。</p>
    <p>两点 <Katex tex="p,q" /> 的连线是叉积 <Katex tex="p\times q" />；两线 <Katex tex="l,m" /> 的交点是 <Katex tex="l\times m" />。两个公式形式相同，只是把点与线换了个位置。</p>
    <p>由此可以把「点在线上」与「线过点」当成同一件事。计算时不必区分谁主谁次，叉积算出什么就用什么。</p>

    <h3 class="sec" id="p4-quad">完全四边形与对偶命题</h3>
    <p>四个点（无三点共线）两两连线，得到 6 条线，这张配置叫<b>完全四边形</b>。对偶地，四条线（无三线共点）两两相交，得到 6 个点。画板左右两栏就是这一对。</p>
    <p>德萨格定理是另一对典型：「两个三角形对应顶点连线共点，则对应边交点共线」，对偶版本把「顶点」与「边」互换，结论也互换。两条定理互为对偶，证一条即得另一条。</p>
    <p>帕斯卡定理与布里安雄定理也是标准的一对：内接六边形三组对边交点共线，外切六边形三条对角线共点。第 7 章会把两张图并排画出来。</p>

    <h3 class="sec" id="p4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：对偶不是镜面反射。</strong>它把点换成线，不是把图形翻个面。画在纸上的左右对照只是示意，真正的对偶发生在命题层面。</li>
        <li><strong>提示二：对偶要整体换。</strong>不能只把「点」改成「线」而留下「共线」不动。点、线、共线、共点四样要一起对调，句子才成立。</li>
        <li><strong>提示三：对偶命题自动为真。</strong>不需要重新证明。若原命题依赖度量（长度、角度），先确认它在射影意义下仍成立，否则对偶过去也没有意义。</li>
        <li><strong>提示四：极线是一种具体的对偶。</strong>给定一条圆锥曲线，每点配一条极线，这是把对偶实现成具体的对应；但对偶原理本身不依赖任何圆锥曲线。</li>
      </ul>
    </div>
    <p>回收与预告：圆锥曲线把对偶具体化：每个点配一条极线，每条线配一个极点。极点与极线的对应由二次型给出，切线、切点、配极全都归到同一套矩阵运算里。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDual } from '../../../boards/projgeom/plane/dual.js';
import { PRJ_CHAPTERS } from './prjnav.js';
</script>
