<template>
  <ChPage :cur="3" no="O3" base="/sets/o" :chapters="O_CHAPTERS"
    title="四种命题：互为逆否" sub="把「若 $p$ 则 $q$」的条件与结论交换、否定、又换又否，得到逆命题、否命题、逆否命题。四个命题两两配对：原命题与逆否命题永远同真假，逆命题与否命题永远同真假 —— 原因只有一个组合：$p\to q$ 唯一为假处是「$p$ 真而 $q$ 假」，逆否命题恰好倒在同一格。"
    :toc="[{ id: 'o3-four', t: '四种命题' }, { id: 'o3-proof', t: '逆否等价的证明' }, { id: 'o3-use', t: '应用：改证逆否' }, { id: 'o3-pit', t: '真假的错位' }]">
    <div class="note good" id="o3-law">原命题 <Katex tex="p\Rightarrow q" />、逆命题 <Katex tex="q\Rightarrow p" />、否命题 <Katex tex="\neg p\Rightarrow\neg q" />、逆否命题 <Katex tex="\neg q\Rightarrow\neg p" />。等价关系：<Katex tex="p\Rightarrow q\iff\neg q\Rightarrow\neg p" />、<Katex tex="q\Rightarrow p\iff\neg p\Rightarrow\neg q" /> —— 互为逆否，同真同假。</div>
    <ConicFigure number="O3" title="原命题与逆否命题" head="bottom" :factory="createCT">
      组合格的行表示 <Katex tex="p" /> 的真假，列表示 <Katex tex="q" /> 的真假。拖动探针或开启扫轴，金框会移到当前取值对应的一格。切到预设②，把探针拖到 <Katex tex="x=-3" />，可同时推翻原命题与逆否命题。图下四个判定针对整个实数域。
    </ConicFigure>

    <h3 class="sec" id="o3-four">四种命题</h3>
    <p>以 <Katex tex="p\Rightarrow q" /> 为原命题：把条件与结论<strong>交换</strong>得逆命题 <Katex tex="q\Rightarrow p" />；把两者<strong>都否定</strong>得否命题 <Katex tex="\neg p\Rightarrow\neg q" />；既交换又否定得逆否命题 <Katex tex="\neg q\Rightarrow\neg p" />。注意对象：这一套是围绕「若…则…」型命题的改写，与<RouterLink class="xref" to="/sets/o2">量词命题的否定：真假互补</RouterLink>那种把真假反过来的「命题的否定」不是一回事。预设 ① <Katex tex="p:\ x>2,\ q:\ x>1" /> 四式中原命题与逆否命题为真，逆命题与否命题为假（<Katex tex="x=1.5" /> 是反例）；预设 ② <Katex tex="p:\ x^2>4,\ q:\ x>2" /> 恰好整体反过来 —— 两个预设合起来说明：四种命题的真假之间<strong>没有</strong>「一真带动」的关系，只有配对内部的等价。</p>

    <h3 class="sec" id="o3-proof">逆否等价的证明</h3>
    <p>枚举 <Katex tex="p" />、<Katex tex="q" /> 的全部真假组合即可。蕴含式 <Katex tex="p\Rightarrow q" /> 为假的唯一组合是「<Katex tex="p" /> 真、<Katex tex="q" /> 假」（前提成立而结论不成立）；逆否命题 <Katex tex="\neg q\Rightarrow\neg p" /> 为假的唯一组合是「<Katex tex="\neg q" /> 真而 <Katex tex="\neg p" /> 假」，翻译回 <Katex tex="p" />、<Katex tex="q" /> 就是「<Katex tex="q" /> 假、<Katex tex="p" /> 真」—— 同一个组合。两命题在完全相同的世界里为假、其余世界全为真，故永远同真假；<Katex tex="q\Rightarrow p" /> 与 <Katex tex="\neg p\Rightarrow\neg q" /> 共享「<Katex tex="q" /> 真而 <Katex tex="p" /> 假」一格，同理等价。图 O3 的 2×2 组合格把这两个「唯一假格」直接标了颜色 —— 拖动探针即可验证。</p>

    <h3 class="sec" id="o3-use">应用：改证逆否</h3>
    <p>原命题难证而逆否命题好证时，改证逆否即可。例如证「若 <Katex tex="x^2" /> 为奇数，则 <Katex tex="x" /> 为奇数」：直接分类要讨论 <Katex tex="x" /> 的各种情形，改证逆否「若 <Katex tex="x" /> 不为奇数（即为偶数），则 <Katex tex="x^2" /> 不为奇数（为偶数）」—— 设 <Katex tex="x=2k" />，则 <Katex tex="x^2=4k^2=2\cdot 2k^2" /> 是偶数，一步完成；由逆否等价，原命题成立。书写时要说明一句「改证其逆否命题」，因为结论毕竟属于原命题 —— 等价保证这一替换合法。</p>

    <h3 class="sec" id="o3-pit">真假的错位</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：原真推不出逆真。</strong>预设 ① 原命题真而逆命题假 —— 交换条件与结论不是恒等变形，真假须重新判定；「原命题成立」与「逆命题成立」是两件事。</li>
        <li><strong>提示二：否命题与命题的否定混淆。</strong>否命题 <Katex tex="\neg p\Rightarrow\neg q" /> 是四命题家族的成员，与原命题<strong>不</strong>保证同真假（预设 ② 中一真一假）；命题的否定（<RouterLink class="xref" to="/sets/o2">量词命题的否定：真假互补</RouterLink>）则必须与原命题一真一假 —— 名称相近，判据不同。</li>
        <li><strong>提示三：把「互为逆否」当口号背。</strong>等价的依据是假组合重合；遇到复合条件（如含 <Katex tex="\wedge" />、<Katex tex="\vee" /> 的 <Katex tex="p" />、<Katex tex="q" />），仍须按组合枚举确认，不能只套口诀。</li>
      </ul>
    </div>
    <p>命题 p、q 之间的推出关系 <Katex tex="p\Rightarrow q" /> 本身成为主角，就进入本模块最后一站：充分条件与必要条件 —— 集合的包含关系与逻辑的推出关系，在真值集上合流。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCT } from '../../../boards/sets/logic/contra.js';
import { O_CHAPTERS } from './onav.js';
</script>
