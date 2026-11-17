<template>
  <div>
    <div class="chapter-head">
      <h1>函数与微积分初步</h1>
      <p class="sub">从"y 随 x 变"到对应说、从静态图象到瞬时变化率：六大子专题共 <strong>35 章</strong>，导数作为工具贯穿单调性、零点迭代与极值双证，泰勒展开与积分作大学下放的拓展收尾。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 35 章（顶栏「速查」收录 35 章定理总表）</div>
    </div>

    <h3 class="sec">子专题一 · 从映射到函数（对应观点的基础）<span class="prog">已读 {{ cnt(cs, '/functions/c') }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="'/functions/c' + (i + 1)">
        <span class="tag">C{{ i + 1 }}</span><span v-if="isRead('/functions/c' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 函数的基本性质<span class="prog">已读 {{ cnt(ss, '/functions/s') }}/{{ ss.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ss" :key="i" class="topic-card" :to="'/functions/s' + (i + 1)">
        <span class="tag">S{{ i + 1 }}</span><span v-if="isRead('/functions/s' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 零点与存在性定理<span class="prog">已读 {{ cnt(rs, '/functions/r') }}/{{ rs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rs" :key="i" class="topic-card" :to="'/functions/r' + (i + 1)">
        <span class="tag">R{{ i + 1 }}</span><span v-if="isRead('/functions/r' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 基本初等函数<span class="prog">已读 {{ cnt(es, '/functions/e') }}/{{ es.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in es" :key="i" class="topic-card" :to="'/functions/e' + (i + 1)">
        <span class="tag">E{{ i + 1 }}</span><span v-if="isRead('/functions/e' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 图象变换<span class="prog">已读 {{ cnt(gs, '/functions/g') }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="'/functions/g' + (i + 1)">
        <span class="tag">G{{ i + 1 }}</span><span v-if="isRead('/functions/g' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 变化率与导数<span class="prog">已读 {{ cnt(vs, '/functions/v') }}/{{ vs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in vs" :key="i" class="topic-card" :to="'/functions/v' + (i + 1)">
        <span class="tag">V{{ i + 1 }}</span><span v-if="isRead('/functions/v' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 函数方程（<Katex tex="f(x+y)=f(x)+f(y)" /> 一类）把条件写在自变量之间，解出来往往是线性或指数型；② 反函数与复合把「机器」倒着开，指对互逆是第一个实例；③ 数列是定义域为整数集的函数，等差与等比即线性与指数在格点上的样子；④ 优化问题（成本、面积、利润）写成单变量或双变量函数的最值，后者要拉格朗日乘子；⑤ 凸函数与琴生不等式把「凹凸性」从图象性质变成可用的不等式。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
const cs = [
  { t: '映射与函数', d: '一对一、多对一、一对多、缺像四种对应逐一检验：函数的定义要求 —— 一个输入只对应一个输出。' },
  { t: '三要素与同一函数', d: '定义域 + 化简后法则 = 判定依据；字母伪装、化简伪装、半域伪装三大陷阱；值域为何不能当判据。' },
  { t: '定义域与值域', d: '自然定义域的限制清单（分母/根号/对数）与求值域的方法阶梯：观察、配方、反解 —— 扫描机现场验证。' },
  { t: '分段函数与表示法', d: '邮资的跳变、个税的折线衔接、|x−1| 的解析分段：分段点实心/空心由开闭决定，单值性在分段处复发。' },
  { t: '机器观与位移', d: 'f(x)+h 竖着走、f(x+h) 横着走：输出端升降机 vs 输入端传送带，「左加右减」的代数真相。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const ss = [
  { t: '单调性：增减的规则', d: '任取 $x_1<x_2$ 比大小：两点抽查、跨缺口陷阱、作差法证明模板 —— 定义口径的单调。' },
  { t: '单调性与导数', d: 'f′ 的符号是增减的判据：f 与 f′ 双面板同框、曲线按符号染色 —— 导数第一次入场。' },
  { t: '奇偶性：镜像折叠', d: '把 x>0 的半张图折过去：沿 y 轴折拢验偶、绕原点转半圈验奇 —— 定义域不对称直接排除。' },
  { t: '有界性与最值', d: '拖一面金墙 M 拦图象：拦得住是界、取得到才是最值 —— 开区间有界无最值的例子。' },
  { t: '对称性专题：抽象式与翻译', d: 'f(a+x)=f(b−x) 译出对称轴、f(a+x)+f(b−x)=0 译出中心；由一半写另一半的代入翻译术。' },
  { t: '周期性专题：平移重合', d: 'f(x+T)=f(x) 的平移验收；两条轴推周期 T=2d、轴心推周期 T=4d；周期延拓由一段生成全轴。' },
  { t: '性质综合阅读', d: '单调染色、奇偶镜像、周期平移、确界线四开关 —— 一条曲线四项检验的完整阅读流程。' },
];
const rs = [
  { t: '零点：三种说法，一个数', d: 'f(c)=0、方程的根、交点横坐标 —— 三语言同认一个数；无理根探针拖不上、二重零点使符号检查失效。' },
  { t: '存在性定理：端点异号', d: '连续 + $f(a)f(b)<0 \\Rightarrow$ 必有零点：不给位置不给个数；同号也有零点（充分不必要）、跳变反例现场；唯一性另请单调。' },
  { t: '二分法：对半缩区间', d: '中点判定留变号半区，双栏显微镜放大当前区间；误差每步减半、步数按对数增长 —— 不挑函数不需求导。' },
  { t: '牛顿法与弦截：切线一步到位', d: '$x_{n+1}=x_n-f(x_n)/f\'(x_n)$：切线迭代误差平方级缩小；弦截免导数；循环反例展示失效情形 —— 导数的第二处应用。' },
];
const es = [
  { t: '一次函数：斜率与截距', d: 'k 定坡向、b 管平移；$f\'\\equiv k$ 是导数世界最平凡的成员 —— 斜率三角形拖到哪儿都一个坡。' },
  { t: '二次函数：区间最值与根的分布', d: '区间最值：顶点在区间内则顶点定一头、否则近端点定那一头，另一头归距轴远者；根的分布：Δ、对称轴、端点 a·f(k) 三项判据定根的位置 —— 定轴动区间、动轴定区间、根分布三态同验。' },
  { t: '幂函数：α 曲线族', d: '一个 α 走遍抛物线、直线、根式、常数、双曲线五种类型；全族恒过 (1,1)，负底数开不出偶次方是首要限制。' },
  { t: '指数函数：增速由底数定', d: '增长率与函数值成正比：$f\'=\\ln a\\cdot a^x$ —— 曲线越高增长率越大；$2^{10}=1024$ 远超幂函数，$a=1$ 直接排除。' },
  { t: '对数函数：增速递减', d: '增长无上界、增速一直减小（f′ 递减）；慢过一切正幂，把天文数字压成对数尺度。' },
  { t: '指与对：互为反演', d: '同底成对关于 y=x 对折重合：定义域值域互换、单调同号、恒过点对调 —— 坐标对调的几何全书。' },
  { t: '对勾函数：一形两证', d: '$ax+b/x$ 的顶点 $(\\sqrt{b/a},\\ 2\\sqrt{ab})$：导数与均值不等式两路得出同一结果；判根 $\\Delta=c^2-4ab$ 与 R 系列相互核验。' },
  { t: '绝对值嵌套：三种折叠', d: '|f| 沿 x 轴翻上（零点不变）、f(|x|) 沿 y 轴折拢（必偶、零点可翻倍）—— 折叠滑块逐层变形。' },
];
const gs = [
  { t: '平移：左加右减的代数原理', d: '横移加括号里、竖移加括号外 —— 「左加右减」是输入端的补偿方向；探针 $P\\to P\'$ 把 $(h,k)$ 画成看得见的平移向量。' },
  { t: '伸缩与翻折：横除纵乘', d: '$f(ax)$ 横向压到 $1/a$、$b\\cdot f(x)$ 纵向拉到 b 倍；符号管镜像、绝对值管幅度 —— a 滑块拖过 0 曲线直接翻边。' },
  { t: '变换顺序与由图反演', d: '$f(ax\\pm b)$ 一律先提因子：$f(2x-2)$ 右移 1 不是 2 —— 误读线与正确线起笔点直接分离；由图反演把读图三步做成求解练习。' },
];
const vs = [
  { t: '割线与切线：导数的诞生', d: '平均变化率的极限就是瞬时变化率：割线斜率趋于切线斜率，Δx=0 直接排除；常见函数用定义逐个推出 —— 从头到尾没有除以 0。' },
  { t: '运算法则：增量的记录', d: '面积增量板把 $(uv)\'$ 推出来：三块增量各归各项，红角二阶小量在极限中消去 —— 法则有几何来源，不必死背。' },
  { t: '极值与最值：导数的判定', d: '$f\'=0$ 只是入围、变号才是判据；闭区间最值 = 驻点 $\\cup$ 端点候选逐一比较 —— $x^3$ 的驻点直接排除。' },
  { t: '凹凸性与切线放缩', d: '$f\'\'$ 读弯向：下凸把切线踩脚下、上凸被切线盖住；$e^x\\ge x+1$ 等经典放缩的区间版 —— 出凹凸区间直接失效。' },
  { t: '参数综合：大题工作流', d: '$f=x^3-3tx$ 的 t 扫过 0：极值相遇、零点个数改变，临界类单独成列 —— 分类讨论四步流程实时演示。' },
  { t: '泰勒展开：从拟合到 e', d: '多项式在 0 处逐阶匹配导数：$P_n$ 一项项逼近 $e^x$；$e=\\sum 1/k!=\\lim(1+1/n)^n$ 两种表达相互印证，常用麦克劳林展开速查。' },
  { t: '从求和到积分：n² 到 x²', d: '平方和公式 ÷$n^3$ 铺回 [0,1]：金字塔变矩形和，$R_n=1/3+1/(2n)+1/(6n^2)\\to 1/3$ —— 积分由求和的极限导出。' },
  { t: '积分初步：黎曼与基本定理', d: '矩形累加趋于曲边面积（n 加倍误差减半）；$F\'=f$ 让求面积变成求导逆题 —— 为大学微积分作预备。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/functions/')).length;
</script>
