<template>
  <ChPage :cur="3" no="次3" base="/inequalities/q" :chapters="Q_CHAPTERS"
    title="绝对值不等式" sub="$|x-m|$ 是数轴上 x 到 m 的距离，绝对值不等式的解集由「带内 / 带外」直接读出：$|x-m|<c$ 是以 m 为中心、半宽 c 的开带，$>c$ 是带外两段，端点关于 m 对称。含系数时换元 $t=ax+b$ 或读统一式：$|ax+b|$ 与 c 的比较，等价于到中心 $-b/a$ 的距离与 $c/|a|$ 的比较。双绝对值用零点分段，或画平底折线与水平线求交。"
    :toc="[{ id: 'q3-band', t: '距离读法：带内与带外' }, { id: 'q3-sub', t: '换元与反解' }, { id: 'q3-two', t: '双绝对值：零点分段' }, { id: 'q3-graph', t: '图象解法与平方' }, { id: 'q3-pit', t: 'c 的符号与端点' }]">
    <div class="note good" id="q3-law"><Katex tex="c>0" /> 时：<Katex tex="|x-m|<c\iff m-c<x<m+c" />（带内），<Katex tex="|x-m|>c\iff x<m-c\ \text{或}\ x>m+c" />（带外）。统一式（<Katex tex="a\ne 0" />、<Katex tex="c>0" />）：<Katex tex="|ax+b|\lessgtr c\iff \bigl|x+\tfrac ba\bigr|\lessgtr \tfrac{c}{|a|}" />。<Katex tex="c=0" />：<Katex tex="|u|<0" /> 无解、<Katex tex="|u|>0\iff u\ne 0" />；<Katex tex="c<0" />：小于恒无解、大于恒成立。</div>
    <div class="board-wrap">
      <BoardMount :factory="createAD" />
      <div class="cap">图 次3 · <b>绝对值距离机</b>：上轴是换元 <Katex tex="t=ax+b" />、下轴是 x，拖 a、b、c 或点三个预设，「&lt;c / &gt;c」两模式切换。看点：紫虚线把 t 带两端与反解后的 x 端点连线，x 带以 <Katex tex="m=-b/a" /> 为中心、半宽 <Katex tex="c/|a|" /> —— a 只是距离的换算率；c 拖过零时「小于」恒无解、「大于」恒成立；a=0 时左边退化为常数，与 c 直接比较。</div>
    </div>

    <h3 class="sec" id="q3-band">距离读法：带内与带外</h3>
    <p><Katex tex="|x-m|" /> 的几何意义是数轴上 x 到 m 的距离，于是 <Katex tex="|x-m|<c" /> 即「到 m 的距离小于 c」：x 落在以 m 为中心、半宽 c 的开带内；<Katex tex=">c" /> 即带外两段。距离观点直接给出解集的特征 —— 两端点 <Katex tex="m-c" /> 与 <Katex tex="m+c" /> 关于 m 对称，中心与半宽就是全部参数。例 <Katex tex="|x-1|<2" />（图 次3 预设①）：中心 1、半宽 2，解 <Katex tex="-1<x<3" />，一步读出，不须分类讨论。</p>

    <h3 class="sec" id="q3-sub">换元与反解</h3>
    <p>形如 <Katex tex="|ax+b|\lessgtr c" /> 的不等式有两条并行路径。换元：令 <Katex tex="t=ax+b" />（图 次3 上轴），先解 <Katex tex="|t|\lessgtr c" /> 得 t 的带，再反解 x —— 两轴端点间的紫虚线就是这层映射。统一式：<Katex tex="|ax+b|=|a|\,\bigl|x-\bigl(-\tfrac ba\bigr)\bigr|" />，即到中心 <Katex tex="m=-\tfrac ba" /> 的距离乘以换算率 <Katex tex="|a|" />（x 每移动 1，t 移动 <Katex tex="|a|" />），故半宽按 <Katex tex="c/|a|" /> 缩放。例 <Katex tex="|2x-1|<3" />（预设②）：中心 <Katex tex="\tfrac12" />、半宽 <Katex tex="\tfrac32" />，解 <Katex tex="-1<x<2" /> —— 与逐段去绝对值（<Katex tex="-3<2x-1<3" />）的结果一致，统一式只是把它读成距离。</p>

    <h3 class="sec" id="q3-two">双绝对值：零点分段</h3>
    <p><Katex tex="|x+1|+|x-2|<4" />：两个绝对值的零点 −1 与 2 把数轴分成三段，每段内两个绝对值同时去掉（符号由所在段决定），化为一次不等式；<strong>每段的解必须与所在段求交</strong>（该段的展开只在此段内成立），最后取并。<Katex tex="x<-1" /> 段：<Katex tex="-2x+1<4" /> 给 <Katex tex="-\tfrac32<x<-1" />；<Katex tex="[-1,2]" /> 段：左边恒为 3，全段满足；<Katex tex="x>2" /> 段：<Katex tex="2x-1<4" /> 给 <Katex tex="2<x<\tfrac52" />；并集 <Katex tex="\bigl(-\tfrac32,\tfrac52\bigr)" />。几何核验：左边是到 −1 与 2 的距离之和，最小值 3 恰在 <Katex tex="[-1,2]" /> 上取得（两点间距），故 <Katex tex="|x+1|+|x-2|\le 3\iff -1\le x\le 2" />、而任何「&lt;3」的写法无解 —— 分段计算与距离直觉一致。</p>

    <h3 class="sec" id="q3-graph">图象解法与平方</h3>
    <p>图象：把 <Katex tex="y=|ax+b|" /> 与 <Katex tex="y=c" /> 画在同一坐标系，交点横坐标即解集端点 —— V 形折线（E8 绝对值家族的基本成员，G2 的翻折变换产物）被水平线截出带内 / 带外；双绝对值 <Katex tex="y=|x+1|+|x-2|" /> 是平底折线，与 <Katex tex="y=4" /> 的交点同样读出 <Katex tex="\bigl(-\tfrac32,\tfrac52\bigr)" />。水平线与图象求交的方法与 K1 三角方程的金线 <Katex tex="y=t" /> 一致：不等式的解集边界总在等式的解处。平方：两边非负时 <Katex tex="|u|<c\iff u^2<c^2" />、<Katex tex="|u|>c\iff u^2>c^2" />（<Katex tex="c>0" />）。c 的符号未知时平方不合法 —— 见提示一。</p>

    <h3 class="sec" id="q3-pit">c 的符号与端点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不验 c 的符号就平方或套公式。</strong><Katex tex="c<0" /> 时「<Katex tex="|u|<c" />」恒无解、「<Katex tex="|u|>c" />」恒成立（绝对值非负）—— 与次1 的 <Katex tex="\Delta<0" /> 两态同型，解集只有 ℝ 与 ∅ 两个极端；而平方会破坏等价性：<Katex tex="|x|<-1" /> 无解，平方成 <Katex tex="x^2<1" /> 却有解 —— 负的 c 经平方变正。先定 c 的符号，再选方法。</li>
        <li><strong>提示二：端点开闭。</strong><Katex tex="&lt;c" /> 带端点开、<Katex tex="\le c" /> 带端点闭 —— 端点处恰取等 <Katex tex="|u|=c" />，与 Y4 的端点归属同一检验。</li>
        <li><strong>提示三：分段忘求交。</strong>双绝对值每段解出的一次不等式，其解必须落回该段才算有效 —— 段外的解是展开式不成立处混入的假解。</li>
      </ul>
    </div>
    <p>距离、换元、分段、图象四条通路至此齐备；解不等式的工具箱还缺证明不等式的核心定理 —— 下一子专题的基本不等式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAD } from '../../../boards/inequalities/quad/absdist.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
