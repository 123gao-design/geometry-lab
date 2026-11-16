<template>
  <ChPage :cur="1" no="向1" base="/vectors/x" :chapters="VX_CHAPTERS"
    title="向量的概念与表示"
    sub="位移、力、速度这类量只说大小不够，还必须说方向。把「方向 + 长度」打包成一个对象，就是向量；画在纸上是一支带箭头的线段，箭头指方向，线段长度是它的大小。"
    :toc="[{ id: 'x1-what', t: '从位移说起' }, { id: 'x1-seg', t: '有向线段与记号' }, { id: 'x1-equal', t: '相等向量与平行向量' }, { id: 'x1-zero', t: '模、零向量与单位向量' }, { id: 'x1-pit', t: '模、比较与零向量' }]">
    <div class="note good" id="x1-def">既有大小又有方向的量叫做<strong>向量</strong>。向量用<strong>有向线段</strong>表示：线段的长度表示向量的大小，箭头所指的方向表示向量的方向。以 <Katex tex="A" /> 为起点、<Katex tex="B" /> 为终点的向量记作 <Katex tex="\overrightarrow{AB}" />；向量的大小叫做<strong>模</strong>，记作 <Katex tex="|\overrightarrow{AB}|" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createVecBasic" />
      <div class="cap">图 向1 · <b>向量表示机</b>：拖动黄色终点 P，蓝色有向线段随方向与长度一起改变；绿色虚线一支是把起点平移过去的相等向量，方向与长度全不变。看点：② 的终点落在 <Katex tex="y" /> 轴上，判读给出与 <Katex tex="y" /> 轴平行；④ 把终点拖回原点，箭头缩成一个点，这就是零向量，模读数为 0。</div>
    </div>

    <h3 class="sec" id="x1-what">从位移说起</h3>
    <p>从教室走到操场，走了多少米是<strong>路程</strong>，从哪个位置到哪个位置是<strong>位移</strong>。绕操场跑一整圈，路程是 400 米，位移却是零——起点与终点重合。路程只需要一个数就能说清，位移必须同时给出长度与朝向，否则无法确定人最终站在哪里。力、速度、加速度同样如此：推门的力朝哪个方向推，结果完全不同。</p>
    <p>这类「带方向的量」在数学里统一叫做向量。与它相对，只有大小而没有方向的量叫数量（或标量），长度、质量、温度、面积都是数量。一次位移是「向东 3 米」，一个数量是「3 米」，两者写出来的符号后面必须能分清属于哪一类。</p>

    <h3 class="sec" id="x1-seg">有向线段与记号</h3>
    <p>画图时，向量用一条规定了起点和终点的线段表示：起点在 <Katex tex="A" />、终点在 <Katex tex="B" /> 的向量记作 <Katex tex="\overrightarrow{AB}" />，箭头落在 <Katex tex="B" /> 处，线段 <Katex tex="AB" /> 的长度就是它的模。也可以用一个带箭头的小写字母记，如 <Katex tex="\vec a" />；为方便，起点常常放在原点，此时向量由终点的坐标完全确定，图 向1 的徽章读的就是这对坐标与模。</p>
    <p>要留意的是：<strong>有向线段只是向量的表示，不是向量本身</strong>。同一支箭头在纸上挪个位置、转个方向，如果长度与朝向都没变，它表示的仍是同一个向量。图 向1 里绿色那一支与蓝色那一支起点不同，代表的却是同一个向量。正因为向量与起点无关，它才能在平面上自由平移——后面讲加法时，平行四边形法则用的正是这一点。</p>

    <h3 class="sec" id="x1-equal">相等向量与平行向量</h3>
    <p>两个向量<strong>相等</strong>，当且仅当它们的长度相等并且方向相同，记作 <Katex tex="\vec a=\vec b" />。这个定义完全抹掉了起点的位置：只要两段有向线段平行、同向、等长，它们就表示同一个向量。反过来，长度相等而方向相反的两个向量<strong>不</strong>相等，它们互为相反向量，在数乘一节会写成 <Katex tex="-\vec a" /> 的形式。</p>
    <p>方向相同或相反的两个向量叫做<strong>平行向量</strong>，也叫做共线向量，记作 <Katex tex="\vec a\parallel\vec b" />。平行向量并不要求画在同一条直线上：把两支箭头放进同一张图，它们所在直线互相平行即可。由于向量可以平移，平行与共线在这里是一回事——这一条在数乘一节会化成「一个向量是另一个的实数倍」。</p>

    <h3 class="sec" id="x1-zero">模、零向量与单位向量</h3>
    <p>向量的模是一个非负实数，记作 <Katex tex="|\vec a|" />。模为零的向量叫<strong>零向量</strong>，记作 <Katex tex="\vec 0" />，它没有确定的朝向，规定它平行于任何向量。模为 1 的向量叫<strong>单位向量</strong>。对任一非零向量 <Katex tex="\vec a" />，与它同向的单位向量是 <Katex tex="\dfrac{\vec a}{|\vec a|}" />，作用是把长度缩成 1、方向原样保留。</p>
    <p>零向量与单位向量在定义里各占一个位置，做题时最容易在这里出错：零向量的方向任意，所以「与 <Katex tex="\vec a" /> 同向的单位向量」这句话必须先保证 <Katex tex="\vec a\ne\vec 0" />；而「<Katex tex="\vec a" /> 为单位向量」等价于 <Katex tex="|\vec a|=1" />，与它落在哪个方向无关。</p>

    <h3 class="sec" id="x1-pit">模、比较与零向量</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：模是数量，不是向量。</strong>写 <Katex tex="|\vec a|>0" /> 合法，写 <Katex tex="|\vec a|>\vec 0" /> 无意义；同理 <Katex tex="|\vec a|=1" /> 说的是长度为一，不能读成「<Katex tex="\vec a" /> 等于 1」。</li>
        <li><strong>提示二：向量之间不能比较大小。</strong><Katex tex="\vec a\ge\vec b" /> 这种写法没有定义，因为方向无法排序。能比较大小的只有它们的模 <Katex tex="|\vec a|" /> 与 <Katex tex="|\vec b|" />，那是两个数在比。</li>
        <li><strong>提示三：零向量的方向是任意的，不是「没有方向」。</strong>规定 <Katex tex="\vec 0\parallel\vec a" /> 对一切 <Katex tex="\vec a" /> 成立，正因为它朝哪都行。由此还得到：若 <Katex tex="\vec a\parallel\vec b" /> 且 <Katex tex="\vec b\parallel\vec c" />，并不一定有 <Katex tex="\vec a\parallel\vec c" />，反例正是 <Katex tex="\vec b=\vec 0" />。</li>
        <li><strong>提示四：相等向量要有方向，不能只看长度。</strong><Katex tex="|\vec a|=|\vec b|" /> 只说明两支箭头一样长，它们可能反向。相等必须长度与方向同时满足，图 向1 的绿色一支挪了起点却仍然相等，靠的正是两条都满足。</li>
      </ul>
    </div>
    <p>回收与预告：函数模块里坐标平面上的点用一对实数 <Katex tex="(x,y)" /> 定位，这里终点在原点时的向量也由一对实数确定，两种记号第一次对上。向2 把两个向量接在一起，给出加法与减法的两种画法；向3 用实数去乘向量，得到共线向量之间的倍率关系。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createVecBasic } from '../../../boards/vectors/linear/vecbasic.js';
import { VX_CHAPTERS } from './vxnav.js';
</script>
