<template>
  <ChPage :cur="2" no="C2" base="/functions/c" :chapters="C_CHAPTERS"
    title="三要素与同一函数" sub="定义域 + 对应法则 = 判定依据；值域只是随之确定的结果。"
    :toc="[{ id: 'c2-elm', t: '三要素：真正要查的只有两样' }, { id: 'c2-same', t: '同一函数判据（图 C2）' }, { id: 'c2-trap', t: '三大伪装陷阱' }, { id: 'c2-val', t: '值域为什么不当判据' }]">
    <p>C1 的对应说里，一个函数由三样东西完全确定：<strong>定义域</strong>、<strong>对应法则</strong>、<strong>值域</strong>。三者并非平起平坐 —— 值域是由前两者算出来的（值域 = {f(x) | x∈定义域}），前两者定了，值域想变也没得变。所以"验明两个函数是否同一个"，只需要查两样：定义域，以及化简之后的对应法则。</p>
    <div class="note good" id="c2-elm"><strong>同一函数判据</strong>：两个函数是同一函数 <span class="term">(identical functions)</span>，当且仅当<strong>定义域相同</strong>且<strong>对应法则（化简后）相同</strong>。记变量的字母无关紧要 —— <Katex tex="f(x)=x^2" /> 与 <Katex tex="g(t)=t^2" /> 是同一个函数，字母只是占位符。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSameFn" />
      <div class="cap">图 C2 · <b>同一函数的判定</b>：六对函数逐一检验。实线 f 与虚线 g 完全重合 ⇔ 逐点相同 ⇔ 同一函数；一旦定义域不同（②④⑤），图象立刻出现差异 —— 短一截、缺一点、只剩半边。拖"探针 x"：探针走到 f 未定义、g 有定义的地方，f(x) 徽章直接翻红 —— 那个空心点就是被定义域挖去的点。①③⑥ 是同一函数：字母无关（①）、化简后同（③）、展开恒等（⑥）。</div>
    </div>

    <h3 class="sec" id="c2-same">三大伪装陷阱</h3>
    <p>考试从不直接问"这两个函数定义域是否相同"，而是把差异<strong>伪装</strong>起来。图 C2 的六个按钮对应三种经典伪装：</p>
    <ul>
      <li><strong>字母伪装</strong>（①⑥）：<Katex tex="x^2" /> 与 <Katex tex="t^2" />、<Katex tex="(x+1)^2" /> 与 <Katex tex="t^2+2t+1" /> —— 字母不同、写法不同，但化简后完全一致。应对：<strong>别看字母看结构</strong>。</li>
      <li><strong>化简伪装</strong>（②③）：<Katex tex="\frac{x^2}{x}" /> 看起来"约分完就是 <Katex tex="x" />"，但约分动作本身改变了定义域（<Katex tex="x=0" /> 被约掉了），所以 f 的定义域是 <Katex tex="x\ne 0" /> —— 它与 <Katex tex="g(x)=x" /> 只在 <Katex tex="x\ne 0" /> 处逐点相同，不是同一函数；反过来 <Katex tex="\sqrt{x^2}" /> 化简成 <Katex tex="|x|" /> 是恒等变形（两步都保定义域），所以 ③ 判同一。应对：<strong>先算定义域，再化简</strong>，顺序反了就会误判。</li>
      <li><strong>半域伪装</strong>（④⑤）：<Katex tex="(\sqrt{x})^2" /> 的定义域被根号限制为 <Katex tex="x\ge 0" />；<Katex tex="\lg x^2" /> 与 <Katex tex="2\lg x" /> 更隐蔽 —— 两个式子在 <Katex tex="x>0" /> 上逐点相等，但 <Katex tex="\lg x^2" /> 对负数也有定义（<Katex tex="x\ne 0" /> 即可），定义域一大一小。应对：<strong>每个运算符都有自己的"定义域限制"</strong>，下一讲把限制清单列全。</li>
    </ul>
    <div class="note warn tip" id="c2-val">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>值域不能当判据</strong>：同一函数必然同值域，但<strong>同值域推不回同一函数</strong>。<Katex tex="f(x)=x^2" /> 与 <Katex tex="g(x)=|x|" /> 值域都是 [0,∞)，对应法则却完全不同（-2 处一个给 4、一个给 2）。值域是身份的"必要不充分"侧写，面试时可以用来初筛，不能用来定案。</p>
    </div>

    <h3 class="sec" id="c2-val2">判据的完整程序</h3>
    <p>把判定流程写成三步，遇到任何"是否同一函数"的题都有固定步骤：</p>
    <p><strong>第一步</strong>，分别写出两个函数的定义域（按下一讲 C3 的限制清单）；<strong>第二步</strong>，在各自定义域上把两式化简到最简；<strong>第三步</strong>，比对：定义域相同吗？化简后的法则相同吗？两问皆是 → 同一函数；任何一问否 → 不是。图 C2 的判定徽章就是照这个程序给出结论的 —— 尤其注意 ⑤：定义域在第一步就排除了，无需化简。</p>
    <p>下一讲把"限制清单"补全：分母、根号、对数、零次幂各自把什么挡在定义域之外。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSameFn } from '../../../boards/functions/concept/samefn.js';
import { C_CHAPTERS } from './cnav.js';
</script>
