<template>
  <ChPage :cur="2" no="I2" base="/trig/i" :chapters="I_CHAPTERS"
    title="互配两组与奇变偶不变" sub="$\pi/2\pm\alpha$ 是诱导公式里唯一换名的两组：$\pi/2-\alpha$ 的终边与 $\alpha$ 关于 $y=x$ 对称 —— 坐标对调，$\sin$ 与 $\cos$ 互换名称；$\pi/2+\alpha$ 则是 $\alpha$ 逆时针转 $90^\circ$ —— 坐标轮换。把 $k\cdot\pi/2\pm\alpha$ 各组公式归纳下来只用一句口诀：奇变偶不变，符号看象限。"
    :toc="[{ id: 'i2-mirror', t: '互余的镜像：y=x' }, { id: 'i2-rot', t: 'π/2+α：直角旋转' }, { id: 'i2-rule', t: '奇变偶不变与完整总表' }, { id: 'i2-pit', t: '换名与链式' }]">
    <div class="note good" id="i2-law"><strong>互配两组</strong>：<Katex tex="\sin\Bigl(\frac{\pi}{2}-\alpha\Bigr)=\cos\alpha,\quad \cos\Bigl(\frac{\pi}{2}-\alpha\Bigr)=\sin\alpha" />；<Katex tex="\sin\Bigl(\frac{\pi}{2}+\alpha\Bigr)=\cos\alpha,\quad \cos\Bigl(\frac{\pi}{2}+\alpha\Bigr)=-\sin\alpha" />。<strong>总口诀（<Katex tex="k\cdot\pi/2\pm\alpha"/> 全部公式）：奇变偶不变，符号看象限。</strong></div>
    <ConicFigure number="I2" title="诱导公式一览" head="bottom" :factory="createMutual">拨 k 滑块、切 ±、拖 P —— <Katex tex="-\alpha"/> 族亮出倾斜 <Katex tex="k\cdot\pi/4"/> 的金色镜面（<Katex tex="k=1"/> 正是 <Katex tex="y=x"/>），<Katex tex="+\alpha"/> 族沿圆周画出 k 个直角的转程；<Katex tex="\sin\beta"/>、<Katex tex="\cos\beta"/> 的名字与符号由口诀现场判定，数值核验永绿。</ConicFigure>

    <h3 class="sec" id="i2-mirror">互余的镜像：y=x</h3>
    <p><Katex tex="\frac{\pi}{2}-\alpha" /> 与 <Katex tex="\alpha" /> 互余（和为直角）。几何上这有句漂亮的话：互余两角的终边关于直线 <Katex tex="y=x" /> 对称 —— 把单位圆沿 <Katex tex="y=x" /> 一折，角 <Katex tex="\alpha" /> 的终边恰好压在角 <Katex tex="\frac{\pi}{2}-\alpha" /> 的终边上。而 <Katex tex="y=x" /> 这面镜子的专长是<strong>坐标对调</strong>：点 <Katex tex="(\cos\alpha,\sin\alpha)" /> 照过去变成 <Katex tex="(\sin\alpha,\cos\alpha)" />。可对调后的点仍要按「横 <Katex tex="\cos" /> 纵 <Katex tex="\sin" />」读数（<RouterLink class="xref" to="/trig/u1">单位圆定义与三角函数线</RouterLink>的规矩），于是横坐标读出 <Katex tex="\cos\beta=\sin\alpha" />、纵坐标读出 <Katex tex="\sin\beta=\cos\alpha" /> —— <strong>换名不是新规定，是坐标对调的直译</strong>。板上把 <Katex tex="k" /> 拨到 <Katex tex="1" />、镜像线正落在 <Katex tex="45^\circ" />，<Katex tex="P" /> 与 <Katex tex="P'" /> 的两条坐标读数恰好互为倒序，一眼验证。</p>

    <h3 class="sec" id="i2-rot">π/2+α：直角旋转</h3>
    <p><Katex tex="\frac{\pi}{2}+\alpha" /> 换个角度理解：把 <Katex tex="P" /> 逆时针<strong>旋转 <Katex tex="90^\circ" /></strong>，坐标按轮换规矩 <Katex tex="(x,y)\to(-y,x)" /> 变形（旋转不改变长度，只换座位）。于是 <Katex tex="\sin\beta=x=\cos\alpha" />（横坐标顶上纵位）、<Katex tex="\cos\beta=-y=-\sin\alpha" />。也可以走链式推导：<Katex tex="\frac{\pi}{2}+\alpha=\frac{\pi}{2}-(-\alpha)" />，先做 ② 的 <Katex tex="x" /> 轴镜像、再做本节的 <Katex tex="y=x" /> 镜像，两步复合出直角旋转 —— 诱导公式之间可以互相拼装，不必每条都另起炉灶。</p>

    <h3 class="sec" id="i2-rule">奇变偶不变与完整总表</h3>
    <p>把两组公式放回完整体系 <Katex tex="\beta=k\frac{\pi}{2}\pm\alpha" />：<Katex tex="k" /> 取偶数（<Katex tex="0" />、<Katex tex="2" />、<Katex tex="4" />）就是上一章的五组 —— 镜面落在 <Katex tex="x" /> 轴、<Katex tex="y" /> 轴上，坐标只变号、不对调，函数名不变；<Katex tex="k" /> 取奇数（<Katex tex="1" />、<Katex tex="3" />）时镜面转成 <Katex tex="45^\circ" /> 斜线（<Katex tex="y=x" /> 或 <Katex tex="y=-x" />），坐标对调，<Katex tex="\sin" /> 与 <Katex tex="\cos" /> 换名。于是口诀的两半各有几何出处：<strong>奇变</strong> = 斜镜面对调坐标；<strong>偶不变</strong> = 平镜面只翻符号；<strong>符号看象限</strong> = 反射后按 <Katex tex="\beta" /> 的新象限定号（<RouterLink class="xref" to="/trig/i1">诱导公式</RouterLink>的提示二）。板上 <Katex tex="k" /> 滑块从 <Katex tex="0" /> 拨到 <Katex tex="4" />，七组常用公式（含 <Katex tex="\alpha+2k\pi" />、<Katex tex="2\pi-\alpha" />）一屏演完，名字与符号逐组直接判定。</p>
    <p>口诀练熟之后，把<strong>九组公式一次列全</strong> —— 六个函数（倒数三函数已在<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>给出）一并收进总表：倒数函数的符号与换名跟母函数同步（分母变号它变号、分母换名它换名），所以 <Katex tex="\sec" />、<Katex tex="\csc" />、<Katex tex="\cot" /> 随之确定，盯住 <Katex tex="\sin" />、<Katex tex="\cos" /> 两列即可。</p>
    <table>
      <tbody>
        <tr><th><Katex tex="\beta" />（<Katex tex="k" /> 偶：平镜 · 名不变）</th><th><Katex tex="\sin\beta" /></th><th><Katex tex="\cos\beta" /></th><th><Katex tex="\tan\beta" /></th><th><Katex tex="\cot\beta" /></th><th><Katex tex="\sec\beta" /></th><th><Katex tex="\csc\beta" /></th></tr>
        <tr><td><Katex tex="\alpha+2k\pi" /></td><td><Katex tex="\sin\alpha" /></td><td><Katex tex="\cos\alpha" /></td><td><Katex tex="\tan\alpha" /></td><td><Katex tex="\cot\alpha" /></td><td><Katex tex="\sec\alpha" /></td><td><Katex tex="\csc\alpha" /></td></tr>
        <tr><td><Katex tex="-\alpha" /></td><td><Katex tex="-\sin\alpha" /></td><td><Katex tex="\cos\alpha" /></td><td><Katex tex="-\tan\alpha" /></td><td><Katex tex="-\cot\alpha" /></td><td><Katex tex="\sec\alpha" /></td><td><Katex tex="-\csc\alpha" /></td></tr>
        <tr><td><Katex tex="\pi-\alpha" /></td><td><Katex tex="\sin\alpha" /></td><td><Katex tex="-\cos\alpha" /></td><td><Katex tex="-\tan\alpha" /></td><td><Katex tex="-\cot\alpha" /></td><td><Katex tex="-\sec\alpha" /></td><td><Katex tex="\csc\alpha" /></td></tr>
        <tr><td><Katex tex="\pi+\alpha" /></td><td><Katex tex="-\sin\alpha" /></td><td><Katex tex="-\cos\alpha" /></td><td><Katex tex="\tan\alpha" /></td><td><Katex tex="\cot\alpha" /></td><td><Katex tex="-\sec\alpha" /></td><td><Katex tex="-\csc\alpha" /></td></tr>
        <tr><td><Katex tex="2\pi-\alpha" /></td><td><Katex tex="-\sin\alpha" /></td><td><Katex tex="\cos\alpha" /></td><td><Katex tex="-\tan\alpha" /></td><td><Katex tex="-\cot\alpha" /></td><td><Katex tex="\sec\alpha" /></td><td><Katex tex="-\csc\alpha" /></td></tr>
      </tbody>
    </table>
    <p>前三行各面镜子不同、表达式同源：<Katex tex="2\pi-\alpha" /> 与 <Katex tex="-\alpha" /> 只差一整圈，两行完全一致；第 1 行是恒等行 —— 名、号、值原样照抄。</p>
    <table>
      <tbody>
        <tr><th><Katex tex="\beta" />（<Katex tex="k" /> 奇：斜镜 / 旋转 · 必换名）</th><th><Katex tex="\sin\beta" /></th><th><Katex tex="\cos\beta" /></th><th><Katex tex="\tan\beta" /></th><th><Katex tex="\cot\beta" /></th><th><Katex tex="\sec\beta" /></th><th><Katex tex="\csc\beta" /></th></tr>
        <tr><td><Katex tex="\frac{\pi}{2}-\alpha" /></td><td><Katex tex="\cos\alpha" /></td><td><Katex tex="\sin\alpha" /></td><td><Katex tex="\cot\alpha" /></td><td><Katex tex="\tan\alpha" /></td><td><Katex tex="\csc\alpha" /></td><td><Katex tex="\sec\alpha" /></td></tr>
        <tr><td><Katex tex="\frac{\pi}{2}+\alpha" /></td><td><Katex tex="\cos\alpha" /></td><td><Katex tex="-\sin\alpha" /></td><td><Katex tex="-\cot\alpha" /></td><td><Katex tex="-\tan\alpha" /></td><td><Katex tex="-\csc\alpha" /></td><td><Katex tex="\sec\alpha" /></td></tr>
        <tr><td><Katex tex="\frac{3\pi}{2}-\alpha" /></td><td><Katex tex="-\cos\alpha" /></td><td><Katex tex="-\sin\alpha" /></td><td><Katex tex="\cot\alpha" /></td><td><Katex tex="\tan\alpha" /></td><td><Katex tex="-\csc\alpha" /></td><td><Katex tex="-\sec\alpha" /></td></tr>
        <tr><td><Katex tex="\frac{3\pi}{2}+\alpha" /></td><td><Katex tex="-\cos\alpha" /></td><td><Katex tex="\sin\alpha" /></td><td><Katex tex="-\cot\alpha" /></td><td><Katex tex="-\tan\alpha" /></td><td><Katex tex="\csc\alpha" /></td><td><Katex tex="-\sec\alpha" /></td></tr>
      </tbody>
    </table>
    <p>读表三步：① 判断 <Katex tex="\beta" /> 中 <Katex tex="k" /> 的奇偶（定换不换名）；② 按 <Katex tex="\alpha" /> 锐角默认全正写名；③ 按 <Katex tex="\beta" /> 的真实象限定号 —— 每格都能在画板上拨出来核验。后两行（<Katex tex="\frac{3\pi}{2}\pm\alpha" />）是 <Katex tex="k=3" /> 的<strong>链式推论</strong>，不入记忆集：现场拼 <Katex tex="\pi+\Bigl(\frac{\pi}{2}\pm\alpha\Bigr)" /> 两步得到即可。</p>

    <h3 class="sec" id="i2-pit">换名与链式</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：换名不等于换号。</strong><Katex tex="\sin\Bigl(\frac{\pi}{2}-\alpha\Bigr)=\cos\alpha" /> 取正，是因为按 <Katex tex="\alpha" /> 锐角说 <Katex tex="\beta" /> 仍是锐角 —— 符号另有象限判定，别把「变」字理解成添负号。</li>
        <li><strong>提示二：<Katex tex="\pi/2\pm\alpha"/> 与 <Katex tex="\pi\pm\alpha"/> 一换名一不变，最易互串。</strong>记镜子：<Katex tex="\pi\pm\alpha" /> 是平镜（<Katex tex="y" /> 轴 / 原点）不换名，<Katex tex="\frac{\pi}{2}\pm\alpha" /> 是斜镜（<Katex tex="y=x"/> / 旋转）必换名。</li>
        <li><strong>提示三：口诀按 <Katex tex="\alpha" /> 锐角陈述。</strong><Katex tex="\alpha" /> 是任意角时「符号看象限」仍成立，但象限要按 <Katex tex="\beta" /> 实算 —— 板上把 <Katex tex="\alpha" /> 拖出第一象限即可验证结论仍然成立。</li>
        <li><strong>提示四：<Katex tex="\tan" /> 也换名。</strong><Katex tex="k" /> 奇时 <Katex tex="\tan\beta=\pm\frac{1}{\tan\alpha}" />（<Katex tex="\tan\leftrightarrow\cot"/>），由商数关系现推即可，不必为 <Katex tex="\cot" /> 单开记忆。</li>
        <li><strong>提示五：别背 <Katex tex="3\pi/2\pm\alpha"/> 的成品公式。</strong>链式推导两步得到，背了反而容易在符号上出错。</li>
      </ul>
    </div>
    <p>诱导公式至此闭环：任意角 → 锐角，函数值全部可查。下一阶段让单位圆滚动起来 —— 把 P 的纵坐标随角度变化的轨迹画成曲线，正弦的波浪第一次现身。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMutual } from '../../../boards/trig/induce/mutual.js';
import { I_CHAPTERS } from './inav.js';
</script>
