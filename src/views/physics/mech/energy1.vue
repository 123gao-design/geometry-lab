<template>
  <PhysicsCh id="energy1"
    sub="功是力在位移方向上的累积：W = Fs cosθ，垂直的分力不做功，反向的分力做负功。功率是做功的快慢，平均功率是 W/t，瞬时功率是 Fv cosθ。机车起动把两者连起来：牵引力与阻力之差决定加速度，功率一旦固定，速度越大牵引力越小。"
    :toc="[
      { id: 'e1-work', t: '功的定义与正负' },
      { id: 'e1-cases', t: '不做功的三种情形与总功' },
      { id: 'e1-power', t: '功率：平均与瞬时' },
      { id: 'e1-car', t: '机车起动' },
    ]">
    <div class="note good">
      力对物体做的功定义为力、位移与两者夹角余弦的乘积：
      <Katex tex="W=Fs\cos\theta" />。<Katex tex="\theta" /> 是<strong>力与位移的夹角</strong>。锐角时 <Katex tex="\cos\theta>0" />，力做正功；直角时为零，力不做功；钝角时 <Katex tex="\cos\theta<0" />，力做负功，习惯上说物体「克服这个力做功 <Katex tex="|W|" />」。功率是单位时间内做的功，<Katex tex="P=W/t" />，把它与 <Katex tex="s=vt" /> 合起来就得到瞬时功率 <Katex tex="P=Fv\cos\theta" />。这一组从功与功率开始，为动能定理与机械能守恒打底。
    </div>

    <h3 class="sec" id="e1-work">功的定义与正负</h3>
    <p>做功的两个要素缺一不可：<strong>力</strong>与<strong>沿力的方向发生的位移</strong>。把力按位移方向与垂直方向分解，<Katex tex="F\cos\theta" /> 沿位移、<Katex tex="F\sin\theta" /> 垂直于位移，后者在位移方向上没有任何贡献，所以</p>
    <p style="text-align:center"><Katex tex="W=F\cos\theta\cdot s=Fs\cos\theta." display /></p>
    <p>这个式子的几何含义是：功等于力在位移方向上的投影与位移大小的乘积。演示里把拉力斜向上拉，绿色的 <Katex tex="F\cos\theta" /> 是真正参与做功的那个分力，紫色的 <Katex tex="F\sin\theta" /> 竖着，一点也不做功——把 θ 拖到 90°，绿色分力缩成零，功随之归零。</p>
    <p>功是<strong>标量</strong>，可正可负，正负不代表方向，而表示「力对物体输运能量」还是「从物体取走能量」。推力与位移同向时物体被加速，动能增加；摩擦力与位移反向时物体被减速，动能减少。这个对应关系在动能定理一章会被写成等式。</p>
    <p>功的单位是焦耳，1 J = 1 N·m。注意 1 N·m 作为功时叫焦耳，作为力矩时叫牛·米，两者不能混用——力矩的 N·m 是转动效果的度量，不涉及能量转化。</p>
    <p>下面那块板把斜着拉的物块与功随夹角的变化画在一起：左半是物块、拉力与两支分力，右半是功随夹角的曲线。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力22a · <b>功与功率</b>：水平地面上一个物块，橙箭头是拉力 <Katex tex="F" />，与位移方向成 <Katex tex="\theta" /> 角，角弧画在力的起点；绿箭头是沿位移方向的分力 <Katex tex="F\cos\theta" />，紫色虚线是竖直分力 <Katex tex="F\sin\theta" />；青色箭头是位移 <Katex tex="s" />，末端一条竖线标出量到哪。右栏画功随夹角的余弦曲线，橙点是当前状态，绿色标「正功」、灰色标「不做功」、粉色标「负功」。看点一：把 θ 从 0 拖到 180，绿箭头先缩到零再反向，读数栏的 <Katex tex="W" /> 从最大正值一路减到负值，右栏橙点沿曲线从左走到右、穿过 90° 处的零点。看点二：把 θ 停在 90°，绿箭头消失，读数栏的 <Katex tex="W" /> 与 <Katex tex="P" /> 同时归零——拉力再大也不做功。看点三：只拖「速率 v」，功 <Katex tex="W" /> 不动、功率 <Katex tex="P" /> 跟着变，两者的区别一目了然。</p>

    <h3 class="sec" id="e1-cases">不做功的三种情形与总功</h3>
    <p>把 <Katex tex="W=Fs\cos\theta" /> 的三项逐一取零，就得到三种不做功的情形。</p>
    <p><strong>有力无位移，或有位移无力。</strong>推一堵没有推动的墙，用了力但没有位移；物体靠惯性滑行时，水平方向没有力，滑了多远也没有水平力做功。静止的物体上挂着多大力，都不产生功。</p>
    <p><strong>力与位移垂直。</strong><Katex tex="\theta=90^\circ" />，<Katex tex="\cos\theta=0" />。这是最容易漏掉的一条：水平面上滑动的物体，重力与支持力都不做功；绳牵着小球在水平面内做圆周运动，绳的拉力始终沿半径、速度始终沿切线，两者垂直，拉力一点功也不做，所以速率不变。演示把 θ 拖到 90°，左栏出现「竖直拉力不做功」一行，右栏的曲线正好穿过横轴。</p>
    <p><strong>力与位移反向。</strong><Katex tex="\theta=180^\circ" />，<Katex tex="W=-Fs" />。滑动摩擦力、空气阻力都是这种情形，它们把物体的机械能变成内能散发出去。</p>
    <p>物体往往同时受几个力，<strong>总功</strong>有两种算法：先把各力做的功代数相加，或者先求合力再用 <Katex tex="W_{\text{合}}=F_{\text{合}}s\cos\theta_{\text{合}}" />。两种算法结果相同，因为功是标量，可以直接相加减。演示里只有拉力这一个主动力，实际题目常常还要再算重力、支持力与摩擦力的功，其中支持力与摩擦力的和往往不为零——支持力不做功，摩擦力做负功。</p>

    <h3 class="sec" id="e1-power">功率：平均与瞬时</h3>
    <p>同样的功，用一小时做完与用一秒做完，效果相差很远。功率就是刻画这个快慢的量：</p>
    <p style="text-align:center"><Katex tex="P=\frac{W}{t}." display /></p>
    <p>这是<strong>平均功率</strong>。若力是恒力、运动是匀速，平均功率等于瞬时功率；若速度在变，两者就要分开。把 <Katex tex="W=Fs\cos\theta" /> 与 <Katex tex="v=s/t" /> 代入，得到瞬时功率</p>
    <p style="text-align:center"><Katex tex="P=Fv\cos\theta," display /></p>
    <p>力与速度同向时简写成 <Katex tex="P=Fv" />。演示里读数栏最后两行就是这两个量：<Katex tex="W=Fs\cos\theta" /> 与 <Katex tex="P=Fv\cos\theta" />，把速率滑块拖快，功率随之变大而功不变——功只看位移，功率还看用了多少时间。</p>
    <p>机械上常提到<strong>额定功率</strong>与<strong>实际功率</strong>。额定功率是机器长时间正常工作的最大输出功率，写在铭牌上；实际功率随负载变化，可以小于也可以短时超过额定值。功率的单位是瓦特，1 W = 1 J/s，汽车发动机常用千瓦，1 kW = 10³ W。</p>

    <h3 class="sec" id="e1-car">机车起动</h3>
    <p>机车问题把功、功率与牛顿第二定律串在一起。水平路面上，牵引力 <Katex tex="F" /> 与阻力 <Katex tex="f" /> 同时作用，加速度由合力决定：</p>
    <p style="text-align:center"><Katex tex="a=\frac{F-f}{m},\qquad P=Fv." display /></p>
    <p><strong>以恒定功率起动</strong>时，<Katex tex="P" /> 不变，速度 <Katex tex="v" /> 一变大，牵引力 <Katex tex="F=P/v" /> 就变小，加速度随之减小。速度越大、加速越吃力，最后牵引力降到与阻力相等，加速度为零，速度达到最大值</p>
    <p style="text-align:center"><Katex tex="v_{\max}=\frac{P}{f}." display /></p>
    <p>这一档的加速度是变值，不能用匀变速公式，得靠动能定理或能量关系算时间与位移。</p>
    <p><strong>以恒定牵引力起动</strong>时，加速度不变，是匀加速过程；但功率 <Katex tex="P=Fv" /> 随速度线性上升，涨到额定功率那一刻起动阶段结束，之后转入恒功率阶段，牵引力开始下降，直到速度到达 <Katex tex="P_{\text{额}}/f" />。</p>
    <p>两种起动的共同结论是同一条：<strong>速度越大，同一功率下能拿到的牵引力越小</strong>。这也是为什么汽车上坡要换低挡——低挡把发动机的转速换成更大的牵引力，功率不变而 <Katex tex="F" /> 变大，才爬得上去。</p>
    <p>下面那块板把两种起动并排画在同一个 <Katex tex="v\text{-}t" /> 坐标系里：左栏是车与路面上的三支箭头，右栏两档各一条曲线，切档看当前那一档的走法。</p>

    <PhysicsDemo :def="CAR" />
    <p class="cap">图 力22b · <b>机车起动</b>：左栏是一辆车与一条水平路面，橙箭头是牵引力 <Katex tex="F" />、紫箭头是阻力 <Katex tex="f" />、绿箭头是此刻的速度 <Katex tex="v" />，长度都随读数变；右栏是两档的 <Katex tex="v\text{-}t" /> 曲线，橙色是当前这一档、灰线是另一档，青色虚线标出两档共同的末速度 <Katex tex="v_{\max}=P/f" />。看点一：切到「恒定功率」档，橙色曲线开头陡、越走越平，读数栏的「功率 <Katex tex="F\cdot v" />」整段停在额定功率上，而「牵引力」一路下降、「加速度」一路减小——速度越来越大，同样的功率换来的牵引力越来越小。看点二：切到「恒定加速度」档，曲线开头是一段直线（牵引力保持 <Katex tex="f+ma_0" />），功率随速度线性上涨；涨到额定功率之后曲线弯下去，牵引力开始下降，加速度从这一刻起不再恒定。看点三：两条曲线都向右上方渐渐贴近同一条青色虚线而不真正到达它——速度越大，牵引力与阻力之差越小，加速度趋于零，末速度只能无限接近 <Katex tex="P/f" />。把额定功率或阻力拖大拖小，虚线的高度随之移动，两档却始终共用这一条。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：认为有力、有位移就一定做功。</strong>还有一种情形是两个都有却仍然为零——力与位移垂直。<Katex tex="\cos90^\circ=0" />，此时不论力多大、位移多长，功都是零。</li>
        <li><strong>提示二：把 θ 当成力与水平面的夹角。</strong><Katex tex="\theta" /> 是力与<strong>位移</strong>的夹角。物体沿斜面下滑时，重力与位移的夹角是 <Katex tex="90^\circ-\alpha" />（<Katex tex="\alpha" /> 是斜面倾角），不是 <Katex tex="\alpha" />，这一步写错会差一个正余弦。</li>
        <li><strong>提示三：把 <Katex tex="W=Fs\cos\theta" /> 用在变力或曲线运动上。</strong>这个式子要求力是恒力、路径是直线。圆周运动中绳的拉力、弹簧的弹力都随位置改变，必须另找办法（动能定理、图象面积或积分），不能直接把路程当位移代进去。</li>
        <li><strong>提示四：混淆平均功率与瞬时功率。</strong><Katex tex="P=W/t" /> 给的是一段的平均，<Katex tex="P=Fv" /> 给的是某一时刻的瞬时值。机车以恒定功率起动时，速度在变，<Katex tex="F=P/v" /> 也随之在变，用平均功率去算某一时刻的牵引力是错的。</li>
      </ul>
    </div>
    <p>回收与预告：功把「力」与「位移」相乘，得到了一个只看始末、不看中间过程的量；功率再把时间放进去。这条线继续走下去就是动能定理：所有力做的总功等于动能的变化量，<Katex tex="W_{\text{合}}=\tfrac12mv_2^2-\tfrac12mv_1^2" />。力23 从这里出发，把变力、曲线与多过程问题一并收进一条等式里。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('energy1');
const CAR = demoOf('carstart');
</script>
