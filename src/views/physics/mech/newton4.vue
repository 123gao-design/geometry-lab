<template>
  <PhysicsCh id="newton4"
    sub="超重与失重说的是视重与实重的差别，由加速度的方向决定，与速度方向无关。N = m(g+a)：加速度向上时超重，向下时失重，向下且等于 g 时完全失重。连接体问题先整体求加速度，再隔离求内力。"
    :toc="[
      { id: 'n4-weight', t: '视重与实重' },
      { id: 'n4-over', t: '超重与失重' },
      { id: 'n4-zero', t: '完全失重' },
      { id: 'n4-link', t: '连接体与整体法' },
    ]">
    <div class="note good">
      站在体重计上，秤的读数等于秤对人的支持力，这个读数叫<strong>视重</strong>；人受到的重力 <Katex tex="mg" /> 叫<strong>实重</strong>。取竖直向上为正，由 <Katex tex="N-mg=ma" /> 得 <Katex tex="N=m(g+a)" />：加速度向上时视重大于实重，这是<strong>超重</strong>；加速度向下时小于实重，这是<strong>失重</strong>；加速度向下且等于 <Katex tex="g" /> 时视重为零，这是<strong>完全失重</strong>。重力本身始终不变。
    </div>

    <h3 class="sec" id="n4-weight">视重与实重</h3>
    <p>体重计显示的并不是重力，而是秤面受到的压力，数值等于秤面对人的支持力。人静止站在秤上时，支持力与重力平衡，读数恰好等于重力，两种说法才混作一谈。一旦有了竖直方向的加速度，两者就分开：支持力与重力不再相等，读数反映的是支持力。</p>
    <p>把这一点写明：<strong>实重</strong>是地球对物体的吸引力 <Katex tex="mg" />，只由质量与当地的重力加速度决定；<strong>视重</strong>是秤测得的压力或拉力，随物体的运动状态变化。超重与失重说的都是视重的变化，与实重无关。</p>

    <h3 class="sec" id="n4-over">超重与失重</h3>
    <p>人在电梯里，站在体重计上，只受两个力：重力 <Katex tex="mg" /> 向下，支持力 <Katex tex="N" /> 向上。取向上为正方向，由牛顿第二定律</p>
    <p style="text-align:center"><Katex tex="N-mg=ma,\qquad N=m(g+a)." display /></p>
    <p>加速度向上时，<Katex tex="a>0" />，<Katex tex="N>mg" />，视重大于实重，这叫<strong>超重</strong>。电梯从静止开始向上启动，或者向下运动时逐渐减速，都属于加速度向上的情形。</p>
    <p>加速度向下时，取向下为正重新列式，得 <Katex tex="mg-N=ma" />，即 <Katex tex="N=m(g-a)" />，视重小于实重，这叫<strong>失重</strong>。电梯向上运动时逐渐减速，或者向下运动时逐渐加速，都属于加速度向下的情形。</p>
    <p>判断超重还是失重，只看加速度的方向，与速度的方向无关。向上运动可以是失重，向下运动也可以是超重。这一点常被「上升就是超重」的直觉带偏，实际只需问加速度朝哪边。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力12 · <b>超重与失重</b>：电梯里的物块站在体重计上，绿色箭头是秤的支持力 <Katex tex="N" />，橙色箭头是重力 <Katex tex="mg" />，两根箭头按同一把尺子量；轿厢左侧的紫色箭头是加速度。右边的两根条把实重与视重并排放着，蓝色虚线是实重的长度，视重的条越过它多少，就是超重的部分。看点：把「加速度 a」拖到正值，视重条变长，读数大于 <Katex tex="mg" />，状态显示超重；拖到负值，视重条变短，读数小于 <Katex tex="mg" />，状态显示失重；一直拖到 <Katex tex="-9.8\ \text{m/s}^2" />，视重归零，物块完全失重。拖动「质量 m」时，实重与视重一起变，两者的比值不变，说明超重、失重只看加速度。</p>

    <h3 class="sec" id="n4-zero">完全失重</h3>
    <p>令 <Katex tex="N=m(g-a)=0" />，得 <Katex tex="a=g" />，方向向下。这时物体与秤之间不再有压力，视重为零，叫<strong>完全失重</strong>。自由落体的电梯、绕地球运行的飞船都处于这种状态。</p>
    <p>完全失重时重力并没有消失。物体仍然受重力，只是与它一起下落的支持面不再需要提供支持力，于是所有「靠重力压着」的现象都消失了：天平测不出质量，水不再往低处流，杯中的水可以悬在半空。飞船里的失重不是因为离开了地球引力，而是因为它一直在「下落」，只是向前的速度让它不断「错过」地面。</p>
    <p>体重计在完全失重时读数为零，但物体的质量、重力都没有变。若在这时用弹簧秤沿水平方向拉物体，仍能测出拉力，也仍能测出质量，因为水平方向的规律不受影响。</p>

    <h3 class="sec" id="n4-link">连接体与整体法</h3>
    <p>几个物体连在一起，具有相同的加速度，这类问题叫<strong>连接体</strong>问题。处理的办法是先整体、后隔离。</p>
    <p>光滑水平面上两个物块 <Katex tex="m_1" />、<Katex tex="m_2" /> 用轻绳相连，在 <Katex tex="m_1" /> 上施加水平拉力 <Katex tex="F" />。取两个物块组成的整体，内部的绳力属于内力，不出现在整体的合力里，直接求出共同的加速度：</p>
    <p style="text-align:center"><Katex tex="a=\frac{F}{m_1+m_2}." display /></p>
    <p>再隔离 <Katex tex="m_2" />。它只受绳的拉力 <Katex tex="T" />，于是</p>
    <p style="text-align:center"><Katex tex="T=m_2a=\frac{m_2}{m_1+m_2}F." display /></p>
    <p>由此看出 <Katex tex="T<F" />，只有当 <Katex tex="m_1" /> 为零时两者才相等。绳拉着后面的物体，本身也要被前面的物体拉着，中间的张力小于两端的拉力，这在滑轮、绳结一类问题里同样成立。</p>
    <p>整体法的好处是不必考虑内力，代价是求不出内力；隔离法的好处是能把内力暴露出来，代价是要多列几个方程。两者配合，先用整体求出加速度，再用隔离求出想要的那个内力，顺序不要颠倒。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：认为超重就是重力变大。</strong>重力只由质量与重力加速度决定，始终是 <Katex tex="mg" />。超重指的是视重变大，也就是秤的支持力变大。</li>
        <li><strong>提示二：用速度方向判断超重失重。</strong>判断依据是加速度的方向。向上减速与向下加速都是失重，向上加速与向下减速都是超重。</li>
        <li><strong>提示三：认为完全失重时物体不受重力。</strong>重力仍然存在，只是不再有支持力与之对抗。飞船里的物体照样受地球引力，正是这个引力提供了绕行的向心力。</li>
        <li><strong>提示四：整体法与隔离法混着列式。</strong>取整体时不要画内力，取单个物体时不要漏掉外力。同一个方程里不能一半按整体、一半按隔离。</li>
      </ul>
    </div>
    <p>回收与预告：牛顿三定律到此讲完，力与运动的关系有了完整的框架：不受力时保持原状，受力时按 <Katex tex="F=ma" /> 改变，物体之间的力总是成对出现。下一组把直线运动推广到曲线，先讲运动的合成与分解，再讲平抛。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('newton4');
</script>
