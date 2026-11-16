<template>
  <ChPage :cur="1" no="综1" base="/linecircle/z" :chapters="ZN_CHAPTERS"
    title="对称与最值"
    sub="对称把两个点的位置绑在一起，也给折线提供了一条拉直的路。求折线最短时，把其中一个定点关于直线翻过去，折线就变成一条直线段；求圆上点到定点或定直线的距离最值，则把圆心到该对象的最值平移一个半径。"
    :toc="[{ id: 'z1-sym', t: '点与圆的对称' }, { id: 'z1-path', t: '折线最短' }, { id: 'z1-ext', t: '圆上的距离最值' }, { id: 'z1-pit', t: '对称与取等' }]">
    <div class="note good">点 <Katex tex="P(x_0,y_0)" /> 关于直线 <Katex tex="l:Ax+By+C=0" /> 的对称点 <Katex tex="P'" /> 同时满足两个条件：<Katex tex="PP'\perp l" />，且 <Katex tex="PP'" /> 的中点在 <Katex tex="l" /> 上。圆关于直线对称，只须把圆心对称过去，半径不变。圆上点 <Katex tex="P" /> 到定点 <Katex tex="Q" /> 的距离界于 <Katex tex="\big||QC|-r\big|" /> 与 <Katex tex="|QC|+r" /> 之间；到定直线 <Katex tex="l" /> 的距离界于 <Katex tex="|d-r|" /> 与 <Katex tex="d+r" /> 之间，其中 <Katex tex="d=d(C,l)" />，直线与圆相交时最小值为 <Katex tex="0" />。</div>

    <h3 class="sec" id="z1-sym">点与圆的对称</h3>
    <p>对称有三种基本对象。点关于点对称，用中点公式：<Katex tex="P(x_0,y_0)" /> 关于 <Katex tex="M(a,b)" /> 的对称点是 <Katex tex="(2a-x_0,\ 2b-y_0)" />。</p>
    <p>点关于直线对称，要解一个方程组。设对称点为 <Katex tex="P'(x',y')" />，先写垂直条件 <Katex tex="PP'\perp l" />，把两个方向向量点乘为零；再写中点条件，把 <Katex tex="PP'" /> 的中点坐标代入直线方程。两个方程解两个未知量，得到唯一解。</p>
    <p>若直线是特殊位置，可以直接写结果。关于 <Katex tex="x" /> 轴对称，纵坐标变号；关于 <Katex tex="y" /> 轴对称，横坐标变号；关于 <Katex tex="y=x" /> 对称，两个坐标互换；关于 <Katex tex="y=-x" /> 对称，两个坐标互换后再变号。</p>
    <p>圆关于直线对称，圆心的对称点就是新圆心，半径保持不变。直线与圆的位置关系在对称下也不变：相切仍相切，相交仍相交，弦长相同。两个圆关于一条直线对称时，两个圆心互为对称点，半径相等；这条直线是两圆公共弦的垂直平分线。</p>

    <h3 class="sec" id="z1-path">折线最短</h3>
    <div class="board-wrap">
      <BoardMount :factory="createSymReflect" />
      <div class="cap">图 综1a · <b>对称与折线最短</b>：金色定点 <Katex tex="A" />、绿色定点 <Katex tex="B" />、橙色动点 <Katex tex="P" /> 在 <Katex tex="x" /> 轴上。看点：把 <Katex tex="B" /> 拖到 <Katex tex="x" /> 轴另一侧，紫色虚线的作法是「作 <Katex tex="A" /> 的对称点」还是「直接连 <Katex tex="AB" />」会随之切换；拖动 <Katex tex="P" />，当它落进空心圈时，两段距离之和恰好等于下界。</div>
    </div>
    <p>在直线 <Katex tex="l" /> 上求一点 <Katex tex="P" />，使 <Katex tex="|PA|+|PB|" /> 最小。若 <Katex tex="A" />、<Katex tex="B" /> 在 <Katex tex="l" /> 的同一侧，作 <Katex tex="A" /> 关于 <Katex tex="l" /> 的对称点 <Katex tex="A'" />。对 <Katex tex="l" /> 上任意一点 <Katex tex="P" />，都有 <Katex tex="|PA|=|PA'|" />，于是</p>
    <p style="text-align:center"><Katex tex="|PA|+|PB|=|PA'|+|PB|\ge|A'B|." display /></p>
    <p>右边是两点之间的直线距离，与 <Katex tex="P" /> 无关。等号成立当且仅当 <Katex tex="P" /> 落在 <Katex tex="A'B" /> 上，此时 <Katex tex="P" /> 就是 <Katex tex="A'B" /> 与 <Katex tex="l" /> 的交点。若 <Katex tex="A" />、<Katex tex="B" /> 分居 <Katex tex="l" /> 两侧，<Katex tex="AB" /> 本身就与 <Katex tex="l" /> 相交，最小值就是 <Katex tex="|AB|" />，不必再作对称点。</p>
    <p>反过来求差的绝对值最大，作法相反。<Katex tex="A" />、<Katex tex="B" /> 在 <Katex tex="l" /> 同侧时，<Katex tex="\big||PA|-|PB|\big|\le|AB|" />，延长 <Katex tex="AB" /> 与 <Katex tex="l" /> 相交即取等；在两侧时先作对称点，再由三角形不等式取等。和的极小与差的极大是同一套三角形不等式，只是取等的图形不同。</p>

    <h3 class="sec" id="z1-ext">圆上的距离最值</h3>
    <div class="board-wrap">
      <BoardMount :factory="createCircEx" />
      <div class="cap">图 综1b · <b>与圆有关的最值</b>：金色圆、蓝色圆心 <Katex tex="C" />、橙色点 <Katex tex="P" /> 沿圆周走。看点：第一档拖动绿色定点 <Katex tex="Q" />，蓝圈与紫圈分别是最近点与最远点，<Katex tex="|PQ|" /> 在两者之间取值；第二档换成水平直线 <Katex tex="l" />，紫虚线是 <Katex tex="P" /> 到 <Katex tex="l" /> 的垂线段，上下拖动直线，最小值在 <Katex tex="d" /> 与 <Katex tex="r" /> 的大小关系改变时换一种算法。</div>
    </div>
    <p>圆上点到定点的距离最值，用圆心作中介。设圆心为 <Katex tex="C" />、半径为 <Katex tex="r" />，定点为 <Katex tex="Q" />。由三角形不等式，<Katex tex="|QC|-r\le|PQ|\le|QC|+r" />。取等的位置在射线 <Katex tex="CQ" /> 上：靠近 <Katex tex="Q" /> 的那一端给最小值，远离 <Katex tex="Q" /> 的那一端给最大值。若 <Katex tex="Q" /> 在圆内，<Katex tex="|QC|-r" /> 为负，最小值应写成 <Katex tex="r-|QC|" />，几何上是 <Katex tex="P" /> 落在射线 <Katex tex="QC" /> 的反向延长线与圆的交点。</p>
    <p>圆上点到定直线的距离最值，同样用圆心。设圆心到直线的距离为 <Katex tex="d" />，则 <Katex tex="P" /> 到直线的距离界于 <Katex tex="|d-r|" /> 与 <Katex tex="d+r" /> 之间。直线与圆相交时 <Katex tex="d\le r" />，最小值是 <Katex tex="0" />，因为圆上已经有点落在直线上。</p>
    <p>求斜率或截距的最值，可以化为距离问题。过定点 <Katex tex="Q" /> 的直线与圆有公共点，等价于 <Katex tex="Q" /> 到圆心的距离不超过 <Katex tex="r" />；对斜率设参数后，这条条件就是一个关于斜率的不等式，解出区间即得范围。截距型同理，把直线写成斜截式后让圆心到它的距离不超过半径。</p>

    <h3 class="sec" id="z1-pit">对称与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把点关于直线的对称点当成关于原点的对称点。</strong>关于原点对称是坐标同时变号，关于一般直线对称要解方程组，两者只有在直线为 <Katex tex="y=x" /> 这类特殊位置时才偶然一致。</li>
        <li><strong>提示二：忘记验证中点。</strong>只写垂直条件只能确定对称点在过 <Katex tex="P" /> 的垂线上，位置有两个方向，必须再加中点条件。有些解答只算斜率乘积为 <Katex tex="-1" />，漏掉中点，得到的点关于垂足对称却没有翻到另一侧。</li>
        <li><strong>提示三：最小值写成 <Katex tex="|QC|-r" /> 而不看正负。</strong>定点在圆内时这个差是负数，而距离不能为负。写答案前先比较 <Katex tex="|QC|" /> 与 <Katex tex="r" />，必要时取绝对值或改写成 <Katex tex="r-|QC|" />。</li>
        <li><strong>提示四：折线最短只算长度，不验证点落在轨道上。</strong>对称后的交点可能落在直线的延长线上，而题目限定了 <Katex tex="P" /> 在某条线段或某段弧上。这时最小值在端点取到，不能直接用拉直的结果。</li>
      </ul>
    </div>
    <p>回收与预告：综2 把对称与圆周角定理合起来求轨迹，再用弦心距处理弦长的最值。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSymReflect } from '../../../boards/linecircle/apply/symreflect.js';
import { createBoard as createCircEx } from '../../../boards/linecircle/apply/circlex.js';
import { ZN_CHAPTERS } from './znav.js';
</script>
