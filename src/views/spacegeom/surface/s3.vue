<template>
  <ChPage :cur="3" no="曲3" base="/spacegeom/s" :chapters="SS_CHAPTERS"
    title="二次曲面"
    sub="三元二次方程表示的曲面叫二次曲面。用水平平面一张张截下去，把每一次的截痕摆在一起，形状就清楚了——这叫截痕法。按截痕是椭圆、双曲线还是抛物线，二次曲面分成椭球、双曲面与抛物面三类，每一类各有一条标准方程。"
    :toc="[{ id: 's3-ellip', t: '椭球面' }, { id: 's3-hyper', t: '单叶与双叶双曲面' }, { id: 's3-parab', t: '椭圆抛物面与双曲抛物面' }, { id: 's3-slice', t: '截痕法与分类' }, { id: 's3-pit', t: '符号与截痕' }]">
    <div class="note good">三元二次方程的一般形式为 <Katex tex="Ax^2+By^2+Cz^2+Dxy+Exz+Fyz+Gx+Hy+Iz+J=0" />。经过平移与旋转消去交叉项、一次项之后，可以化成五种标准形：椭球面、单叶双曲面、双叶双曲面、椭圆抛物面、双曲抛物面（另有退化成柱面、锥面、平面等情形）。</div>

    <h3 class="sec" id="s3-ellip">椭球面</h3>
    <p><strong>椭球面</strong>的标准方程是</p>
    <p style="text-align:center"><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2}=1." display /></p>
    <p>三个半轴 <Katex tex="a,b,c" /> 都有限，曲面被限制在长方体 <Katex tex="[-a,a]\times[-b,b]\times[-c,c]" /> 之内，是封闭曲面。用 <Katex tex="z=z_0" />（<Katex tex="|z_0|<c" />）去截，截痕是椭圆，两个半轴按 <Katex tex="\sqrt{1-z_0^2/c^2}" /> 同比例缩小；到 <Katex tex="z_0=\pm c" /> 时缩成一点。</p>
    <p>三个半轴相等时椭球退化为球面；两个相等时是旋转椭球，相当于把椭圆绕某条对称轴旋转——曲2 的代换规则在这里正好用上。</p>

    <h3 class="sec" id="s3-hyper">单叶与双叶双曲面</h3>
    <p>把椭球方程中的一个加号改成减号，就得到<strong>单叶双曲面</strong>：</p>
    <p style="text-align:center"><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=1." display /></p>
    <p>水平截痕仍然是椭圆，但半轴 <Katex tex="a\sqrt{1+z^2/c^2}" /> 随 <Katex tex="|z|" /> 增大而增大，最细的一圈在 <Katex tex="z=0" />，叫<strong>腰椭圆</strong>。曲面连通、不封闭，形状像腰鼓。它还是直纹曲面：腰椭圆上每一点都有一条直线整条落在曲面上，冷却塔的外形就是它。</p>
    <p>把等号右边的 1 改成 <Katex tex="-1" />，得到<strong>双叶双曲面</strong>：</p>
    <p style="text-align:center"><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}-\frac{z^2}{c^2}=-1." display /></p>
    <p>此时右边为负，必须有 <Katex tex="z^2/c^2\ge1" />，即 <Katex tex="|z|\ge c" />——曲面分成上下两叶，<Katex tex="|z|<c" /> 的部分是空的。同一个高度截下去，截痕只在 <Katex tex="|z|>c" /> 时存在，越往上椭圆越大。</p>
    <div class="board-wrap">
      <BoardMount :factory="createQuadrics" />
      <div class="cap">图 曲3 · <b>二次曲面机</b>：五档标准形共用一枚「截痕高度」滑块，蓝色细线是各高度的截痕与两条子午线，绿色是 <Katex tex="z_0" /> 处那一层。① 椭球——截痕随高度按 <Katex tex="\sqrt{1-z^2/c^2}" /> 缩小；② 单叶双曲面——腰椭圆最细，越往上下越宽；③ 双叶双曲面——<Katex tex="|z|<c" /> 时没有截痕，判读直接说明截到了空隙；④ 椭圆抛物面——截痕为椭圆，母线是抛物线；⑤ 双曲抛物面——蓝青两族直母线都落在曲面上。看点：把截痕高度从 −2.4 推到 2.4，第三档会先空一段再重新出现，这一段空隙正是两叶之间的部分；第五档转动视角，两族直线仍然贴着曲面，这是马鞍面的直纹性。</div>
    </div>

    <h3 class="sec" id="s3-parab">椭圆抛物面与双曲抛物面</h3>
    <p>方程中 <Katex tex="z" /> 只出现一次时，得到抛物面一类的曲面。<strong>椭圆抛物面</strong>的标准形为</p>
    <p style="text-align:center"><Katex tex="z=\frac{x^2}{a^2}+\frac{y^2}{b^2}." display /></p>
    <p>顶点在原点、开口朝上；水平截痕是椭圆，半轴按 <Katex tex="\sqrt z" /> 增长；竖直截痕是抛物线。它是旋转抛物面的推广（<Katex tex="a=b" /> 时正好是旋转面），卫星接收天线就取这个形状。</p>
    <p>把其中一个加号改成减号，得到<strong>双曲抛物面</strong>：</p>
    <p style="text-align:center"><Katex tex="z=\frac{x^2}{a^2}-\frac{y^2}{b^2}." display /></p>
    <p>水平截痕是双曲线（<Katex tex="z" /> 为正时开口沿 <Katex tex="x" /> 方向，为负时开口沿 <Katex tex="y" /> 方向，<Katex tex="z=0" /> 时退化为两条相交直线），竖直截痕是抛物线。形状像马鞍，因而也叫<strong>马鞍面</strong>。它同样是直纹曲面：两族直母线都以 <Katex tex="z=xy" /> 的形式落在曲面上。</p>

    <h3 class="sec" id="s3-slice">截痕法与分类</h3>
    <p>截痕法的做法是：用一族平行平面去截曲面，把每次得到的平面曲线放在同一张图里比较，看它们如何随高度变化。椭球与双曲面的截痕是椭圆、双曲线，抛物面的截痕是抛物线，三类曲面的差别就体现出来了。</p>
    <p>方程里三个平方项的符号决定分类：</p>
    <ul>
      <li>三个同号、等号右边同号：<strong>椭球面</strong>（有三个系数相等时是球面）。</li>
      <li>两个同号、一个异号且右边为正：<strong>单叶双曲面</strong>；右边为负：<strong>双叶双曲面</strong>。</li>
      <li>出现一次项：<strong>抛物面</strong>，再按剩下两项的符号分椭圆与双曲两类。</li>
      <li>缺一个变量：退化为<strong>柱面</strong>（曲1）；方程齐次：退化为<strong>锥面</strong>（曲1）。</li>
    </ul>
    <p>这套分类与圆锥曲线的分类一脉相承：平面内按判别式 <Katex tex="B^2-4AC" /> 的符号分椭圆、抛物线、双曲线，空间里按平方项的符号分三类，用的都是「符号定形状」这条思路。</p>

    <h3 class="sec" id="s3-pit">符号与截痕</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：单叶与双叶只看一个减号就下结论。</strong>关键是等号右边为正还是为负。左边一个减号、右边为 <Katex tex="1" /> 是单叶；右边为 <Katex tex="-1" /> 才是双叶。同一张方程两边同乘 <Katex tex="-1" /> 会同时翻转，别被外观迷惑。</li>
        <li><strong>提示二：以为双叶双曲面的截痕在任意高度都存在。</strong><Katex tex="|z|<c" /> 时没有实点，画图时要空出这一段。计算截痕半轴时 <Katex tex="z^2/c^2-1" /> 为负即为无截痕。</li>
        <li><strong>提示三：把抛物面的竖直截痕当成椭圆。</strong>椭圆抛物面的竖直截痕是抛物线，只有水平截痕才是椭圆。截痕法的每次截都要写清用的是哪个方向的平面。</li>
        <li><strong>提示四：把退化情形当成本类曲面。</strong>缺变量时是柱面、齐次时是锥面，这两类在分类表里另立，不属于椭球或双曲面。先看有没有变量缺失，再套标准形。</li>
      </ul>
    </div>
    <p>回收与预告：二次曲面是一次方程（平面）之外最简单的一类。曲4 把两张曲面放在一起，问它们交成什么——空间曲线正是两张曲面方程的联立，而参数方程给的是另一种刻画方式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuadrics } from '../../../boards/spacegeom/surface/quadrics.js';
import { SS_CHAPTERS } from './ssnav.js';
</script>
