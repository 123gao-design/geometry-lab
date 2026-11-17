<template>
  <ChPage :cur="1" no="P1" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="参数方程：离心角与三曲线" sub="让点随参数跑起来。椭圆的 t 是辅助圆上的离心角（不是极角）；双曲线的 t 站在圆外 —— 割线长与切线长；抛物线的 t 干脆就是时间。三种曲线，三种参数身份。"
    :toc="[{ id: 'p1-lab', t: '辅助圆实验（图 P1）' }, { id: 'p1-e', t: '椭圆 · 离心角与双辅助圆' }, { id: 'p1-hb', t: '双曲线 · 割线与切线（图 P1b）' }, { id: 'p1-pb', t: '抛物线 · 时间参数（图 P1c）' }, { id: 'p1-f', t: '焦半径回收与速查表' }]">
    <div class="note good"><strong>参数方程</strong>：用第三个变量 t 把曲线上的点写成 <Katex tex="(x(t),\ y(t))" /> —— 每个时刻 t 给出一个点，点随 t 跑动就把曲线<strong>生成</strong>出来。它比普通方程多给出一样东西：<strong>点的到达顺序</strong>。这正是"轨迹问题"的本质。</div>

    <h3 class="sec" id="p1-lab">辅助圆实验</h3>
    <div class="board-wrap">
      <BoardMount :factory="createAuxCircle" />
      <div class="cap">图 P1 · <b>辅助圆与离心角</b>：拖动大圆上的 Q —— Q 竖直下落、小圆上的 R 水平推进，两条虚线交出的 P 恰好落在椭圆上。读数区并排显示离心角 t 与真正的极角 φ：<strong>它们几乎永远不相等</strong>。</div>
    </div>
    <p>为什么 t ≠ φ？因为 P 的横纵坐标被<strong>不同幅度</strong>压缩（a 与 b），角度的均匀刻度被打乱。真正均匀转动的是 Q（大圆上），P 只是它的"影子"。这也解释了一个高频易错题：椭圆上"离心角相差 <Katex tex="\tfrac{\pi}{2}" /> 的两点"不是"互相垂直的半径端点"。</p>

    <h3 class="sec" id="p1-e">椭圆：离心角与双辅助圆</h3>
    <p>消参验证：<Katex tex="\cos^2 t+\sin^2 t=1" /> 一行就把参数方程压回标准方程 ——</p>
    <Katex tex="\left.\begin{aligned}x&=a\cos t\\y&=b\sin t\end{aligned}\right\}\ \Longrightarrow\ \frac{x^2}{a^2}+\frac{y^2}{b^2}=1" display />
    <p>反过来读就是构造：作<strong>大辅助圆</strong> <Katex tex="x^2+y^2=a^2" /> 与<strong>小辅助圆</strong> <Katex tex="x^2+y^2=b^2" />。过大圆上的 Q(a cos t, a sin t) 作竖直线，过小圆上对应的 R(b cos t, b sin t) 作水平线，交点就是 P —— 图 P1 的机械全程在演这件事。这个双圆构造在"卡当椭圆"（P2 的杆子问题）里还会再登场。</p>
    <p>顺带一提，A1 的伸缩机把这一切串起来了：P 就是 Q 被 <Katex tex="T_{b/a}" /> 压缩后的像。<strong>参数 t 是压缩前的世界（圆）里保留下来的角度</strong> —— 所以它才叫离心角，而不叫什么"椭圆上的角"。</p>

    <h3 class="sec" id="p1-hb">双曲线：割线与切线</h3>
    <div class="board-wrap">
      <BoardMount :factory="createHypParam" />
      <div class="cap">图 P1b · <b>双曲线的参数方程</b>：竖直线过 <Katex tex="E=(a\sec t,\ 0)" />（x 轴上、永远在辅助圆外的"割线端"），水平线过 <Katex tex="G=(0,\ b\tan t)" />，交点 P 落在双曲线上。金色线段是从 E 向辅助圆所作的<strong>切线</strong> —— 切点恰好是辅助圆上离心角为 t 的点。t 逼近 <Katex tex="\pm 90^\circ" /> 时 P 沿渐近线趋向无穷：<strong>参数失效处正是渐近方向</strong>（大学里由 cosh/sinh 续写）。</div>
    </div>
    <p>把恒等式换成 <Katex tex="\sec^2t-\tan^2t=1" />，消参一行完成：</p>
    <Katex tex="x=\frac{a}{\cos t},\qquad y=b\tan t\quad(\cos t\ne 0)" display />
    <p>更妙的是它的<strong>构造身份</strong>。在辅助圆 <Katex tex="x^2+y^2=a^2" /> 外取一点 <Katex tex="E=(a\sec t,\ 0)" />：从原点连 E 是一条<strong>割线</strong>，长 <Katex tex="OE=a\sec t" />；从 E 向圆作<strong>切线</strong>，切点恰是 <Katex tex="T=(a\cos t,\ a\sin t)" /> —— 辅助圆上离心角为 t 的点，切线长 <Katex tex="|ET|=a\tan t" />（勾股：<Katex tex="OE^2-OT^2=a^2(\sec^2t-1)=a^2\tan^2 t" />）。于是<strong>secant（割线）与 tangent（切线）的名字就有了出处</strong>：双曲线的参数方程里，横坐标取割线长、纵坐标取切线长再乘 <Katex tex="\tfrac{b}{a}" /> ——</p>
    <p>与椭圆一对照，格局立刻清楚：椭圆的 cos、sin 都是<strong>圆内</strong>的线段（圆上点的射影），双曲线的 sec、tan 都是<strong>圆外</strong>的线段（圆外一点的割线与切线）。三角函数表里两族名称的几何来源，在这里同图呈现。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p>若让 t 一口气跑满全圆，cos t 过零时点会在两支之间跳跃，画出一条并不存在的弦 —— 双曲线的参数方程在渐近方向是<strong>断开</strong>的，必须逐支采样（t 各取 <Katex tex="(-\tfrac{\pi}{2},\ \tfrac{\pi}{2})" /> 一段）。大学里改用双曲函数 <Katex tex="(a\cosh u,\ b\sinh u)" /> 把两支无缝接起来，t 与 u 之间隔着一层"双曲角"（面积意义）—— 拓展内容，此处不展开。</p>
    </div>

    <h3 class="sec" id="p1-pb">抛物线：时间参数</h3>
    <div class="board-wrap">
      <BoardMount :factory="createParaParam" />
      <div class="cap">图 P1c · <b>抛物线的参数方程与落点</b>：取 <Katex tex="x=2pt^2,\ y=2pt" />。把竖直方向当"时钟"（<Katex tex="y=2pt" /> 匀速走过），水平落点 <Katex tex="x=2pt^2" /> 按时间的<strong>平方</strong>膨胀 —— 轴上金色刻度按 <strong>1:3:5:7</strong> 拉开，这是伽利略斜面实验的奇数定律。抛物线的参数 t 不是任何角度，<strong>它是时间本身</strong>。</div>
    </div>
    <p>它的物理来源：抛体运动里，水平方向匀速 <Katex tex="x=v_0\tau" />，竖直方向匀加速 <Katex tex="y=\tfrac12 g\tau^2" /> —— 消去时间 τ 就得抛物线。反过来说，<Katex tex="y^2=2px" /> 上以 t 为参数的写法 <Katex tex="x=2pt^2,\ y=2pt" /> 恰好把"时间"直接写进了坐标：y 匀速（时钟），x 按平方膨胀（匀加速位移）。</p>
    <p>轴上 1:3:5:7 的来历不过一个平方差：</p>
    <Katex tex="2p(i\Delta)^2-2p\big((i-1)\Delta\big)^2=2p\Delta^2\,(2i-1)" display />
    <p>等时间隔的落点间距是首项为 <Katex tex="2p\Delta^2" /> 的等差数列 —— 伽利略用斜面珠子验证的正是这一串奇数。阿波罗尼的抛物线与伽利略的抛物线在这里相遇：一端是圆锥截面，另一端是 <Katex tex="s=\tfrac12 at^2" />。</p>

    <h3 class="sec" id="p1-f">焦半径回收与速查表</h3>
    <p>把 <Katex tex="P=(a\cos t,\ b\sin t)" /> 代进 D1 的焦半径公式 <Katex tex="|PF_{1,2}|=a\pm ex_0" />（<Katex tex="x_0=a\cos t" />）：</p>
    <Katex tex="|PF_1|=a+c\cos t,\qquad |PF_2|=a-c\cos t" display />
    <p>图 P1 的读数在实时验证它 —— 参数方程不只是"另一种写法"，它让 D1 的焦半径变成了 t 的<strong>三角函数</strong>，于是弦长、焦点三角形（D5）都化成三角恒等式。全套速查：</p>
    <table>
      <tbody>
        <tr><th>曲线</th><th>参数方程</th><th>消参恒等式</th><th>参数的几何意义</th></tr>
        <tr><td>椭圆</td><td><Katex tex="(a\cos t,\ b\sin t)" /></td><td><Katex tex="\cos^2t+\sin^2t=1" /></td><td>大辅助圆上的旋转角（离心角），圆内线段 cos·sin</td></tr>
        <tr><td>双曲线</td><td><Katex tex="\big(a\sec t,\ b\tan t\big)" /></td><td><Katex tex="\sec^2t-\tan^2t=1" /></td><td>圆外一点 E 的割线长与切线长；失效处 = 渐近方向</td></tr>
        <tr><td>抛物线</td><td><Katex tex="(2pt^2,\ 2pt)" /></td><td><Katex tex="y^2=2px" /></td><td>抛体运动的时间（一个方向匀速、另一方向匀加速）</td></tr>
      </tbody>
    </table>
    <p>下一讲把"点的到达顺序"用足：让两条直线联动，用交轨法现场生成一条曲线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAuxCircle } from '../../../boards/conics/locus/auxcircle.js';
import { createBoard as createHypParam } from '../../../boards/conics/locus/hypparam.js';
import { createBoard as createParaParam } from '../../../boards/conics/locus/paraparam.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
