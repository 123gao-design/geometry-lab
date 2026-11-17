<template>
  <ChPage :cur="3" no="换3" base="/projgeom/g" :chapters="PRG_CHAPTERS"
    title="从射影到欧氏"
    sub="把无穷远线仅仅当成一条普通的直线，得到射影几何；一旦把它指定下来、不许动，就得到仿射几何。无穷远线的位置变了，同一条圆锥曲线的仿射类型也跟着变。"
    :toc="[{ id: 'g3-line', t: '无穷远线是选定的' }, { id: 'g3-move', t: '移动无穷远线' }, { id: 'g3-recover', t: '从射影回到欧氏' }, { id: 'g3-tip', t: '四条提示' }]">
    <div class="note good">射影平面里没有特殊直线。要得到仿射平面，需额外<b>指定</b>一条直线 <Katex tex="l_\infty" /> 作为无穷远线，并要求变换把它映到自身：<Katex tex="\mathrm{Aff}=\{g\in\mathrm{PGL}_3: g(l_\infty)=l_\infty\}" />。椭圆、抛物线、双曲线的差别正是由 <Katex tex="l_\infty" /> 与圆锥曲线的相对位置决定的，与曲线本身无关。</div>

    <div class="board-wrap">
      <BoardMount :factory="createChain" />
      <div class="cap">图 换3 · <b>无穷远线的位置与曲线类型</b>：青色是固定的射影圆锥曲线，红色直线是无穷远线，高度由滑块控制。看点：① 无穷远线在曲线外时没有交点，读作椭圆；② 移到相切，交点缩成一个，读作抛物线；③ 再往里，交于两点，读作双曲线——同一条曲线，换了无穷远线就换了身份。</div>
    </div>

    <h3 class="sec" id="g3-line">无穷远线是选定的</h3>
    <p>齐次坐标下，无穷远线是 <Katex tex="z=0" />。这个方程本身没什么特殊，射影变换可以把它送到任意一条直线。只有当我们额外规定「这条线不动」，齐次坐标才获得「有限部分 + 无穷远」的读法。</p>
    <p>换句话说，仿射几何 = 射影几何 + 一条被选定的直线。所有仿射概念都能用射影语言重写：平行是「在 <Katex tex="l_\infty" /> 上相交」，中点可以用无穷远点与交比定义，长度之比也是交比的变形。</p>
    <p>这解释了为什么射影几何能统一处理平行与相交：在射影平面里，它们本来就是同一件事，区别只在交点是否落在 <Katex tex="l_\infty" /> 上。</p>

    <h3 class="sec" id="g3-move">移动无穷远线</h3>
    <p>固定一条圆锥曲线，让 <Katex tex="l_\infty" /> 从曲线外平移到相切、再移进曲线内部。没有交点、一个重交点、两个交点，对应椭圆、抛物线、双曲线三种仿射类型。</p>
    <p>这个连续变化说明三者在射影意义下是同一族。射影分类只看矩阵的秩，仿射分类才看与 <Katex tex="l_\infty" /> 的交点，欧氏分类再看离心率——每往内一层，分类就更细。</p>
    <p>画板的滑块把这条思路变成一个动作：拖动红色直线，徽章里的类型跟着改口。中间那段「恰好相切」很窄，滑块步长 0.05，判据留了 0.03 的容差。</p>

    <h3 class="sec" id="g3-recover">从射影回到欧氏</h3>
    <p>再指定一对虚圆点 <Katex tex="I,J" />（<Katex tex="x^2+y^2=0" /> 与 <Katex tex="z=0" /> 的两个复交点），角度与垂直就有了定义：两条直线垂直，当且仅当它们与 <Katex tex="I,J" /> 的交点构成调和点列。相似群正是保持 <Katex tex="I,J" /> 的射影变换。</p>
    <p>欧氏群再多一层：保持绝对形（虚圆点对）与一条不动点，长度本身才定下来。这套「绝对形」语言把度量几何也纳入了射影框架，是克莱因纲领最完整的一层。</p>
    <p>至此四层变换群各有出处：射影什么都不选，仿射选一条实直线，相似选对虚圆点，欧氏再选一个定点。几何的分类表与「选定哪些特殊对象」一一对应。</p>

    <h3 class="sec" id="g3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：无穷远线不是天然存在的。</strong>它是射影平面里被「选中」的一条普通直线。画板把它画成红色是为了强调这一点，位置由我们指定。</li>
        <li><strong>提示二：椭圆的双曲线身份可以互换。</strong>同一条射影曲线，换一条无穷远线就是另一种仿射类型。说「这是椭圆」时必须先固定 <Katex tex="l_\infty" />。</li>
        <li><strong>提示三：相切是临界情形。</strong>交点从两个变成一个再变成零，抛物线恰好落在中间。判据用交点个数，不要用肉眼看到的「开口」。</li>
        <li><strong>提示四：虚圆点对是度量的来源。</strong>角度、垂直、圆都靠 <Katex tex="I,J" /> 定义。只给一条实无穷远线，得到的是仿射几何，还不足以谈长度。</li>
      </ul>
    </div>
    <p>回收与预告：射影几何到这里走完一圈——从齐次坐标出发，经交比与对偶，到二次曲线的配极与帕斯卡定理，最后用变换群把射影、仿射、欧氏排成一列。每一层几何研究的，都是自己那个群的不变量。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChain } from '../../../boards/projgeom/group/chain.js';
import { PRG_CHAPTERS } from './prgnav.js';
</script>
