<template>
  <ChPage :cur="3" no="G3" base="/functions/g" :chapters="G_CHAPTERS"
    title="变换顺序与由图反演" sub="$f(ax\pm b)$ 一律先提因子；先移后压与先压后移顺序可换、平移量必换算 —— 由图反演则反过来：从特殊点读参数，把图象翻译回解析式。"
    :toc="[{ id: 'g3-fact', t: '提因子纪律（图 G3）' }, { id: 'g3-order', t: '顺序可换、平移量必换算' }, { id: 'g3-detect', t: '由图反演：读图三步' }]">
    <div class="note good" id="g3-fact"><strong>提因子纪律</strong>：<Katex tex="f(ax+b)=f\!\left(a\left(x+\dfrac{b}{a}\right)\right)" /> —— 括号里的加法必须先提因子再读：真正的平移量是 <Katex tex="\dfrac{b}{a}" />，不是 b。复合变换 <Katex tex="y=b\,f(a(x-h))+k" /> 的读法拆解：括号内管横（先右移 h、再压到 <Katex tex="\dfrac{1}{a}" />），括号外管竖（纵缩 b 倍、再上移 k）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createOrder" />
      <div class="cap">图 G3 · <b>变换的先后顺序</b>：模式一「顺序对比」—— 金线是提因子后的正确读法、红虚线是把 h 直接当平移量的误读，两个起笔点 (h,k) 与 <Katex tex="(h/a,\,k)"/> 直接分离；模式二「由图反演」—— 出题按钮发一条金目标曲线，拖 a、h、b、k 把橙线贴上去，最大偏差小于 0.06 即求解。</div>
    </div>

    <h3 class="sec" id="g3-fact">提因子纪律</h3>
    <p>经典易错现场：<Katex tex="y=f(2x-2)" /> 右移多少？把「−2」直接读成右移 2 就错了 —— <Katex tex="2x-2=2(x-1)" />，真平移量是 1。误读线与正确线在图 G3 模式一同框：起笔点一个在 1、一个在 2（h=1、a=2 时），一眼见高下。判据只有一条：<strong>平移量必须从「x 的完整代数式」里读</strong>，括号里不是单独的 x，就得先把 a 提出去。提完因子，G1 的定理原样适用。</p>
    <p>为什么提因子是合法的？因为复合本身就是分步：<Katex tex="f(2x-2)" /> 可以是「先把图象右移 2 得 <Katex tex="f(x-2)" />，再横向压一半」，也可以是「先压一半得 <Katex tex="f(2x)" />，再右移 1 得 <Katex tex="f(2(x-1))" />」—— 两条流程终点相同。但注意平移量需换算：先移后压要移 2，先压后移只移 1（被压回一半）。</p>

    <h3 class="sec" id="g3-order">顺序可换、平移量必换算</h3>
    <p>两类横向变换之间（压与移），<strong>顺序可交换，但平移量必须换算</strong>：<Katex tex="\dfrac{h}{a}" /> 是换算系数。横与竖之间则天然互不干扰（输入端与输出端各自记录），先竖后横与先横后竖结果相同且无需换算 —— <Katex tex="f(2x)+3" /> 无论先压后升还是先升后压都一样。真正不可交换的，是「压与移」换算错误：那不是顺序错了，是<strong>没提因子</strong>。图 G3 的红虚线就是这一换算错误的图象化。</p>

    <h3 class="sec" id="g3-detect">由图反演：读图三步</h3>
    <p>由式作图走 G1→G2→G3 的正向流程；由图反演走回来，步骤固定：<strong>① 特殊点定位</strong> —— 起笔点/顶点/渐近线给出 (h,k)（原图特征点移到哪儿，h、k 就在哪儿）；<strong>② 特征点定缩放</strong> —— 找原图上第二个已知点（如 <Katex tex="\sqrt{x}"/> 的 (1,1)），它的像给出 <Katex tex="(h+\dfrac{1}{a},\ k+b)" />，解出 a、b；<strong>③ 形状复核</strong> —— 单调走向、开口、渐近线与所读参数自洽，防粗心。图 G3 模式二把这个流程做成反向求解练习：金线藏参数，橙线对答案 —— 起笔点一对上，参数就确定了一半。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：f(2x−2) 右移 2。</strong>提因子后是右移 1 —— 全章最大的易错点，模式一的红虚线专治它。</li>
        <li><strong>提示二：以为「先压再移」与「先移再压」结果不同。</strong>结果相同，只是平移量差 a 倍 —— 说「结果不同」时其实是有一边忘了换算。</li>
        <li><strong>提示三：反演只对一个点。</strong>一个特殊点只给两个方程，四参数至少要两个点 —— 用第二个特征点锁缩放，再用形状复核兜底。</li>
      </ul>
    </div>
    <p>回收与预告：G1 的平移、G2 的伸缩在此合并成完整流程；S5「由一半写另一半」是反演的对称版本；R 系列由零点反推参数是反演在方程方向的应用。函数模块的图象方法至此完整 —— V 系列将把「读图」升级成「读变化率」：切线与极值的判定方法，都从本章的图象语言展开。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOrder } from '../../../boards/functions/transforms/orderlab.js';
import { G_CHAPTERS } from './gnav.js';
</script>
