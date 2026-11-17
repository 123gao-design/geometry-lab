<template>
  <ChPage :cur="3" no="曲3" base="/projgeom/c" :chapters="PRC_CHAPTERS"
    title="帕斯卡定理与布里安雄定理"
    sub="圆锥曲线上的六个点构成内接六边形，三组对边的交点必定共线。把这句话对偶过去，得到外切六边形的三条对角线共点。一条定理给出两条。"
    :toc="[{ id: 'c3-pascal', t: '帕斯卡定理' }, { id: 'c3-proof', t: '为什么对边交点共线' }, { id: 'c3-brianchon', t: '布里安雄与对偶' }, { id: 'c3-tip', t: '四条提示' }]">
    <div class="note good"><b>帕斯卡定理</b>：圆锥曲线上的六点 <Katex tex="P_1,\dots,P_6" />（任意顺序），三组对边 <Katex tex="P_1P_2" /> 与 <Katex tex="P_4P_5" />、<Katex tex="P_2P_3" /> 与 <Katex tex="P_5P_6" />、<Katex tex="P_3P_4" /> 与 <Katex tex="P_6P_1" /> 的三个交点共线，这条线叫<b>帕斯卡线</b>。<b>布里安雄定理</b>：外切六边形的三条主对角线共点。两者互为对偶，一条成立，另一条自动成立。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPascal" />
      <div class="cap">图 曲3 · <b>帕斯卡定理与布里安雄定理</b>：拖动六个角滑块挪动顶点，右上角按钮在对偶两版之间切换。看点：① 六点在曲线上任意滑动，黄色帕斯卡线始终穿过三个橙色交点；② 切到布里安雄，切线围成外切六边形，三条橙色主线交于一个金点；③ 换个顺序摆点，线换位置但共线性不变。</div>
    </div>

    <h3 class="sec" id="c3-pascal">帕斯卡定理</h3>
    <p>取椭圆上六个点，按任意顺序连成一条六边形的折线 <Katex tex="P_1P_2P_3P_4P_5P_6" />。把三条交替边延长：第一对是 <Katex tex="P_1P_2" /> 与 <Katex tex="P_4P_5" />，第二对是 <Katex tex="P_2P_3" /> 与 <Katex tex="P_5P_6" />，第三对是 <Katex tex="P_3P_4" /> 与 <Katex tex="P_6P_1" />。每对交于一点，三点共线。</p>
    <p>六点的位置与顺序都任意：点可以重合（退化成切线）、可以排成自交的星形，结论都成立。把相邻两点并为一点，弦变成切线，就得到「五边形」与「四边形」版本的帕斯卡定理，仍是一条直线。</p>
    <p>这条线依赖圆锥曲线。六个一般位置的点不会被任意曲线接纳，正是「都在同一条二次曲线上」这一约束把它们绑在了一条直线上。</p>

    <h3 class="sec" id="c3-proof">为什么对边交点共线</h3>
    <p>把圆锥曲线用射影变换搬到抛物线或圆上，共线性不变，所以只需对圆证。取圆上六点，记 <Katex tex="X=P_1P_2\cap P_4P_5" />、<Katex tex="Y=P_2P_3\cap P_5P_6" />、<Katex tex="Z=P_3P_4\cap P_6P_1" />。</p>
    <p>对三角形 <Katex tex="XYZ" /> 用梅涅劳斯定理，只需证三边的比乘积等于 <Katex tex="-1" />。每个比都可以用正弦定理改写成弦张角之比：</p>
    <p style="text-align:center"><Katex display tex="\prod_{\text{三边}}\frac{\sin\angle P_iP_j?}{\sin\angle P_jP_k?}=-1." /></p>
    <p>右边的正弦因子一一配对，靠的是圆周角定理：同弧所对的圆周角相等，于是每个正弦在分子分母里各出现一次，约得只剩符号。乘积为 <Katex tex="-1" />，三点由梅涅劳斯定理的逆定理共线。</p>
    <p>另一条路用交比：六点在圆锥曲线上诱导一个 <Katex tex="\mathrm{PGL}_2" /> 作用，把其中三点固定到标准位置后，剩下三点满足一个交比恒等式，恒等式逐项展开正是三点共线。两种证法都不短，画板把结论摆出来，证明可以只记住「用梅涅劳斯与圆周角」这条主线。</p>

    <h3 class="sec" id="c3-brianchon">布里安雄与对偶</h3>
    <p>把帕斯卡定理里的「点」换成「线」、「连线」换成「交点」、「共线」换成「共点」：六条切线围成外切六边形，三条主对角线（连接两组对顶点的线）共点。这就是<b>布里安雄定理</b>，不需要另证。</p>
    <p>画板的切换按钮把同一组角度读成两种对象：模式一以六个角度为点，模式二以六点为切点作切线。两次读数共用一套参数，两幅图严格对偶。</p>
    <p>两个定理合起来说明圆锥曲线上的配置有很强的刚性：六个位置就锁定一条直线或一个点，没有多余的自由度。后世的射影几何把这类「配置定理」系统整理成一套计数规则，帕斯卡与布里安雄是最早的两个样本。</p>

    <h3 class="sec" id="c3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：三点是「对边」的交点。</strong>分组是 <Katex tex="12" /> 与 <Katex tex="45" />、<Katex tex="23" /> 与 <Katex tex="56" />、<Katex tex="34" /> 与 <Katex tex="61" />。写成相邻两组（如 <Katex tex="12" /> 与 <Katex tex="23" />）会得到顶点本身，结论没有意义。</li>
        <li><strong>提示二：顺序可以任意换。</strong>六点的编号只决定哪三条是对边。换一个排列，帕斯卡线跟着换位置，但三点仍然共线。</li>
        <li><strong>提示三：点的重合是退化情形。</strong>相邻两点重合时那条边变成切线，定理仍然成立。不要因为图上出现切线就以为条件变了。</li>
        <li><strong>提示四：对偶不是把图翻过来。</strong>布里安雄说的对象是六条切线及其交点，与帕斯卡的六点六弦是两套对象。图上并排只是便于对照，两者本身各自成立。</li>
      </ul>
    </div>
    <p>回收与预告：到这里，射影平面、二次曲线两大部分已经连成一片。剩下的问题是：这些结论在多大的变换群里成立？换一个群，哪些结论保留、哪些消失？下一专题回到「几何 = 变换群的不变量」这一条主线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPascal } from '../../../boards/projgeom/conic/pascal.js';
import { PRC_CHAPTERS } from './prcnav.js';
</script>
