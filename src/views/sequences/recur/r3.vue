<template>
  <ChPage :cur="3" no="递3" base="/sequences/r" :chapters="RQ_CHAPTERS"
    title="分式递推与不动点（蛛网图）"
    sub="每递推一步就是用函数算一次。把函数曲线与直线 y=x 画在同一张图上，反复「竖到曲线、横到 y=x」，折线就画出整列数，尽头是曲线与直线的交点。"
    :toc="[{ id: 'r3-map', t: '递推就是反复用同一个函数' }, { id: 'r3-web', t: '蛛网图的画法' }, { id: 'r3-fix', t: '不动点与收敛' }, { id: 'r3-pit', t: '定义域、交点个数与收敛条件' }]">
    <div class="note good">递推式 <Katex tex="a_{n+1}=f(a_n)" /> 把「算下一项」写成「过一遍函数 <Katex tex="f" />」。若某个值 <Katex tex="x" /> 满足 <Katex tex="x=f(x)" />，则数列取到它以后一直不变，这样的 <Katex tex="x" /> 叫<strong>不动点</strong>。在图上，不动点是曲线 <Katex tex="y=f(x)" /> 与直线 <Katex tex="y=x" /> 的交点。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCobweb" />
      <div class="cap">图 递3 · <b>分式递推与蛛网图</b>：蓝曲线是 <Katex tex="f(x)=1+\dfrac{c}{x}" />，金虚线是 <Katex tex="y=x" />，紫折线是数列的轨迹，橙点是曲线与直线的交点（不动点）。从蓝点 <Katex tex="(a_1,0)" /> 出发，竖直碰到曲线、水平走到 <Katex tex="y=x" />，再竖、再横。拖动 <Katex tex="a_1" />：起点在不动点下方时折线自下而上绕，在上方时自上而下绕，最终都卷向同一个交点。</div>
    </div>

    <h3 class="sec" id="r3-map">递推就是反复用同一个函数</h3>
    <p><Katex tex="a_{n+1}=\dfrac{a_n+c}{a_n}" /> 右边只含 <Katex tex="a_n" />，把它记作 <Katex tex="f(x)=\dfrac{x+c}{x}=1+\dfrac{c}{x}" />，递推式就是 <Katex tex="a_{n+1}=f(a_n)" />。整列数由首项与这个函数确定：<Katex tex="a_1" />，<Katex tex="f(a_1)" />，<Katex tex="f(f(a_1))" />，……</p>
    <p>把它与 递2 对照：那里 <Katex tex="f" /> 是一次函数，可以直接求出通项；这里的 <Katex tex="f" /> 是分式，通项要用分式线性变换的办法求出；但数列的<strong>走向</strong>可以先由图象读出，不必先求出通项。</p>
    <p>图 递3 的递推式还可写成 <Katex tex="a_{n+1}=1+\dfrac{c}{a_n}" />，若把 <Katex tex="c" /> 取成 1、并把每一站都代回去，会得到连分数 <Katex tex="1+\dfrac{1}{1+\dfrac{1}{1+\dots}}" />。它的值正是方程 <Katex tex="x=1+\dfrac{1}{x}" /> 的正根 <Katex tex="\dfrac{1+\sqrt5}{2}" />——斐波那契数列相邻两项之比趋近的那个数。</p>

    <h3 class="sec" id="r3-web">蛛网图的画法</h3>
    <p>准备两张图叠在一起：曲线 <Katex tex="y=f(x)" /> 与直线 <Katex tex="y=x" />。从 <Katex tex="(a_1,0)" /> 出发，按三步走：</p>
    <p>① 竖直向上（或向下）走到曲线上的点 <Katex tex="(a_1,f(a_1))" />，这一步把 <Katex tex="a_1" /> 换成了 <Katex tex="a_2" />；② 水平走到直线上的点 <Katex tex="(a_2,a_2)" />，这一步把 <Katex tex="a_2" /> 搬到横轴上；③ 再竖直走到曲线，得到 <Katex tex="a_3" />。重复下去，折线的每一个横坐标就是一项。</p>
    <p>图 递3 中的紫折线就是这样得到的：竖段的顶端在曲线上，横段的右端在 <Katex tex="y=x" /> 上。折线是一圈一圈的方形螺旋而不是台阶，原因是这里 <Katex tex="f" /> 递减（<Katex tex="f'(x)=-\dfrac{c}{x^2}<0" />）：一步大一步小，数值来回换边，但幅度逐步缩小。</p>
    <p>蛛网图不依赖通项公式，它把「数列的第几项」换成「在图上走了几步」，收敛、发散、摆动这些现象都能直接看出来。</p>

    <h3 class="sec" id="r3-fix">不动点与收敛</h3>
    <p>不动点由 <Katex tex="x=\dfrac{x+c}{x}" /> 求出，乘以 <Katex tex="x" />（<Katex tex="x\ne0" />）得 <Katex tex="x^2-x-c=0" />，正根是 <Katex tex="x=\dfrac{1+\sqrt{1+4c}}{2}" />。这个根在图上就是曲线与 <Katex tex="y=x" /> 的交点，图 递3 的橙点。</p>
    <p>折线为什么能卷向它？把递推式写成 <Katex tex="a_{n+1}-x=f(a_n)-f(x)" />，两边差的绝对值随 <Katex tex="|f'(x)|=\dfrac{c}{x^2}" /> 缩小。在不动点附近 <Katex tex="|f'(x)|<1" /> 时，误差每走一步就乘上一个小于 1 的因子，折线越绕越紧；<Katex tex="|f'(x)|>1" /> 时误差放大，折线向外散开，这个办法就只能用来判发散。</p>
    <p>本板的 <Katex tex="c>0" /> 使不动点处的 <Katex tex="\dfrac{c}{x^2}<1" /> 成立（因为 <Katex tex="x^2=x+c>c" />），所以从任何正的首项出发都收敛到 <Katex tex="x" />。从下方出发数列递增，从上方出发数列递减，两者都夹着 <Katex tex="x" /> 靠近，图 递3 的徽章按起点位置改判读。</p>

    <h3 class="sec" id="r3-pit">定义域、交点个数与收敛条件</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：分母不能为零。</strong><Katex tex="a_{n+1}=\dfrac{a_n+c}{a_n}" /> 要求 <Katex tex="a_n\ne0" />。如果某一项算出来是 0，下一项就没有定义，数列在此截断，讨论通项也不再适用。首项取 0 时递推式无意义。</li>
        <li><strong>提示二：不动点可能有多个或没有。</strong>方程 <Katex tex="x=f(x)" /> 是一般方程，二次的不动点方程可以有两个根（例如 <Katex tex="a_{n+1}=\dfrac{2a_n+1}{a_n}" /> 有两根，一正一负），数列只会趋近其中有定义且稳定的那一个；也可能一个根都没有，这时蛛网图没有交点，数列不收敛。</li>
        <li><strong>提示三：有交点不等于收敛。</strong>不动点只是「停下来的位置」，能否走到它要看附近的斜率。图上表现为：折线朝交点收拢才收敛，朝外展开则发散，即使交点明明画在那里。判定时看图也看 <Katex tex="f'(x)" />。</li>
        <li><strong>提示四：蛛网图给的是趋势，不是通项。</strong>折线能说明数列趋近于哪个值、单调还是摆动，但要求某一项的具体数值，仍要代递推式逐项算，或求出通项。</li>
      </ul>
    </div>
    <p>回收与预告：本板的不动点是曲线与直线 <Katex tex="y=x" /> 的交点，递2 的不动点是直线与直线的交点；同一个「平衡位置」的想法在 递4 变成特征方程的两个根——那里有两个成分同时等比，只平移一次不够，要把整列数拆成两份。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCobweb } from '../../../boards/sequences/recur/cobweb.js';
import { RQ_CHAPTERS } from './rnav.js';
</script>
