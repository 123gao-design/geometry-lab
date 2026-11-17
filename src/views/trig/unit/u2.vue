<template>
  <ChPage :cur="2" no="U2" base="/trig/u" :chapters="U_CHAPTERS"
    title="同角三角函数的关系" sub="平方关系与商数关系是三角恒等变换的两条基础：前者是单位圆方程 $x^2+y^2=1$ 的勾股直译，后者把 $\tan$ 定义成斜率。已知一角求其余的全部技巧，都从这几条关系出发 —— 连倒数三函数 $\sec$、$\csc$、$\cot$ 也一并列出。"
    :toc="[{ id: 'u2-sq', t: '平方关系：勾股的直译' }, { id: 'u2-qt', t: '商数关系与符号' }, { id: 'u2-rec', t: '倒数三函数与图象' }, { id: 'u2-pit', t: '开方的 $\\pm$' }]">
    <div class="note good" id="u2-law"><strong>平方关系</strong>：<Katex tex="\sin^2\alpha+\cos^2\alpha=1" />（对一切 α 成立）；<strong>商数关系</strong>：<Katex tex="\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}" />；<strong>倒数关系</strong>：<Katex tex="\sec\alpha=\dfrac{1}{\cos\alpha},\quad\csc\alpha=\dfrac{1}{\sin\alpha},\quad\cot\alpha=\dfrac{1}{\tan\alpha}" />；<strong>tan–sec 关系</strong>：<Katex tex="1+\tan^2\alpha=\sec^2\alpha,\quad\sec^2\alpha-\tan^2\alpha=1" />（切线三角形 OA=1、AT=tan、OT=sec 的勾股直译）；<strong>第三部分</strong>：<Katex tex="(\sin\alpha\pm\cos\alpha)^2=1\pm2\sin\alpha\cos\alpha" /> —— 五条线量知一得二。</div>
    <div class="board-wrap">
      <BoardMount :factory="createIdent" />
      <div class="cap">图 U2 · <b>同角的平方关系</b>：左侧单位圆直角三角形（斜边恒 1），右侧 <Katex tex="\sin^2"/> 与 <Katex tex="\cos^2"/> 堆叠条 —— 无论怎么拖，总高恒满；开「切线三角形」后切线 <Katex tex="x=1"/> 与终边延长线交出 T，<Katex tex="OA=1"/>、<Katex tex="AT=\tan"/>、<Katex tex="OT=\sec"/> —— <strong><Katex tex="1+\tan^2=\sec^2"/> 的勾股直译</strong>（右下核验徽章实时验证）；②③④ 三个预设演示开方的 <Katex tex="\pm"/> 如何由象限判定。</div>
    </div>

    <h3 class="sec" id="u2-sq">平方关系：勾股的直译</h3>
    <p>图 U2 左侧的直角三角形两直角边为 <Katex tex="\sin\alpha,\cos\alpha" />、斜边为 1 —— 勾股定理直接给出 <Katex tex="\sin^2\alpha+\cos^2\alpha=1" />。换一个角度看：它就是单位圆的方程 <Katex tex="x^2+y^2=1" />（J2 图示法的回收：同一件事的几何说法与代数说法）。右侧的堆叠条是这条恒等式的直译：<strong>sin² 与 cos² 此消彼长，总高永远满格</strong> —— 拖动 P 到任何角度，两段蓝色与橙色加起来不多不少。它也是解三角方程的核心工具：已知 <Katex tex="\sin\alpha=t" />，则 <Katex tex="|\cos\alpha|=\sqrt{1-t^2}" /> —— 平方关系给出<strong>绝对值</strong>，正负号则由象限确定。</p>

    <h3 class="sec" id="u2-qt">商数关系与符号</h3>
    <p><Katex tex="\tan\alpha=\sin\alpha/\cos\alpha" /> 在图 U2 的商数徽章上逐字核验：<strong>商数即斜率</strong> —— 直线 OP 的倾斜角正是 α，斜率 <Katex tex="k=\tan\alpha" />（回收 E1：一次函数的 k 从来都是倾斜角的正切）。符号系统也由商数自动导出：tan 的符号 = sin 与 cos 的<strong>商的符号</strong> —— 第三象限两者同负、商反为正，「三正切」无需死记。已知 tan 求弦则走<strong>齐次式</strong>：设 <Katex tex="\sin\alpha=2k,\cos\alpha=k" />，用平方关系 <Katex tex="4k^2+k^2=1" /> 解出 k 的绝对值、象限定符号 —— 预设 ④ 演的正是这条流程。第三部分 <Katex tex="\sin\alpha\pm\cos\alpha" /> 与 <Katex tex="\sin\alpha\cos\alpha" /> 由完全平方绑定：知其一即可得其余两个，化简求值的高频通道。</p>

    <h3 class="sec" id="u2-rec">倒数三函数：sec、csc、cot 与它们的图象</h3>
    <p>商数关系把 tan 定义成斜率，倒数关系再补齐其余三个：<Katex tex="\sec\alpha=\dfrac{1}{\cos\alpha}" />、<Katex tex="\csc\alpha=\dfrac{1}{\sin\alpha}" />、<Katex tex="\cot\alpha=\dfrac{\cos\alpha}{\sin\alpha}=\dfrac{1}{\tan\alpha}" /> —— 正割、余割、余切。名称的由来：secant 是<strong>割</strong>过圆的线段（U1 的切线 AT 之旁，终边与直线 x=1 的交点到圆心的距离恰是 sec），「余」字辈一律与「正」字辈互余配对（cos 配 sin、cot 配 tan、csc 配 sec）。平方关系再做一次除法得到另一组公式：两边同除 <Katex tex="\cos^2\alpha" /> 得 <Katex tex="1+\tan^2\alpha=\sec^2\alpha" />，同除 <Katex tex="\sin^2\alpha" /> 得 <Katex tex="1+\cot^2\alpha=\csc^2\alpha" /> —— 除以哪个函数的平方，哪个函数就化为常数 1，其余按倒数关系改写。<strong>tan 与 sec 的关系另有一个更直观的解释</strong>：图 U2 开「切线三角形」后，OA=1、AT=tan、OT=sec 本身就是直角三角形 —— 勾股定理把 <Katex tex="1+\tan^2\alpha=\sec^2\alpha" /> 画成「两条直角边 1 与 tan、斜边 sec」，无需任何除法，直接得到。再补充一条高频恒等式：<Katex tex="\sec^2\alpha-\tan^2\alpha=1\Rightarrow(\sec\alpha+\tan\alpha)(\sec\alpha-\tan\alpha)=1" />，即 <Katex tex="\sec\alpha-\tan\alpha=\dfrac{1}{\sec\alpha+\tan\alpha}" /> —— sec 与 tan 的和、差互为倒数，化简求值里的「对偶对」（E6 指对互反的同一思路：已知和差，倒数立得，常用于构造乘积）。至此六个同角函数相互确定：已知一角，全部可求。</p>
    <div class="board-wrap">
      <BoardMount :factory="createReci" />
      <div class="cap">图 U2b · <b>sec、csc、cot 的图像</b>：切 <Katex tex="\sec"/> / <Katex tex="\csc"/> / <Katex tex="\cot"/>，母函数以参考虚线同屏 —— 曲线只在母函数的<strong>零点</strong>处断开（倒数趋于无穷）；<Katex tex="|\cos|\le1"/> 决定 <Katex tex="|\sec|\ge1"/>（淡色禁区带内曲线绝不现身）；cot 模式亮出金线 <Katex tex="x=\pi/4"/> —— 整条余切曲线是正切关于它的互余镜像。拖 <Katex tex="x_0"/> 逐点核验，乘积恒等于 1。</div>
    </div>
    <p>三条曲线的读法与母函数一一核验。<strong>断口</strong>：sec 断在 cos 的零点 <Katex tex="x=\tfrac{\pi}{2}+k\pi" />，csc 断在 sin 的零点 <Katex tex="x=k\pi" />，cot 断在 kπ 而零点落在 <Katex tex="\tfrac{\pi}{2}+k\pi" /> —— 与 tan 恰好错位。<strong>有界性</strong>（S4 回收）：母函数 <Katex tex="|\cos\alpha|\le1" /> ⇒ 倒数 <Katex tex="|\sec\alpha|\ge1" /> —— 曲线永远在禁区带之外，只在母函数取 ±1 处贴线回调（sec 的波谷恰在 kπ）。<strong>周期与奇偶</strong>：cot 的周期是 <Katex tex="\pi" />（tan 的一半），sec、csc 与母函数同为 <Katex tex="2\pi" />；sec 偶，csc、cot 奇。最值得注意的一条：<Katex tex="\cot x=\tan\Bigl(\tfrac{\pi}{2}-x\Bigr)" /> —— 诱导公式 π/2−α 在图象上的体现：cot 的整条曲线就是 tan 关于直线 <Katex tex="x=\tfrac{\pi}{4}" /> 的镜面反射（I2 提示四的图形版）。W 系列将把 sin、cos、tan 请上同一张坐标纸，四条曲线同屏复检。</p>

    <h3 class="sec" id="u2-pit">开方的 ±</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：开方出 <Katex tex="\pm"/>，由象限选定符号。</strong>已知 <Katex tex="\sin\alpha=\tfrac35" /> 求 cos：平方关系只给 <Katex tex="|\cos\alpha|=\tfrac45" /> —— 第二象限取 <Katex tex="-\tfrac45" />、第一象限取 <Katex tex="\tfrac45" />（图 U2 预设 ②③ 对比）；「题目没说象限」时必须<strong>分类讨论</strong>。</li>
        <li><strong>提示二：同角才成立。</strong><Katex tex="\sin^2\alpha+\cos^2\beta=1" /> 未必成立 —— 恒等式认角不认形。</li>
        <li><strong>提示三：<Katex tex="\tan"/> 在 <Katex tex="\cos=0"/> 处排除。</strong>用商数关系前先验 <Katex tex="\cos\alpha\neq0" />（回收 X1：定义域外的等式没有意义）—— <Katex tex="\sec"/>、<Katex tex="\cot"/>、<Katex tex="\csc"/> 同理各有各的排除点（图 U2b 的断口）。</li>
        <li><strong>提示四：1 的恒等替换。</strong>齐次化简时 <Katex tex="1=\sin^2\alpha+\cos^2\alpha" /> 是最常用的「换 1」—— 分子分母同除 <Katex tex="\cos^2\alpha" /> 可把整式化成 tan 的有理式，前提仍是 <Katex tex="\cos\alpha\neq0" />（除完顺手把 <Katex tex="1+\tan^2=\sec^2"/> 也认出来）。</li>
        <li><strong>提示五：倒数 <Katex tex="\ne"/> 翻折。</strong><Katex tex="y=1/f"/> 的图象不是 f 关于 x 轴翻折 —— cot 的曲线是 tan 关于 <Katex tex="x=\pi/4"/> 的<strong>镜像</strong>而非上下颠倒；断口也认准各自的母函数：tan 断在 <Katex tex="\pm\pi/2"/>，cot 断在 <Katex tex="k\pi"/>，不要混淆。</li>
      </ul>
    </div>
    <p>对照表至此贯通：同角六函数正余成对、互为倒数。下一章<strong>诱导公式</strong>：终边关于轴与原点对称的角，函数值只差正负号或一次换名 —— 把任意角化归回锐角表，sec/csc/cot 的完整变换总表也在那里一并列全。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIdent } from '../../../boards/trig/unit/identlab.js';
import { createBoard as createReci } from '../../../boards/trig/unit/reciplab.js';
import { U_CHAPTERS } from './unav.js';
</script>
