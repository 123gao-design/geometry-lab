<template>
  <ChPage :cur="2" no="放2" base="/inequalities/f" :chapters="F_CHAPTERS"
    title="柯西不等式" sub="把四个数配成两个向量，看清投影、面积和平方和怎样给出同一个界。"
    :toc="[{id:'f2-vec',t:'投影与取等'},{id:'f2-triangles',t:'两个直角三角形的拼图'},{id:'f2-id',t:'面积恒等式'},{id:'f2-dim',t:'平方和与 n 维证明'},{id:'f2-min',t:'直线上的最小值'},{id:'f2-frac',t:'分式求下界'}]">
    <div class="note good" id="f2-law">任意实数 <Katex tex="a,b,c,d" /> 都满足
      <Katex tex="(a^2+b^2)(c^2+d^2)\ge(ac+bd)^2" />。等号成立当且仅当 <Katex tex="ad=bc" />。</div>
    <h3 class="sec" id="f2-vec">把内积看成投影</h3>
    <p>取 <Katex tex="u=(a,b),\ v=(c,d)" />。若两向量都非零，设夹角为 <Katex tex="\theta" />，则 <Katex tex="u\cdot v=|u||v|\cos\theta" />。把 v 的端点投影到 u 所在的直线，垂足记为 H。直角三角形中，投影长度 <Katex tex="OH=|v||\cos\theta|" /> 至多等于斜边长 <Katex tex="|v|" />。两边乘以 <Katex tex="|u|" /> 再平方，就得到柯西不等式。</p>
    <ConicFigure number="2a" title="内积、垂足与平行四边形" head="bottom" :factory="vectors"
      :legend="[['blue', '向量 u'], ['gold', '向量 v'], ['mint', 'u、v 张成的平行四边形与 v 的投影', 'dashed']]">
      调整四个坐标，观察垂足 H。切换「同向」与「反向」时，内积变号，投影长度和等号条件都保持相同。
    </ConicFigure>
    <p id="f2-eq">同向与反向都使 <Katex tex="|\cos\theta|=1" />。只要有一个零向量，两边也同为零，此时直接从原式判断取等。正交时内积为零；在两向量长度固定的条件下，此时平行四边形面积最大。</p>
    <h3 class="sec" id="f2-triangles">用两个直角三角形拼出柯西不等式</h3>
    <p>先设四个数都是正数。在水平底边上取点 O，向右走 a、再向上走 b，到达 A。另从 O 向左走 d、再向上走 c，到达 B。这样，右侧直角三角形的斜边是 OA，左侧的是 OB。连接 AB，中间便围出三角形 OAB。</p>
    <ConicFigure number="2b" title="拼成梯形，用两种方法量中间的三角形" head="bottom" :factory="triangles"
      :legend="[['blue', '右侧直角三角形 OUA'], ['gold', '左侧直角三角形 OVB'], ['mint', '中间的三角形 OAB 与高 BH', 'dashed']]">
      图中固定 a = 3、b = 1.5。拖动 B，虚线 BH 是中间三角形以 OA 为底的高。点「让两条斜边垂直」，观察垂足 H 的位置。
    </ConicFigure>
    <p><strong>先用拼图算面积。</strong>整个梯形的两条平行边是竖直的 b 和 c，它们相距 a + d。从梯形面积中扣去左右两个直角三角形，便得到中间的面积 S。</p>
    <Katex tex="2S=(b+c)(a+d)-ab-cd=ac+bd." display />
    <p><strong>再用底和高估面积。</strong>从 B 向直线 OA 作垂线，垂足为 H。点到直线的距离 BH 不超过 BO，所以</p>
    <Katex tex="2S=OA\cdot BH\le OA\cdot OB=\sqrt{a^2+b^2}\sqrt{c^2+d^2}." display />
    <p>把两个面积式接起来再平方，就得到柯西不等式。等号成立时 H 恰与 O 重合，两条斜边垂直。此时左右两个直角三角形相似，对应直角边满足 <Katex tex="b/a=d/c" />，即 <Katex tex="ad=bc" />。反过来，这个比例也保证两条斜边垂直。</p>
    <p>边长为零的情形可令正边长趋于零得到。对任意实数，先用 <Katex tex="|ac+bd|\le |a||c|+|b||d|" />，再对四个绝对值应用拼图结论，便得到同一个上界。下面的恒等式直接给出包括负数、零在内的完整取等条件。</p>
    <h3 class="sec" id="f2-id">差额恰好是面积的平方</h3>
    <p>也可以完全用代数证明。展开两边，消去共同的 <Katex tex="a^2c^2" /> 与 <Katex tex="b^2d^2" /> 后，余下的是一个完全平方。</p>
    <Katex tex="(a^2+b^2)(c^2+d^2)-(ac+bd)^2=(ad-bc)^2." display />
    <p>从图上也能读出这个因子。若 u 非零，取与它垂直的单位向量 <Katex tex="(-b,a)/|u|" />。v 在这个方向上的投影长度为 <Katex tex="|ad-bc|/|u|" />。以 u 为底，底乘高得到面积 <Katex tex="|ad-bc|" />。所以差额等于面积的平方，等号对应平行四边形压成线段或点。</p>
    <h3 class="sec" id="f2-dim">让一个平方和取到最小值</h3>
    <p>将二维结论推广到 n 维，可以从一个对所有实数 t 都非负的量出发。设 <Katex tex="A=\sum a_i^2,\ B=\sum a_ib_i,\ C=\sum b_i^2" />，各项都从 1 加到 n。展开并配方，在 <Katex tex="A>0" /> 时得到</p>
    <Katex tex="q(t)=\sum_i(ta_i-b_i)^2=At^2-2Bt+C=A(t-B/A)^2+C-B^2/A." display />
    <p>取 <Katex tex="t=B/A" />，第一项消失，余下的最小值仍须非负。因此 <Katex tex="AC\ge B^2" />。等号成立恰好要求每一个平方项都为零，即对所有 i 有 <Katex tex="b_i=(B/A)a_i" />。若 <Katex tex="A=0" />，所有 <Katex tex="a_i" /> 都是零，原式直接取等。</p>
    <ConicFigure number="2c" title="平方和的最低点" head="bottom" :factory="quadratic">
      <Katex tex="q(t)=(t-1)^2+h^2" />。固定垂直分量 <Katex tex="h" />，移动 <Katex tex="t" /> 比较当前点与顶点。再令 <Katex tex="h=0" />，观察最低点如何落到横轴上。
    </ConicFigure>
    <h3 class="sec" id="f2-min">例一 · 直线上哪一点离原点最近？</h3>
    <p>已知 <Katex tex="2x+3y=6" />，求 <Katex tex="x^2+y^2" /> 的最小值。把系数 (2, 3) 与未知数 (x, y) 配成两个向量，内积已固定为 6，故 <Katex tex="13(x^2+y^2)\ge36" />。取等时 <Katex tex="(x,y)=\lambda(2,3)" />，代回约束得到 <Katex tex="\lambda=6/13" />。最小值 <Katex tex="36/13" /> 在 <Katex tex="H=(12/13,18/13)" /> 处取得。</p>
    <ConicFigure number="2d" title="沿约束直线寻找最小半径" head="bottom" :factory="minimum"
      :legend="[['blue', '约束直线 2x + 3y = 6'], ['gold', '半径 OP'], ['mint', '以 O 为心的圆与垂足 H', 'dashed']]">
      拖动 P，圆始终经过 P。点「回到垂足」，圆与直线相切，此时半径与直线的法向量 (2, 3) 同向。
    </ConicFigure>
    <p>同理，对 <Katex tex="ax+by=k" /> 且 <Katex tex="a^2+b^2>0" />，最小距离平方为 <Katex tex="k^2/(a^2+b^2)" />。反过来，若给定向量长度而求内积的最值，要同时考虑同向和反向，它们分别给出上界和下界。</p>
    <h3 class="sec" id="f2-frac">例二 · 把正分母配进向量</h3>
    <p>设 <Katex tex="x,y>0,\ x+y=10" />，求 <Katex tex="9/x+4/y" /> 的最小值。想把两个分式写成模长平方，就取 <Katex tex="u=(3/\sqrt{x},2/\sqrt{y})" />，再用 <Katex tex="v=(\sqrt{x},\sqrt{y})" /> 消去内积中的根号。</p>
    <Katex tex="(9/x+4/y)(x+y)\ge(3+2)^2." display />
    <p>下界是 <Katex tex="5/2" />。两向量成比例要求 <Katex tex="3/x=2/y" />，与和为 10 联立得 <Katex tex="x=6,\ y=4" />，故下界可以达到。这个配对也证明了一般的分式形式：当所有 <Katex tex="w_i>0" /> 时，<Katex tex="\sum_i z_i^2/w_i\ge(\sum_i z_i)^2/\sum_i w_i" />，取等当且仅当各 <Katex tex="z_i/w_i" /> 相同。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as vectors } from '../../../boards/inequalities/scale/cauchy.js';
import { createBoard as triangles } from '../../../boards/inequalities/scale/cauchyTriangles.js';
import { createBoard as quadratic } from '../../../boards/inequalities/scale/cauchyQuadratic.js';
import { createBoard as minimum } from '../../../boards/inequalities/scale/cauchyMinimum.js';
import { F_CHAPTERS } from './fnav.js';
</script>
