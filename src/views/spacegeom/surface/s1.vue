<template>
  <ChPage :cur="1" no="曲1" base="/spacegeom/s" :chapters="SS_CHAPTERS"
    title="柱面与锥面"
    sub="一条曲线沿某个方向平移，扫出的曲面叫柱面；一条曲线被某个定点连成射线，扫出的曲面叫锥面。两种曲面的方程有一个共同的记号特征：柱面的方程里缺一个变量，锥面的方程是齐次的。认准这一条，就能从方程直接看出曲面是什么形状。"
    :toc="[{ id: 's1-def', t: '准线与母线' }, { id: 's1-cyl', t: '柱面的方程' }, { id: 's1-cone', t: '锥面的方程' }, { id: 's1-common', t: '常见的柱面与锥面' }, { id: 's1-pit', t: '缺变量与齐次' }]">
    <div class="note good">一条曲线 <Katex tex="C" /> 沿固定方向 <Katex tex="\vec v" /> 平移，所有经过的轨迹构成<strong>柱面</strong>；<Katex tex="C" /> 叫<strong>准线</strong>，平移的路线叫<strong>母线</strong>。若经过定点 <Katex tex="V" /> 的每一条射线都穿过曲线 <Katex tex="C" />，这些射线的并集构成<strong>锥面</strong>，<Katex tex="V" /> 叫<strong>顶点</strong>。</div>

    <h3 class="sec" id="s1-def">准线与母线</h3>
    <p>柱面由「准线 + 母线方向」两件要素决定：准线定了截面的形状，母线方向定了曲面向哪个方向延伸。母线方向取得不同，同一条准线扫出的柱面也不同——椭圆准线沿竖直方向平移得椭圆柱面，沿斜方向平移得到的却是斜柱面。</p>
    <p>锥面由「准线 + 顶点」决定：顶点与准线上每一点连成一条射线，这些射线的并集就是锥面。准线抬高或降低时，锥面的开口随之变化，但顶点始终固定。</p>
    <p>两种曲面都是「直线扫出来的」，所以曲面上每一点都有一条直线经过——这条性质叫<strong>直纹性</strong>。二次曲面里还有别的直纹曲面，曲3 会再遇到。</p>

    <h3 class="sec" id="s1-cyl">柱面的方程</h3>
    <p>母线平行于 <Katex tex="z" /> 轴时，准线 <Katex tex="C" /> 落在 <Katex tex="xOy" /> 平面内，方程为 <Katex tex="F(x,y)=0" />。柱面上任意一点 <Katex tex="(x,y,z)" /> 与准线上的点 <Katex tex="(x,y,0)" /> 只差一个高度，所以它满足的方程也是</p>
    <p style="text-align:center"><Katex tex="F(x,y)=0." display /></p>
    <p>方程里<strong>缺 <Katex tex="z" /></strong>，这是柱面最显眼的特征：无论 <Katex tex="z" /> 取什么值，只要 <Katex tex="x,y" /> 满足条件，点就在曲面上。反过来说，一个三元方程里缺哪个变量，曲面就平行于哪条轴平移——缺 <Katex tex="x" /> 时母线平行于 <Katex tex="x" /> 轴，依此类推。</p>
    <div class="board-wrap">
      <BoardMount :factory="createCylsurf" />
      <div class="cap">图 曲1 · <b>柱面与锥面</b>：① 柱面——金色准线是 <Katex tex="xOy" /> 平面上的椭圆，蓝色细线是一根根母线，竖着把它们连成柱面，两枚半轴滑块改变截面形状；② 锥面——准线抬到高度 <Katex tex="h" />，母线从橙色的顶点射向准线上的点，淡色的另一半说明两支关于顶点对称。徽章读准线、母线、曲面方程与判读。看点：第一档把两个半轴调成相等，截面由椭圆变圆，方程化简为 <Katex tex="x^2+y^2=R^2" />；第二档把准线抬高，锥面变尖，方程右侧分母 <Katex tex="h^2" /> 随之增大。</div>
    </div>

    <h3 class="sec" id="s1-cone">锥面的方程</h3>
    <p>顶点在原点、准线是高度 <Katex tex="h" /> 处的椭圆 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" /> 时，锥面由「过原点的射线」组成。设锥面上一点 <Katex tex="(x,y,z)" />，把它按比例缩放到准线所在高度，即 <Katex tex="\left(\dfrac{hx}{z},\dfrac{hy}{z},h\right)" />，这个点必须落在准线上，代入得</p>
    <p style="text-align:center"><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}=\frac{z^2}{h^2}." display /></p>
    <p>方程两端都是二次的，叫<strong>齐次方程</strong>。齐次性正好对应锥面的几何：把点 <Katex tex="(x,y,z)" /> 沿射线伸缩成 <Katex tex="(tx,ty,tz)" />，方程两边同乘 <Katex tex="t^2" />，仍然成立。于是射线上的点要么全在曲面上，要么全不在。</p>
    <p>这条判断可以反过来用：<strong>方程是齐次二次式就表示锥面</strong>（或退化成两条直线、一个点）。看到 <Katex tex="z^2=x^2+y^2" /> 这类式子，应当立刻想到锥面而不是抛物面。</p>

    <h3 class="sec" id="s1-common">常见的柱面与锥面</h3>
    <p>准线取平面上的圆锥曲线，就得到三种柱面：</p>
    <ul>
      <li>圆柱面：<Katex tex="x^2+y^2=R^2" />，准线是圆。</li>
      <li>椭圆柱面：<Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" />，准线是椭圆。</li>
      <li>抛物柱面：<Katex tex="y^2=2px" />，准线是抛物线。这一种在空间里依旧叫柱面，不是抛物面——抛物面需要三个变量都出现。</li>
    </ul>
    <p>锥面最常见的是 <Katex tex="z^2=x^2+y^2" />，这是顶点在原点、准线为高度 1 处的单位圆的圆锥面，半顶角为 <Katex tex="45^\circ" />。把系数改一改，半顶角随之改变；把 <Katex tex="z^2" /> 换成一次项，锥面就变成抛物面。</p>
    <p>立体几何里的圆台、棱台不是锥面本身，而是锥面被两张平行平面截出的中间部分。旋转体的侧面（曲2）与本节联系紧密：圆锥面正是把一条斜线绕轴旋转得到的。</p>

    <h3 class="sec" id="s1-pit">缺变量与齐次</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把缺变量的方程当成平面内的曲线。</strong>在空间里 <Katex tex="x^2+y^2=R^2" /> 是圆柱面，不是圆。圆要再加一个条件（如 <Katex tex="z=0" />）才成为空间曲线。</li>
        <li><strong>提示二：把 <Katex tex="y^2=2px" /> 叫成抛物面。</strong>抛物面必须三个变量都出现（如 <Katex tex="z=x^2+y^2" />）。只含两个变量的叫抛物柱面，母线沿缺失的那个变量方向平移。</li>
        <li><strong>提示三：由齐次性判定锥面时漏掉退化。</strong><Katex tex="x^2-y^2=0" /> 也是齐次的，但它化成两张平面 <Katex tex="y=\pm x" />，不是真正的锥面。齐次是必要条件，还要看曲面是否连通、是否退化成直线或点。</li>
        <li><strong>提示四：写准线时忘了注明高度。</strong>锥面的准线必须写清所在的平面（如 <Katex tex="z=h" />），否则「椭圆的锥面」无从计算；柱面的准线同理，通常取在 <Katex tex="xOy" /> 平面内。</li>
      </ul>
    </div>
    <p>回收与预告：柱面与锥面都由「曲线 + 一个运动规则」生成。把规则换成「绕一条直线旋转一圈」，得到的就是旋转曲面——曲2 给出它的方程写法，并说明为什么旋转后的方程里总出现 <Katex tex="x^2+y^2" />。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCylsurf } from '../../../boards/spacegeom/surface/cylsurf.js';
import { SS_CHAPTERS } from './ssnav.js';
</script>
