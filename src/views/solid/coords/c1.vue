<template>
  <ChPage :cur="1" no="标1" base="/solid/c" :chapters="SC_CHAPTERS"
    title="空间直角坐标系与坐标平面"
    sub="过空间一个定点 O，作三条两两垂直的数轴，就建立了空间直角坐标系。空间一点 P 的坐标由三个有序实数 (x, y, z) 组成，它们分别是 P 到三个坐标平面的有向距离。三个坐标平面把空间分成八个卦限。"
    :toc="[{ id: 'c1-build', t: '三条轴与三张平面' }, { id: 'c1-coord', t: '点的坐标' }, { id: 'c1-octant', t: '八个卦限' }, { id: 'c1-dist', t: '距离与中点' }, { id: 'c1-sym', t: '对称点' }, { id: 'c1-pit', t: '坐标的次序与符号' }]">
    <div class="note good">以单位正方体的一个顶点 <Katex tex="O" /> 为原点，以从 <Katex tex="O" /> 出发的三条棱所在直线为 <Katex tex="x" /> 轴、<Katex tex="y" /> 轴、<Katex tex="z" /> 轴，以 <Katex tex="O" /> 为原点，三条轴都以单位正方体的棱长为单位长度，这样就建立了<strong>空间直角坐标系</strong>，记作 <Katex tex="O\text{-}xyz" />。三条轴的方向按右手系约定：<Katex tex="x" /> 轴、<Katex tex="y" /> 轴、<Katex tex="z" /> 轴依次与右手拇指、食指、中指的指向一致。</div>

    <h3 class="sec" id="c1-build">三条轴与三张平面</h3>
    <div class="board-wrap">
      <BoardMount :factory="createSpaceLab" />
      <div class="cap">图 标1 · <b>空间直角坐标系与坐标平面</b>：三条坐标轴带箭头，三张坐标平面各一种颜色、半透明并铺上淡网格——<Katex tex="xOy" /> 平面是蓝色，<Katex tex="yOz" /> 平面是绿色，<Katex tex="zOx" /> 平面是紫色。橙点 <Katex tex="P" /> 可以在水平面内拖动，<Katex tex="z" /> 滑块抬高它。<b>看点</b>：按住画面拖动可以转动整个坐标系，转到侧面时能看到三张平面两两垂直；虚线把 <Katex tex="P" /> 拆成三个坐标读数，<Katex tex="P'" /> 是它到底面的投影。</div>
    </div>
    <p>三条轴两两垂直，每两条确定一张平面，共得到三张<strong>坐标平面</strong>：<Katex tex="x" /> 轴与 <Katex tex="y" /> 轴确定的平面叫 <Katex tex="xOy" /> 平面，另外两张分别是 <Katex tex="yOz" /> 平面与 <Katex tex="zOx" /> 平面。三张平面互相垂直，把整个空间切成八块，每一块的内部叫做一个卦限。</p>
    <p>坐标平面的方程非常简洁：<Katex tex="xOy" /> 平面上所有点的竖坐标为零，方程是 <Katex tex="z=0" />；<Katex tex="yOz" /> 平面是 <Katex tex="x=0" />；<Katex tex="zOx" /> 平面是 <Katex tex="y=0" />。坐标轴则是两张平面的交线：<Katex tex="z" /> 轴是 <Katex tex="x=0" /> 与 <Katex tex="y=0" /> 的交线，因此 <Katex tex="z" /> 轴上点的坐标形如 <Katex tex="(0,0,z)" />。标2 会把这一观察推广成一般的平面方程。</p>

    <h3 class="sec" id="c1-coord">点的坐标</h3>
    <p>设 <Katex tex="P" /> 是空间一点，过 <Katex tex="P" /> 分别作三张坐标平面的垂线，垂足依次为 <Katex tex="P_x" />、<Katex tex="P_y" />、<Katex tex="P_z" />。三个垂足在对应轴上的坐标 <Katex tex="x,y,z" /> 就是点 <Katex tex="P" /> 的坐标，记作 <Katex tex="P(x,y,z)" />，依次称为横坐标、纵坐标、竖坐标。</p>
    <p>图中把这一过程拆成了两步：先从 <Katex tex="P" /> 竖直落到 <Katex tex="xOy" /> 平面上的 <Katex tex="P'" />，再由 <Katex tex="P'" /> 分别向两轴作垂线读出 <Katex tex="x" /> 与 <Katex tex="y" />；<Katex tex="z" /> 则由 <Katex tex="P" /> 到 <Katex tex="P'" /> 的高度读出。三条虚线合起来，就是「一点对应三个数」的全部动作。</p>
    <p>坐标的另一种理解是「到坐标平面的有向距离」：<Katex tex="x" /> 是 <Katex tex="P" /> 到 <Katex tex="yOz" /> 平面的有向距离，<Katex tex="y" /> 是到 <Katex tex="zOx" /> 平面的有向距离，<Katex tex="z" /> 是到 <Katex tex="xOy" /> 平面的有向距离。方向朝向轴的正向时取正号，反之取负号。三张平面只要有两个同时为零，点就落在某条坐标轴上；三个都为零，点就是原点。</p>

    <h3 class="sec" id="c1-octant">八个卦限</h3>
    <p>三张坐标平面把空间分成八个卦限，按 <Katex tex="(x,y,z)" /> 三个坐标的符号来编号：三个全正的是第一卦限，然后按逆时针绕 <Katex tex="z" /> 轴转到第二、三、四卦限（<Katex tex="z" /> 坐标都为正），再把前四个卦限中 <Katex tex="z" /> 坐标改为负，依次得到第五到第八卦限。</p>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>卦限</th><th>符号 <Katex tex="(x,y,z)" /></th><th>卦限</th><th>符号 <Katex tex="(x,y,z)" /></th></tr></thead>
        <tbody>
          <tr><td>Ⅰ</td><td><Katex tex="(+,+,+)" /></td><td>Ⅴ</td><td><Katex tex="(+,+,-)" /></td></tr>
          <tr><td>Ⅱ</td><td><Katex tex="(-,+,+)" /></td><td>Ⅵ</td><td><Katex tex="(-,+,-)" /></td></tr>
          <tr><td>Ⅲ</td><td><Katex tex="(-,-,+)" /></td><td>Ⅶ</td><td><Katex tex="(-,-,-)" /></td></tr>
          <tr><td>Ⅳ</td><td><Katex tex="(+,-,+)" /></td><td>Ⅷ</td><td><Katex tex="(+,-,-)" /></td></tr>
        </tbody>
      </table>
    </div>
    <p>卦限的编号只由符号决定，与坐标的绝对值无关：点 <Katex tex="(0.1,0.1,0.1)" /> 与点 <Katex tex="(100,50,80)" /> 都在第一卦限。只要有一个坐标为零，点就不在任何卦限的内部，而是落在某张坐标平面上；两个坐标为零则落在坐标轴上。</p>

    <h3 class="sec" id="c1-dist">距离与中点</h3>
    <p>设 <Katex tex="P_1(x_1,y_1,z_1)" />、<Katex tex="P_2(x_2,y_2,z_2)" />，则两点间的距离</p>
    <p style="text-align:center"><Katex tex="|P_1P_2|=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}." display /></p>
    <p>推导只需两次勾股：把两点投影到 <Katex tex="xOy" /> 平面，两条投影点之间的水平距离是 <Katex tex="\sqrt{(\Delta x)^2+(\Delta y)^2}" />，再与竖直方向的高度差 <Katex tex="\Delta z" /> 垂直，第二次勾股即得。特别地，点 <Katex tex="P(x,y,z)" /> 到原点的距离 <Katex tex="|OP|=\sqrt{x^2+y^2+z^2}" />。</p>
    <p>线段 <Katex tex="P_1P_2" /> 的中点坐标是两端坐标的算术平均：</p>
    <p style="text-align:center"><Katex tex="M\left(\dfrac{x_1+x_2}{2},\ \dfrac{y_1+y_2}{2},\ \dfrac{z_1+z_2}{2}\right)." display /></p>
    <p>这两个公式与平面上的对应公式只差一个坐标，形式上完全一致；定比分点公式也是把每一条坐标分别按比例作分点，因此可以逐坐标运算。</p>

    <h3 class="sec" id="c1-sym">对称点</h3>
    <p>点 <Katex tex="P(x,y,z)" /> 关于原点对称的点是 <Katex tex="(-x,-y,-z)" />；关于 <Katex tex="xOy" /> 平面对称的点是 <Katex tex="(x,y,-z)" />，关于 <Katex tex="yOz" /> 平面是 <Katex tex="(-x,y,z)" />，关于 <Katex tex="zOx" /> 平面是 <Katex tex="(x,-y,z)" />。关于坐标平面对称，只把垂直于该平面的那个坐标变号。</p>
    <p>关于 <Katex tex="x" /> 轴对称的点是 <Katex tex="(x,-y,-z)" />，关于 <Katex tex="y" /> 轴是 <Katex tex="(-x,y,-z)" />，关于 <Katex tex="z" /> 轴是 <Katex tex="(-x,-y,z)" />。关于坐标轴对称，把不沿这条轴的两个坐标同时变号——因为这条轴就是那两张平面的交线，关于它对称为同时关于两张平面作对称。</p>

    <h3 class="sec" id="c1-pit">坐标的次序与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="(x,y,z)" /> 写成 <Katex tex="(x,z,y)" />。</strong>三个坐标有固定次序，<Katex tex="y" /> 轴与 <Katex tex="z" /> 轴不能互换：交换后点的位置完全改变。书写时按 <Katex tex="x,y,z" /> 的顺序，与坐标系中三轴的正方向一一对应。</li>
        <li><strong>提示二：以为 <Katex tex="z" /> 坐标就是点到 <Katex tex="z" /> 轴的距离。</strong><Katex tex="z" /> 是到 <Katex tex="xOy" /> 平面的有向距离；点到 <Katex tex="z" /> 轴的距离是 <Katex tex="\sqrt{x^2+y^2}" />。三个坐标分别对应三张坐标平面，而不是三根坐标轴。</li>
        <li><strong>提示三：作图时把 <Katex tex="z" /> 轴画成斜的。</strong>约定 <Katex tex="z" /> 轴竖直向上，<Katex tex="x" /> 轴与 <Katex tex="y" /> 轴画成夹角约为 <Katex tex="135^\circ" /> 的两条斜线（各与水平线成 <Katex tex="45^\circ" /> 左右）。这样画出的三张平面才看得出两两垂直。</li>
        <li><strong>提示四：求对称点时只改一个坐标。</strong>关于原点、关于坐标轴对称都要同时改两个或三个坐标的符号。用「对称点与原点的连线被对称中心平分」回代核验，可以避免漏号。</li>
      </ul>
    </div>
    <p>回收与预告：坐标系把空间几何翻译成代数。<Katex tex="xOy" /> 平面的方程 <Katex tex="z=0" /> 是平面方程的原型，标2 在此基础上写出一平面的点法式与一般式，并用距离与夹角公式收束空间中点、线、面的度量。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpaceLab } from '../../../boards/solid/coords/spacelab.js';
import { SC_CHAPTERS } from './cnav.js';
</script>
