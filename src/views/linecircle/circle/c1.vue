<template>
  <ChPage :cur="1" no="圆1" base="/linecircle/c" :chapters="CN_CHAPTERS"
    title="圆的标准方程与一般方程"
    sub="圆是到定点距离等于定值的点的集合。把这个定义写成坐标式，平方后就是标准方程；展开整理成二次式，就是一般方程。两种写法各有用途：标准方程直接读出圆心与半径，一般方程便于与直线方程联立。"
    :toc="[{ id: 'c1-std', t: '标准方程的来源' }, { id: 'c1-gen', t: '一般方程与配方' }, { id: 'c1-three', t: '三个条件定一个圆' }, { id: 'c1-pit', t: '系数与判别' }]">
    <div class="note good">圆心为 <Katex tex="C(a,b)" />、半径为 <Katex tex="r" /> 的圆的标准方程是 <Katex tex="(x-a)^2+(y-b)^2=r^2" />。展开并整理，得一般方程 <Katex tex="x^2+y^2+Dx+Ey+F=0" />，其中 <Katex tex="D=-2a" />、<Katex tex="E=-2b" />、<Katex tex="F=a^2+b^2-r^2" />。一般方程表示圆的条件是 <Katex tex="D^2+E^2-4F>0" />；等于 <Katex tex="0" /> 时只表示一个点，小于 <Katex tex="0" /> 时不表示任何图形。</div>

    <h3 class="sec" id="c1-std">标准方程的来源</h3>
    <div class="board-wrap">
      <BoardMount :factory="createCircleEq" />
      <div class="cap">图 圆1 · <b>圆的标准方程与一般方程</b>：金色圆周、蓝色圆心 <Katex tex="C" /> 与半径 <Katex tex="r" />，两个方程徽章同步改写。看点：拖动圆心，标准方程里的两个减数跟着变，一般方程的一次项系数随之变号；把半径滑块拉小，一般方程的常数项 <Katex tex="F" /> 增大，但配方徽章的判别式始终等于 <Katex tex="4r^2" />。</div>
    </div>
    <p>设动点 <Katex tex="P(x,y)" /> 在圆上，圆心 <Katex tex="C(a,b)" />、半径 <Katex tex="r" />。由圆的定义，<Katex tex="|PC|=r" />，用两点间距离公式写成</p>
    <p style="text-align:center"><Katex tex="\sqrt{(x-a)^2+(y-b)^2}=r." display /></p>
    <p>两边平方得 <Katex tex="(x-a)^2+(y-b)^2=r^2" />，这就是标准方程。平方把根号去掉，同时把「距离等于 <Katex tex="r" />」与「距离平方等于 <Katex tex="r^2" />」变成同一件事，因为距离非负、半径非负。</p>
    <p>圆心在原点时方程化为 <Katex tex="x^2+y^2=r^2" />，这是最简单的一类圆，也是后面直线与圆问题里最常用的模型。</p>

    <h3 class="sec" id="c1-gen">一般方程与配方</h3>
    <p>把标准方程展开：<Katex tex="x^2-2ax+a^2+y^2-2by+b^2=r^2" />。令 <Katex tex="D=-2a" />、<Katex tex="E=-2b" />、<Katex tex="F=a^2+b^2-r^2" />，移项即得 <Katex tex="x^2+y^2+Dx+Ey+F=0" />。</p>
    <p>反过来，给定一般方程，配方可以读回圆心与半径：</p>
    <p style="text-align:center"><Katex tex="\left(x+\frac{D}{2}\right)^2+\left(y+\frac{E}{2}\right)^2=\frac{D^2+E^2-4F}{4}." display /></p>
    <p>右端必须为正。圆心是 <Katex tex="\left(-\dfrac{D}{2},-\dfrac{E}{2}\right)" />，半径是 <Katex tex="\dfrac{\sqrt{D^2+E^2-4F}}{2}" />。判别式 <Katex tex="D^2+E^2-4F" /> 的三种符号对应三种图形：正数给圆，零给一个点，负数不给图形。</p>

    <h3 class="sec" id="c1-three">三个条件定一个圆</h3>
    <p>标准方程含三个待定参数 <Katex tex="a" />、<Katex tex="b" />、<Katex tex="r" />，一般方程含三个待定系数 <Katex tex="D" />、<Katex tex="E" />、<Katex tex="F" />。因此确定一个圆通常需要三个独立条件：过三个已知点，或已知圆心与一个点，或已知圆心与半径。</p>
    <p>过三点的圆，把三点坐标分别代入一般方程，得到关于 <Katex tex="D" />、<Katex tex="E" />、<Katex tex="F" /> 的三元一次方程组，解出系数再配方；若三点中有两点连线是直径，用标准方程更快：圆心是其中点，半径是半条直径。</p>
    <p>已知圆心与圆上一点时，半径就是两点间距离，直接写标准方程，不必设一般式。</p>

    <h3 class="sec" id="c1-pit">系数与判别</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：二次项系数不是 1。</strong>一般方程要求 <Katex tex="x^2" /> 与 <Katex tex="y^2" /> 的系数相等且非零。遇到 <Katex tex="2x^2+2y^2-4x+6y-1=0" />，先两边除以 <Katex tex="2" />，再用 <Katex tex="D=-2" />、<Katex tex="E=3" />、<Katex tex="F=-1/2" /> 配方。</li>
        <li><strong>提示二：圆心符号写反。</strong>标准方程里是 <Katex tex="(x-a)^2" />，圆心横坐标是 <Katex tex="+a" />；一般方程里是 <Katex tex="Dx" />，圆心横坐标是 <Katex tex="-D/2" />。两处符号相反，不能照抄。</li>
        <li><strong>提示三：忘记检验判别式。</strong>形如 <Katex tex="x^2+y^2+Dx+Ey+F=0" /> 的方程不一定表示圆。若 <Katex tex="D^2+E^2-4F\le0" />，它分别表示一个点或空集，不能再称圆心与半径。</li>
        <li><strong>提示四：三个点共线时仍套公式。</strong>三点共线时不存在过三点的圆，方程组虽然可能解出 <Katex tex="D" />、<Katex tex="E" />、<Katex tex="F" />，但判别式会小于或等于零。解题时应先判断三点是否共线。</li>
      </ul>
    </div>
    <p>回收与预告：圆2 把直线方程与圆方程联立，用圆心到直线的距离判断交点个数；圆3 再把两个圆方程相减，读出公共弦所在的直线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCircleEq } from '../../../boards/linecircle/circle/circleeq.js';
import { CN_CHAPTERS } from './cnav.js';
</script>
