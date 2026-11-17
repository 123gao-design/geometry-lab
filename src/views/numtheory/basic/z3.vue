<template>
  <ChPage :cur="3" no="整3" base="/numtheory/z" :chapters="Z_CHAPTERS"
    title="同余"
    sub="两个整数除以同一个模，余数相同，就说它们同余。这个说法把「相差整数个模」写成一条短记号，四则运算在其中照常进行，数轴上的情形则缩成一只表盘。"
    :toc="[{ id: 'z3-def', t: '同余的定义' }, { id: 'z3-equiv', t: '同余是等价关系' }, { id: 'z3-op', t: '同余式的运算' }, { id: 'z3-class', t: '剩余类与完全剩余系' }, { id: 'z3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="m" /> 是正整数。若 <Katex tex="m\mid (a-b)" />，称 <Katex tex="a" /> 与 <Katex tex="b" /> 对模 <Katex tex="m" /> 同余，记作
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="a\equiv b\ (\mathrm{mod}\ m)." /></p>
      等价的说法是：<Katex tex="a" /> 与 <Katex tex="b" /> 除以 <Katex tex="m" /> 的余数相同。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCong" />
      <div class="cap">图 整3 · <b>同余</b>：模 <Katex tex="m" /> 的表盘上只有 <Katex tex="m" /> 个刻度，数字 <Katex tex="a" />、<Katex tex="b" /> 各落一格。看点：① 两枚指针落在同一刻度时 <Katex tex="a\equiv b" />，落不到一起就不同余；② 右栏把两数分别写成 <Katex tex="mq+r" />，可以看到同余与「余数相等」是同一件事；③ 拖动 <Katex tex="a" /> 走过一圈，它会回到原来的刻度，这正是同余的周期性。</div>
    </div>

    <h3 class="sec" id="z3-def">同余的定义</h3>
    <p>同余只是带余除法的一种简写。把 <Katex tex="a" /> 与 <Katex tex="b" /> 各除以 <Katex tex="m" />：</p>
    <p style="text-align:center"><Katex display tex="a=mq_1+r_1,\qquad b=mq_2+r_2." /></p>
    <p>若 <Katex tex="r_1=r_2" />，则 <Katex tex="a-b=m(q_1-q_2)" /> 是 <Katex tex="m" /> 的倍数；反过来，若 <Katex tex="a-b" /> 是 <Katex tex="m" /> 的倍数，由余数的唯一性也能推出 <Katex tex="r_1=r_2" />。所以下面三种说法完全等价：</p>
    <ul>
      <li><Katex tex="a\equiv b\ (\mathrm{mod}\ m)" />；</li>
      <li><Katex tex="m\mid(a-b)" />；</li>
      <li><Katex tex="a" /> 与 <Katex tex="b" /> 除以 <Katex tex="m" /> 的余数相同。</li>
    </ul>
    <p>记号里的 <Katex tex="(\mathrm{mod}\ m)" /> 是句子的一部分，不是一个运算。<Katex tex="a\equiv b\ (\mathrm{mod}\ m)" /> 是一个命题，能判断真假；写成 <Katex tex="a\bmod m" /> 才是余数这个数，等于 <Katex tex="[0,m)" /> 中的某个整数。两者别混用。</p>
    <p>举几个例子：<Katex tex="47\equiv 5\ (\mathrm{mod}\ 7)" />，因为 <Katex tex="47-5=42=6\times7" />；<Katex tex="-1\equiv 11\ (\mathrm{mod}\ 12)" />，因为 <Katex tex="-1" /> 与 <Katex tex="11" /> 除以 <Katex tex="12" /> 的余数都是 <Katex tex="11" />；<Katex tex="100\equiv0\ (\mathrm{mod}\ 10)" />，个位为零的数都被 <Katex tex="10" /> 整除。</p>

    <h3 class="sec" id="z3-equiv">同余是等价关系</h3>
    <p>对固定的模 <Katex tex="m" />，同余满足三条：</p>
    <ul>
      <li><b>自反</b>：<Katex tex="a\equiv a" />，因为 <Katex tex="m\mid0" />。</li>
      <li><b>对称</b>：<Katex tex="a\equiv b" /> 则 <Katex tex="b\equiv a" />，因为 <Katex tex="m\mid(a-b)" /> 与 <Katex tex="m\mid(b-a)" /> 是一回事。</li>
      <li><b>传递</b>：<Katex tex="a\equiv b" /> 且 <Katex tex="b\equiv c" />，则 <Katex tex="a\equiv c" />，因为 <Katex tex="a-c=(a-b)+(b-c)" /> 是两个倍数之和。</li>
    </ul>
    <p>满足这三条的关系叫等价关系，它把集合分成互不相交的类。模 <Katex tex="m" /> 的同余把整数分成 <Katex tex="m" /> 类，每类是一个剩余类。表盘上的每一个刻度就是一类：指针指到哪里，就说明这个数属于哪一类。</p>
    <p>用类来想，同余就变成了一种「投影」：先把整数投影到 <Katex tex="m" /> 个刻度上，再在刻度之间做运算。投影会丢掉信息——商被丢掉了，只剩余数——但丢掉的恰好是与整除、周期性无关的部分。</p>

    <h3 class="sec" id="z3-op">同余式的运算</h3>
    <p>同余式可以像等式一样相加、相减、相乘。若 <Katex tex="a\equiv b" />、<Katex tex="c\equiv d" />，则</p>
    <p style="text-align:center"><Katex display tex="a+c\equiv b+d,\qquad a-c\equiv b-d,\qquad ac\equiv bd\ (\mathrm{mod}\ m)." /></p>
    <p>证明只需把差写出来：<Katex tex="(a+c)-(b+d)=(a-b)+(c-d)" /> 是两个倍数之和；乘积的情形写成 <Katex tex="ac-bd=(a-b)c+b(c-d)" />，同样能被 <Katex tex="m" /> 整除。由乘法可以推得 <Katex tex="a^k\equiv b^k" />，这是快速幂与费马小定理的基础。</p>
    <p>加、减、乘都通行，<b>除法不通行</b>。由 <Katex tex="ac\equiv bc" /> 不能直接约去 <Katex tex="c" /> 得到 <Katex tex="a\equiv b" />。<Katex tex="2\times3\equiv2\times0\ (\mathrm{mod}\ 6)" /> 成立，但 <Katex tex="3\not\equiv0\ (\mathrm{mod}\ 6)" />。约分的条件是 <Katex tex="\gcd(c,m)=1" />：此时 <Katex tex="c" /> 在模 <Katex tex="m" /> 下有逆元，两边同乘逆元即可。若 <Katex tex="c" /> 与 <Katex tex="m" /> 有公因子 <Katex tex="d" />，约去 <Katex tex="c" /> 的同时模也要除以 <Katex tex="d" />：</p>
    <p style="text-align:center"><Katex display tex="ac\equiv bc\ (\mathrm{mod}\ m)\ \Longrightarrow\ a\equiv b\ \left(\mathrm{mod}\ \frac{m}{d}\right),\qquad d=\gcd(c,m)." /></p>
    <p>模变小了，这恰恰说明信息有损失：原本可能在模 <Katex tex="m" /> 下不同的两个数，约分后落到同一类里。</p>

    <h3 class="sec" id="z3-class">剩余类与完全剩余系</h3>
    <p>模 <Katex tex="m" /> 的每个剩余类里取一个代表，凑成的 <Katex tex="m" /> 个数叫<b>完全剩余系</b>。<Katex tex="0,1,\dots,m-1" /> 是最常用的一组；<Katex tex="1,2,\dots,m" /> 也是；奇偶、正负交错地取也可以，只要每类恰有一个。</p>
    <p>完全剩余系的好处是：任何整数都与其中恰好一个数同余。所以「对任意整数成立」的命题，可以只对这 <Katex tex="m" /> 个代表检验。模 <Katex tex="3" /> 时只需检验 <Katex tex="0,1,2" /> 三种情形，模 <Katex tex="4" /> 时检验四种，证明的长度因此固定下来，与数的大小无关。</p>
    <p>还有一类常用的剩余系：只取与 <Katex tex="m" /> 互素的那些余数，叫<b>简化剩余系</b>，它的个数就是欧拉函数 <Katex tex="\varphi(m)" />。模 <Katex tex="12" /> 时，<Katex tex="1,5,7,11" /> 这四类与 <Katex tex="12" /> 互素，<Katex tex="\varphi(12)=4" />。这个函数与欧拉定理在后面还会回来。</p>

    <h3 class="sec" id="z3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\equiv" /> 是命题，<Katex tex="\bmod" /> 是数。</strong><Katex tex="a\equiv b\ (\mathrm{mod}\ m)" /> 的真假只有两种；<Katex tex="a\bmod m" /> 才是落在 <Katex tex="[0,m)" /> 里的余数，可以参与进一步的算术。</li>
        <li><strong>提示二：不能随手约去公因子。</strong><Katex tex="2\times3\equiv2\times0\ (\mathrm{mod}\ 6)" /> 成立，<Katex tex="3\equiv0\ (\mathrm{mod}\ 6)" /> 却不成立。能约的条件是公因子与模互素；不互素时模也要同除公因子。</li>
        <li><strong>提示三：模不能为负或零。</strong>同余理论里模一律取正整数。写 <Katex tex="\mathrm{mod}\ -7" /> 不会带来新内容，只会让余数的区间约定混乱。</li>
        <li><strong>提示四：负数的余数按「向负无穷取整」算。</strong><Katex tex="-1\bmod 12=11" />，不是 <Katex tex="-1" />。取一个完全剩余系时也要遵守这条，否则会漏掉一类。</li>
      </ul>
    </div>
    <p>回收与预告：同余式能加能乘，那么含未知数的同余式——<Katex tex="ax\equiv b\ (\mathrm{mod}\ m)" />——怎样求解，解有几个，这些就是下一章的内容。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCong } from '../../../boards/numtheory/basic/conglab.js';
import { Z_CHAPTERS } from './znav.js';
</script>
