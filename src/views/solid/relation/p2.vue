<template>
  <ChPage :cur="2" no="位2" base="/solid/w" :chapters="SW_CHAPTERS"
    title="异面直线与角"
    sub="异面直线既没有公共点，也不平行，它们所成的角要靠平移把两条线搬到同一个顶点上。直线与平面所成的角用射影来定义，点到平面的距离用垂线段来度量。三种量的求法都归结为同一件事：找出合适的平行线或垂足，再在三角形里算。"
    :toc="[{ id: 'w2-skew', t: '异面直线' }, { id: 'w2-angle', t: '平移法求所成角' }, { id: 'w2-lineplane', t: '直线与平面所成的角' }, { id: 'w2-minangle', t: '最小角定理' }, { id: 'w2-distance', t: '点到平面的距离' }, { id: 'w2-pit', t: '范围与垂足' }]">
    <div class="note good">定义在前，计算在后。异面直线所成角 <Katex tex="\theta\in\left(0,\tfrac{\pi}{2}\right]" />，直线与平面所成角 <Katex tex="\theta\in\left[0,\tfrac{\pi}{2}\right]" />，二面角 <Katex tex="\theta\in[0,\pi]" />。三个范围成对出现，前两个都取不到钝角，第二个还允许取到 <Katex tex="0" />——直线在平面内时就是 <Katex tex="0" />。掌握范围，能在算完余弦后立即判断符号该不该取绝对值。</div>

    <h3 class="sec" id="w2-skew">异面直线</h3>
    <p>不同在任何一个平面内的两条直线叫做<strong>异面直线</strong>。判定异面的常用办法有两条：一是直接用正方体这类模型观察，二是用反证法——若两条直线共面，则它们相交或平行，与已知矛盾。过平面内一点与平面外一点的直线，和平面内不过该点的直线一定是异面直线，这条结论在证明题里出现得最多。</p>
    <p>正方体中每一条棱都与若干条棱异面。取棱 <Katex tex="A_1B" />，与它异面的有 <Katex tex="B_1C" />、<Katex tex="DD_1" />、<Katex tex="CC_1" /> 等；与它相交、平行的棱则与它共面。把每个顶点处的三条棱与面对角线标出来，异面关系一目了然。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSkewLab" />
      <div class="cap">图 位2 · <b>异面直线与角机</b>：单位正方体上三档。第一档取异面直线 <Katex tex="A_1B" /> 与 <Katex tex="B_1C" />，把 <Katex tex="B_1C" /> 平移到 <Katex tex="A_1D" />（绿色虚线），在 <Katex tex="A_1" /> 处量出 <Katex tex="60^\circ" />；第二档把斜线投到平面 <Katex tex="ABCD" /> 上，垂足与射影一起画出，读出 <Katex tex="45^\circ" />；第三档从 <Katex tex="A_1" /> 向平面 <Katex tex="BDC_1" /> 作垂线，垂足 <Katex tex="H" /> 恰是三角形的重心，垂线段长 <Katex tex="\tfrac{2\sqrt{3}}{3}\approx1.15" />。拖动画面旋转，箭头所指的角始终张在同一个顶点上。</div>
    </div>

    <h3 class="sec" id="w2-angle">平移法求所成角</h3>
    <p>已知两条异面直线 <Katex tex="a" />、<Katex tex="b" />，在空间中任取一点 <Katex tex="O" />，过 <Katex tex="O" /> 分别作 <Katex tex="a'\parallel a" />、<Katex tex="b'\parallel b" />，则 <Katex tex="a'" /> 与 <Katex tex="b'" /> 所成的<strong>锐角或直角</strong>就叫做异面直线 <Katex tex="a" /> 与 <Katex tex="b" /> 所成的角。这个角的大小与点 <Katex tex="O" /> 的选取无关。</p>
    <p>用向量算最省事。设两条直线的方向向量为 <Katex tex="\vec u" />、<Katex tex="\vec v" />，则</p>
    <p style="text-align:center"><Katex tex="\cos\theta=\frac{\left|\vec u\cdot\vec v\right|}{\left|\vec u\right|\left|\vec v\right|},\qquad \theta\in\left(0,\tfrac{\pi}{2}\right]." display /></p>
    <p>举例：在棱长为 <Katex tex="1" /> 的正方体中，取 <Katex tex="\vec u=\overrightarrow{A_1B}=(1,0,-1)" />、<Katex tex="\vec v=\overrightarrow{B_1C}=(0,1,-1)" />，则 <Katex tex="\vec u\cdot\vec v=1" />，两向量的模都是 <Katex tex="\sqrt2" />，于是 <Katex tex="\cos\theta=\tfrac12" />，<Katex tex="\theta=60^\circ" />。几何上的对应动作是把 <Katex tex="B_1C" /> 平移到 <Katex tex="A_1D" />，因为 <Katex tex="A_1D\parallel B_1C" />，于是所求角就是 <Katex tex="\angle BA_1D" />。</p>
    <p>平移的目标点通常选在正方体的顶点上。若两条直线没有公共的端点，可平移其中一条，使它与另一条相交；若能直接找一条与其中一条平行的面对角线或棱，平移就不必作图，直接连出来即可。</p>

    <h3 class="sec" id="w2-lineplane">直线与平面所成的角</h3>
    <p>一条直线与一个平面斜交时，这条直线与它在平面内的<strong>射影</strong>所成的角，叫做直线与平面所成的角。若直线垂直于平面，所成角为 <Katex tex="90^\circ" />；若直线在平面内或与平面平行，所成角为 <Katex tex="0^\circ" />。</p>
    <p>求法的固定步骤是三步：在直线上取一点向平面作垂线，连接垂足与直线与平面的交点得到射影，最后在这个直角三角形里求角。设直线的方向向量为 <Katex tex="\vec u" />、平面的法向量为 <Katex tex="\vec n" />，则</p>
    <p style="text-align:center"><Katex tex="\sin\theta=\frac{\left|\vec u\cdot\vec n\right|}{\left|\vec u\right|\left|\vec n\right|},\qquad \theta\in\left[0,\tfrac{\pi}{2}\right]." display /></p>
    <p>注意这里是<strong>正弦</strong>：方向向量与法向量夹角的余弦，等于直线与平面夹角的正弦。正方体中 <Katex tex="A_1B" /> 与平面 <Katex tex="ABCD" /> 所成角为 <Katex tex="45^\circ" />，因为 <Katex tex="A_1" /> 的射影是 <Katex tex="A" />，直角三角形 <Katex tex="A_1AB" /> 的两条直角边都是棱长。</p>

    <h3 class="sec" id="w2-minangle">最小角定理</h3>
    <p>取定平面外一点 <Katex tex="P" />，<Katex tex="PO\perp\alpha" /> 于 <Katex tex="O" />，斜线 <Katex tex="PA" /> 交平面于 <Katex tex="A" />，<Katex tex="AO" /> 是 <Katex tex="PA" /> 在平面内的射影。记线面角 <Katex tex="\angle PAO=\theta_1" />，在平面内过 <Katex tex="A" /> 任作一条直线 <Katex tex="AB" />，记 <Katex tex="\angle OAB=\theta_2" />、<Katex tex="\angle PAB=\theta" />，则</p>
    <p style="text-align:center"><Katex tex="\cos\theta=\cos\theta_1\cos\theta_2\le\cos\theta_1,\qquad \theta\ge\theta_1." display /></p>
    <p>推法是一次坐标计算。以 <Katex tex="A" /> 为原点，<Katex tex="AO" /> 所在直线为 <Katex tex="x" /> 轴，平面 <Katex tex="\alpha" /> 为 <Katex tex="xOy" /> 平面。设 <Katex tex="AB=L" />，则 <Katex tex="B=(L\cos\theta_2,\ L\sin\theta_2,\ 0)" />；设 <Katex tex="PA=m" />，则 <Katex tex="P=(m\cos\theta_1,\ 0,\ m\sin\theta_1)" />。两向量点积为 <Katex tex="mL\cos\theta_1\cos\theta_2" />，除以模长之积 <Katex tex="mL" /> 即得上式。由于 <Katex tex="\theta_2\in[0,90^\circ]" />，<Katex tex="\cos\theta_2\le1" />，等号只在 <Katex tex="\theta_2=0" /> 时成立。</p>
    <p>这条结论称为<strong>最小角定理</strong>，也常写作三余弦定理：斜线与平面内一条直线所成角的余弦，等于线面角的余弦乘以该直线与射影夹角的余弦。它说明<strong>斜线与它在平面内的射影所成的角，是这条斜线与平面内经过斜足的所有直线所成角中最小的</strong>。取 <Katex tex="\theta_2=0" />，即 <Katex tex="AB" /> 与 <Katex tex="AO" /> 重合，<Katex tex="\theta" /> 落到最小值 <Katex tex="\theta_1" />；取 <Katex tex="\theta_2=90^\circ" />，即 <Katex tex="AB\perp AO" />，则 <Katex tex="\theta=90^\circ" />，这是平面内与斜线成角最大的一条。</p>
    <p>定理的用处有两方面。求线面角时，它保证沿射影方向量出的角确实是所有可能角里最小的那个，选错直线只会得到偏大的角；证明不等式时，把 <Katex tex="\cos\theta" /> 写成两个余弦的乘积，<Katex tex="\cos\theta_2\le1" /> 一步就能放缩。</p>
    <div class="board-wrap">
      <BoardMount :factory="createMinAngle" id="minangle" />
      <div class="cap">图 位2b · <b>最小角定理机</b>：<Katex tex="PO\perp\alpha" />，<Katex tex="AO" /> 是斜线 <Katex tex="PA" /> 的射影，绿色直线 <Katex tex="AB" /> 在平面内绕斜足 <Katex tex="A" /> 转动。三个角分色画出：线面角 <Katex tex="\theta_1" /> 为金色，射影与 <Katex tex="AB" /> 的夹角 <Katex tex="\theta_2" /> 为青色，斜线与 <Katex tex="AB" /> 的夹角 <Katex tex="\theta" /> 为紫色。看点：转动「方向」滑块，<Katex tex="\theta_2" /> 变大时 <Katex tex="\theta" /> 随之变大；<Katex tex="\theta_2=0" /> 处 <Katex tex="\theta" /> 落到最小值，与 <Katex tex="\theta_1" /> 相等；<Katex tex="\theta_2=90^\circ" /> 处 <Katex tex="\theta" /> 达到 <Katex tex="90^\circ" />。余弦关系徽章把 <Katex tex="\cos\theta_1\cos\theta_2" /> 的乘积与 <Katex tex="\cos\theta" /> 并列，拖动时两者始终一致。</div>
    </div>

    <h3 class="sec" id="w2-distance">点到平面的距离</h3>
    <p>从平面外一点向平面作垂线，垂线段的长度就是点到平面的距离。距离是「最短」的体现：平面内任意一点与该点的连线中，垂线段最短。设点的位置向量为 <Katex tex="\vec p" />，平面过点 <Katex tex="\vec a" />、法向量为 <Katex tex="\vec n" />，则</p>
    <p style="text-align:center"><Katex tex="d=\frac{\left|(\vec p-\vec a)\cdot\vec n\right|}{\left|\vec n\right|}." display /></p>
    <p>画板的第三档取点 <Katex tex="A_1(0,0,1)" /> 与平面 <Katex tex="BDC_1" />。平面上的三个点确定法向量 <Katex tex="\vec n=\overrightarrow{BD}\times\overrightarrow{BC_1}" />，代入上式得 <Katex tex="d=\tfrac{2}{\sqrt3}=\tfrac{2\sqrt3}{3}\approx1.15" />。垂足 <Katex tex="H" /> 的坐标是 <Katex tex="\left(\tfrac23,\tfrac23,\tfrac13\right)" />，恰好是三角形 <Katex tex="BDC_1" /> 的重心，这一点在解题时经常被问到。</p>
    <p>求点到平面的距离有三条常用路线：一是直接作垂线并找到垂足，落在图形内部时最省事；二是等体积法，把一个三棱锥用两种方式算体积，反解出高；三是向量法，即上面的公式。三条路线的结果相同，选择取决于垂足是否容易定位。</p>

    <h3 class="sec" id="w2-pit">范围与垂足</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：异面直线所成角算成钝角。</strong>按方向向量算出的余弦可能为负，必须取绝对值；所成角限定在 <Katex tex="\left(0,\tfrac{\pi}{2}\right]" /> 内，余弦不会为负。</li>
        <li><strong>提示二：线面角当作斜线与平面内任意直线的夹角。</strong>必须取斜线在平面内的<strong>射影</strong>。最小角定理说明，平面内其它直线与斜线所成的角都大于线面角，随手取一条量出来只会偏大。</li>
        <li><strong>提示三：线面角套用余弦。</strong>方向向量与法向量的夹角与线面角互余，公式里必须是正弦。写成余弦，小角度会被算成接近 <Katex tex="90^\circ" /> 的错误值。</li>
        <li><strong>提示四：点到平面距离的垂足一定落在图形内部。</strong>垂足落在三角形或平面图形之外是常见情形，距离照样有定义。用等体积法时不必找垂足，体积不变，距离由 <Katex tex="\tfrac{3V}{S}" /> 给出，换一个顶点算体积结果相同。</li>
      </ul>
    </div>
    <p>回收与预告：位2 的三个量都写成了向量公式，标2 建立空间直角坐标系与平面方程，标3 把这些公式统一到一套坐标运算里。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSkewLab } from '../../../boards/solid/relation/skewlab.js';
import { createBoard as createMinAngle } from '../../../boards/solid/relation/minangle.js';
import { SW_CHAPTERS } from './wnav.js';
</script>
