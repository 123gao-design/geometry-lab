<template>
  <ChPage :cur="5" no="线5" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="第二类曲面积分"
    sub="流体穿过一张曲面的流量，取决于流速在法向上的分量。把「分量乘面积」累加，就得到第二类曲面积分，也叫通量。曲面必须指定朝向：法向反一个方向，通量就换一个符号。"
    :toc="[{ id: 'c5-def', t: '通量与曲面定向' }, { id: 'c5-proj', t: '分面投影法' }, { id: 'c5-case', t: '半球面上的三个通量' }, { id: 'c5-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="S" /> 是取定了侧的曲面，单位法向量为 <Katex tex="n=(\cos\alpha,\cos\beta,\cos\gamma)" />，向量场 <Katex tex="F=(P,Q,R)" />。称 <Katex tex="\iint_SF\cdot n\,dS=\iint_S\big(P\cos\alpha+Q\cos\beta+R\cos\gamma\big)dS" /> 为 <Katex tex="F" /> 穿过 <Katex tex="S" /> 指定侧的<b>通量</b>，也记作 <Katex tex="\iint_SP\,dydz+Q\,dzdx+R\,dxdy" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSurfInt2" />
      <div class="cap">图 线5 · <b>第二类曲面积分</b>：曲面是上半球面，法向朝外（紫箭），橙箭是场，金色小片是 <Katex tex="P" /> 附近的一块，紫箭头是它的外法向。三个场：① 竖直常场 <Katex tex="F=(0,0,1)" />，通量 <Katex tex="\pi R^2" />，正好等于赤道圆盘的面积；② <Katex tex="F=(0,0,z)" />，越靠顶部场越强，通量 <Katex tex="2\pi R^3/3" />；③ 辐射场 <Katex tex="F=(x,y,z)" />，处处沿法向，通量 <Katex tex="2\pi R^3" />。把 <Katex tex="\varphi" /> 拖到顶部，看 <Katex tex="F\cdot n" /> 随位置的变化。</div>
    </div>

    <h3 class="sec" id="c5-def">通量与曲面定向</h3>
    <p>通量的读法很直白：把曲面分成小片，每片的面积乘上「流速在该片法向上的投影」，加起来就是单位时间内穿过曲面的流体体积。投影为零的地方（场与曲面平行）不贡献通量，投影为负的地方算作「反向穿过」，也就是从里往外流的反方向。</p>
    <p>曲面有两侧，取定一侧就取定了一个法向。闭合曲面常用<b>外侧</b>；开曲面则要说清「向上」「向外」或「与某条边界成右手关系」。两侧的通量互为相反数：</p>
    <p style="text-align:center"><Katex display tex="\iint_{S^-}F\cdot n\,dS=-\iint_{S^+}F\cdot n\,dS." /></p>
    <p>这与第二类曲线积分的走向问题一模一样：第一类积分不带方向，第二类积分带方向，换了方向就变号。两种积分之间还差一个法向的分量：</p>
    <p style="text-align:center"><Katex display tex="\iint_SP\,dydz+Q\,dzdx+R\,dxdy=\iint_S(P\cos\alpha+Q\cos\beta+R\cos\gamma)\,dS." /></p>

    <h3 class="sec" id="c5-proj">分面投影法</h3>
    <p>只有给出 <Katex tex="z=z(x,y)" /> 时，才方便把三项合成一项。这时上侧的法向是 <Katex tex="(-z_x,-z_y,1)" />，于是</p>
    <p style="text-align:center"><Katex display tex="\iint_SP\,dydz+Q\,dzdx+R\,dxdy=\iint_D\Big(-Pz_x-Qz_y+R\Big)dx\,dy." /></p>
    <p>如果曲面不能整体写成 <Katex tex="z=z(x,y)" />，可以分成几块分别写、再相加；也可以改投到 <Katex tex="yOz" />、<Katex tex="zOx" /> 面上。投影到哪个面，就要看被积式里哪一项是主角：含 <Katex tex="dx\,dy" /> 的那一项靠 <Katex tex="xOy" /> 面的投影来算，其余两项同理。</p>
    <p>符号最容易出错的地方是双值曲面。球面在上、下两半的法向 <Katex tex="\cos\gamma" /> 异号，投影到 <Katex tex="xOy" /> 面时上下两片要分别取正负号，不能把整个球面一次性投影完事。</p>

    <h3 class="sec" id="c5-case">半球面上的三个通量</h3>
    <p>取上半球面 <Katex tex="z=\sqrt{R^2-x^2-y^2}" />，外法向。三个场的结果恰好对应三种几何读法。</p>
    <p><b>常数场。</b><Katex tex="F=(0,0,1)" /> 时，通量 <Katex tex="\iint_S\cos\gamma\,dS" /> 就是曲面在 <Katex tex="xOy" /> 面上的投影面积，也就是赤道圆盘的面积 <Katex tex="\pi R^2" />。竖直穿过半球面的通量，与穿过那张圆盘的通量一样——进来的每一条流线都要先从盘面穿过。</p>
    <p><b>随高度增长的场。</b><Katex tex="F=(0,0,z)" /> 时，带来的因子是 <Katex tex="z\cos\gamma" />。用球面坐标，<Katex tex="z=R\cos\varphi" />、<Katex tex="\cos\gamma=\cos\varphi" />、<Katex tex="dS=R^2\sin\varphi\,d\varphi\,d\theta" />，得</p>
    <p style="text-align:center"><Katex display tex="\iint_Sz\cos\gamma\,dS=R^3\int_0^{2\pi}d\theta\int_0^{\pi/2}\cos^2\varphi\sin\varphi\,d\varphi=\frac{2\pi R^3}{3}." /></p>
    <p><b>辐射场。</b><Katex tex="F=(x,y,z)" /> 指向外侧、处处沿法向，<Katex tex="F\cdot n=R" /> 是常数，通量等于 <Katex tex="R" /> 乘曲面面积 <Katex tex="2\pi R^2" />，即 <Katex tex="2\pi R^3" />。它的值与整个球面的通量 <Katex tex="4\pi R^3" /> 差一半，正好被下半球占去一半。</p>

    <h3 class="sec" id="c5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：没说清是哪一侧。</strong>通量随侧换号，题目不给侧时凹曲面要默认外侧，开曲面按几何描述推断（向上、向外）。</li>
        <li><strong>提示二：把 <Katex tex="dx\,dy" /> 当面积元。</strong><Katex tex="dx\,dy" /> 是投影面积元，带符号；真实面积元是 <Katex tex="dS" />，两者差 <Katex tex="\cos\gamma" />。</li>
        <li><strong>提示三：投影到 <Katex tex="xOy" /> 面时丢了竖直线上的部分。</strong>侧面（<Katex tex="\cos\gamma=0" />）在 <Katex tex="xOy" /> 面上的投影退化，贡献为零，但它在别的坐标面上的投影不为零。</li>
        <li><strong>提示四：闭合曲面直接用单侧公式。</strong>闭合曲面要内外两侧分开看，直接套用上侧公式会把下半的部分算错。</li>
      </ul>
    </div>
    <p>回收与预告：闭合曲面上的通量与区域内的散度之间有一条等式，曲面上旋度的通量与边界上的环流之间也有一条，这就是下一章的两条公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSurfInt2 } from '../../../boards/calc2/curve/surfint2.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
