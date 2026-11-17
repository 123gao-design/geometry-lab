<template>
  <ChPage :cur="3" title="完全四点形：成批生成调和点列的射影方法" sub="只用“连线与求交”量产交叉比 −1 —— 另附角平分线、Apollonius 圆两种度量形式。"
    :toc="[{ id: 'c3-quad', t: '机器一 · 完全四点形（图 3）' }, { id: 'c3-ab', t: '机器二 · 内外角平分线（图 3b）' }, { id: 'c3-ap', t: '机器三 · Apollonius 圆（图 3c）' }]">
    <p>调和点列里藏着一个 −1，看起来是度量性质的产物 —— 但其实<strong>它根本不需要长度</strong>。制造它的第一台机器叫<strong>完全四点形</strong> <span class="term">(complete quadrangle)</span>：</p>
    <div class="note">取四个点 A, B, C, D（无三点共线），两两连出全部六条边。三对<strong>对边</strong> —— AB 与 CD、AC 与 BD、AD 与 BC —— 各自相交，得到三个<strong>对角点</strong>：<Katex tex="P_1=AB\cap CD,\ P_2=AC\cap BD,\ P_3=AD\cap BC" />。它们构成的三角形称为<strong>对角三角形</strong>。</div>
    <p>完全四点形有一条惊人的调和性质。以边 AB 为例：让另外两个对角点的连线 <Katex tex="P_2P_3" /> 与 AB 相遇，交点记作 <Katex tex="S_1" />。那么 <Katex tex="A,\ B,\ P_1,\ S_1" /> 恰好组成<strong>调和点列</strong>。整件事只用了“连线”和“求交”两个动作 —— 不需要尺子，不需要量角器，<strong>纯射影</strong>。也就是说：调和这件事本身属于射影几何，而不是搭在度量之上的巧合。</p>

    <div class="board-wrap" id="c3-quad">
      <BoardMount :factory="createBoard" />
      <div class="cap">图 3 · <b>完全四点形与调和点列</b>：拖动四个白点 A, B, C, D —— 画布视野自动缩放，保证三个橙色对角点 <Katex tex="P_1" />、<Katex tex="P_2" />、<Katex tex="P_3" /> 与对角三角形始终完整可见（出界的点在边缘挂出方向徽章）。用按钮选择一条边（如 AB），图中实时标出调和点列 <Katex tex="A,\ B,\ P_1,\ S_1" /> 并显示交叉比 —— 无论顶点拖到哪里，数值恒为 <Katex tex="-1" />。</div>
    </div>
    <p>试试把某个顶点拖向远方：视野会自动拉远、一路跟踪移向远方的 P₁；与此同时 <Katex tex="S_1" /> 移向 AB 的中点 —— 当 <Katex tex="P_1" /> 趋于无穷远时，<Katex tex="S_1" /> 恰好落在 AB 的<strong>中点</strong>上。这一过程把 §2 的“中点 ⟷ 无穷远点”公式直接演示出来。</p>

    <h3 class="sec" id="c3-ab">机器二：三角形的内外角平分线</h3>
    <p>完全四点形是第一台机器 —— 纯射影，只动用连线与求交。有趣的是，两件最朴素的<strong>度量</strong>工具同样能量产调和点列，三台机器各造各的、产品却一模一样 —— 这本身就说明：调和是点列的内在属性，不是哪一门几何的专利。</p>
    <p>在三角形 ABC 中，顶点 A 的<strong>内角平分线</strong>交对边 BC 于 D；<strong>外角平分线</strong>（与内角平分线垂直）交直线 BC 于 E。角平分线定理给出内分比 <Katex tex="\dfrac{BD}{DC}=\dfrac{AB}{AC}" />，外角平分线定理给出外分比 <Katex tex="\dfrac{BE}{EC}=\dfrac{AB}{AC}" />（E 在线段之外，带符号比值取负）。一个内分、一个外分，绝对值相同、符号相反 —— 代入交叉比定义立得 <Katex tex="(B,\,C;\,D,\,E)=-1" />：D 与 E 调和分割 B、C。</p>
    <div class="board-wrap">
      <BoardMount :factory="createAngleBisect" />
      <div class="cap">图 3b · <b>内外角平分线实验</b>：拖动 A、B、C 三个顶点 —— 绿色内角平分线交 BC 于 D，黄色外角平分线交直线 BC 于 E；数值盒实时验证 (B,C;D,E) = −1，且内、外分比都等于 AB : AC。∠A 接近 0° 或 180° 时构造退化，把 A 拖离直线 BC 即可恢复。</div>
    </div>

    <h3 class="sec" id="c3-ap">机器三：Apollonius 圆（阿波罗尼奥斯圆）</h3>
    <p>到两个定点 B、C 的距离之比恒等于定值 k（k &gt; 0，k ≠ 1）的点 P，轨迹是一个圆 —— <strong>Apollonius 圆</strong>。它与直线 BC 的两个交点颇有身份：内分点 D（<Katex tex="BD:DC=k" />）与外分点 E（<Katex tex="BE:EC=k" />），而且这对点恰好是圆的<strong>直径两端</strong>。内分、外分同一个比值 —— 又是调和的结构：<Katex tex="(B,\,C;\,D,\,E)=-1" />。反过来也对：调和分割 B、C 的任何一对点，都充当着某个 Apollonius 圆的直径。</p>
    <p><strong>k = 1</strong> 是优雅的极限：比值圆的半径趋于无穷，圆拉直成线段的<strong>垂直平分线</strong>，外分点 E 退向无穷远 —— <Katex tex="(B,\,C;\,\text{中点},\,P_\infty)=-1" />，§2 的中点公式在此第三次登场。</p>
    <div class="board-wrap">
      <BoardMount :factory="createApollonius" />
      <div class="cap">图 3c · <b>Apollonius 圆实验</b>：滑块调节比值 k（或点「随机换 k」），青色比值圆随之变形，金色直径端点 D、E 恰好调和分割 B、C —— 交叉比恒为 −1。P 可沿圆周拖动，|PB|:|PC| 读数纹丝不动地等于 k。把 k 推向 1 —— 圆拉直成垂直平分线，E 退向无穷远，正是中点的调和公式。</div>
    </div>

    <p>完全四点形这台机器马上就有大用。把 A, B, C, D 四个顶点<strong>放到圆锥曲线上</strong>，对角三角形 <Katex tex="P_1P_2P_3" /> 会获得一个新身份：每个对角点关于这条曲线的<strong>极线，恰好是另外两个对角点的连线</strong>（自配极三角形，§4 立即揭晓）。换句话说，§4 中极线的全部构造 —— 你将看到 —— 无非是这台调和机器在圆锥曲线上的直接运转。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/quad.js';
import { createBoard as createAngleBisect } from '../../../boards/conics/projective/anglebisect.js';
import { createBoard as createApollonius } from '../../../boards/conics/projective/apollonius.js';
</script>
