<template>
  <ChPage :cur="2" no="换2" base="/projgeom/g" :chapters="PRG_CHAPTERS"
    title="爱尔兰根纲领"
    sub="1872 年，克莱因在爱尔兰根大学就职演讲里提出：几何学就是研究一个变换群下不变量的学问。换一个群，就换一门几何。"
    :toc="[{ id: 'g2-idea', t: '一门几何对应一个群' }, { id: 'g2-chain', t: '四级变换群' }, { id: 'g2-inv', t: '不变量清单' }, { id: 'g2-tip', t: '四条提示' }]">
    <div class="note good"><b>爱尔兰根纲领</b>（Erlanger Programm）：给定空间 <Katex tex="X" /> 与作用其上的变换群 <Katex tex="G" />，几何学的研究对象是 <Katex tex="X" /> 在 <Katex tex="G" /> 下的不变量与轨道。射影群对应射影几何，仿射群对应仿射几何，相似群对应相似几何，欧氏群对应欧氏几何。<Katex tex="\mathrm{PGL}_3\supset \mathrm{Aff}_2\supset \mathrm{Sim}_2\supset \mathrm{Euc}_2" />，群越大，能说的话越少。</div>

    <div class="board-wrap">
      <BoardMount :factory="createErlangen" />
      <div class="cap">图 换2 · <b>变换群的层级</b>：灰色是原正方形，蓝色是它在各级变换下的像，四个按钮逐级换群。看点：① 欧氏档保持形状与大小，只挪动、转动；② 相似档允许放大，角度与形状仍保留；③ 仿射档把正方形压成平行四边形，平行仍在；④ 射影档变成一般四边形，只剩共线与交比。</div>
    </div>

    <h3 class="sec" id="g2-idea">一门几何对应一个群</h3>
    <p>命题「三角形两腰相等」只在欧氏几何里说得通，因为它用到长度。命题「平行四边形对边平行」是仿射命题，因为它只用到平行。命题「三线共点」是射影命题，因为它在任何射影变换下都成立。</p>
    <p>克莱因的想法是把这种分层写成一个对应：先选定变换群，再问哪些性质在群下不变，这些性质就是该几何的定理。群固定了，图形之间的等价关系（能否互相变换）也随之固定。</p>
    <p>这个纲领把原本各自成体系的几何学科归到一个框架里。它不证明新定理，但回答了「一条定理属于哪门几何」这类分类问题，作用相当于给几何学编了一份目录。</p>

    <h3 class="sec" id="g2-chain">四级变换群</h3>
    <p>最外层是射影群，矩阵可逆、相差倍数视为同一个。往里加一条固定的无穷远线，得到仿射群：无穷远线必须映到自身，直线仍为直线，平行仍为平行。</p>
    <p>再加保角的限制，得到相似群：角度不变，长度按同一比例缩放。最内层是欧氏群，长度本身不变，只有平移、旋转与反射。四层是包含关系，每往里一层就多一批不变量。</p>
    <p>画板上同一个正方形在四档里依次变成旋转后的正方形、放大的正方形、平行四边形、一般四边形。形状的变形程度正好反映群的自由程度。</p>

    <h3 class="sec" id="g2-inv">不变量清单</h3>
    <p>射影群：共线性、交比、二次曲线的类型（非退化与退化）。仿射群：平行、面积比、重心、无穷远点。<b>相似群</b>：角度、长度之比。欧氏群：长度本身与角度本身。</p>
    <p>清单要从下往上读：列在下面的量一定也在上面的群里不变，反之不成立。长度之比是相似不变量，但不是射影不变量；共线性在四层里全都保持。</p>
    <p>沿用这份清单判断命题的归属：如果证明只用到射影变换，那它可以搬到任何圆锥曲线上；如果用到距离，就不能随意换群。做题时看清「用到了哪些量」，比记住定理的归类更实用。</p>

    <h3 class="sec" id="g2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：群包含关系是反的。</strong>射影群最大、结论最少；欧氏群最小、结论最多。<Katex tex="\mathrm{Euc}\subset\mathrm{Sim}\subset\mathrm{Aff}\subset\mathrm{PGL}" />。</li>
        <li><strong>提示二：不变量的定义依赖群。</strong>「面积」在仿射群里只是按固定倍数变，不是严格不变；不变量可以放宽成「相差一个已知因子」。</li>
        <li><strong>提示三：纲领是分类框架，不是定理本身。</strong>它不告诉你某条命题真假，只告诉你这条命题该在哪门几何里找证明。</li>
        <li><strong>提示四：无穷远线定了仿射层级。</strong>仿射群正是保持某条指定无穷远线不动的射影变换，记住这一条，四层关系就串起来了。</li>
      </ul>
    </div>
    <p>回收与预告：最外层的射影群往内收一层，就得到仿射群；仿射层的关键是那条被指定的无穷远线。它的位置一动，同一条曲线就换一种仿射类型。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createErlangen } from '../../../boards/projgeom/group/erlangen.js';
import { PRG_CHAPTERS } from './prgnav.js';
</script>
