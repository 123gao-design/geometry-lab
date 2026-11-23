<template>
  <ChPage :cur="4" no="R4" base="/functions/r" :chapters="R_CHAPTERS"
    title="牛顿法与弦截：切线一步到位" sub="牛顿法用切线求下一个近似。弦截法用两个近似点之间的割线代替切线。"
    :toc="[{ id: 'r4-der', t: '切线截距的推导（图 R4）' }, { id: 'r4-sp', t: '速度：对数 vs 平方' }, { id: 'r4-fail', t: '失效情形与实战组合' }]">
    <div class="note good" id="r4-der"><strong>牛顿法</strong>：在零点附近取初值 <Katex tex="x_0" />，在 <Katex tex="(x_0,\,f(x_0))" /> 处作切线，用切线与 x 轴的交点 <Katex tex="x_1" /> 作下一个迭代点；再在 <Katex tex="(x_1,\,f(x_1))" /> 作切线……循环往复。切线方程 <Katex tex="y=f(x_0)+f'(x_0)(x-x_0)" />，令 <Katex tex="y=0" /> 解出交点，即得迭代式 —— 这是「<strong>以直代曲</strong>」思想的第一次直接应用：曲线难解，切线好解，就一步一步用切线逼近零点。</div>
    <Katex tex="x_{n+1}\ =\ x_n-\dfrac{f(x_n)}{f'(x_n)}" display />
    <div class="board-wrap">
      <BoardMount :factory="createNewton" />
      <div class="cap">图 R4 · <b>牛顿法与弦截法</b>。比较两种迭代的路径。观察平方根示例收敛，再切到初值为 0 的循环反例。</div>
    </div>

    <h3 class="sec" id="r4-sp">速度：对数 vs 平方</h3>
    <p>设 f 在零点 c 附近二阶连续可导且 <Katex tex="f'(c)\ne0" />。从足够近的初值出发，牛顿法至少二次收敛，误差的二阶项为 <Katex tex="\frac{f''(c)}{2f'(c)}(x_n-c)^2" />。二分法每步把保留区间宽度减半。常见的非退化情形下，弦截法的局部收敛阶约为 1.618。</p>

    <h3 class="sec" id="r4-fail">失效情形与实战组合</h3>
    <p>牛顿法的失效都源于 <Katex tex="f'"/>：<strong>驻点附近</strong>（<Katex tex="f'\approx 0"/> 时切线近水平，交点被推到很远处）；<strong>初值来回循环</strong>（图 R4 ③：<Katex tex="0\to 1\to 0\to 1"/>，两步一个来回，永不收敛）；<strong>不保区间</strong>（下一个迭代点可能越出异号区间，二分法没有这种现象）。弦截法 <Katex tex="x_{n+1}=x_n-\dfrac{f(x_n)(x_n-x_{n-1})}{f(x_n)-f(x_{n-1})}" /> 用两点连线代替切线 —— 不用导数、收敛也快于二分，但同样不保区间。实战标准做法是<strong>两法组合</strong>：先用二分（R3）缩小异号区间 —— 牛顿的初值落进小邻域，失效概率显著下降；再换牛顿法获取平方收敛的速度。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：检查初值和根的条件。</strong>在二阶连续可导的简单零点附近，初值足够近时可以保证局部收敛。图 R4 的循环反例说明其他情形需单独检查。</li>
        <li><strong>提示二：收敛判据只看一个。</strong><Katex tex="|f(x)|"/> 小不代表 x 准（平缓段误差被放大），<Katex tex="|\Delta x|"/> 小也不代表收敛（循环时 <Katex tex="\Delta x"/> 稳定非零）—— 双重验证再结束。</li>
        <li><strong>提示三：<Katex tex="f'\approx 0"/> 仍继续迭代。</strong>分母趋零时一步偏离极大；程序要设护栏（图 R4 的徽章会在这些情形发出警告）。</li>
      </ul>
    </div>
    <p>回收与预告：S2 导数判据第一次入场（f′ 的符号染单调）；这里是第二次 —— f′ 直接进分母当「校正系数」。V 系列将从「割线斜率→切线」正式开场（V1），牛顿法是它最快的应用预告；R3 的二分仍在后台待命 —— 先稳后快，是数值方法的一贯章法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNewton } from '../../../boards/functions/zeros/newton.js';
import { R_CHAPTERS } from './znav.js';
</script>
