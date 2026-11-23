<template>
  <ChPage :cur="2" title="交叉比与调和点列" sub="四个点的位置可以改变，它们的交叉比保持不变。"
    :toc="[{ id: 'c2-exp', t: '交叉比不变性' }, { id: 'c2-harm', t: '调和共轭的性质与证明' }, { id: 'c2-alg', t: '调和的代数形式' }]">
    <p>固定直线上的一个正方向。设 <Katex tex="A,B,C,D" /> 是四个互不相同的共线点，用带符号线段定义交叉比：</p>
    <Katex tex="(A,B;C,D)=\frac{\overline{CA}/\overline{CB}}{\overline{DA}/\overline{DB}}" display />
    <p>交换书写顺序通常会改变数值。比如一条数轴上的 <Katex tex="A=0,\ B=1,\ C=\tfrac13,\ D=2" /> 给出 <Katex tex="(A,B;C,D)=-\tfrac14" />，交换 <Katex tex="C,D" /> 会得到它的倒数 <Katex tex="-4" />。</p>
    <p>从一个离开两条直线的中心 <Katex tex="S" /> 投影，<Katex tex="A,B,C,D" /> 和像点 <Katex tex="A',B',C',D'" /> 的交叉比相等。这个结论也适用于无穷远点。用直线上的齐次坐标向量表示四点，记 <Katex tex="[U,V]=\det(U,V)" />，则</p>
    <Katex tex="(A,B;C,D)=\frac{[C,A][D,B]}{[C,B][D,A]}." display />
    <p>中心投影在这两条线的齐次坐标之间由一个可逆的 <Katex tex="2\times2" /> 矩阵表示。四个行列式各乘同一个因子，分子和分母里的因子恰好抵消。</p>

    <ConicFigure head="bottom" id="c2-exp" number="2" title="对照投影前后的交叉比" :factory="createBoard"
      :legend="[['guide', '两条基线'], ['ink', '投影中心 S', 'point'], ['gold', 'D 与 D′', 'point']]">
      拖动 <Katex tex="S" /> 或下方直线的把手，比较两条线的读数。点「保持调和」后，<Katex tex="D" /> 会跟随 <Katex tex="C" />。点「令 C 为中点」可直接看到 <Katex tex="D" /> 在无穷远，而它的像 <Katex tex="D'" /> 可以是有限点。
    </ConicFigure>

    <h3 class="sec" id="c2-harm">调和共轭的性质与证明</h3>
    <p>交叉比等于 −1 时，称四点构成<strong>调和点列</strong>。通常先固定基点 <Katex tex="A,B" />，再问 <Katex tex="C" /> 的调和共轭 <Katex tex="D" /> 在哪里。令 <Katex tex="A=0,\ B=1,\ C=t,\ D=s" />，把定义代入得到</p>
    <Katex tex="\begin{aligned}t(s-1)&amp;=-s(t-1),\\ D&amp;=[t:2t-1].\end{aligned}" display />
    <ol>
      <li><strong>共轭点唯一，配两次回到原点。</strong> 固定 <Katex tex="C" /> 后，上式给出唯一的 <Katex tex="D" />。交换 <Katex tex="C,D" /> 会使交叉比取倒数，而 −1 的倒数仍是 −1，所以 <Katex tex="C" /> 也就是 <Katex tex="D" /> 的共轭点。交换基点 <Katex tex="A,B" /> 同样保留这对共轭点。</li>
      <li><strong>两个有限共轭点一内一外。</strong> 调和条件要求两个有向分点比的绝对值相同、符号相反。点在线段 <Katex tex="AB" /> 内时，分点比为负。点在延长线上时，分点比为正。例如 <Katex tex="A=0,\ B=1,\ C=\tfrac13" /> 时，算得 <Katex tex="D=-1" />。</li>
      <li><strong>中点和方向点互为共轭。</strong> 若 <Katex tex="t=\tfrac12" />，则 <Katex tex="D=[1:0]" />，是这条直线的无穷远点。也可以把原点放到 <Katex tex="AB" /> 的中点 <Katex tex="M" />，令两端坐标为 <Katex tex="-a,a" />。把有限点 <Katex tex="C,D" /> 的有向坐标记作 <Katex tex="c,d" />，调和条件即 <Katex tex="(c+a)(d-a)=-(d+a)(c-a)" />，展开后只剩 <Katex tex="cd=a^2" />。这条乘积公式会在圆的反演里再次出现。</li>
    </ol>
    <p><strong>另一种坐标写法。</strong> 以 <Katex tex="A=[1:0],\ B=[0:1]" /> 为基点，对异于 <Katex tex="A,B" /> 的点 <Katex tex="C=[u:v]" />，可以用 <Katex tex="v/u" /> 比较它与两基点的位置。换成 <Katex tex="D=[u:-v]" /> 就把这个比值变号，所以它们的交叉比正好等于 −1。这种「只翻一个坐标的符号」的写法，会在 §4 的二次曲线证明中直接用上。</p>
    <p><strong>从四点换成四条共点直线。</strong> 过同一点的四条直线，如果与一条横截线交成调和点列，就称为<strong>调和线束</strong>。换一条横截线，新旧交点由线束中心作中心投影，交叉比仍为 −1。这样就能用调和证明中点。只要选一条平行于第四条直线的横截线，第四个交点就在无穷远，第三个交点必是前两个交点的中点。</p>

    <h3 class="sec" id="c2-alg">调和的代数形式</h3>
    <p>把共轭关系写成坐标之间的运算，可以得到一组便于计算的代数性质。以下取 <Katex tex="A=0,\ B=1" />，其余各点用实数表示，无穷远点记作 <Katex tex="\infty" />。</p>

    <p><strong>一、共轭点的显式公式。</strong> 设 <Katex tex="C=t" />，它的共轭点为 <Katex tex="D=s" />。把坐标代入交叉比的定义，令其等于 −1：</p>
    <Katex tex="(A,B;C,D)=\frac{(t-0)(s-1)}{(s-0)(t-1)}=-1\ \Longleftrightarrow\ 2st=s+t\ \Longleftrightarrow\ s=\frac{t}{2t-1}\quad\left(t\neq\tfrac12\right)." display />
    <p>当 <Katex tex="t=\tfrac12" /> 时，中间的方程变成 <Katex tex="s=s+\tfrac12" />，没有有限解，共轭点落到无穷远；这与齐次形式 <Katex tex="D=[t:2t-1]" /> 在 <Katex tex="t=\tfrac12" /> 处给出 <Katex tex="[1:0]" /> 一致。把 <Katex tex="t\mapsto\tfrac{t}{2t-1}" /> 记作 <Katex tex="\varphi" />，它把 <Katex tex="\tfrac12" /> 送到 <Katex tex="\infty" />，又把 <Katex tex="\infty" /> 送回 <Katex tex="\tfrac12" />。</p>

    <p><strong>二、对合性与不动点。</strong> 把 <Katex tex="\varphi" /> 连续作用两次：</p>
    <Katex tex="\varphi(\varphi(t))=\frac{\frac{t}{2t-1}}{\frac{2t}{2t-1}-1}=\frac{t}{2t-1}\cdot(2t-1)=t," display />
    <p>所以 <Katex tex="C" /> 的共轭是 <Katex tex="D" /> 时，<Katex tex="D" /> 的共轭也必是 <Katex tex="C" />。这种把自己送回原位的对应称为<strong>对合</strong>（involution）。再解不动点方程</p>
    <Katex tex="\varphi(t)=t\ \Longleftrightarrow\ 2t(t-1)=0," display />
    <p>得 <Katex tex="t=0" /> 或 <Katex tex="t=1" />，恰好是两个基点。按公式的极限理解，<Katex tex="A,B" /> 各自与自己配对；其余每一点都与一个不同的点配对。共轭点一内一外也可以从 <Katex tex="\varphi" /> 的符号读出：<Katex tex="0<t<\tfrac12" /> 时 <Katex tex="\varphi(t)<0" />；<Katex tex="\tfrac12<t<1" /> 时 <Katex tex="\varphi(t)>1" />，两种情形下 <Katex tex="C,D" /> 都分居线段 <Katex tex="AB" /> 的两侧。</p>

    <p><strong>三、有向长度的倒数和形式。</strong> 以 <Katex tex="A" /> 为原点，记 <Katex tex="b=\overline{AB},\ c=\overline{AC},\ d=\overline{AD}" />，交叉比化为</p>
    <Katex tex="(A,B;C,D)=\frac{c/(c-b)}{d/(d-b)}=\frac{c(d-b)}{d(c-b)}." display />
    <p>令它等于 −1，展开得 <Katex tex="2cd=b(c+d)" />，两边同除 <Katex tex="bcd" />，得到</p>
    <Katex tex="\frac{2}{AB}=\frac{1}{AC}+\frac{1}{AD}." display />
    <p>也就是说，<Katex tex="\tfrac{1}{AC},\ \tfrac{1}{AB},\ \tfrac{1}{AD}" /> 成等差数列，<Katex tex="AB" /> 是 <Katex tex="AC" /> 与 <Katex tex="AD" /> 的调和平均。用 <Katex tex="A=0,\ B=1,\ C=\tfrac13,\ D=-1" /> 核对：<Katex tex="3+(-1)=2=\tfrac{2}{1}" />。这里的长度都按有向计：点落在 <Katex tex="A" /> 的某一侧，长度取正；落在另一侧取负。符号的差别正是「一内一外」的代数来源。</p>

    <p><strong>四、两对点的对称。</strong> 用 <Katex tex="[U,V]=\det(U,V)" /> 的写法，交叉比为 <Katex tex="[C,A][D,B]/([C,B][D,A])" />。交换 <Katex tex="A,B" />，分子分母整体互换，取值变成倒数；交换 <Katex tex="C,D" /> 同样取倒数；两对同时交换则倒数两次，回到原值。由于 −1 的倒数仍是 −1，只要把 <Katex tex="A,B" /> 留在同一对、<Katex tex="C,D" /> 留在同一对，无论对内怎样调序、两对之间怎样摆，调和关系都成立：</p>
    <Katex tex="(A,B;C,D)=(C,D;A,B)=(B,A;D,C)=(D,C;B,A)." display />
    <p>反过来，只要有一对被拆散，交叉比就不再等于 −1。四点共有 24 种写法，其中保持 −1 的恰有 8 种（两对内各 2 种次序、两对之间 2 种先后），其余 16 种分成两类，分别取 2 与 <Katex tex="\tfrac12" />。可见调和点列的实质是四点分成两对的结构：把 <Katex tex="C,D" /> 当作基点、求 <Katex tex="A,B" /> 的共轭点，答案一样成立。下一节和 §4 会反复用到这一点。</p>

    <p><strong>五、分式线性变换保持调和性。</strong> 平移 <Katex tex="t\mapsto t+k" /> 与伸缩 <Katex tex="t\mapsto kt" /> 同时改变分子与分母里的有向线段，交叉比不变。只剩倒数这一步需要单独验证：</p>
    <Katex tex="\left(\frac1A,\frac1B;\frac1C,\frac1D\right)=\frac{(C-A)(D-B)}{(C-B)(D-A)}=(A,B;C,D)." display />
    <p>据此，任何形如 <Katex tex="t\mapsto(\alpha t+\beta)/(\gamma t+\delta)" />（<Katex tex="\alpha\delta-\beta\gamma\neq0" />）的变换都保持交叉比，因而把调和点列映成调和点列。中心投影把一条直线上的坐标换到另一条直线上，正是这样一种变换，本章开头的画板在数值上核对的就是这条代数事实。反过来，任取一个这样的变换作用在 <Katex tex="0,\ 1,\ t,\ \tfrac{t}{2t-1}" /> 上，结果仍是调和点列；实射影直线上每一个调和点列也都能这样得到。</p>

    <p>公式可以算出共轭点。下一节「完全四边形」将用四点连线和求交作出同一个点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/cross.js';
</script>
