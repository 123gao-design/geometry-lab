<template>
  <ChPage :cur="2" no="次2" base="/inequalities/q" :chapters="Q_CHAPTERS"
    title="穿根法：高次与分式" sub="高次与分式不等式的通用解法只有一句话：把左边分解成一次因子之积、与零比较。每个因子的符号只在自身的根处换向，因此数轴被全部根分段后，每段上各因子符号恒定，乘积的符号由符号表逐行读出。穿根曲线是符号表的图像化：从最右端正号起笔向左穿行，奇重根穿过数轴、偶重根碰回。分式一律移项通分，分母零点除外。"
    :toc="[{ id: 'q2-table', t: '符号表与穿根曲线' }, { id: 'q2-parity', t: '奇穿偶不穿' }, { id: 'q2-frac', t: '分式：移项通分' }, { id: 'q2-even', t: '平方因子的处理' }, { id: 'q2-pit', t: '两边乘分母与约分丢域' }]">
    <div class="note good" id="q2-law">穿根法：<Katex tex="P(x)=a\prod (x-r_i)^{m_i}" />（<Katex tex="a>0" />），全部根标上数轴 —— 最右段恒正，向左每过一个根：<Katex tex="m_i" /> 为奇数则变号（穿过），偶数则不变号（碰回）。分式：<Katex tex="\tfrac{x-r_1}{x-r_2}>0\iff (x-r_1)(x-r_2)>0,\ x\ne r_2" /> —— 乘积读解，分母零点除外。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPC" />
      <div class="cap">图 次2 · <b>穿根法</b>：四个预设（三因子 / 含平方因子 / 四因子 / 分式）与 P&gt;0、P&lt;0 方向切换。看点：符号表逐因子一行、绿正红负，积行金色穿根曲线从最右端正号起笔向左穿行 —— 奇重根穿过数轴、偶重根碰回折返；预设② 的偶重根 −2 处曲线碰回，解集被切成三段；分式预设④ 中分母零点是红色空心点并配竖直渐近线，解集须补 x≠−2。</div>
    </div>

    <h3 class="sec" id="q2-table">符号表与穿根曲线</h3>
    <p>每个一次因子 <Katex tex="x-r" /> 的符号只在 r 处换向，把全部根标上数轴后，每一段上每个因子的符号都恒定，乘积的符号由逐行符号相乘读出 —— 这就是符号表（图 次2 下半部分）。次1 的「相邻两根之间符号恒定」在高次情形原样成立，符号表是把它系统化的操作规程；性2 变形手段一节预告的「因子符号已知，积的符号逐段读出」在此成为完整方法。解集 = 符号符合要求（正或负）的那些段，端点是否可取由不等号严格与否决定。</p>

    <h3 class="sec" id="q2-parity">奇穿偶不穿</h3>
    <p>穿根曲线是符号表的图像化：最高次系数为正时最右段恒正，从右端「正号」起笔向左画；过一个根 <Katex tex="r_i" /> 时只有因子 <Katex tex="(x-r_i)^{m_i}" /> 变号 —— <Katex tex="m_i" /> 为奇数时积的符号改变（曲线穿过数轴），偶数时符号复原（曲线碰到数轴折回）。例：预设② <Katex tex="(x+2)^2(x-1)(x-3)>0" />，三个根把数轴分成四段，最右段正、过 3 变负、过 1 变正、过 −2（偶重）不变号 —— 解集三段 <Katex tex="x<-2" /> 或 <Katex tex="-2<x<1" /> 或 <Katex tex="x>3" />（−2 处 P=0，严格不等号不可取）。次1 中 <Katex tex="\Delta=0" /> 的重根正是偶重根的最小情形（二重根），「除一点外的全体」就是「偶不穿」在二次上的表现。</p>

    <h3 class="sec" id="q2-frac">分式：移项通分</h3>
    <p>分式不等式的标准流程固定：移项（右边归零）→ 通分 → 化为单一分式与 0 比较 → 等价改写为乘积并补分母零点除外。核心等价：<Katex tex="\tfrac{x-1}{x+2}>0\iff (x-1)(x+2)>0,\ x\ne -2" /> —— 分式的符号即分子与分母商的符号，同号得正、异号得负，与性2 作商法的符号分类完全同构。分母零点处分式无定义，图 次2 预设④ 把它画成红色空心点并配竖直渐近线，曲线在渐近线两侧断开 —— 分式不等式永远不取「两边同乘分母」的路径（见提示一），乘积读解是唯一规范动作。</p>

    <h3 class="sec" id="q2-even">平方因子的处理</h3>
    <p>偶重因子有两种等价处理。几何侧：穿根曲线上「碰回」，符号不变。代数侧：直接约去 —— <Katex tex="(x+2)^2" /> 在 <Katex tex="x\ne -2" /> 时恒正，除以恒正的式子方向不变，故原不等式在 <Katex tex="x\ne-2" /> 上等价于 <Katex tex="(x-1)(x-3)>0" />，解集为 <Katex tex="x<1" /> 或 <Katex tex="x>3" />，再剔除 <Katex tex="x=-2" />，与穿根法结果一致。一般地，<Katex tex="(x-a)^{2k}" /> 型因子满足：除式在 <Katex tex="x\ne a" /> 上恒正（方向不变），<Katex tex="x=a" /> 处整个乘积为零（严格不等号本就不可取），约去后补回 <Katex tex="x\ne a" /> 即完全等价。</p>

    <h3 class="sec" id="q2-pit">两边乘分母与约分丢域</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：两边同乘分母。</strong><Katex tex="\tfrac{x-1}{x+2}>1" /> 不能直接乘 <Katex tex="x+2" /> —— 分母符号未定，乘正乘负方向相反（性1 的规则）。移项通分：<Katex tex="\tfrac{x-1}{x+2}-1=\tfrac{-3}{x+2}>0" />，分子恒负，分式为正须分母为负，解 <Katex tex="x<-2" />。</li>
        <li><strong>提示二：约分丢域。</strong><Katex tex="\tfrac{x^2-1}{x-1}>1" /> 约去 <Katex tex="x-1" /> 得 <Katex tex="x+1>1" /> 即 <Katex tex="x>0" />，但 <Katex tex="x=1" /> 使原式无定义 —— 解集 <Katex tex="x>0" /> 且 <Katex tex="x\ne 1" />。约分改变定义域，结论必须带定义域。</li>
        <li><strong>提示三：忘分母零点除外。</strong>解集端点若来自分母零点，写成闭区间即错 —— 图 次2 预设④ 的红色空心点提示 <Katex tex="x=-2" /> 恒不可取。</li>
      </ul>
    </div>
    <p>因子分解把高次与分式一并化归为数轴上的分段定号；把「与某点的距离」作为新的比较对象，就得到下一章的绝对值不等式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPC } from '../../../boards/inequalities/quad/pierce.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
