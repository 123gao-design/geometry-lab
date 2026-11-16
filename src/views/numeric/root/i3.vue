<template>
  <ChPage :cur="3" no="迭3" base="/numeric/i" :chapters="NI_CHAPTERS"
    title="不动点迭代与压缩映射"
    sub="把方程 x=φ(x) 当作递推 xₙ₊₁=φ(xₙ) 来用。曲线与直线 y=x 的交点是不动点，收敛还是发散，只看 φ 在这条曲线上的陡缓。"
    :toc="[{ id: 'i3-fix', t: '不动点与等价变形' }, { id: 'i3-cob', t: '蛛网图' }, { id: 'i3-cond', t: '压缩与误差估计' }, { id: 'i3-pit', t: '变形方式决定成败' }]">

    <div class="note good" id="i3-fix">把 <Katex tex="f(x)=0" /> 改写成 <Katex tex="x=\varphi(x)" />，就得到一个递推 <Katex tex="x_{n+1}=\varphi(x_n)" />。满足 <Katex tex="x^*=\varphi(x^*)" /> 的点叫<b>不动点</b>，它就是原方程的根。同一个方程可以改成许多种 <Katex tex="\varphi" />，收敛性各不相同。</div>

    <div class="board-wrap">
      <BoardMount :factory="createFixPointLab" />
      <div class="cap">图 迭3 · <b>不动点迭代机</b>：蓝色直线是 y=φ(x)，灰色虚线是 y=x，金色折线是从 <Katex tex="x_0" /> 出发的蛛网，红点在不动点。看点：拖动斜率 <Katex tex="a" />，蛛网从贴着不动点收拢（<Katex tex="|a|&lt;1" />）变成向外张开（<Katex tex="|a|&gt;1" />）；<Katex tex="a=-1" /> 时折线绕着不动点打转，既不进也不出。</div>
    </div>

    <h3 class="sec" id="i3-fix">不动点与等价变形</h3>
    <p>解方程与找不动点是一回事，两者的区别只在写法。求 <Katex tex="x^2-2=0" /> 的正根，可以写成 <Katex tex="x=\dfrac{x}{2}+\dfrac1x" />，也可以写成 <Katex tex="x=\dfrac2x" />，还可以写成 <Katex tex="x=\sqrt2" />——最后一种当然没用，它直接把答案写在右边，迭代不动。</p>
    <p>有用的变形要让右边的式子「靠」左边：<Katex tex="\varphi" /> 在这附近每给一个 <Katex tex="x" />，都要算出一个离不动点更近的值。图 迭3 用的是一族最简单的 <Katex tex="\varphi(x)=ax+(1-a)\cdot2" />，不动点固定在 2，只把斜率 <Katex tex="a" /> 当作旋钮，好观察斜率本身的作用。</p>
    <p>不动点可能不止一个，也可能没有。<Katex tex="\varphi(x)=x^2+1" /> 就没有不动点，把任何数代进去只会越跑越大。</p>

    <h3 class="sec" id="i3-cob">蛛网图</h3>
    <p>蛛网图把递推画成一段折线：从 <Katex tex="(x_n,x_n)" /> 竖直走到曲线上的 <Katex tex="(x_n,\varphi(x_n))" />，再水平走到直线 <Katex tex="y=x" /> 上的 <Katex tex="(\varphi(x_n),\varphi(x_n))" />，如此反复。竖直段体现 <Katex tex="\varphi" /> 的作用，水平段只是把纵坐标挪回横坐标。</p>
    <p>折线朝不动点收拢还是向外散开，取决于曲线在不动点附近比直线 <Katex tex="y=x" /> 陡还是缓。<Katex tex="|a|&lt;1" /> 时曲线比直线缓，每一步都更靠近交点；<Katex tex="|a|&gt;1" /> 时更陡，每一步都更远。</p>
    <p>斜率为负时折线在不动点两侧交替走，形成之字形。它仍然是往中间收的，只要 <Katex tex="|a|&lt;1" /> 就成立，摆动收敛与单调收敛的区别只在于符号。</p>

    <h3 class="sec" id="i3-cond">压缩与误差估计</h3>
    <p>若在含不动点的区间上恒有 <Katex tex="|\varphi'(x)|\le L&lt;1" />，则称 <Katex tex="\varphi" /> 是一个<b>压缩映射</b>。它保证迭代必然收敛到唯一的那个不动点，与初值无关。</p>
    <p>由于 <Katex tex="x_{n+1}-x^*=\varphi(x_n)-\varphi(x^*)=\varphi'(\xi)(x_n-x^*)" />，每走一步，到不动点的距离至少缩短到原来的 <Katex tex="L" /> 倍：<Katex tex="|x_n-x^*|\le L^{\,n}|x_0-x^*|" />。第 <Katex tex="n" /> 步之后，误差被压在 <Katex tex="L^n" /> 的尺度以内。</p>
    <p>不知道 <Katex tex="x^*" /> 时，用相邻两步的差来估计：<Katex tex="|x_n-x^*|\le\dfrac{L}{1-L}|x_n-x_{n-1}|" />。这条估计是程序判断「可以停了」的依据，<Katex tex="L" /> 接近 1 时右端会很大，说明收敛慢、步子要迈得更多。</p>

    <h3 class="sec" id="i3-pit">变形方式决定成败</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：同一个方程换一种变形就发散。</strong>求 <Katex tex="x^2-2=0" />，用 <Katex tex="x=2/x" /> 会变成两点循环，用 <Katex tex="x=\dfrac{x}{2}+\dfrac1x" /> 才收敛到 <Katex tex="\sqrt2" />。变形后先算 <Katex tex="\varphi'" />，再决定要不要用。</li>
        <li><strong>提示二：只在不动点附近才看斜率。</strong>压缩条件要在整个区间上成立，仅在一点满足不够，初值稍远就可能跑掉。</li>
        <li><strong>提示三：<Katex tex="L" /> 越接近 1 越慢。</strong>误差按 <Katex tex="L^n" /> 缩小，<Katex tex="L=0.99" /> 时要几百步才改善两位，实际计算会卡在最大步数上。</li>
        <li><strong>提示四：收敛不代表算出的是根。</strong>如果 <Katex tex="\varphi" /> 与 <Katex tex="f" /> 的变形过程中在同解之外引入了别的解（例如两边平方），迭代可能收敛到增根。变形要保证等价。</li>
      </ul>
    </div>
    <p>回收与预告：牛顿法正是把 <Katex tex="\varphi" /> 选成 <Katex tex="x-\dfrac{f(x)}{f'(x)}" />，在根处斜率恰好为零，所以收敛最快。误差的界告诉算法何时停，而误差本身从哪来、怎样积累，已经在误1 与误2 里说过。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFixPointLab } from '../../../boards/numeric/root/fixpointlab.js';
import { NI_CHAPTERS } from './inav.js';
</script>
