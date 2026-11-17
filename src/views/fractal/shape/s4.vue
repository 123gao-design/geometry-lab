<template>
  <ChPage :cur="4" no="形4" base="/fractal/s" :chapters="FX_CHAPTERS"
    title="朱利亚集与曼德博集"
    sub="同一个迭代 z↦z²+c，固定参数看起点，得到朱利亚集；固定起点看参数，得到曼德博集。两张图互为切片，把复动力系统的稳定性画成了一张地图。"
    :toc="[{ id: 's4-iter', t: '迭代与逃逸' }, { id: 's4-mandel', t: '曼德博集' }, { id: 's4-julia', t: '朱利亚集的形状' }, { id: 's4-tip', t: '四条提示' }]">
    <div class="note good">对 <Katex tex="c\in\mathbb C" />，迭代 <Katex tex="z_{n+1}=z_n^2+c" />。称轨道有界的起点 <Katex tex="z_0" /> 的全体为<b>填充朱利亚集</b> <Katex tex="K_c" />，其边界为<b>朱利亚集</b> <Katex tex="J_c" />。称使 <Katex tex="z_0=0" /> 的轨道有界的参数 <Katex tex="c" /> 的全体为<b>曼德博集</b> <Katex tex="M" />。则 <Katex tex="c\in M" /> 当且仅当 <Katex tex="K_c" /> 连通。</div>

    <div class="board-wrap">
      <BoardMount :factory="createJulia" />
      <div class="cap">图 形4 · <b>朱利亚集与曼德博集</b>：蓝色到橙色表示逃逸所需步数，深色是有界轨道。看点：① 朱利亚模式下拖动 <Katex tex="c" />，图形从连成一片变成碎点；② 切到曼德博视角，红叉标出当前 <Katex tex="c" />；③ 红叉落在曼德博集内时连通性徽章显示「连通」，移到集外立刻变成「尘埃状」。</div>
    </div>

    <h3 class="sec" id="s4-iter">迭代与逃逸</h3>
    <p>取复数 <Katex tex="c" />，从 <Katex tex="z_0" /> 出发反复平方再加 <Katex tex="c" />。平方把模长抬成平方：一旦 <Katex tex="|z_n|" /> 超过 <Katex tex="\max(|c|,2)" />，后面只会越跑越远，轨道逃向无穷。所以「有界」与「逃逸」可以用有限步近似判定：算到某个上限还没跑出去，就当作有界。</p>
    <p>画板按逃逸步数上色。深色区域里的点，轨道被反复拉回；彩色区域里的点，迭代若干次后冲出半径 2 的圆。颜色深浅记录的是「撑了多少步」，不是距离。</p>
    <p>若把 <Katex tex="z_0" /> 换到另一处而 <Katex tex="c" /> 不动，有界区域与逃逸区域的分界线就是 <Katex tex="J_c" />。分界线上的点对初值极其敏感：稍微挪一点，轨道可能从有界变成逃逸。</p>

    <h3 class="sec" id="s4-mandel">曼德博集</h3>
    <p>固定起点 <Katex tex="z_0=0" />，让参数 <Katex tex="c" /> 跑遍复平面，把所有「不逃逸」的 <Katex tex="c" /> 收集起来，就是曼德博集。它关于实轴对称，整体装在一个半径 2 的圆盘里。</p>
    <p>它的主体是一张心形线，参数方程</p>
    <p style="text-align:center"><Katex tex="c=\frac{e^{i\theta}}{2}-\frac{e^{2i\theta}}{4},\qquad 0\le\theta&lt;2\pi." /></p>
    <p>心形线左侧接一个圆盘，圆心 <Katex tex="-1" />、半径 <Katex tex="\tfrac14" />，对应周期 2 的吸引轨道；再往左是一串越来越小的圆盘，周期依次为 4、8、16……心形线周围还长着无数小球与细须。</p>
    <p>曼德博集是参数空间的「稳定性地图」：<Katex tex="c" /> 落在集内，<Katex tex="K_c" /> 连通；落在集外，<Katex tex="K_c" /> 碎成康托尘。画板上的连通性徽章做的就是这件事——把 <Katex tex="z_0=0" /> 迭代一百多步，看它跑不跑。</p>

    <h3 class="sec" id="s4-julia">朱利亚集的形状</h3>
    <p><Katex tex="c=0" /> 时迭代就是平方，<Katex tex="|z|&lt;1" /> 收敛到 0，<Katex tex="|z|&gt;1" /> 逃逸，<Katex tex="J_0" /> 恰是单位圆——维数 1，光滑。</p>
    <p><Katex tex="c" /> 离开 0，圆开始起皱。心形线内部多数参数给出连通的朱利亚集，边界弯弯曲曲但仍是一条闭合曲线；跑到某些参数上，曲线长出无穷多花瓣，形成「兔子」一类的图案。</p>
    <p><Katex tex="c" /> 移到曼德博集外，朱利亚集不再是曲线，而是一团康托尘：完全不连通，点点都是极限点。参数越往外，尘埃越稀，铺开的范围越小。</p>
    <p>维数的范围很宽：<Katex tex="J_0" /> 是 1；集外的尘埃随参数改变疏密，维数随之变化；集内许多参数的朱利亚集维数介于 1 与 2 之间。曼德博集自身的边界维数是 2（Shishikura 1991），一条边界与整个平面同维。</p>

    <h3 class="sec" id="s4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：朱利亚集与填充朱利亚集不同。</strong><Katex tex="K_c" /> 包括有界区域内部，<Katex tex="J_c" /> 只是它的边界。画板上深色块的整体是 <Katex tex="K_c" />，边界才是 <Katex tex="J_c" />。</li>
        <li><strong>提示二：两张图的自变量不同。</strong>朱利亚图固定 <Katex tex="c" />、让起点 <Katex tex="z_0" /> 变；曼德博图固定 <Katex tex="z_0=0" />、让参数 <Katex tex="c" /> 变。把两张图的坐标混为一谈，是读图时最常见的错位。</li>
        <li><strong>提示三：有限步判定只是近似。</strong>迭代上限越高，判定越准，但总有极靠近边界的点需要更多步。画板取 40 步，边缘的细须会被粗略处理。</li>
        <li><strong>提示四：连通性由参数决定。</strong><Katex tex="c" /> 在 <Katex tex="M" /> 内则 <Katex tex="K_c" /> 连通，在集外则完全不连通。看朱利亚图之前，先看 <Katex tex="c" /> 落在曼德博集的哪里。</li>
      </ul>
    </div>
    <p>回收与预告：四个典型分形各有各的挖法，却都能由一组压缩映射或一条迭代规则生成。下一章把这套生成机制抽象成迭代函数系统，用随机点走出一条与规则完全一致的图形。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createJulia } from '../../../boards/fractal/shape/julia.js';
import { FX_CHAPTERS } from './fxnav.js';
</script>
