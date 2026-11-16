<template>
  <ChPage :cur="2" no="面2" base="/spacegeom/p" :chapters="SP_CHAPTERS"
    title="空间直线的方程"
    sub="直线由一个点与一条方向向量确定，与平面只差「法向量」换成「方向向量」这一步。把「点 P 与定点的连线平行于方向向量」写成坐标成比例，就得到点向式；令比例等于参数 t，得到参数式，t 的绝对值就是点沿着直线走过的有向距离。"
    :toc="[{ id: 'p2-pointdir', t: '点向式（对称式）' }, { id: 'p2-param', t: '参数式' }, { id: 'p2-twopt', t: '两点式' }, { id: 'p2-intersect', t: '两平面交线与一般式' }, { id: 'p2-pit', t: '方向向量与分母' }]">
    <div class="note good">设直线过点 <Katex tex="P_0(x_0,y_0,z_0)" />，方向向量为 <Katex tex="\vec s=(m,n,p)\ne\vec 0" />，则点 <Katex tex="P(x,y,z)" /> 在直线上的充要条件是 <Katex tex="\overrightarrow{P_0P}\parallel\vec s" />，写成坐标即
      <Katex tex="\frac{x-x_0}{m}=\frac{y-y_0}{n}=\frac{z-z_0}{p}." display /></div>

    <h3 class="sec" id="p2-pointdir">点向式（对称式）</h3>
    <p>这一组等式本来就是「存在实数 <Katex tex="t" /> 使三个分量的差分别等于 <Katex tex="tm,tn,tp" />」的另一种写法：三式的公共比值正是这个 <Katex tex="t" />。所以点向式与参数式描述的是同一条直线，只是把参数消去了。</p>
    <p>点向式里出现的分母是方向向量的分量，可以同乘一个非零数换成任何一组成比例的数。把分母化成整数、让第一个非零分量为正，是常用的整理方式。与平面的一般式不同，直线没有「一般式」——空间里两个一次方程联立才表示曲线，一条直线要两张平面交出来。</p>
    <div class="board-wrap">
      <BoardMount :factory="createLine3d" />
      <div class="cap">图 面2 · <b>空间直线的方程机</b>：三档同台。① 点向式——方向角 <Katex tex="\theta" />、方位角 <Katex tex="\varphi" /> 转动紫色方向向量 <Katex tex="\vec s" />，橙色定点 <Katex tex="P_0" /> 的横坐标可调，徽章用坐标写出对称式；② 参数式——参数 <Katex tex="t" /> 滑块让绿点 <Katex tex="P" /> 沿直线滑动，徽章读 <Katex tex="t" /> 与 P 的坐标，<Katex tex="|t|" /> 即 P 到 <Katex tex="P_0" /> 的距离；③ 两平面交线——蓝色与绿色两张半透明平面相交，金色交线的方向是 <Katex tex="\vec n_1\times\vec n_2" />。看点：把直线平行于某条坐标轴调出来，点向式里对应分量的分母就趋于零，那种写法要改成参数式或方程组；第二档把 <Katex tex="t" /> 从负拨到正，P 穿过 <Katex tex="P_0" /> 换到另一侧。</div>
    </div>

    <h3 class="sec" id="p2-param">参数式</h3>
    <p>引入参数 <Katex tex="t\in\mathbb R" />，直线写成</p>
    <p style="text-align:center"><Katex tex="\begin{cases}x=x_0+mt,\\ y=y_0+nt,\\ z=z_0+pt,\end{cases}\qquad\text{即}\quad P=P_0+t\vec s." display /></p>
    <p>参数式的长处是把「直线上的点」变成「一个数」：给定 <Katex tex="t" /> 立刻得到点的坐标，反过来给定点时解出 <Katex tex="t" /> 即可判断它是否在直线上。</p>
    <p>当方向向量取成单位向量时，<Katex tex="|t|" /> 就是点 <Katex tex="P" /> 到 <Katex tex="P_0" /> 的距离，<Katex tex="t" /> 的符号说明 P 落在 <Katex tex="P_0" /> 的哪一侧。这条性质在面4 求点到直线的距离时直接用得上：垂足对应的参数由投影算出，距离再由 <Katex tex="t" /> 与勾股合成。</p>
    <p>参数式的另一个用处是处理「竖直」情形。点向式的分母不能为零，而方向向量平行于某条坐标轴时必然出现零分量；参数式不需要相除，任何方向都能写，所以严格来说它比对称式更通用。</p>

    <h3 class="sec" id="p2-twopt">两点式</h3>
    <p>已知直线上两点 <Katex tex="P_1,P_2" />，取方向向量为 <Katex tex="\overrightarrow{P_1P_2}" />，点向式变成</p>
    <p style="text-align:center"><Katex tex="\frac{x-x_1}{x_2-x_1}=\frac{y-y_1}{y_2-y_1}=\frac{z-z_1}{z_2-z_1}." display /></p>
    <p>两点式没有新内容，只是把方向向量落了地。写法上与平面内的两点式只多一个分量，验证三点共线也靠它：把第三点的坐标代进去，三式同时成立即三点共线。</p>
    <p>另一种常见写法是把两点写成参数式的端点组合 <Katex tex="(1-t)P_1+tP_2" />，取 <Katex tex="t=0,1" /> 分别得两端，取 <Katex tex="t=\tfrac12" /> 得中点。这与平面内定比分点的写法完全一致，vectors 模块的 基3 讲过同一件事。</p>

    <h3 class="sec" id="p2-intersect">两平面交线与一般式</h3>
    <p>两张不平行的平面交出一条直线，把它写成方程组就得到直线的<strong>一般式</strong>：</p>
    <p style="text-align:center"><Katex tex="\begin{cases}A_1x+B_1y+C_1z+D_1=0,\\ A_2x+B_2y+C_2z+D_2=0.\end{cases}" display /></p>
    <p>要从一般式回到点向式，先取方向向量 <Katex tex="\vec s=\vec n_1\times\vec n_2" />，再解方程组求交线上的一点（可令某个坐标为 0 化简），两件要素齐了，点向式就写出来了。画板第三档做的正是这一步：两张平面转动的角度由滑块给出，金色交线的方向每次都由叉积现算。</p>
    <p>两法向量共线时方程组无解（平行且不重合）或两张平面是同一张（重合），这时没有唯一的直线。判定顺序与面1 的两平面判据一致，先看叉积是否为零向量。</p>

    <h3 class="sec" id="p2-pit">方向向量与分母</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向向量写成了两点坐标之差的反向。</strong><Katex tex="\overrightarrow{P_1P_2}" /> 与 <Katex tex="\overrightarrow{P_2P_1}" /> 表示同一条直线，符号全反不影响图形；但在参数式里算距离、比较方位时方向必须一致，中途换向会让答案差一个负号。</li>
        <li><strong>提示二：分母为零时仍按比例式解方程。</strong><Katex tex="m=0" /> 表示这条直线的 <Katex tex="x" /> 坐标恒为 <Katex tex="x_0" />，应改写成 <Katex tex="x=x_0" /> 并与其余两式联立，不能写成除以零。</li>
        <li><strong>提示三：以为一条一次方程就是一条直线。</strong>空间里一个一次方程表示一张平面。要表示直线须两个一次方程联立，这条与平面内的情形正好相反。</li>
        <li><strong>提示四：参数式的 t 当成坐标。</strong><Katex tex="t" /> 是有向距离（方向向量取单位向量时）或它的倍数，不是某个坐标分量。求交点时把 <Katex tex="t" /> 代回参数式得到的才是坐标。</li>
      </ul>
    </div>
    <p>回收与预告：平面有法向量、直线有方向向量，两种方程凑在一起就能问「它们怎么摆」。面3 把两平面、直线与平面、两直线三组位置关系排成一张判定表，全部由数量积与向量积读出。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLine3d } from '../../../boards/spacegeom/plane/line3d.js';
import { SP_CHAPTERS } from './spnav.js';
</script>
