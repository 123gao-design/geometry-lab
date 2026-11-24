<template>
  <div>
    <div class="chapter-head">
      <h1>圆锥曲线专题</h1>
      <p class="sub">解析几何的核心内容。当前上线六个子专题：<strong>定义与标准方程</strong>（数形结合 · 5 章 · 9 块画板）、<strong>光学性质与切线</strong>（4 章 · 4 块画板）、<strong>仿射变换看圆锥曲线</strong>（6 章 · 6 块画板）、<strong>参数方程与轨迹</strong>（5 章 · 7 块画板）、<strong>直线与圆锥曲线</strong>（联立与判别式 · 5 章 · 5 块画板）与<strong>极点极线与配极理论</strong>（射影几何视角 · 8 章 · 18 块画板），共 33 章 · 49 块画板。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 33 章</div>
    </div>

    <h3 class="sec">子专题一 · 圆锥曲线的定义与标准方程（数形结合）<span class="prog">已读 {{ cnt(defs, '/conics/def') }}/{{ defs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in defs" :key="i" class="topic-card" :to="'/conics/def' + (i + 1)">
        <span class="tag">D{{ i + 1 }}</span><span v-if="isRead('/conics/def' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 光学性质与切线（反射定律视角）<span class="prog">已读 {{ cnt(opts, '/conics/opt') }}/{{ opts.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in opts" :key="i" class="topic-card" :to="'/conics/opt' + (i + 1)">
        <span class="tag">T{{ i + 1 }}</span><span v-if="isRead('/conics/opt' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 仿射变换看圆锥曲线（把圆压扁）<span class="prog">已读 {{ cnt(affs, '/conics/aff') }}/{{ affs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in affs" :key="i" class="topic-card" :to="'/conics/aff' + (i + 1)">
        <span class="tag">A{{ i + 1 }}</span><span v-if="isRead('/conics/aff' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 参数方程与轨迹（让点跑起来）<span class="prog">已读 {{ cnt(pars, '/conics/par') }}/{{ pars.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in pars" :key="i" class="topic-card" :to="'/conics/par' + (i + 1)">
        <span class="tag">P{{ i + 1 }}</span><span v-if="isRead('/conics/par' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 直线与圆锥曲线（联立与判别式）<span class="prog">已读 {{ cnt(lins, '/conics/lin') }}/{{ lins.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in lins" :key="i" class="topic-card" :to="'/conics/lin' + (i + 1)">
        <span class="tag">L{{ i + 1 }}</span><span v-if="isRead('/conics/lin' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 极点极线与配极理论（射影几何视角）<span class="prog">已读 {{ cnt(chs, '/conics/ch') }}/{{ chs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in chs" :key="i" class="topic-card" :to="'/conics/ch' + (i + 1)">
        <span class="tag">§{{ i + 1 }}</span><span v-if="isRead('/conics/ch' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
const chs = [
  { t: '无穷远点与消点', d: '从照片中的消点出发，用齐次坐标写出两条平行线的交点。' },
  { t: '交叉比与调和点列', d: '用交叉比证明内外分、共轭的唯一性与中点性质，再把点列投成线束。' },
  { t: '完全四边形与调和构造', d: '用对边求交构造调和点列，观察对角三角形的极点与极线。' },
  { t: '极点与极线', d: '从二次项的结构证明调和共轭点共线，进而求切点弦和切线。' },
  { t: '配极原则与齐次坐标', d: '把共线换成共点，用一个矩阵比较椭圆、双曲线与抛物线。' },
  { t: 'Pascal 与 Brianchon', d: '用同一组六点对照 Pascal 线和 Brianchon 点，观察切线极限与无穷远构型。' },
  { t: 'Pascal 与 Brianchon 的自对偶推广', d: '把内接、共线、共点、外切连成一条等价链，用弦方程和多项式推导，并观察共轭圆锥曲线的切线包络。' },
  { t: '用配极解定点与轨迹题', d: '由椭圆切点弦找定点，反求切线交点的轨迹，再用焦点弦推出抛物线的准线与直角。' },
];
const defs = [
  { t: '椭圆 · 距离之和', d: '一根绳子两颗图钉：$|PF_1|+|PF_2|=2a$；两次平方推出标准方程，半路捡到焦半径公式。' },
  { t: '双曲线 · 距离之差', d: '和改成差，曲线裂成两支；$\\bigl||PF_1|-|PF_2|\\bigr|=2a$，渐近线是它伸向无穷的切线。' },
  { t: '抛物线 · 等距平衡', d: '一个焦点一条准线，$|PF|=d(P,l)$；只平方一次就得到 $y^2=2px$。' },
  { t: '统一定义 · 离心率', d: '|PF| / d(P, l) = e：拖滑块连续变形；三曲线同屏对比与 e 塑形（圆的极限、特征矩形）。' },
  { t: '第三定义 · 焦点三角形', d: '斜率之积 $\\pm b^2/a^2$；焦点三角形面积 $b^2\\cdot\\tan(\\theta/2)$ —— 余弦定理两行证完。' },
];
const opts = [
  { t: '切线 · 四种求法', d: '判别式、求导、偏导（梯度）、极线公式四法同归；切线速查表 —— 光学性质的工具箱。' },
  { t: '椭圆 · 聚光', d: '从 F₁ 射出的光必进 F₂；光脉冲动画 + 外角平分线定理逆定理两行证明。' },
  { t: '抛物线 · 平行光', d: '卫星锅的几何原理；一个二倍角恒等式看懂"平行光 ⇄ 焦点"。' },
  { t: '双曲线 · 虚焦点', d: '反向延长线过另一焦点；卡塞格林望远镜把抛物线与双曲线一次用全。' },
];
const affs = [
  { t: '伸缩变换 · 不变清单', d: 'T_k: (x,y)→(x,ky) 把圆压成椭圆；相切、平行、中点、面积比全都不变 —— 切线速查表是圆的抄写。' },
  { t: '垂径定理 → 点差法', d: '平行弦中点共线：圆里垂直（$-1$），压扁后 $-b^2/a^2$ —— 点差法就是垂径定理的仿射遗言。' },
  { t: '面积 πab · 割圆术', d: '刘徽割圆 $\\pi a^2$，压扁后极限原样平移 $\\to\\pi ab$；仿射秒证内接平行四边形与最大三角形。' },
  { t: '双曲线 · 反比例母本', d: '一切中心双曲线都是 $y=k/x$ 的仿射像：矩形变平行四边形、坐标轴变渐近线；等轴 $\\iff e=\\sqrt 2\\iff$ 相似。' },
  { t: '对勾函数 · 剪切来源', d: '$y=ax+b/x$ 是 $y=k/x$ 的剪切像：渐近线 $x=0$ 与 $y=ax$；离心率 $e=\\sec(\\psi/2)$ 只看倾角 a、与 b 无关 —— 均值不等式与解析几何在此结合。' },
  { t: '一般二次方程 · 移轴转轴', d: '$Ax^2+Bxy+Cy^2+Dx+Ey+F=0$ 的考古步骤：判型（$B^2-4AC$）→ 移轴 → 转轴，转轴后的新系数恰是特征值 $\\lambda_\\pm$；对勾函数的 $e\\approx 1.082$ 在此逐项核验。' },
];
const pars = [
  { t: '参数方程 · 三曲线', d: 'P = (a cos t, b sin t) 的 t 是离心角不是极角；双曲线的 t 是圆外的割线与切线，抛物线的 t 是时间（1:3:5:7）。' },
  { t: '轨迹与包络 · 交轨法', d: '两条被 $k_1k_2=K$ 拴住的直线，交点现场画出椭圆 / 双曲线 / 圆；杆子问题与卡当椭圆。' },
  { t: '焦点弦 · 通径', d: '$L=2ed/(1-e^2\\cos^2\\theta)$：通径在焦点位于弦内时最短；比较以弦为直径的圆与准线。' },
  { t: '极坐标方程 · 焦点为极点', d: '$\\rho=ed/(1-e\\cos\\theta)$ 一式管三曲线：顶点、通径 $2ed$、倒数和 $1/\\rho_1+1/\\rho_2=2/(ed)$ 一次成型，P3 的焦点弦长公式在此复发。' },
  { t: '蒙日圆 · 垂直切线', d: '两条互相垂直的切线，交点恒在 $x^2+y^2=a^2+b^2$ 上；抛物线版交点跑出准线，双曲线版要求 $a>b$ —— 等轴双曲线一对都没有。' },
];
const lins = [
  { t: '判别式一览', d: '相交 / 相切 / 相离一表判定，外加判别式失效的第四态：平行渐近线、平行对称轴 —— 「只有一个公共点」⇏ 相切。' },
  { t: '韦达定理 · 弦长公式', d: '对称多项式整包取根：$L=\\sqrt{1+k^2}\\cdot\\sqrt\\Delta/|A|$，弦长、中点、面积全免求根；$k_{chord}\\cdot k_{OM}=-b^2/a^2$ 实时验证。' },
  { t: '点位 · 极线三身份', d: '$F(M)$ 符号直接判定内外 ↔ 切线条数 0/1/2；极线一式三用：切点弦、切线、配极接口 —— 串联全站六条主线。' },
  { t: '曲线系 · 编制一族', d: '$f+\\lambda g=0$ 恒过公共点，$\\lambda^*=-f(P_0)/\\ell(P_0)$ 一步选出过定点的成员；共渐近线族与共焦点族的编制手册。' },
  { t: '定点 · 定值 · 最值', d: '大题三宝逐条拆解：斜率积 $k_1k_2=K$ 的弦恒过定点（K 取三档恰是顶点、中心、焦点），定值对偶阅读，最值三条方法。' },
];
// 阅读进度角标：模板里的函数调用会建立对 READ.set 的响应式依赖，标记后自动刷新
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/conics/')).length;
</script>
