<template>
  <ChPage :cur="2" no="复2" base="/complexvar/c" :chapters="CV_CHAPTERS"
    title="复变函数与映射"
    sub="实函数的图象画在平面上，复变函数却把一个复平面搬到另一个复平面，要画就得画两张。左边铺一张网格，右边看它被搬过去变了什么形状，这是理解复变函数最省力的办法。"
    :toc="[{ id: 'c2-map', t: '把函数看成搬家' }, { id: 'c2-elem', t: '三种基本映射' }, { id: 'c2-image', t: '曲线映成曲线' }, { id: 'c2-inverse', t: '单叶与反函数' }, { id: 'c2-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="D" /> 是复平面上的一个点集。若对 <Katex tex="D" /> 中每个 <Katex tex="z" /> 都按某种规则有一个确定的 <Katex tex="w" /> 与之对应，就说在 <Katex tex="D" /> 上定义了一个<b>复变函数</b>，记作 <Katex tex="w=f(z)" />。<Katex tex="z" /> 所在的平面叫 <Katex tex="z" /> 平面，<Katex tex="w" /> 所在的平面叫 <Katex tex="w" /> 平面。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMapW" />
      <div class="cap">图 复2 · <b>复变函数与映射机</b>：左图 <Katex tex="z" /> 平面上铺着方格网，右图是同一张网在 <Katex tex="w=f(z)" /> 下的像，竖线族蓝、横线族绿。看点：① <Katex tex="w=iz+1" /> 把方格整体转 <Katex tex="90^\circ" /> 再平移，格子还是方的；② <Katex tex="w=z^2" /> 把直线族弯成抛物线，第一象限被折进上半平面；③ <Katex tex="w=1/z" /> 把直线族卷成过原点的圆族，离原点越近的格子翻得越大。拖动左图的点，右图的像同步走。</div>
    </div>

    <h3 class="sec" id="c2-map">把函数看成搬家</h3>
    <p>实函数的图象是一条曲线，看横坐标就能读出纵坐标。复变函数做不到这一步：<Katex tex="z" /> 有两个实参数，<Katex tex="w" /> 也有两个，四个数要挤进一幅平面图是挤不下的。通常的办法是画两张平面，左边标出 <Katex tex="z" />，右边标出它搬过去的位置 <Katex tex="w=f(z)" />。</p>
    <p>既然是搬家，就值得关心搬法：哪些形状被保住了，哪些被扭了。画板上的方格网正是为了看这件事——网格的每个交点都对应过去，竖线与横线的像各自连成一条曲线。网格足够密时，曲线的走向就交代了映射在每一点附近的样子。</p>
    <p>写起来最省事的是把两侧都写成指数式。设 <Katex tex="z=re^{i\theta}" />，若 <Katex tex="w=f(z)" />，则 <Katex tex="w=\rho e^{i\varphi}" />，其中 <Katex tex="\rho" />、<Katex tex="\varphi" /> 都是 <Katex tex="r" /> 与 <Katex tex="\theta" /> 的函数。两个实函数 <Katex tex="\rho(r,\theta)" /> 与 <Katex tex="\varphi(r,\theta)" /> 合起来，就是一个复变函数。</p>

    <h3 class="sec" id="c2-elem">三种基本映射</h3>
    <p><b>线性映射</b> <Katex tex="w=az+b" />（<Katex tex="a\ne0" />）。写成 <Katex tex="a=|a|e^{i\alpha}" /> 就看清了：先把 <Katex tex="z" /> 转 <Katex tex="\alpha" />、长度乘 <Katex tex="|a|" />，再平移到 <Katex tex="b" />。三个动作叠在一起，形状、夹角都不变，方格搬过去还是方格。画板第一个预设正是 <Katex tex="w=iz+1" />，<Katex tex="a=i" /> 给出 <Katex tex="90^\circ" /> 的旋转。</p>
    <p><b>平方映射</b> <Katex tex="w=z^2" />。指数式一代就明白：<Katex tex="z=re^{i\theta}" /> 对应 <Katex tex="w=r^2e^{2i\theta}" />，模平方、辐角加倍。辐角从 <Katex tex="0" /> 走到 <Katex tex="\pi" />，像就从正实轴走到负实轴，正好扫过整个上半平面；所以第一、二象限都被折进上半平面，两个半平面叠在一起。画板上 <Katex tex="y=1" /> 这条横线的像是一条开口向上的抛物线，竖直方向因此被「掰弯」了。</p>
    <p><b>倒数映射</b> <Katex tex="w=1/z" />。同样一代：<Katex tex="z=re^{i\theta}" /> 对应 <Katex tex="w=\dfrac1re^{-i\theta}" />。模取倒数、辐角取相反数，等于先关于单位圆做反演（离原点远变近、近变远），再关于实轴翻一次。它把不过原点的圆映成圆，把过原点的圆映成直线，两类结果只差一个是否经过原点。</p>
    <p>这三种映射是构件：一般的分式线性变换 <Katex tex="w=\dfrac{az+b}{cz+d}" /> 可以拆成若干个它们复合；<Katex tex="z^2" /> 与 <Katex tex="1/z" /> 又拼得出儒可夫斯基变换 <Katex tex="w=\dfrac12\left(z+\dfrac1z\right)" />，翼型绕流正是用它算的。</p>

    <h3 class="sec" id="c2-image">曲线映成曲线</h3>
    <p>映射把点搬到点，也把曲线搬到曲线：取曲线上的一串点，逐点算出 <Katex tex="w" />，连起来就是像曲线。画板上每条蓝色曲线都是一条竖线的像，每条绿色曲线都是一条横线的像，颜色配对，一眼能对上。</p>
    <p>常考的是三类曲线的像：竖线 <Katex tex="x=c" />、横线 <Katex tex="y=c" />、圆 <Katex tex="|z|=r" />。在 <Katex tex="w=z^2" /> 下，圆 <Katex tex="|z|=r" /> 映成圆 <Katex tex="|w|=r^2" />；竖线与横线分别映成两条抛物线，它们以原点为公共顶点、开口方向相反，交叉处正是原像的交点。在 <Katex tex="w=1/z" /> 下，圆 <Katex tex="|z|=r" /> 仍映成圆 <Katex tex="|w|=1/r" />，而 <Katex tex="x=c" /> 映成圆心在实轴上、过原点的圆。</p>
    <p>判断一个区域映到哪里，最稳妥的做法是挑它的边界。边界映过去了，内部映到哪一侧再看一个内点的像即可。画板第三个预设里，单位圆内的点被翻到单位圆外，方位再关于实轴镜像一次——「内部变外部」正是倒数映射最容易弄错的地方。</p>

    <h3 class="sec" id="c2-inverse">单叶与反函数</h3>
    <p>映射若把不同的点搬到不同的点，就说它在 <Katex tex="D" /> 上是<b>单叶</b>的。单叶映射才有反函数：由 <Katex tex="w=f(z)" /> 反解出 <Katex tex="z=f^{-1}(w)" />，把像搬回原处。</p>
    <p><Katex tex="w=z^2" /> 在整个平面上不是单叶的：<Katex tex="z" /> 与 <Katex tex="-z" /> 落在同一点，画板上实轴两侧的网格重叠在一起就是证据。只留上半平面，它就是单叶的，反函数是开方取上半平面那一支；只留下半平面，得到的是另一支。两支合起来才覆盖整个平面，这正是多值函数的来历。</p>
    <p><Katex tex="w=1/z" /> 在去掉原点的平面上是单叶的，反函数就是它自己：再取一次倒数又回到 <Katex tex="z" />。画板上把点拖到原点附近，像会飞到很远的地方；反过来把点拖到远处，像又挤回原点附近。原点这个位置没有像，它是映射的<b>奇点</b>。</p>

    <h3 class="sec" id="c2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：复变函数不能画成一条曲线。</strong>要画就画两张平面，或者把平面上的网格、圆、直线搬过去看形状。把 <Katex tex="u" />、<Katex tex="v" /> 各画一张曲面是一种办法，但两张曲面之间的对应关系看不出来。</li>
        <li><strong>提示二：<Katex tex="z^2" /> 不单叶，反解时要指定分支。</strong>笼统写 <Katex tex="z=\sqrt w" /> 会丢掉一半点。先划出单叶区域（例如上半平面），再在该区域内取反函数。</li>
        <li><strong>提示三：<Katex tex="1/z" /> 把内翻成外。</strong>单位圆内映成单位圆外、过原点的圆映成直线，这两条结论都来自「模取倒数」这一个动作，别把方位也照原样搬过去。</li>
        <li><strong>提示四：复合映射从右往左读。</strong><Katex tex="g(f(z))" /> 是先把 <Katex tex="z" /> 搬到 <Katex tex="f" /> 的像，再从那一点继续搬。两个映射都可逆时，复合的逆是先后交换：<Katex tex="(g\circ f)^{-1}=f^{-1}\circ g^{-1}" />。</li>
      </ul>
    </div>
    <p>回收与预告：三张基本映射给的只是形状上的印象，还没来得及计算。要把它们写成一个能随手取值的式子，还得先备好几件初等函数——指数函数把横条卷成角，对数函数再把它展开。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMapW } from '../../../boards/complexvar/cplx/mapw.js';
import { CV_CHAPTERS } from './cvnav.js';
</script>
