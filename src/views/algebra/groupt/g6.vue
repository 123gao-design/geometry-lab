<template>
  <ChPage :cur="6" no="群6" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="群与对称"
    sub="正多边形的旋转与翻转把它送回自己，这些变换收齐就成二面体群。阶为 2n，旋转与翻转的复合次序有讲究，形状的对称程度直接读成群的阶。"
    :toc="[{ id: 'g6-sym', t: '对称变换' }, { id: 'g6-dihedral', t: '二面体群' }, { id: 'g6-order', t: '阶与对称性' }, { id: 'g6-tip', t: '四条提示' }]">
    <div class="note good">把正 <Katex tex="n" /> 边形映到自身的平面变换共 <Katex tex="2n" /> 个：<Katex tex="n" /> 个旋转与 <Katex tex="n" /> 个反射，按复合构成<b>二面体群</b> <Katex tex="D_n" />。旋转子群 <Katex tex="\langle r\rangle" /> 是循环群，指数为 2，因此正规；反射元素都是二阶元。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSymmetry" />
      <div class="cap">图 群6 · <b>对称机</b>：灰色是正 n 边形的原位，蓝色是变换后的位置。看点：① 旋转滑块让蓝色多边形沿中心转向，金色虚线追踪顶点的去向；② 打开反射，蓝色翻到轴的另一侧；③ 改变边数，群阶 2n 与旋转阶 n 同步变化。</div>
    </div>

    <h3 class="sec" id="g6-sym">对称变换</h3>
    <p>对称变换的要求是「做完之后图形与原图重合」，不要求每点不动。旋转让全部顶点换位，仍算对称；反射把顶点两两交换，也算。</p>
    <p>旋转的阶是 <Katex tex="n" />，反射的阶是 2。反射轴经过中心：奇数边形有 <Katex tex="n" /> 条，每条过一个顶点与一条对边中点；偶数边形也有 <Katex tex="n" /> 条，一半过顶点、一半过边中点。</p>
    <p>把对称变换逐个作用在标记过的顶点上，得到的重排恰好是 <Katex tex="S_n" /> 里的一个置换。对称群因此成为置换群的一部分，与上一章的凯莱定理相接。</p>

    <h3 class="sec" id="g6-dihedral">二面体群</h3>
    <p><Katex tex="D_n" /> 由 <Katex tex="r" />（转 <Katex tex="2\pi/n" />）与 <Katex tex="s" />（一次反射）生成，关系为 <Katex tex="r^n=e" />、<Katex tex="s^2=e" />、<Katex tex="sr=r^{-1}s" />。最后一条说明先反射再旋转与先旋转再反射方向相反。</p>
    <p>八个元素可写成 <Katex tex="r^k" /> 与 <Katex tex="sr^k" />，前四个是旋转、后四个是反射。两个反射复合得到旋转，旋转与反射复合得到反射——矩阵行列式的符号给出同一条规律。</p>
    <p><Katex tex="n\ge3" /> 时 <Katex tex="D_n" /> 非交换。小阶情形有例外：<Katex tex="D_3\cong S_3" />，三角形的六个对称正好对应三个元素的所有重排。</p>

    <h3 class="sec" id="g6-order">阶与对称性</h3>
    <p>对称越多，形状越规整。正方形有 8 个对称，一般三角形只有 1 个（恒等），等边三角形有 6 个。群的阶因此可以当作「对称程度」的量化指标。</p>
    <p>圆有无限多个对称，平面内的旋转群是连续群。有限边形取极限时，离散的 <Katex tex="D_n" /> 逼近这个连续群，这是从有限群走向李群的一条线索。</p>
    <p>结晶学里把三维的有限对称群分成 32 个点群，二维平面图案则有 17 种壁纸群。分类的依据就是变换群的结构，逻辑与本模块一致。</p>

    <h3 class="sec" id="g6-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：群阶是 2n，旋转阶是 n。</strong>两个都叫「阶」，指的是不同对象，答题时写清是群的阶还是元素的阶。</li>
        <li><strong>提示二：反射不是旋转。</strong>反射改变朝向，行列式为 −1；旋转行列式为 1。三阶以下可以凑巧重合，别推广。</li>
        <li><strong>提示三：复合顺序影响结果。</strong><Katex tex="sr\neq rs" />，除非形状满足特殊条件。写等式时保留顺序。</li>
        <li><strong>提示四：D₃ 与 S₃ 同构是特例。</strong><Katex tex="D_4" /> 阶为 8，<Katex tex="S_4" /> 阶为 24，两者不同构。</li>
      </ul>
    </div>
    <p>回收与预告：群这一专题到此结束。接下来换一种结构，把「谁与谁相连」画成点与线：顶点、边与度，握手定理把度数与边数绑在一起。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSymmetry } from '../../../boards/algebra/groupt/symmetry.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
