<template>
  <ChPage :cur="3" title="完全四点形与调和构造" sub="同一个调和点列，可以由对边交点、角平分线或距离比得到。"
    :toc="[{ id: 'c3-quad', t: '完全四点形' }, { id: 'c3-ab', t: '内外角平分线' }, { id: 'c3-ap', t: '阿波罗尼奥斯圆' }]">
    <h3 class="sec" id="c3-quad">完全四点形</h3>
    <p>取四个无三点共线的点 <Katex tex="A,B,C,D" />，两两连出六条直线。令三对对边分别相交，得到<strong>对角三角形</strong>的三个顶点：</p>
    <Katex tex="P_1=AB\cap CD,\qquad P_2=AC\cap BD,\qquad P_3=AD\cap BC." display />
    <p>在边 <Katex tex="AB" /> 上取 <Katex tex="S_1=AB\cap P_2P_3" />，便有 <Katex tex="(A,B;P_1,S_1)=-1" />。在其余五条边上也可以作同样的构造。</p>
    <ConicFigure head="bottom" number="3" title="用对边交点构造调和点列" :factory="createBoard">
      选一条边（如 <Katex tex="AB" />），再拖动任一顶点。点「AB 与 CD 平行」，或手动把对边 <Katex tex="CD" /> 转到与 <Katex tex="AB" /> 平行，观察 <Katex tex="P_1" /> 移向无穷远时 <Katex tex="S_1" /> 如何趋向中点。
    </ConicFigure>
    <p><strong>为什么是 −1？</strong> 选取射影坐标，把前三个顶点放在三个坐标方向上，再利用坐标的比例自由把第四个顶点写成 <Katex tex="D=[1:1:1]" />。因为无三点共线，这三个坐标都可以分别缩放到 1。于是 <Katex tex="AB" /> 是 <Katex tex="W=0" />，直接求交得到 <Katex tex="P_1=[1:1:0],\ P_2=[1:0:1],\ P_3=[0:1:1]" />。<Katex tex="P_2P_3" /> 的方程是 <Katex tex="X+Y=W" />，所以 <Katex tex="S_1=[1:-1:0]" />。在 <Katex tex="AB" /> 上用 <Katex tex="[X:Y]" /> 看，两个点恰好只差第二个坐标的符号。这就是 §2 的调和判据。</p>
    <p>这个证明也说明了作图的自由度。只要固定 <Katex tex="A,B,P_1" />，就可以换一条过 <Katex tex="P_1" /> 的对边 <Katex tex="CD" />。构造出的 <Katex tex="S_1" /> 始终相同，因为 <Katex tex="P_1" /> 的调和共轭唯一。</p>

    <h3 class="sec" id="c3-ab">内外角平分线</h3>
    <p>设三角形 <Katex tex="ABC" /> 的内、外角平分线分别交直线 <Katex tex="BC" /> 于 <Katex tex="D,E" />。当 <Katex tex="AB\ne AC" /> 时，两个角平分线定理分别给出 <Katex tex="|BD|/|DC|=|BE|/|EC|=|AB|/|AC|" />。内分比和外分比的绝对值相同、符号相反，所以 <Katex tex="(B,C;D,E)=-1" />。若 <Katex tex="AB=AC" />，则 <Katex tex="D" /> 为中点，外角平分线平行于 <Katex tex="BC" />，<Katex tex="E" /> 在无穷远。</p>
    <ConicFigure head="bottom" number="3b" title="内分与外分取同一个距离比" :factory="createAngleBisect">
      拖动 <Katex tex="A" /> 改变两边的长度比，看内分点 <Katex tex="D" /> 与外分点 <Katex tex="E" /> 如何响应。点「等腰三角形」比较 <Katex tex="AB=AC" /> 的情况。
    </ConicFigure>

    <h3 class="sec" id="c3-ap">阿波罗尼奥斯圆</h3>
    <p>对定点 <Katex tex="B,C" />，满足 <Katex tex="|PB|/|PC|=k" /> 的点 <Katex tex="P" /> 在 <Katex tex="k>0,\ k\ne 1" /> 时构成一个圆。设三角形 <Katex tex="PBC" /> 的两条角平分线交 <Katex tex="BC" /> 于 <Katex tex="D,E" />，那么 <Katex tex="D,E" /> 是同一距离比确定的内分点与外分点，又因为 <Katex tex="PD\perp PE" />，所以 <Katex tex="P" /> 落在以 <Katex tex="DE" /> 为直径的圆上。<Katex tex="D,E" /> 自身也是距离比方程的解。<Katex tex="k=1" /> 时轨迹为 <Katex tex="BC" /> 的垂直平分线。</p>
    <p>当 <Katex tex="k\ne1" /> 时，代数上也能检验反方向。令 <Katex tex="B=(0,0),C=(1,0)" />，把距离比等式平方。将结果按 <Katex tex="x" /> 因式分解，得到 <Katex tex="(x-d)(x-e)+y^2=0" />，其中 <Katex tex="d,e" /> 是两个分点的横坐标。这个方程等价于以 <Katex tex="DE" /> 为直径的圆的方程，所以整个圆都是所求轨迹。</p>
    <ConicFigure head="bottom" number="3c" title="从比值圆过渡到垂直平分线" :factory="createApollonius">
      调节 <Katex tex="k" />，看两个调和共轭点 <Katex tex="D,E" /> 如何移动。拖动 <Katex tex="P" /> 验证距离比，再将 <Katex tex="k" /> 调到 1，观察外分点走向无穷远。
    </ConicFigure>
    <p>把完全四点形的四个顶点都放在一条非退化圆锥曲线上，对角三角形就会成为<strong>自配极三角形</strong>。此时曲线和割线的两个交点自然成为一对基点。下一节会说明，为什么换了割线、换了基点，所得到的共轭点仍然落在同一条直线上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/quad.js';
import { createBoard as createAngleBisect } from '../../../boards/conics/projective/anglebisect.js';
import { createBoard as createApollonius } from '../../../boards/conics/projective/apollonius.js';
</script>
