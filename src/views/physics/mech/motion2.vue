<template>
  <PhysicsCh id="motion2"
    sub="位移与时间之比给出平均速度，时间间隔趋于零时给出瞬时速度。瞬时速度随时间的变化率叫加速度。三者都是矢量，一维情形用正负号表示方向；v-t 图像把速度随时间的变化画成一条曲线，斜率与面积分别对应加速度与位移。"
    :toc="[
      { id: 'm2-avg', t: '平均速度与平均速率' },
      { id: 'm2-inst', t: '瞬时速度' },
      { id: 'm2-acc', t: '加速度' },
      { id: 'm2-graph', t: 'x-t 图与 v-t 图：斜率与面积' },
    ]">
    <div class="note good">
      物体在时间间隔 <Katex tex="\Delta t" /> 内的<strong>平均速度</strong>是 <Katex tex="\bar v=\frac{\Delta x}{\Delta t}" />，方向与位移相同；时间间隔趋于零时它的极限是<strong>瞬时速度</strong>。速度的变化量与所用时间之比叫<strong>加速度</strong>，
      <Katex tex="a=\frac{\Delta v}{\Delta t}=\frac{v-v_0}{t}" />，方向与速度的变化量相同。在 x-t 图像中，切线的斜率是瞬时速度；在 v-t 图像中，图线的斜率是加速度，图线与时间轴围成的有向面积是位移。
    </div>

    <h3 class="sec" id="m2-avg">平均速度与平均速率</h3>
    <p>物体在 <Katex tex="t_1" /> 到 <Katex tex="t_2" /> 这段时间内的位移为 <Katex tex="\Delta x" />，用时 <Katex tex="\Delta t=t_2-t_1" />，则这段时间内的平均速度为</p>
    <p style="text-align:center"><Katex tex="\bar v=\frac{\Delta x}{\Delta t}." display /></p>
    <p>平均速度是矢量，方向与位移 <Katex tex="\Delta x" /> 的方向相同。它只反映整段时间内位置变化的总效果，不说明中途快慢如何变化：一辆车每小时走 60 km，中途可能停过三次，也可能一路匀速，只要位移与时间相同，平均速度就相同。</p>
    <p>用路程与时间之比定义的是<strong>平均速率</strong>，记作 <Katex tex="\bar v_s" />：</p>
    <p style="text-align:center"><Katex tex="\bar v_s=\frac{s}{\Delta t}." display /></p>
    <p>平均速率是标量，只与路程有关。物体绕操场跑一圈回到起点，位移为零，平均速度为零，平均速率却不等于零。两者的数值一般不等，只有在单向直线运动中才相等。</p>

    <h3 class="sec" id="m2-inst">瞬时速度</h3>
    <p>平均速度描述的是整段时间。要把某一时刻的快慢说清楚，就把时间间隔不断缩短：从 <Katex tex="t" /> 到 <Katex tex="t+\Delta t" /> 的平均速度，随着 <Katex tex="\Delta t" /> 减小而逐渐稳定下来。当 <Katex tex="\Delta t" /> 趋于零时，这个比值的极限叫 <Katex tex="t" /> 时刻的<strong>瞬时速度</strong>：</p>
    <p style="text-align:center"><Katex tex="v=\lim_{\Delta t\to 0}\frac{\Delta x}{\Delta t}." display /></p>
    <p>瞬时速度的方向是物体在该时刻的运动方向，也就是轨迹在该点的切线方向。瞬时速度的大小叫<strong>瞬时速率</strong>，简称速率，日常说的「车速 60 km/h」指的就是它，与平均速率不是同一个量。</p>
    <p>数学上，若位置随时间的变化写成函数 <Katex tex="x(t)" />，瞬时速度就是它的导数 <Katex tex="v=x'(t)" />。这一点在函数模块的<strong>导数与切线</strong>一章里已经讨论过，这里的「极限」与那里的「切线斜率」是同一件事。</p>

    <h3 class="sec" id="m2-acc">加速度</h3>
    <p>速度也有变化快慢之分。汽车起步时速度从零增到 100 km/h 要用十几秒，飞机起飞只需几十米滑跑。描述这一点的物理量是加速度：</p>
    <p style="text-align:center"><Katex tex="a=\frac{\Delta v}{\Delta t}=\frac{v-v_0}{\Delta t}." display /></p>
    <p>加速度是矢量，单位是 <Katex tex="\text{m/s}^2" />。读作「米每二次方秒」，含义是每秒钟速度改变多少 <Katex tex="\text{m/s}" />。加速度的方向与速度变化量 <Katex tex="\Delta v" /> 的方向相同，<strong>与速度本身的方向没有必然联系</strong>。</p>
    <p>一维情形下，把正方向取定，<Katex tex="v" /> 与 <Katex tex="a" /> 都带符号。两者的符号关系决定速度是增是减：</p>
    <ul>
      <li><Katex tex="a" /> 与 <Katex tex="v" /> 同号，速率增大，这是加速；</li>
      <li><Katex tex="a" /> 与 <Katex tex="v" /> 异号，速率减小，这是减速；</li>
      <li><Katex tex="a=0" />，速度不变，这是匀速直线运动。</li>
    </ul>
    <p>「加速度大」与「速度大」是两件独立的事。高速匀速行驶的列车加速度为零；刚从站台启动的列车速度很小，加速度却不小。减速过程中即使加速度在减小，只要它与速度同向，速度仍在增大，只是增大得慢了。</p>
    <p>把两支箭头画在同一辆车上，上面这组符号关系就摆在眼前。下面那块板的绿色箭头是速度、橙色箭头是加速度，两者指向同一边时车越走越快，指向相反时越走越慢；右图 v-t 直线的斜率就是加速度，斜率为负只说明 <Katex tex="a<0" />，车是在加速还是减速，还要看速度那一边的符号。</p>

    <PhysicsDemo :def="ACC" />
    <p class="cap">图 力2a · <b>加速度的方向</b>：左栏轨道上一辆小车，绿箭头是它此刻的速度、橙箭头是加速度，两支箭头各按自己的量级伸缩，方向随符号翻转；右栏是速度—时间图，蓝直线的斜率就是加速度，橙点标出当前时刻，蓝色阴影是已经走过的那段图线与时间轴围成的有向面积。看点一：初值取 <Katex tex="v_0=6\ \text{m/s}" />、<Katex tex="a=-2\ \text{m/s}^2" />，开初两支箭头指向相反，速率一路减小，到 <Katex tex="t=3\ \text{s}" /> 速度减到零，此后加速度与速度同号，车掉头越走越快——速度为零的那一瞬间只是转向，加速度并不为零。看点二：把 <Katex tex="a" /> 拖成正值，两支箭头同向，速率一路增大，右图直线向上倾斜；把 <Katex tex="v_0" /> 拖成负值，速度箭头翻向左，此时 <Katex tex="a>0" /> 反而让速率减小，读数栏的「v 与 a」一栏随之改成「异号」。看点三：把 <Katex tex="a" /> 拖到零，右图直线变水平、斜率为零，左栏速度箭头的长度不再变化，阴影仍是矩形，位移与时间成正比。读数栏的「速度 v」是带符号的量，「速率」取它的绝对值，两者在车掉头之后给出不同的符号与正数。</p>

    <h3 class="sec" id="m2-graph">x-t 图与 v-t 图：斜率与面积</h3>
    <p>把位置随时间的变化画成以时间 <Katex tex="t" /> 为横轴、位置 <Katex tex="x" /> 为纵轴的曲线，得到<strong>位移—时间图像</strong>。这条曲线上某一点的切线斜率就是该时刻的瞬时速度：上一节把 <Katex tex="\Delta t" /> 不断缩短，在图上就是割线逐段转到切线。匀变速运动的 x-t 图线是一条抛物线，速度为零的时刻切线水平，速度最大处切线最陡。</p>
    <p>以时间 <Katex tex="t" /> 为横轴、速度 <Katex tex="v" /> 为纵轴，把物体在各时刻的速度画成点并连成线，得到<strong>速度—时间图像</strong>。从定义读出的两条性质是：图线上任意两点连线的斜率等于这段时间内的加速度，图线与时间轴围成的面积等于这段时间内的位移。写下来就是</p>
    <p style="text-align:center"><Katex tex="a=\frac{\Delta v}{\Delta t},\qquad \Delta x=S." display /></p>
    <p>第一条来自斜率的定义。匀变速运动的 v-t 图线是直线，斜率恒定，加速度不变；斜率越陡，加速度越大；倾斜方向给出加速度的正负，与速度本身的符号无关——图线向下倾斜而速度也为负时两者同号，物体正沿负方向加速。第二条来自面积的意义：把时间轴等分成许多小段，每段内速度近似不变，位移约等于高为 <Katex tex="v" />、宽为 <Katex tex="\Delta t" /> 的小矩形面积，求和并让分点加密，就得到图线与时间轴之间的面积。面积在时间轴上方取正，下方取负。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力2b · <b>x-t 图与 v-t 图</b>：两张图上下对齐、共用同一条时间轴，一条竖虚线贯穿两图，上下的读数都取自同一时刻。上图蓝色曲线是位置随时间的变化，绿色虚线是此刻的切线，切线斜率就是读数栏里的瞬时速度；下图蓝色直线是速度随时间的变化，橙色三角取紧挨着此刻的一小段，<Katex tex="\Delta t" /> 与 <Katex tex="\Delta v" /> 之比即图线的斜率，也就是加速度；蓝色阴影是图线到时间轴之间围出的面积，越过时间轴的那一块按负面积计，正负相加就是位移。看点：把「加速度 a」拖成负值，上图抛物线由向上弯转为向下弯、顶点移到时间轴以内，下图直线向下倾斜，阴影越过时间轴后转成负面积，位移随之减小；把 a 调回零，上图变成一条斜直线、下图变成水平线，斜率与加速度同时归零。</p>

    <p>读图时有两处容易混。其一，v-t 图线不是物体的运动轨迹，图线的交点表示两物体速度相等，不表示相遇。其二，图线穿过时间轴意味着速度改变方向，此刻速度为零、位移并不为零，也不是回到出发点。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把平均速度算成速度的平均。</strong><Katex tex="\bar v=\frac{v_0+v}{2}" /> 只在匀变速运动中成立。一般情形要用 <Katex tex="\frac{\Delta x}{\Delta t}" />，先求位移再除以时间。</li>
        <li><strong>提示二：由速度方向判断加速度方向。</strong>加速度的方向由 <Katex tex="\Delta v" /> 决定。刹车时 <Katex tex="a" /> 与 <Katex tex="v" /> 反向，加速时同向，两者没有固定的搭配。图 力2a 里把速度箭头与加速度箭头分别画出来，正是为了让这一条看得见：两支指向同一边才加速，与它们各自朝哪个方向无关。</li>
        <li><strong>提示三：认为加速度减小就是减速。</strong>只要 <Katex tex="a" /> 与 <Katex tex="v" /> 同向，速度就一直在增大，变化的只是增大的快慢。加速度减到零之后才转为匀速。</li>
        <li><strong>提示四：把 v-t 图的交点当成相遇。</strong>两车相遇的条件是位置相同，要么用 x-t 图的交点判断，要么比较各自的位移与初始位置。v-t 图的交点只说明速度相等。</li>
      </ul>
    </div>
    <p>回收与预告：速度随时间线性变化时，v-t 图是一条直线，图线围出的面积是梯形。把这个梯形面积算出来，就得到下一章的三个基本公式。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('vgraph');
const ACC = demoOf('accel');
</script>
