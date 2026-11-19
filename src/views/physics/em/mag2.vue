<template>
  <PhysicsCh id="mag2"
    sub="磁场对放在其中的通电导线有作用力，这个力叫安培力。它的大小由磁感应强度、电流、导线长度与三者的夹角共同决定，方向由左手定则判断。这一章把大小与方向分开讲清楚，再用几个例子熟悉用法。"
    :toc="[
      { id: 'm2-size', t: '安培力的大小' },
      { id: 'm2-dir', t: '左手定则' },
      { id: 'm2-pos', t: '三种位置' },
      { id: 'm2-calc', t: '算一遍' },
    ]">
    <div class="note good">
      通电导线垂直放入匀强磁场时受到的力为 <Katex tex="F=BIL" />。若导线与磁场成夹角 <Katex tex="\theta" />，分解导线在垂直于磁场方向上的投影长度 <Katex tex="L\sin\theta" />，一般式是
      <Katex tex="F=BIL\sin\theta." />
      方向用<strong>左手定则</strong>判断：伸开左手，让磁感线穿入掌心，四指指向电流方向，拇指所指就是安培力方向。安培力既垂直于磁场，也垂直于导线——总是垂直于两者所在的平面。
    </div>

    <h3 class="sec" id="m2-size">安培力的大小</h3>
    <p>把一段通电直导线放进磁场，导线会受力。这个力叫<strong>安培力</strong>，是为了纪念安培发现电流的磁效应而命名的。</p>
    <p>实验可以逐条测出它依赖哪些量：在匀强磁场中，导线与磁场垂直时，力与电流成正比、与导线长度成正比、与磁感应强度成正比，合起来就是</p>
    <p style="text-align:center"><Katex tex="F=BIL\qquad(\text{导线与磁场垂直})." display /></p>
    <p>上一章正是用这个式子定义磁感应强度 <Katex tex="B=F/(IL)" /> 的。</p>
    <p>导线与磁场不垂直时，力会变小。把导线长度沿垂直于磁场的方向投影，有效长度是 <Katex tex="L\sin\theta" />，于是</p>
    <p style="text-align:center"><Katex tex="F=BIL\sin\theta," display /></p>
    <p>其中 <Katex tex="\theta" /> 是导线与磁场的夹角。这条式子把几种情形都包进去了：<Katex tex="\theta=90^\circ" /> 时 <Katex tex="F=BIL" /> 最大；<Katex tex="\theta=0^\circ" /> 或 <Katex tex="180^\circ" /> 时导线与磁场平行，<Katex tex="F=0" />。</p>
    <p>对弯曲导线，只要放在匀强磁场里，可以把它看成许多小段，每段用 <Katex tex="BIL\sin\theta" /> 求和，结果是<strong>等效于连接两端的直导线</strong>——有效长度就是首尾两点的连线长度，与中间弯成什么形状无关。</p>

    <h3 class="sec" id="m2-dir">左手定则</h3>
    <p>安培力的方向不能靠公式算，要按<strong>左手定则</strong>判断：</p>
    <p>伸开左手，使拇指与其余四指垂直，并且都跟手掌在同一平面内；让<strong>磁感线穿入掌心</strong>，四指的指向与<strong>电流方向</strong>一致，那么<strong>拇指所指的方向</strong>就是安培力的方向。</p>
    <p>判断时注意两点。其一，磁感线是穿入掌心，不是从掌心穿出——手掌正对着磁场的来向。其二，四指指电流方向，不指电子运动方向；若讨论的是自由电子的移动，要先把电流方向反过来再判。</p>
    <p>由左手定则可以直接得出：安培力<strong>既垂直于磁场，也垂直于导线</strong>，它垂直于这两者所决定的平面。这一点与「力沿着力源方向」的直觉不同，需要专门记。当磁场垂直纸面时，安培力就在纸面内；当磁场在纸面内时，安培力垂直于纸面。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电9 · <b>安培力</b>：磁场沿纸面水平向右，四行灰箭头表示它；导线绕中点转过 θ，橙色小箭头是电流方向。看点一：绿色箭头是安培力，它垂直于纸面朝外——磁场与导线都在纸面内，力就垂直于这个平面，按约定画成右上方的斜箭头，导线中点处的 ⊙ 也是同一个意思。看点二：拖 θ 让导线转起来，绿色箭头随之伸缩，θ = 90° 时最长，θ = 0° 与 180° 时完全消失；转到这两个位置，导线与磁场平行，左手定则判不出力，与公式给出 <Katex tex="\sin\theta=0" /> 一致。看点三：右栏的正弦曲线在 90° 处最高、在 0° 与 180° 处落到零点；把 B、I、L 拖大，整条曲线抬高，形状不变。看点四：读数栏最后两行 <Katex tex="F/(BIL)" /> 与 <Katex tex="\sin\theta" /> 始终相等，这就是 <Katex tex="F=BIL\sin\theta" /> 的逐行验证。</p>

    <h3 class="sec" id="m2-pos">三种位置</h3>
    <p>把导线与磁场的相对位置分三种，每种的结果都不同，解题时先认清是哪一种。</p>
    <p><strong>垂直</strong>：<Katex tex="\theta=90^\circ" />，<Katex tex="F=BIL" /> 最大，方向与磁场、电流都垂直。</p>
    <p><strong>斜交</strong>：<Katex tex="F=BIL\sin\theta" />，方向仍同时垂直于磁场与导线。这时可以把磁场分解成平行于导线的分量与垂直于导线的分量，只有垂直分量产生力。</p>
    <p><strong>平行</strong>：<Katex tex="\theta=0^\circ" /> 或 <Katex tex="180^\circ" />，<Katex tex="F=0" />。导线与磁感线平行时不受安培力，这一点常被漏掉。</p>
    <p>上面那块板把 θ 拖到 90°、30° 与 0°，正好就是这三种位置，绿色箭头的长短可以直接对照。</p>
    <p>还有一个常用结论：两根平行通电导线之间也有相互作用。电流同向时互相吸引，反向时互相排斥——一根导线处在另一根产生的磁场中，它的安培力方向恰好如此。</p>

    <h3 class="sec" id="m2-calc">算一遍</h3>
    <p>磁感应强度 <Katex tex="B=0.50\ \text{T}" /> 的匀强磁场中，长 <Katex tex="L=0.60\ \text{m}" /> 的直导线通有 <Katex tex="I=4.0\ \text{A}" /> 的电流。</p>
    <p>导线与磁场垂直时，安培力</p>
    <p style="text-align:center"><Katex tex="F=BIL=0.50\times4.0\times0.60=1.2\ \text{N}." display /></p>
    <p>若把导线转到与磁场成 <Katex tex="30^\circ" />，力变成</p>
    <p style="text-align:center"><Katex tex="F=BIL\sin30^\circ=1.2\times0.5=0.60\ \text{N}," display /></p>
    <p>正好是垂直时的一半。转到与磁场平行，力为零。</p>
    <p>上面那块板里这三步都能直接看到：把 θ 从 90° 拖到 30°，右栏的橙点沿正弦曲线下滑到一半高度；拖到 0°，绿色箭头消失。读数栏把 <Katex tex="F/(BIL)" /> 与 <Katex tex="\sin\theta" /> 并排列出，两行始终相等。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：忘记乘 sinθ。</strong>只有导线与磁场垂直时才用 <Katex tex="F=BIL" />。凡是给了夹角，先写成 <Katex tex="BIL\sin\theta" />，再代入数值。</li>
        <li><strong>提示二：把安培力的方向画成垂直于导线但与磁场成某个角。</strong>安培力同时垂直于磁场与导线，它垂直于两者构成的平面。判断方向只认左手定则，不要凭「大致垂直」去画。</li>
        <li><strong>提示三：左手定则与右手螺旋定则混用。</strong>判断磁场方向用右手（安培定则），判断安培力方向用左手。两套手的用法不同，做题时先问清楚要判的是磁场还是力。</li>
        <li><strong>提示四：以为弯曲导线受力要逐段积分。</strong>在匀强磁场里，弯曲导线的安培力等于从起点到终点那条直导线的安培力，有效长度为首尾连线。形状不影响结果，只有首尾两点的位置决定它。</li>
      </ul>
    </div>
    <p>回收与预告：安培力是磁场对<strong>整段电流</strong>的作用，把它看成每个运动电荷受到的力叠加起来，就可以推到单个电荷身上。下一章把电流换成单个带电粒子，得到洛伦兹力，并由此解释带电粒子在磁场中为什么会做圆周运动。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('ampere');
</script>
