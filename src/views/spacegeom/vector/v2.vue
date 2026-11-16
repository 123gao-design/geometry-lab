<template>
  <ChPage :cur="2" no="向2" base="/spacegeom/v" :chapters="SV_CHAPTERS"
    title="数量积"
    sub="数量积把一个角变成一次乘法：两向量的模与夹角余弦相乘，得到一个数而不是向量。它在坐标里表现为对应分量相乘再相加，于是夹角、垂直、投影三件事都能直接算。平面与空间中所有「垂直」的判据，归根到底都是数量积为零。"
    :toc="[{ id: 'v2-def', t: '定义与几何意义' }, { id: 'v2-coord', t: '坐标式计算' }, { id: 'v2-angle', t: '夹角与垂直' }, { id: 'v2-proj', t: '投影与分量' }, { id: 'v2-pit', t: '符号与方向' }]">
    <div class="note good">两个非零向量的<strong>数量积</strong>定义为 <Katex tex="\vec a\cdot\vec b=|\vec a||\vec b|\cos\langle\vec a,\vec b\rangle" />。结果是一个实数，符号由夹角决定：锐角为正、直角为零、钝角为负。零向量与任何向量的数量积都约定为零。</div>

    <h3 class="sec" id="v2-def">定义与几何意义</h3>
    <p>把 <Katex tex="|\vec b|\cos\theta" /> 记作 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 方向上的<strong>投影</strong>（有向长度，钝角时为负），数量积就是「一条向量的模」乘「另一条向量在它方向上的投影」：</p>
    <p style="text-align:center"><Katex tex="\vec a\cdot\vec b=|\vec a|\cdot\bigl(|\vec b|\cos\theta\bigr)=|\vec b|\cdot\bigl(|\vec a|\cos\theta\bigr)." display /></p>
    <p>两种读法给出同一个数，所以数量积对两个因式对称。<Katex tex="\vec b" /> 与 <Katex tex="\vec a" /> 同向时投影取满值 <Katex tex="|\vec b|" />，数量积最大；反向时投影取负满值，数量积最小。这两个极值把「同向」「反向」写成了不等式</p>
    <p style="text-align:center"><Katex tex="-|\vec a||\vec b|\le \vec a\cdot\vec b\le |\vec a||\vec b|," display /></p>
    <p>即柯西不等式的向量形式：夹角的余弦夹在 <Katex tex="-1" /> 与 <Katex tex="1" /> 之间，取等当且仅当两向量共线。</p>
    <p>数量积还满足交换律、数乘结合律与分配律，这三条在坐标式里都能逐项核对。注意它<strong>不满足结合律</strong>：<Katex tex="(\vec a\cdot\vec b)\vec c" /> 是一个数与向量相乘，而 <Katex tex="\vec a(\vec b\cdot\vec c)" /> 方向不同，两者一般不能比较。</p>

    <h3 class="sec" id="v2-coord">坐标式计算</h3>
    <p>设 <Katex tex="\vec a=(a_1,a_2,a_3)" />、<Katex tex="\vec b=(b_1,b_2,b_3)" />，则</p>
    <p style="text-align:center"><Katex tex="\vec a\cdot\vec b=a_1b_1+a_2b_2+a_3b_3." display /></p>
    <p>这条公式把几何量彻底化成了算术：先对应分量相乘，再把三个积相加。它与平面内的公式只差一项，多出来的正是 <Katex tex="a_3b_3" />。由它立刻得到自乘关系 <Katex tex="\vec a\cdot\vec a=|\vec a|^2" />，这也是求模与求距离的常用写法：<Katex tex="|\overrightarrow{AB}|^2=(\overrightarrow{AB})^2" />。</p>
    <p>画板里的两行读数是同一条公式的两面：左边按定义算 <Katex tex="|\vec a||\vec b|\cos\theta" />，右边按坐标算三个分量的乘积和，两数始终相等。把方位角 <Katex tex="\varphi" /> 拨动，向量绕着 <Katex tex="\vec a" /> 转一圈，<Katex tex="\vec a\cdot\vec b" /> 一动不动——数量积只与夹角有关，与向量绕轴转到哪里无关。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSpaceDot" />
      <div class="cap">图 向2 · <b>数量积与投影机</b>：金色 <Katex tex="\vec a" /> 沿 <Katex tex="x" /> 轴，蓝色 <Katex tex="\vec b" /> 由夹角 <Katex tex="\theta" /> 与方位 <Katex tex="\varphi" /> 两个滑块定位，橙色弧标夹角，紫色段是 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 方向上的投影，垂足处画直角。徽章读数量积、余弦与投影长度。看点：<Katex tex="\theta" /> 推到 <Katex tex="90^\circ" /> 时投影缩成一点、数量积归零；超过 <Katex tex="90^\circ" /> 后紫色段跑到原点另一侧，数量积变负；拨动 <Katex tex="\varphi" />，蓝色向量绕轴转了一圈，三个读数都不动。</div>
    </div>

    <h3 class="sec" id="v2-angle">夹角与垂直</h3>
    <p>把定义式反解，得到夹角公式</p>
    <p style="text-align:center"><Katex tex="\cos\langle\vec a,\vec b\rangle=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}=\frac{a_1b_1+a_2b_2+a_3b_3}{\sqrt{a_1^2+a_2^2+a_3^2}\,\sqrt{b_1^2+b_2^2+b_3^2}}." display /></p>
    <p>分母是两个模的乘积，恒为正，于是<strong>夹角的余弦与数量积同号</strong>：数量积为正即锐角、为零即直角、为负即钝角。判断垂直时只算这个数：</p>
    <p style="text-align:center"><Katex tex="\vec a\perp\vec b\iff \vec a\cdot\vec b=0\iff a_1b_1+a_2b_2+a_3b_3=0." display /></p>
    <p>这条判据在立体几何里用得非常勤：证线面垂直，只需证明直线的方向向量与平面内两条相交直线的方向向量都垂直；求平面的法向量，只需解法向量与平面内两个方向向量的数量积方程。后面面1 求法向量、面3 判位置关系，用的都是这一步。</p>

    <h3 class="sec" id="v2-proj">投影与分量</h3>
    <p>向量 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 方向上的投影是一个带符号的数</p>
    <p style="text-align:center"><Katex tex="\mathrm{proj}_{\vec a}\vec b=|\vec b|\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a|}," display /></p>
    <p>投影向量则是把这个数乘上 <Katex tex="\vec a" /> 的单位向量：<Katex tex="\dfrac{\vec a\cdot\vec b}{|\vec a|^2}\vec a" />。画板里紫色的那一段就是它的长度，垂足是被投影向量的终点在直线上的落点。</p>
    <p>求一点到一条直线的距离时，这套写法特别顺手：设直线过 <Katex tex="P_0" />、方向向量为 <Katex tex="\vec s" />，则点 <Katex tex="P" /> 到直线的距离是</p>
    <p style="text-align:center"><Katex tex="d=\sqrt{|\overrightarrow{P_0P}|^2-\left(\mathrm{proj}_{\vec s}\overrightarrow{P_0P}\right)^2}," display /></p>
    <p>即斜边长与一条直角边已知时的另一条直角边。面4 会用叉乘给出同一距离的另一个写法，两者互为验算。</p>

    <h3 class="sec" id="v2-pit">符号与方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把数量积当成向量。</strong>数量积的结果是实数，不能再与向量相加。写式子时 <Katex tex="\vec a\cdot\vec b+\vec c" /> 里的前一项已经是数，与向量 <Katex tex="\vec c" /> 不能直接相加，这类式子本身就没有意义。</li>
        <li><strong>提示二：由数量积为零直接断定两向量都是零向量。</strong>数量积为零只说明两向量垂直或其中至少一个是零向量。要排除零向量，得先说明两条向量都非零，这一点在证垂直时常常被漏掉。</li>
        <li><strong>提示三：忽略投影的有向性。</strong>钝角时投影是负数，画在图上要落在 <Katex tex="\vec a" /> 的反方向上。只取绝对值会丢掉「数量积为负」这条信息。</li>
        <li><strong>提示四：用数量积判断平行。</strong>数量积管的是夹角，平行与共线要看 <Katex tex="\vec a=\lambda\vec b" /> 或后面的向量积为零向量（向3）。把「数量积大」当成「两向量接近平行」只在同模时才勉强成立。</li>
      </ul>
    </div>
    <p>回收与预告：数量积给出夹角与投影，但得不到「垂直方向」。向3 的向量积正好补上这一块——它垂直于两条向量张成的平面，模等于平行四边形的面积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpaceDot } from '../../../boards/spacegeom/vector/spacedot.js';
import { SV_CHAPTERS } from './svnav.js';
</script>
