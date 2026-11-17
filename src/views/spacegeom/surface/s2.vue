<template>
  <ChPage :cur="2" no="曲2" base="/spacegeom/s" :chapters="SS_CHAPTERS"
    title="旋转曲面"
    sub="一条曲线绕一条定直线旋转一圈，扫出的曲面叫旋转曲面。曲线叫母线、直线叫轴。垂直于轴截一刀，得到的截口都是圆——纬圆。方程里只要出现 x²+y² 这一整块，就说明这个曲面绕 z 轴旋转而生。"
    :toc="[{ id: 's2-def', t: '母线与旋转轴' }, { id: 's2-eq', t: '方程写法' }, { id: 's2-cases', t: '三种母线与对应曲面' }, { id: 's2-app', t: '球面与圆锥' }, { id: 's2-pit', t: '绕轴与代换的四条' }]">
    <div class="note good">设母线 <Katex tex="C" /> 落在 <Katex tex="xOz" /> 平面内，方程为 <Katex tex="f(x,z)=0" />，绕 <Katex tex="z" /> 轴旋转一圈得到曲面。曲面上点 <Katex tex="P(x,y,z)" /> 由母线上某点 <Katex tex="(x_0,0,z)" /> 绕轴转来，两者高度相同、到轴的距离也相同，即 <Katex tex="x_0=\pm\sqrt{x^2+y^2}" />，代入母线得 <Katex tex="f\!\left(\pm\sqrt{x^2+y^2},\,z\right)=0" />，这就是旋转曲面的方程。</div>

    <h3 class="sec" id="s2-def">母线与旋转轴</h3>
    <p>旋转曲面的生成方式与柱面、锥面同属一族：给一条曲线与一条运动规则，扫出曲面。柱面是「沿直线平移」，锥面是「从定点连射线」，旋转曲面是「绕定直线转一圈」。三种规则的差别在于母线在运动时怎么动，得到的曲面方程也就各有一个记号特征。</p>
    <p>旋转时母线上的每一点画出一个圆，圆心落在轴上，半径等于该点到轴的距离。这些圆叫<strong>纬圆</strong>，母线的每一个位置叫一条<strong>经线</strong>。曲面上每一点都在一个纬圆上，也都在某条经线上——经纬两族曲线叉起来，就把整张曲面包住了。</p>
    <p>母线绕轴转一圈与转半圈得到的曲面相同，因为纬圆本就一整圈。所以判断旋转面只需看「转完之后有没有圆形截口」，不必关心母线的起点。</p>

    <h3 class="sec" id="s2-eq">方程写法</h3>
    <p>把上面的推导整理成一句话：<strong>绕 <Katex tex="z" /> 轴旋转时，把母线方程里的 <Katex tex="x" /> 换成 <Katex tex="\pm\sqrt{x^2+y^2}" />，平方后即为曲面方程</strong>。等价地，母线方程里出现 <Katex tex="x^2" /> 的地方换成 <Katex tex="x^2+y^2" />。</p>
    <p>绕 <Katex tex="y" /> 轴旋转则把 <Katex tex="z^2" /> 换成 <Katex tex="z^2+x^2" />，绕 <Katex tex="x" /> 轴则把 <Katex tex="y^2" /> 换成 <Katex tex="y^2+z^2" />。规律是「绕哪个轴转，就保留哪个变量的平方，把另一个变量的平方补上缺失的第三个变量的平方」——换掉的是垂直于轴的那两个方向。</p>
    <p>反过来也成立：看到方程里只有 <Katex tex="x^2+y^2" />、没有单独的 <Katex tex="x" /> 或 <Katex tex="y" />，就知道它绕 <Katex tex="z" /> 轴旋转而来，母线可以取成 <Katex tex="xOz" /> 平面内的那一段（令 <Katex tex="y=0" /> 反解）。</p>
    <div class="board-wrap">
      <BoardMount :factory="createRevsurf" />
      <div class="cap">图 曲2 · <b>旋转曲面</b>：金色母线画在 <Katex tex="xOz" /> 平面内，淡金色是它的另一侧，蓝色一圈圈纬圆铺出曲面，绿色纬圆随滑块上下移动，它的半径由母线在该高度处的横坐标读出。三档母线：① 抛物线 <Katex tex="z=kr^2" />，得旋转抛物面；② 直线 <Katex tex="z=mr" />，得圆锥面；③ 竖直线 <Katex tex="r=R" />，得圆柱面。看点：把抛物系数 <Katex tex="k" /> 调小，开口变宽、纬圆在相同高度处更大；第二档的纬圆半径随高度线性增大，正是「母线与轴夹角固定」的样子；第三档无论 <Katex tex="z" /> 取多少，纬圆半径都是同一个数。</div>
    </div>

    <h3 class="sec" id="s2-cases">三种母线与对应曲面</h3>
    <ul>
      <li><strong>母线是直线。</strong>斜交于轴时得圆锥面，平行于轴时得圆柱面，与轴重合时退化成轴本身（不是曲面）。</li>
      <li><strong>母线是抛物线。</strong>得旋转抛物面，典型方程 <Katex tex="z=x^2+y^2" />。它与抛物柱面不同：柱面只缺一个变量，抛物面三个变量都在。</li>
      <li><strong>母线是双曲线。</strong>得单叶或双叶旋转双曲面。以 <Katex tex="x^2-z^2=1" /> 绕 <Katex tex="z" /> 轴旋转得 <Katex tex="x^2+y^2-z^2=1" />，最细的一圈在 <Katex tex="z=0" />，形状像腰鼓。</li>
    </ul>
    <p>圆锥曲线绕自己的对称轴旋转，得到的曲面统称<strong>旋转二次曲面</strong>。它们的方程里都只有 <Katex tex="x^2+y^2" /> 这样的组合——这一条把曲3 的二次曲面与本节连了起来，二次曲面里能「绕轴旋转而成」的那几类正好是截口为圆的情形。</p>
    <p>还有一类常见情形：母线本身是椭圆或不闭合曲线，绕轴旋转后得到的曲面没有对称的另一半。例如母线 <Katex tex="z=\sqrt{x}" />（<Katex tex="x\ge 0" />）绕 <Katex tex="z" /> 轴旋转得 <Katex tex="z^2=x^2+y^2" />（<Katex tex="z\ge0" />），只留下上半锥面。</p>

    <h3 class="sec" id="s2-app">球面与圆锥</h3>
    <p>球面是把半圆 <Katex tex="x^2+z^2=R^2" />（<Katex tex="x\ge 0" />）绕 <Katex tex="z" /> 轴旋转得到的。按代换规则把 <Katex tex="x^2" /> 换成 <Katex tex="x^2+y^2" />，得</p>
    <p style="text-align:center"><Katex tex="x^2+y^2+z^2=R^2." display /></p>
    <p>三个变量的平方系数相同，这是球面的特征；系数不同则是椭球。球面是旋转曲面里对称性最强的一种：绕任意一条过球心的直线旋转都能得到它。</p>
    <p>圆锥面 <Katex tex="z^2=m^2(x^2+y^2)" /> 的母线是 <Katex tex="z=mx" />，与 <Katex tex="z" /> 轴的夹角 <Katex tex="\alpha" /> 满足 <Katex tex="\tan\alpha=1/m" />。于是 <Katex tex="m" /> 越大，锥面越尖；画板第二档的斜率滑块改的就是这个 <Katex tex="m" />。把 <Katex tex="z^2" /> 换成 <Katex tex="z" /> 得抛物面，锥面的尖顶随之变成抛物面的光滑顶点。</p>

    <h3 class="sec" id="s2-pit">绕轴与代换的四条</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：绕错轴。</strong>绕 <Katex tex="z" /> 轴转是把「到 <Katex tex="z" /> 轴的距离」保持住，代换补上的是 <Katex tex="x^2+y^2" />，不是 <Katex tex="y^2+z^2" />。先写清轴，再动手代换。</li>
        <li><strong>提示二：母线方程里带有一次项时仍机械代换。</strong>代换 <Katex tex="x^2\to x^2+y^2" /> 只对 <Katex tex="x^2" /> 生效；母线里单独出现的 <Katex tex="x" /> 不能整体换成 <Katex tex="\sqrt{x^2+y^2}" /> 再平方，要先配方或改写成只含 <Katex tex="x^2" /> 的形式。</li>
        <li><strong>提示三：把旋转抛物面写成了抛物柱面。</strong><Katex tex="z=x^2" /> 是抛物柱面（缺 <Katex tex="y" />），<Katex tex="z=x^2+y^2" /> 才是旋转抛物面。两者的截口一个是抛物线平移、一个是抛物线旋转。</li>
        <li><strong>提示四：忽略母线只取一段带来的限制。</strong>母线只取上半支时曲面也只存在一半，方程后面要附上 <Katex tex="z\ge0" /> 之类的条件。丢掉限制会把下半叶凭空补出来。</li>
      </ul>
    </div>
    <p>回收与预告：柱面、锥面、旋转曲面合起来覆盖了大部分常见的二次曲面。曲3 按方程把二次曲面分成椭球、双曲面与抛物面三类，并用「截痕法」把每一类的形状读出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRevsurf } from '../../../boards/spacegeom/surface/revsurf.js';
import { SS_CHAPTERS } from './ssnav.js';
</script>
