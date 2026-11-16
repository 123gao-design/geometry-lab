<template>
  <ChPage :cur="2" no="轨2" base="/polar/g" :chapters="PG_CHAPTERS"
    title="参数方程与轨迹"
    sub="动点随某个参数移动，横纵坐标都写成这个参数的函数，两个式子合起来就是轨迹的参数方程；消去参数得到普通方程。中点、分点、交点这类由已知曲线上的点派生出来的动点，用参数法或代入法都能求出轨迹。"
    :toc="[{ id: 'g2-way', t: '求轨迹方程的三条路' }, { id: 'g2-mid', t: '中点轨迹：两种求法' }, { id: 'g2-step', t: '参数法的一般步骤' }, { id: 'g2-pit', t: '范围与补点' }]">
    <div class="note good">求轨迹方程常用三条路：直接法（把几何条件直接译成 <Katex tex="x" />、<Katex tex="y" /> 的等式）、相关点法（又称代入法，把所求动点 <Katex tex="M(x,y)" /> 用已知曲线上的点 <Katex tex="P" /> 表示，再把 <Katex tex="P" /> 代回已知曲线的方程）、参数法（引入参数 <Katex tex="\theta" />、<Katex tex="t" />，写出 <Katex tex="x(\theta)" />、<Katex tex="y(\theta)" />，再消参）。三条路所得方程应一致，选哪条看条件里现成的是哪一种关系。</div>

    <h3 class="sec" id="g2-way">求轨迹方程的三条路</h3>
    <p>直接法适合条件本身就是距离、斜率、面积等式的情形。设动点 <Katex tex="M(x,y)" />，把「到某点距离等于定值」「到两点距离相等」这类话译成含 <Katex tex="x" />、<Katex tex="y" /> 的方程，化简即得轨迹。</p>
    <p>相关点法适合所求动点由另一条已知曲线上的动点派生出来的情形。先用 <Katex tex="x" />、<Katex tex="y" /> 表示出已知点 <Katex tex="P" /> 的坐标，再把 <Katex tex="P" /> 的坐标代回它所在的曲线方程。已知曲线给出的是 <Katex tex="P" /> 的约束，代换之后约束就转移到了 <Katex tex="M" /> 身上。</p>
    <p>参数法适合动点的位置由某个角度或时间驱动的情形。圆上的点、旋转中的点、按定比分点移动的点，天然带着一个参数。写出参数方程后再消参，得到的普通方程与另外两条路一致。</p>

    <h3 class="sec" id="g2-mid">中点轨迹：两种求法</h3>
    <div class="board-wrap">
      <BoardMount :factory="createParamLocus" />
      <div class="cap">图 轨2 · <b>参数方程与轨迹</b>：金色圆 <Katex tex="x^2+y^2=4" />、蓝色定点 <Katex tex="A(4,0)" />、金色动点 <Katex tex="P" />，绿色点 <Katex tex="M" /> 是 <Katex tex="AP" /> 的中点，绿色虚线是 <Katex tex="M" /> 走出的整条轨迹。看点：拖动 <Katex tex="P" /> 绕圆一周，<Katex tex="M" /> 的横坐标始终是 <Katex tex="P" /> 与 <Katex tex="A" /> 横坐标的平均值；<Katex tex="P" /> 转到最右端时 <Katex tex="M(3,0)" />，转到最左端时 <Katex tex="M(1,0)" />，绿色圆恰以 <Katex tex="(2,0)" /> 为心、半径 <Katex tex="1" />。</div>
    </div>
    <p>已知 <Katex tex="P" /> 在圆 <Katex tex="x^2+y^2=4" /> 上，<Katex tex="A(4,0)" />，<Katex tex="M" /> 为 <Katex tex="AP" /> 的中点，求 <Katex tex="M" /> 的轨迹方程。</p>
    <p><strong>参数法。</strong>把 <Katex tex="P" /> 写成 <Katex tex="(2\cos\theta,2\sin\theta)" />。中点坐标是两端坐标的平均：</p>
    <p style="text-align:center"><Katex tex="x=\frac{2\cos\theta+4}{2}=2+\cos\theta,\qquad y=\frac{2\sin\theta+0}{2}=\sin\theta." display /></p>
    <p>两式移项得 <Katex tex="x-2=\cos\theta" />、<Katex tex="y=\sin\theta" />，平方相加消去 <Katex tex="\theta" />：</p>
    <p style="text-align:center"><Katex tex="(x-2)^2+y^2=1." display /></p>
    <p><strong>相关点法。</strong>设 <Katex tex="M(x,y)" />，由中点公式反解出 <Katex tex="P" />：</p>
    <p style="text-align:center"><Katex tex="P(2x-4,\ 2y)." display /></p>
    <p><Katex tex="P" /> 在圆 <Katex tex="x^2+y^2=4" /> 上，代入得 <Katex tex="(2x-4)^2+(2y)^2=4" />，两边除以 <Katex tex="4" /> 即 <Katex tex="(x-2)^2+y^2=1" />。两条路得到同一个圆，圆心是 <Katex tex="OA" /> 的中点，半径是原圆的一半。</p>
    <p>几何上也能一眼看出：<Katex tex="M" /> 是把 <Katex tex="P" /> 沿 <Katex tex="\overrightarrow{PA}" /> 方向压缩到一半的像，以 <Katex tex="A" /> 为位似中心、比 <Katex tex="1/2" /> 的位似变换把圆 <Katex tex="x^2+y^2=4" /> 变成圆 <Katex tex="(x-2)^2+y^2=1" />。参数法与相关点法给出的是同一件事的两种写法。</p>

    <h3 class="sec" id="g2-step">参数法的一般步骤</h3>
    <p>① 选参数。动点的运动由什么驱动，就取什么作参数：绕定点转动取角，沿直线滑动取有向距离，按比例分线段取比值。</p>
    <p>② 写参数方程。把动点的横纵坐标都用这个参数表示，得到 <Katex tex="x=f(t)" />、<Katex tex="y=g(t)" />。写的时候把参数的取值范围一并记下。</p>
    <p>③ 消参。代入、平方相加、借恒等式（<Katex tex="\cos^2t+\sin^2t=1" />、<Katex tex="\sec^2t-\tan^2t=1" />）都是常用手法，与参1 的消参完全一致。</p>
    <p>④ 补范围。消参可能把曲线扩大，比如平方相加会把「<Katex tex="\theta" /> 只取上半圈」扩成整圆。轨迹方程后面应注明 <Katex tex="x" />、<Katex tex="y" /> 的取值范围，或说明曲线上的哪些点不在轨迹上。</p>

    <h3 class="sec" id="g2-pit">范围与补点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：消参后丢掉参数范围。</strong>本题 <Katex tex="\theta" /> 取遍 <Katex tex="[0,2\pi)" />，得到的确实是整圆。若题设限定 <Katex tex="P" /> 在第一象限，则 <Katex tex="\theta\in(0,\pi/2)" />，轨迹只是绿色圆上的一小段弧，不能写成整圆。</li>
        <li><strong>提示二：相关点法反解时漏掉约束。</strong>把 <Katex tex="P" /> 用 <Katex tex="M" /> 表示后代回已知曲线，只说明 <Katex tex="M" /> 落在某条曲线上；还要核对已知点 <Katex tex="P" /> 是否取遍了整条已知曲线。取不到的点对应的 <Katex tex="M" /> 要从轨迹里删去。</li>
        <li><strong>提示三：把轨迹方程与轨迹混为一谈。</strong>方程是代数对象，轨迹是点集。方程化简过程中若两边平方，可能引入原轨迹上没有的点（增解），也可能因为开方取正而漏掉点（失解）。化简后应回代检验端点与特殊位置。</li>
        <li><strong>提示四：位似比与中点混淆。</strong>本题的中点对应位似比 <Katex tex="1/2" />，圆心到 <Katex tex="A" /> 的距离与原圆心到 <Katex tex="A" /> 的距离之比也是 <Katex tex="1/2" />。若把「中点」换成「三等分点」，位似比随之改变，轨迹圆的圆心与半径都要重算，不能套用本题结论。</li>
      </ul>
    </div>
    <p>回收：本章的中点轨迹用到了参2 的圆的参数式与相关点法，消参手法与参1 一致。极坐标与参数方程四个子专题到此完整：极坐标给点另一种定位方式，参数方程给曲线另一种描述方式，两者在求最值与求轨迹时都比普通方程直接。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParamLocus } from '../../../boards/polar/apply/paramlocus.js';
import { PG_CHAPTERS } from './pgnav.js';
</script>
