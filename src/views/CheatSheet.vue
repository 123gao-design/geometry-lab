<template>
  <div>
    <div class="chapter-head">
      <h1>定理速查总览</h1>
      <p class="sub">把二十三个模块 376 条的核心结论收进一张总表：每张卡片一条定理/判据 + 一句话用法，点进去看完整推导、易错点与实验台 —— 考前最后一遍复习用 Ctrl+P 打印（公式保留、控件不印）。</p>
      <div class="readall">二十三个模块 · 106 小节 · 376 条（集合与常用逻辑 12 + 函数与微积分初步 35 + 不等式 15 + 三角与三角形 23 + 向量与复数 17 + 数列 20 + 直线与圆 13 + 极坐标与参数方程 9 + 圆锥曲线 32 + 立体几何 10 + 组合与二项式 9 + 概率与统计 18 + 数值计算 10 + 线性代数初步 14 + 一元函数微积分 33 + 空间解析几何 12 + 多元函数微积分 18 + 复变函数 12 + 初等数论 13 + 拓扑学基础 12 + 分形几何 11 + 高等几何（射影几何） 11 + 抽象代数 17）</div>
    </div>

    <h3 class="sec">集合与常用逻辑 · 一 集合的语言</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sets/j1"><span class="tag">J1</span><h3>元素与集合</h3><p class="fx"><Katex tex="\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}" /></p><p>三性立规矩（确定、互异、无序）；0∈ℕ，22/7 只是 π 的近似。</p></router-link>
      <router-link class="topic-card" to="/sets/j2"><span class="tag">J2</span><h3>描述法三部件</h3><p class="fx"><Katex tex="A=\{x\in U\mid P(x)\}" /></p><p>代表元 + 前置集合 + 条件；三种代表元 {x|…}、{y|…}、{(x,y)|…} 别认错。</p></router-link>
    </div>

    <h3 class="sec">集合与常用逻辑 · 二 集合间的关系</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sets/x1"><span class="tag">X1</span><h3>子集判定</h3><p class="fx"><Katex tex="A\subseteq B\iff\forall x\,(x\in A\Rightarrow x\in B)" /></p><p>判定只看元素、推翻只要一个反例 —— 含参题先查空集。</p></router-link>
      <router-link class="topic-card" to="/sets/x2"><span class="tag">X2</span><h3>子集计数</h3><p class="fx"><Katex tex="2^n,\quad 2^n-1,\quad 2^n-2" /></p><p>子集 / 真子集（与非空同） / 非空真子集 —— 四口径各减各的。</p></router-link>
    </div>

    <h3 class="sec">集合与常用逻辑 · 三 集合的运算</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sets/y1"><span class="tag">Y1</span><h3>交与并</h3><p class="fx"><Katex tex="A\cap B\subseteq A\subseteq A\cup B" /></p><p>∧∨ 的集合实现；差集不交换，容斥 <Katex tex="|A\cup B|=|A|+|B|-|A\cap B|"/>。</p></router-link>
      <router-link class="topic-card" to="/sets/y2"><span class="tag">Y2</span><h3>补集与全集</h3><p class="fx"><Katex tex="A\setminus B=A\cap\complement_U B" /></p><p>先定全集再谈补集；挖去再挖去回到本身（双重否定）。</p></router-link>
      <router-link class="topic-card" to="/sets/y3"><span class="tag">Y3</span><h3>德摩根与分配</h3><p class="fx"><Katex tex="\complement_U(A\cap B)=\complement_UA\cup\complement_UB" /></p><p>补集穿过括号 ∩∪ 互换 —— 与 ¬(p∧q)=¬p∨¬q 同构。</p></router-link>
      <router-link class="topic-card" to="/sets/y4"><span class="tag">Y4</span><h3>区间运算</h3><p class="fx"><Katex tex="[a,b)\cap(c,d]=(c,b)" /></p><p>交取公共（同点开优先）、并取覆盖（都开留断口）、补对调端点开闭。</p></router-link>
    </div>

    <h3 class="sec">集合与常用逻辑 · 四 常用逻辑</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sets/o1"><span class="tag">O1</span><h3>全称与存在量词</h3><p class="fx"><Katex tex="\forall x\in M,\ p(x)" /></p><p>全称要真须证一切、要假只须一个反例；存在要真只须一个见证、要假须证无解。</p></router-link>
      <router-link class="topic-card" to="/sets/o2"><span class="tag">O2</span><h3>量词的否定</h3><p class="fx"><Katex tex="\neg(\forall x,\ p)=\exists x,\ \neg p" /></p><p>否定 = 量词翻转 + 结论取反，与原命题一真一假；量词不换必错。</p></router-link>
      <router-link class="topic-card" to="/sets/o3"><span class="tag">O3</span><h3>逆否等价</h3><p class="fx"><Katex tex="p\Rightarrow q\iff\neg q\Rightarrow\neg p" /></p><p>原 ⇔ 逆否、逆 ⇔ 否，同真同假；原命题难证时改证逆否。</p></router-link>
      <router-link class="topic-card" to="/sets/o4"><span class="tag">O4</span><h3>充要条件</h3><p class="fx"><Katex tex="A\subseteq B\iff p\Rightarrow q" /></p><p>真值集包含即推出：四类条件按 A⊆B、B⊆A 两向对号入座。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 一 任意角与弧度制</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/b1"><span class="tag">B1</span><h3>任意角与终边</h3><p class="fx"><Katex tex="\beta=\alpha+2k\pi\ (k\in\mathbb{Z})" /></p><p>终边相同差整圈 —— 判象限先减 k·360°；轴线角不属于任何象限。</p></router-link>
      <router-link class="topic-card" to="/trig/b2"><span class="tag">B2</span><h3>弧度制</h3><p class="fx"><Katex tex="s=\alpha r,\quad S=\tfrac{1}{2}\alpha r^2" /></p><p><Katex tex="\alpha"/>=弧长比半径、<Katex tex="180^\circ=\pi"/> —— 摊平直尺每格一个半径，格数即弧度数。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 二 任意角的三角函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/u1"><span class="tag">U1</span><h3>单位圆定义</h3><p class="fx"><Katex tex="P(\cos\alpha,\sin\alpha)" /></p><p>横 cos 纵 sin，tan=纵比横；一全正、二正弦、三正切、四余弦。</p></router-link>
      <router-link class="topic-card" to="/trig/u2"><span class="tag">U2</span><h3>同角关系</h3><p class="fx"><Katex tex="\sin^2\alpha+\cos^2\alpha=1,\quad 1+\tan^2\alpha=\sec^2\alpha" /></p><p>平方给绝对值、象限定符号；<Katex tex="\tan=\sin/\cos"/> 即斜率；切线三角形直译 <Katex tex="1+\tan^2\alpha=\sec^2\alpha"/>（<Katex tex="\sec^2\alpha-\tan^2\alpha=1"/> 对偶对）；倒数三函数图象一并给出 —— <Katex tex="|\sec\alpha|\ge 1"/>、cot 周期 <Katex tex="\pi"/>。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 三 诱导公式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/i1"><span class="tag">I1</span><h3>镜像五组</h3><p class="fx"><Katex tex="\sin(\pi-\alpha)=\sin\alpha,\ \cos(\pi-\alpha)=-\cos\alpha" /></p><p>旋转整圈 + 三面镜子 —— 函数名不变、符号看 β 象限；任意角两步诱导回锐角。</p></router-link>
      <router-link class="topic-card" to="/trig/i2"><span class="tag">I2</span><h3>互配两组</h3><p class="fx"><Katex tex="\sin\Bigl(\frac{\pi}{2}-\alpha\Bigr)=\cos\alpha" /></p><p>互余镜像 <Katex tex="y=x"/> 坐标对调、<Katex tex="\pi/2+\alpha"/> 转 <Katex tex="90^\circ"/>；奇变偶不变，符号看象限。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 四 图象与性质</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/w1"><span class="tag">W1</span><h3>正弦五点法</h3><p class="fx"><Katex tex="(0,0),\Bigl(\tfrac{\pi}{2},1\Bigr),(\pi,0),\Bigl(\tfrac{3\pi}{2},-1\Bigr),(2\pi,0)" /></p><p>单位圆滚动展开、纵坐标摊平成波；五点定一档「升峰降谷升」，<Katex tex="T=2\pi"/>。</p></router-link>
      <router-link class="topic-card" to="/trig/w2"><span class="tag">W2</span><h3>余弦平移等价</h3><p class="fx"><Katex tex="\cos x=\sin\Bigl(x+\tfrac{\pi}{2}\Bigr)" /></p><p>sin 左移 π/2 得 cos；五点错位半周期、偶函数关于 y 轴对称。</p></router-link>
      <router-link class="topic-card" to="/trig/w3"><span class="tag">W3</span><h3>正切断口</h3><p class="fx"><Katex tex="\tan(\pi+\alpha)=\tan\alpha,\quad x\neq\tfrac{\pi}{2}+k\pi" /></p><p>断口=竖直渐近线、断笔成支；每支 <Katex tex="-\infty\to+\infty"/> 单调升，周期 <Katex tex="\pi"/> 不是 <Katex tex="2\pi"/>。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 五 图象变换</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/f1"><span class="tag">F1</span><h3>三旋钮一览</h3><p class="fx"><Katex tex="y=A\sin(\omega x+\varphi):\ A\to[-A,A],\ T=\tfrac{2\pi}{\omega},\ x_0=-\tfrac{\varphi}{\omega}" /></p><p>A 管值域、ω 管周期、φ 管起点 —— 平移量 = <Katex tex="\varphi/\omega"/>，三个旋钮互不干扰。</p></router-link>
      <router-link class="topic-card" to="/trig/f2"><span class="tag">F2</span><h3>顺序与反演</h3><p class="fx"><Katex tex="\sin x\to\sin 2x\to\sin\bigl(2(x+\tfrac{\pi}{6})\bigr)" /></p><p>先压缩后平移 <Katex tex="\pi/6"/>、先平移后压缩 <Katex tex="\pi/3"/> —— 中间产物不同、终点相同；反演读图：峰高 A、峰距 T、升段零点 φ。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 六 和差公式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/m1"><span class="tag">M1</span><h3>和差公式全体</h3><p class="fx"><Katex tex="\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta" /></p><p>弦长两种表达式（坐标距离 vs 余弦定理）推出；sin 靠 π/2 互配换名派生、tan 相除而来 —— 分母 1−tanαtanβ=0 时排除。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 七 倍角与升降幂</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/n1"><span class="tag">N1</span><h3>倍角三形态</h3><p class="fx"><Katex tex="\sin2\alpha=2\sin\alpha\cos\alpha,\quad \cos2\alpha=2\cos^2\alpha-1" /></p><p><Katex tex="\beta=\alpha"/> 代入和差公式；内接矩形面积直译 <Katex tex="\sin 2\alpha"/> —— <Katex tex="\cos 2\alpha"/> 知谁选谁面、<Katex tex="\tan 2\alpha"/> 在 <Katex tex="\pi/4+k\pi/2"/> 无定义。</p></router-link>
      <router-link class="topic-card" to="/trig/n2"><span class="tag">N2</span><h3>降幂与半角</h3><p class="fx"><Katex tex="\sin^2\alpha=\tfrac{1-\cos2\alpha}{2},\quad \sin\tfrac{\alpha}{2}=\pm\sqrt{\tfrac{1-\cos\alpha}{2}}" /></p><p>降幂换写法不换数值、周期折半（<Katex tex="\sin^2x"/> 周期 <Katex tex="\pi"/>）；半角 <Katex tex="\pm"/> 由 <Katex tex="\alpha/2"/> 的象限判定。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 八 积化和差与辅助角</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/q1"><span class="tag">Q1</span><h3>积化和差</h3><p class="fx"><Katex tex="\sin\alpha\cos\beta=\tfrac12\bigl[\sin(\alpha+\beta)+\sin(\alpha-\beta)\bigr]" /></p><p>四个积全由和差两行加减消元读出 —— 异名积出 sin、同名积出 cos、sinsin 是差不是和。</p></router-link>
      <router-link class="topic-card" to="/trig/q2"><span class="tag">Q2</span><h3>辅助角与和差化积</h3><p class="fx"><Katex tex="a\sin x+b\cos x=\sqrt{a^2+b^2}\,\sin(x+\varphi)" /></p><p>两列波叠成一列纯 sin：R 管峰高、φ 按 (a,b) 定象限管起点；和差化积 = 积化和差的换元反演。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 九 反三角函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/h1"><span class="tag">H1</span><h3>主值区间</h3><p class="fx"><Katex tex="\arcsin x\in[-\tfrac\pi2,\tfrac\pi2],\ \arccos x\in[0,\pi],\ \arctan x\in(-\tfrac\pi2,\tfrac\pi2)" /></p><p>裁出单调段才配有反函数；定义域 [−1,1]（arctan 为 ℝ），值域即主值区间，图象关于 y=x 翻折。</p></router-link>
      <router-link class="topic-card" to="/trig/h2"><span class="tag">H2</span><h3>折叠与对偶</h3><p class="fx"><Katex tex="\sin(\arcsin x)=x,\quad \arcsin x+\arccos x=\tfrac\pi2" /></p><p>sin(arcsin x) 域内恒真；arcsin(sin θ) 出窗按镜像/整圈改判 —— 设角解三角形，对偶式一行合并。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 十 解三角形</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/z1"><span class="tag">Z1</span><h3>正弦定理</h3><p class="fx"><Katex tex="\frac{a}{\sin\alpha}=\frac{b}{\sin\beta}=\frac{c}{\sin\gamma}=2R" /></p><p>边比对角正弦恒等，常数是外接圆直径；SSA 数解：a 与 <Katex tex="h=c\cdot\sin\alpha"/> 比大小 —— 两解互补 <Katex tex="\gamma_1+\gamma_2=\pi"/>。</p></router-link>
      <router-link class="topic-card" to="/trig/z2"><span class="tag">Z2</span><h3>余弦定理</h3><p class="fx"><Katex tex="c^2=a^2+b^2-2ab\cos\gamma,\quad \cos\gamma=\tfrac{a^2+b^2-c^2}{2ab}" /></p><p>投影分解：水平分量 <Katex tex="|b-a\cos\gamma|"/>、竖直分量 <Katex tex="a\sin\gamma"/>；修正项的符号由 <Katex tex="\cos\gamma"/> 决定（锐负、直零即勾股、钝正），三边求角走 <Katex tex="\arccos"/>。</p></router-link>
      <router-link class="topic-card" to="/trig/z3"><span class="tag">Z3</span><h3>面积与范围</h3><p class="fx"><Katex tex="S=\tfrac12 ab\sin\gamma\le\tfrac12 ab,\quad b+c\le4R\cos\tfrac\alpha2" /></p><p>夹角写法 <Katex tex="\gamma=90^\circ"/> 达到最大；已知 a 与 α 先定圆（<Katex tex="R=\dfrac{a}{2\sin\alpha}"/>），S 与 <Katex tex="b+c"/> 同在等腰时最大 —— 和差化积与均值两种证法在同一点取得最大。</p></router-link>
    </div>

    <h3 class="sec">三角函数与三角形 · 十一 综合应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/trig/k1"><span class="tag">K1</span><h3>求角与三角方程</h3><p class="fx"><Katex tex="\sin x=t \Rightarrow x=\alpha+2k\pi \text{ 或 } x=\pi-\alpha+2k\pi" /></p><p>三步法：参考角（arcsin|t|）→ 象限定支 → 周期写族；|t|&gt;1 超出范围、|t|=1 切线重根；换元 t=sinx 须收口 [−1,1]。</p></router-link>
      <router-link class="topic-card" to="/trig/k2"><span class="tag">K2</span><h3>建模与最值</h3><p class="fx"><Katex tex="a\sin x+b\cos x+k\in[k-R,\ k+R],\quad R=\sqrt{a^2+b^2}" /></p><p>建模四步：T 两峰距、A 峰谷差半、k 峰谷平均、x₀ 升段零点；辅助角最值 R 管峰高；有界换元与定义域截断先查界再谈极值。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 一 定义与标准方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/def1"><span class="tag">D1</span><h3>椭圆第一定义</h3><p class="fx"><Katex tex="|PF_1|+|PF_2|=2a\ (2a>2c)" /></p><p>到两定点距离之和为定长 —— a&gt;b&gt;0 的来源。</p></router-link>
      <router-link class="topic-card" to="/conics/def2"><span class="tag">D2</span><h3>双曲线第一定义</h3><p class="fx"><Katex tex="\bigl||PF_1|-|PF_2|\bigr|=2a\ (2a<2c)" /></p><p>距离之差的绝对值 —— 两支的来历、渐近线的背景。</p></router-link>
      <router-link class="topic-card" to="/conics/def3"><span class="tag">D3</span><h3>抛物线：焦点与准线</h3><p class="fx"><Katex tex="d(P,F)=d(P,l)" /></p><p>到焦点与准线等距 —— 唯一没有第二焦点的成员。</p></router-link>
      <router-link class="topic-card" to="/conics/def4"><span class="tag">D4</span><h3>统一定义与离心率</h3><p class="fx"><Katex tex="\dfrac{|PF|}{d(P,l)}=e" /></p><p>0&lt;e&lt;1 椭圆、e=1 抛物线、e&gt;1 双曲线 —— e 是分类标准。</p></router-link>
      <router-link class="topic-card" to="/conics/def5"><span class="tag">D5</span><h3>第三定义（斜率积）</h3><p class="fx"><Katex tex="k_1k_2=-\dfrac{b^2}{a^2}" /></p><p>中心对称两点连线斜率恒定 —— 中点弦的关键；双曲线取 <Katex tex="+\dfrac{b^2}{a^2}"/>。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 二 光学性质与切线</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/opt1"><span class="tag">T1</span><h3>切线四法</h3><p class="fx"><Katex tex="\text{判别式、求导、梯度、极线}" /></p><p>同一条切线四种求法 —— 按场合选用，极线最省力。</p></router-link>
      <router-link class="topic-card" to="/conics/opt2"><span class="tag">T2</span><h3>椭圆聚光</h3><p class="fx"><Katex tex="\angle F_1PT=\angle F_2PT" /></p><p>切线与两焦半径成等角 —— 一焦点进光必聚另一焦点。</p></router-link>
      <router-link class="topic-card" to="/conics/opt3"><span class="tag">T3</span><h3>抛物线平行光</h3><p class="fx"><Katex tex="\angle(PT,\text{轴})=\angle FPT" /></p><p>切线平分焦半径与对称轴的夹角 —— 平行光聚焦、探照灯反向。</p></router-link>
      <router-link class="topic-card" to="/conics/opt4"><span class="tag">T4</span><h3>双曲线虚焦点</h3><p class="fx"><Katex tex="\text{切线外平分}\ \angle F_1PF_2" /></p><p>反射光发散、延长线似出自另一支的「虚」焦点 —— 与聚光对偶。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 三 仿射变换</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/aff1"><span class="tag">A1</span><h3>伸缩不变量</h3><p class="fx"><Katex tex="\text{平行、分点比、面积比不变}" /></p><p>单位圆压成椭圆：共线、相切、中点比全部保持不变。</p></router-link>
      <router-link class="topic-card" to="/conics/aff2"><span class="tag">A2</span><h3>点差法</h3><p class="fx"><Katex tex="k_{AB}\cdot k_{OM}=-\dfrac{b^2}{a^2}" /></p><p>中点弦斜率与中心连线斜率之积恒定 —— 只给必要条件。</p></router-link>
      <router-link class="topic-card" to="/conics/aff3"><span class="tag">A3</span><h3>面积公式</h3><p class="fx"><Katex tex="S=\pi ab" /></p><p>单位圆面积 π 经伸缩乘 ab —— 不变量思想第一个战利品。</p></router-link>
      <router-link class="topic-card" to="/conics/aff4"><span class="tag">A4</span><h3>双曲线 = 反比例母本</h3><p class="fx"><Katex tex="xy=k\iff\dfrac{x^2}{2|k|}-\dfrac{y^2}{2|k|}=1" /></p><p>反比例函数是绕原点转 45° 的等轴双曲线 —— 渐近线即两轴。</p></router-link>
      <router-link class="topic-card" to="/conics/aff5"><span class="tag">A5</span><h3>对勾函数 = 剪切像</h3><p class="fx"><Katex tex="e=\sec\dfrac{\psi}{2}" /></p><p><Katex tex="y=x+\dfrac{1}{x}"/> 的两支是双曲线的剪切/旋转像 —— 对勾顶点即顶点。</p></router-link>
      <router-link class="topic-card" to="/conics/aff6"><span class="tag">A6</span><h3>一般二次方程</h3><p class="fx"><Katex tex="\lambda_\pm=\dfrac{(A+C)\pm\sqrt{(A-C)^2+4B^2}}{2}" /></p><p>特征值定主轴 —— 二次曲线家族=圆/椭圆/双曲线/抛物线（含退化）。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 四 参数方程与轨迹</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/par1"><span class="tag">P1</span><h3>三曲线参数</h3><p class="fx"><Katex tex="x=a\cos\varphi,\ y=b\sin\varphi" /></p><p>离心角 φ ≠ 几何角 —— 参数是辅助圆上的时钟。</p></router-link>
      <router-link class="topic-card" to="/conics/par2"><span class="tag">P2</span><h3>交轨法与包络</h3><p>动直线族消参数得包络 —— 轨迹题的标准流程。</p></router-link>
      <router-link class="topic-card" to="/conics/par3"><span class="tag">P3</span><h3>焦点弦</h3><p class="fx"><Katex tex="l=\dfrac{2ep}{1-e^2\cos^2\theta}" /></p><p>θ 垂直轴最短（通径 2ep）、沿轴最长 —— 三曲线一张公式。</p></router-link>
      <router-link class="topic-card" to="/conics/par4"><span class="tag">P4</span><h3>极坐标方程</h3><p class="fx"><Katex tex="\rho=\dfrac{ed}{1-e\cos\theta}" /></p><p>焦点作极点 —— 三个 e 一张图，三曲线统一名称。</p></router-link>
      <router-link class="topic-card" to="/conics/par5"><span class="tag">P5</span><h3>蒙日圆</h3><p class="fx"><Katex tex="x^2+y^2=a^2+b^2" /></p><p>两垂直切线交点的轨迹 —— 双曲线改 <Katex tex="a^2-b^2"/>（<Katex tex="|a|>|b|"/> 时成圆）。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 五 直线与圆锥曲线</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/lin1"><span class="tag">L1</span><h3>判别式一览与第四态</h3><p class="fx"><Katex tex="\text{二次项系数}=0\Rightarrow\text{一交非切}" /></p><p>Δ&gt;0 两交、=0 相切、&lt;0 无交；与渐近线平行降为一次 —— 第四态。</p></router-link>
      <router-link class="topic-card" to="/conics/lin2"><span class="tag">L2</span><h3>弦长公式</h3><p class="fx"><Katex tex="|AB|=\sqrt{1+k^2}\cdot\dfrac{\sqrt{\Delta}}{|a|}" /></p><p>联立、韦达、弦长三步 —— 竖弦用 Δ 直接给 <Katex tex="\dfrac{b^2\Delta}{|a|}"/>。</p></router-link>
      <router-link class="topic-card" to="/conics/lin3"><span class="tag">L3</span><h3>点位与极线三身份</h3><p class="fx"><Katex tex="\dfrac{x_0x}{a^2}\pm\dfrac{y_0y}{b^2}=1" /></p><p>点在曲线上=切线、在外=切点弦、在内=虚轨迹 —— 一套代数式。</p></router-link>
      <router-link class="topic-card" to="/conics/lin4"><span class="tag">L4</span><h3>曲线系</h3><p class="fx"><Katex tex="f+\lambda g=0" /></p><p>过 f=0 与 g=0 全部交点 —— 共焦点、共渐近线族一键生成。</p></router-link>
      <router-link class="topic-card" to="/conics/lin5"><span class="tag">L5</span><h3>定点·定值·最值</h3><p>大题三宝流程：设参 → 联立韦达 → 目标代换 → 证与参数无关。</p></router-link>
    </div>

    <h3 class="sec">圆锥曲线 · 六 极点极线与配极理论</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/conics/ch1"><span class="tag">六1</span><h3>消点：盯住不变量</h3><p class="fx"><Katex tex="(A,B;C,D)=\dfrac{CA}{CB}\div\dfrac{DA}{DB}" /></p><p>交叉比在中心投影下不变 —— 复杂构图消成简单构图再核验。</p></router-link>
      <router-link class="topic-card" to="/conics/ch2"><span class="tag">六2</span><h3>交叉比与调和点列</h3><p class="fx"><Katex tex="(A,B;C,D)=-1" /></p><p>＝−1 即调和 —— 内外分点、极点极线的度量判据。</p></router-link>
      <router-link class="topic-card" to="/conics/ch3"><span class="tag">六3</span><h3>完全四点形</h3><p class="fx"><Katex tex="\text{内接完全四点形的对角三角形自配极}" /></p><p>纯射影的配极构造 —— 不依赖任何度量也能定极线。</p></router-link>
      <router-link class="topic-card" to="/conics/ch4"><span class="tag">六4</span><h3>极点与极线</h3><p class="fx"><Katex tex="\overrightarrow{OP}\cdot\overrightarrow{OQ}=R^2" /></p><p>圆的情形：Q 沿 P 的极线 —— 极线⊥OP，距离倒数记录。</p></router-link>
      <router-link class="topic-card" to="/conics/ch5"><span class="tag">六5</span><h3>配极原则与齐次坐标</h3><p class="fx"><Katex tex="\ell=AP,\quad P=A^{-1}\ell" /></p><p>矩阵对称性给出 La Hire 互易，共线点的极线共点。</p></router-link>
      <router-link class="topic-card" to="/conics/ch6"><span class="tag">六6</span><h3>Pascal 与 Brianchon</h3><p class="fx"><Katex tex="\text{六点对边交点共线}" /></p><p>Pascal 线的极点就是 Brianchon 点。相邻点可取切线极限，平行对边交于无穷远。</p></router-link>
      <router-link class="topic-card" to="/conics/ch7"><span class="tag">六7</span><h3>配极关系回顾</h3><p>由调和分点确定极线，再用点线对偶求切线交点轨迹或证明共点。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 一 从映射到函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/c1"><span class="tag">C1</span><h3>映射三要求</h3><p class="fx"><Katex tex="f(x_0)\ \text{存在且唯一}" /></p><p>每个输入有像且只有一个 —— 一对多直接排除。</p></router-link>
      <router-link class="topic-card" to="/functions/c2"><span class="tag">C2</span><h3>同一函数</h3><p class="fx"><Katex tex="D_f=D_g\ \wedge\ f\equiv g" /></p><p>定义域 + 化简后法则 —— 字母换名、化简伪装都不影响判定。</p></router-link>
      <router-link class="topic-card" to="/functions/c3"><span class="tag">C3</span><h3>定义域与值域</h3><p class="fx"><Katex tex="\text{分母}\neq0,\ \text{根号}\ge0,\ \text{真数}>0" /></p><p>三条限制先查；值域走观察、配方、反解阶梯。</p></router-link>
      <router-link class="topic-card" to="/functions/c4"><span class="tag">C4</span><h3>分段函数</h3><p class="fx"><Katex tex="\text{闭端实心、开端空心}" /></p><p>单值性在分段处复发 —— 衔接点开闭单独审。</p></router-link>
      <router-link class="topic-card" to="/functions/c5"><span class="tag">C5</span><h3>平移记录</h3><p class="fx"><Katex tex="f(x)+h\ \text{竖},\quad f(x+h)\ \text{横（反向）}" /></p><p>输出端升降机、输入端传送带 —— 「左加右减」是输入补偿。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 二 函数的基本性质</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/s1"><span class="tag">S1</span><h3>单调性定义</h3><p class="fx"><Katex tex="x_1<x_2\Rightarrow f(x_1)<f(x_2)" /></p><p>任取两点作差比较 —— 定义是依据，图象只是直观印证。</p></router-link>
      <router-link class="topic-card" to="/functions/s2"><span class="tag">S2</span><h3>导数判据</h3><p class="fx"><Katex tex="f'>0\Rightarrow\uparrow,\quad f'<0\Rightarrow\downarrow" /></p><p>f′ 符号是判据 —— 与 S1 定义互证。</p></router-link>
      <router-link class="topic-card" to="/functions/s3"><span class="tag">S3</span><h3>奇偶性</h3><p class="fx"><Katex tex="f(-x)=\pm f(x)\ (\text{定义域对称})" /></p><p>偶=镜像折叠、奇=旋转折叠 —— 定义域不对称直接排除。</p></router-link>
      <router-link class="topic-card" to="/functions/s4"><span class="tag">S4</span><h3>有界与最值</h3><p class="fx"><Katex tex="\exists M:\ |f(x)|\le M" /></p><p>界是拦得住、最值是取得到 —— 开区间可以有界无最值。</p></router-link>
      <router-link class="topic-card" to="/functions/s5"><span class="tag">S5</span><h3>对称性专题</h3><p class="fx"><Katex tex="f(a+x)=f(b-x)\Rightarrow x=\tfrac{a+b}{2}" /></p><p>加号译出轴；改等式 f(a+x)+f(b−x)=0 译出中心。</p></router-link>
      <router-link class="topic-card" to="/functions/s6"><span class="tag">S6</span><h3>周期性专题</h3><p class="fx"><Katex tex="f(x+T)=f(x)" /></p><p>双轴推 T=2d、轴+心推 T=4d —— 平移重合是验收标准。</p></router-link>
      <router-link class="topic-card" to="/functions/s7"><span class="tag">S7</span><h3>性质综合阅读</h3><p>单调染色、奇偶镜像、周期平移、确界线 —— 一条曲线四项检验。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 三 零点与存在性定理</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/r1"><span class="tag">R1</span><h3>零点三语言</h3><p class="fx"><Katex tex="f(c)=0\iff\text{根}\iff\text{交点横坐标}" /></p><p>同一个数三套名称 —— 二重零点会使符号检查失效。</p></router-link>
      <router-link class="topic-card" to="/functions/r2"><span class="tag">R2</span><h3>存在性定理</h3><p class="fx"><Katex tex="f\text{ 连续}+f(a)f(b)<0\Rightarrow\exists c" /></p><p>保证存在不给位置；唯一性另请单调 —— 同号不排除有零点。</p></router-link>
      <router-link class="topic-card" to="/functions/r3"><span class="tag">R3</span><h3>二分法</h3><p class="fx"><Katex tex="\varepsilon_n=\dfrac{b-a}{2^n}" /></p><p>变号半区留下、误差对数衰减 —— 不挑函数、不需求导。</p></router-link>
      <router-link class="topic-card" to="/functions/r4"><span class="tag">R4</span><h3>牛顿法</h3><p class="fx"><Katex tex="x_{n+1}=x_n-\dfrac{f(x_n)}{f'(x_n)}" /></p><p>切线一步迭代、误差平方级 —— 驻点失速与循环反例要当心。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 四 基本初等函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/e1"><span class="tag">E1</span><h3>一次函数</h3><p class="fx"><Katex tex="f=kx+b,\ f'\equiv k" /></p><p>斜率恒定 —— 导数世界最平凡的成员。</p></router-link>
      <router-link class="topic-card" to="/functions/e2"><span class="tag">E2</span><h3>二次函数</h3><p class="fx"><Katex tex="x_0=-\dfrac{b}{2a},\quad a\cdot f(k)" /></p><p>区间最值（轴在区内顶点定一头、否则近端点定该头、另一头归距轴远者）；根的分布（Δ、轴、a·f(k) 三项判据）。</p></router-link>
      <router-link class="topic-card" to="/functions/e3"><span class="tag">E3</span><h3>幂函数曲线族</h3><p class="fx"><Katex tex="y=x^\alpha\ \text{恒过}(1,1)" /></p><p>α 走遍五种类型 —— 负底数开不出偶次方是首要限制。</p></router-link>
      <router-link class="topic-card" to="/functions/e4"><span class="tag">E4</span><h3>指数函数</h3><p class="fx"><Katex tex="(a^x)'=a^x\ln a" /></p><p>增长率与函数值成正比 —— 曲线越高增长率越大。</p></router-link>
      <router-link class="topic-card" to="/functions/e5"><span class="tag">E5</span><h3>对数函数</h3><p class="fx"><Katex tex="(\log_a x)'=\dfrac{1}{x\ln a}" /></p><p>增长无上界、增速一直减小 —— 慢过一切正幂。</p></router-link>
      <router-link class="topic-card" to="/functions/e6"><span class="tag">E6</span><h3>指对反演镜</h3><p class="fx"><Katex tex="y=a^x\longleftrightarrow y=\log_a x" /></p><p>同底成对关于 y=x 对折重合 —— 定义域值域互换。</p></router-link>
      <router-link class="topic-card" to="/functions/e7"><span class="tag">E7</span><h3>对勾函数</h3><p class="fx"><Katex tex="ax+\dfrac{b}{x}\ge2\sqrt{ab}\ (a,b>0)" /></p><p>顶点 <Katex tex="\bigl(\sqrt{b/a},\ 2\sqrt{ab}\bigr)"/>；有零点版判据 <Katex tex="\Delta=c^2-4ab"/>。</p></router-link>
      <router-link class="topic-card" to="/functions/e8"><span class="tag">E8</span><h3>绝对值嵌套</h3><p class="fx"><Katex tex="|f|\ \text{翻上},\quad f(|x|)\ \text{折拢（必偶）}" /></p><p>零点不变 vs 翻倍 —— 折叠点处折角高发（不可导候选）。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 五 图象变换</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/g1"><span class="tag">G1</span><h3>平移</h3><p class="fx"><Katex tex="y=f(x-h)+k" /></p><p>右 h 上 k —— (h,k) 是平移向量，输入端反向补偿。</p></router-link>
      <router-link class="topic-card" to="/functions/g2"><span class="tag">G2</span><h3>伸缩与翻折</h3><p class="fx"><Katex tex="y=b\,f(ax)" /></p><p>横除纵乘：a 压横、b 拉纵；a&lt;0 翻边、绝对值管幅度。</p></router-link>
      <router-link class="topic-card" to="/functions/g3"><span class="tag">G3</span><h3>顺序与由图反演</h3><p class="fx"><Katex tex="f(ax\pm b)=f\bigl(a(x\pm\tfrac{b}{a})\bigr)" /></p><p>先提因子再平移 —— f(2x−2) 右移 1 不是 2。</p></router-link>
    </div>

    <h3 class="sec">函数与微积分初步 · 六 变化率与导数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/functions/v1"><span class="tag">V1</span><h3>导数定义</h3><p class="fx"><Katex tex="f'(x_0)=\lim_{\Delta x\to0}\dfrac{f(x_0+\Delta x)-f(x_0)}{\Delta x}" /></p><p>先定义除法再取极限 —— 从头到尾没有除以 0。</p></router-link>
      <router-link class="topic-card" to="/functions/v2"><span class="tag">V2</span><h3>四则运算法则</h3><p class="fx"><Katex tex="(uv)'=u'v+uv'" /></p><p>和差逐项、常数提出；红角二阶小量在极限中消去。</p></router-link>
      <router-link class="topic-card" to="/functions/v3"><span class="tag">V3</span><h3>极值判据</h3><p class="fx"><Katex tex="f'(c)=0\ \wedge\ \text{两侧变号}" /></p><p>清零只是入围、变号才是判据；最值候选=驻点∪端点。</p></router-link>
      <router-link class="topic-card" to="/functions/v4"><span class="tag">V4</span><h3>凹凸性与切线放缩</h3><p class="fx"><Katex tex="f''\ge 0\ \Rightarrow\ f(x)\ge f(x_0)+f'(x_0)(x-x_0)" /></p><p>下凸曲线在切线上方：<Katex tex="e^x\ge x+1"/>、<Katex tex="\ln x\le x-1"/> —— 只在凹凸区间内有效。</p></router-link>
      <router-link class="topic-card" to="/functions/v5"><span class="tag">V5</span><h3>参数综合工作流</h3><p class="fx"><Katex tex="f=x^3-3tx:\ t\lessgtr 0\ \text{三档}" /></p><p>按 f′ 零点个数分档、临界单列 —— 极值深度联动零点个数。</p></router-link>
      <router-link class="topic-card" to="/functions/v6"><span class="tag">V6</span><h3>泰勒（麦克劳林）展开</h3><p class="fx"><Katex tex="P_n(x)=\sum_{k=0}^{n}\dfrac{f^{(k)}(0)}{k!}\,x^k" /></p><p>多项式逐阶匹配导数：<Katex tex="e^x=\sum x^k/k!"/>，<Katex tex="e=\sum 1/k!\approx 2.71828"/>；<Katex tex="\ln(1+x)"/> 半径 1。</p></router-link>
      <router-link class="topic-card" to="/functions/v7"><span class="tag">V7</span><h3>求和公式与定积分</h3><p class="fx"><Katex tex="\sum k^2=\dfrac{n(n+1)(2n+1)}{6}" /></p><p>÷<Katex tex="n^3"/> 铺回 [0,1]：<Katex tex="R_n=1/3+1/(2n)+1/(6n^2)\to 1/3"/> —— 积分是求和的极限。</p></router-link>
      <router-link class="topic-card" to="/functions/v8"><span class="tag">V8</span><h3>牛顿–莱布尼茨公式</h3><p class="fx"><Katex tex="\int_a^b f=F(b)-F(a)" /></p><p><Katex tex="F'=f"/> 让面积变求导逆题；原函数带 <Katex tex="\pm C"/>，差值自消。</p></router-link>
    </div>

    <h3 class="sec">不等式 · 一 性质与比较</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/inequalities/p1"><span class="tag">性1</span><h3>性质四条</h3><p class="fx"><Katex tex="a>b,\ c<0\Rightarrow ac<bc" /></p><p>同加减保序、乘除先定 c 的符号；传递无条件成立 —— 乘负反序是变形第一处易错。</p></router-link>
      <router-link class="topic-card" to="/inequalities/p2"><span class="tag">性2</span><h3>作差与作商</h3><p class="fx"><Katex tex="a-b>0\iff a>b" /></p><p>作差 → 变形 → 定号；作商只对同号可用、同负时结论反转。</p></router-link>
    </div>

    <h3 class="sec">不等式 · 二 一元二次不等式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/inequalities/q1"><span class="tag">次1</span><h3>三个二次</h3><p class="fx"><Katex tex="ax^2+bx+c>0\iff (x-x_1)(x-x_2)>0" /></p><p>Δ 三态定根、根切分数轴定号；a&gt;0 大于取根外、小于取根内，开口向下反转。</p></router-link>
      <router-link class="topic-card" to="/inequalities/q2"><span class="tag">次2</span><h3>穿根法</h3><p class="fx"><Katex tex="\tfrac{x-a}{x-b}>0\iff (x-a)(x-b)>0,\ x\ne b" /></p><p>符号表逐行读号、奇穿偶不穿；分式移项通分、分母零点除外。</p></router-link>
      <router-link class="topic-card" to="/inequalities/q3"><span class="tag">次3</span><h3>绝对值距离带</h3><p class="fx"><Katex tex="|x-m|<c\iff m-c<x<m+c\ (c>0)" /></p><p>带内带外、端点关于 m 对称；<Katex tex="|ax+b|"/> 化为中心 <Katex tex="-b/a"/>、半宽 <Katex tex="c/|a|"/>；<Katex tex="c<0"/> 时只剩 ℝ 与 ∅ 两态。</p></router-link>
    </div>

    <h3 class="sec">不等式 · 三 基本不等式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/inequalities/g1"><span class="tag">基1</span><h3>基本不等式</h3><p class="fx"><Katex tex="\sqrt{ab}\le\frac{a+b}{2}\ (a,b>0)" /></p><p>圆图 + 射影定理：竖弦 <Katex tex="\sqrt{ab}"/> 不超过半径 <Katex tex="\dfrac{a+b}{2}"/>；取等当且仅当 <Katex tex="a=b"/>。</p></router-link>
      <router-link class="topic-card" to="/inequalities/g2"><span class="tag">基2</span><h3>用基本不等式求最值</h3><p class="fx"><Katex tex="ab\le\frac{s^2}{4},\quad a+b\ge2\sqrt p" /></p><p>一正二定三相等：和定积最大在 <Katex tex="a=b=s/2"/>、积定和最小在 <Katex tex="a=b=\sqrt p"/>。</p></router-link>
      <router-link class="topic-card" to="/inequalities/g3"><span class="tag">基3</span><h3>均值链 H≤G≤A≤Q</h3><p class="fx"><Katex tex="\frac{2ab}{a+b}\le\sqrt{ab}\le\frac{a+b}{2}\le\sqrt{\frac{a^2+b^2}{2}}" /></p><p>调和/几何/算术/平方四条均值成链；<Katex tex="Q^2-A^2=\dfrac{(a-b)^2}{4}"/>、对倒数用 <Katex tex="A\ge G"/>；等号四处全在 <Katex tex="a=b"/>。</p></router-link>
    </div>

    <h3 class="sec">不等式 · 四 放缩与常用不等式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/inequalities/f1"><span class="tag">放1</span><h3>三角不等式</h3><p class="fx"><Katex tex="|a+b|\le|a|+|b|" /></p><p>折返与直达（两短边闭合才成三角形）；只给上界，下界 <Katex tex="||a|-|b||" /> 由反向换 b→−b 得到。</p></router-link>
      <router-link class="topic-card" to="/inequalities/f2"><span class="tag">放2</span><h3>柯西不等式</h3><p class="fx"><Katex tex="(a^2+b^2)(c^2+d^2)\ge(ac+bd)^2" /></p><p>差额正是平行四边形面积 <Katex tex="(ad-bc)^2"/>；取等在两数组成比例（共线），配成向量求平方和最值。</p></router-link>
      <router-link class="topic-card" to="/inequalities/f3"><span class="tag">放3</span><h3>常用放缩</h3><p class="fx"><Katex tex="\tfrac1{k^2}<\tfrac1{k(k-1)}=\tfrac1{k-1}-\tfrac1k" /></p><p>求不出的和三法开路：裂项成可相消的列、逐项夹逼在可算两界间、二项舍非负项取下界 2——等号在哪各不同。</p></router-link>
    </div>

    <h3 class="sec">不等式 · 五 简单线性规划与非线性规划初步</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/inequalities/l1"><span class="tag">线1</span><h3>半平面与可行域</h3><p class="fx"><Katex tex="Ax+By+C>0" /></p><p>代点定号：直线同侧符号一致；不等式组取交集，凸多边形可行域的顶点是边界直线的交点。</p></router-link>
      <router-link class="topic-card" to="/inequalities/l2"><span class="tag">线2</span><h3>线性规划</h3><p class="fx"><Katex tex="z=ax+by" /></p><p>等值线沿法向平行移动，最值在顶点取得；与某条边平行时整条边都最优；整数解在可行整点中比较。</p></router-link>
      <router-link class="topic-card" to="/inequalities/l3"><span class="tag">线3</span><h3>曲线可行域</h3><p class="fx"><Katex tex="x^2+y^2\le r^2" /></p><p>边界是二次曲线时，最优等值线与边界相切，切点即最优解；圆用圆心距、椭圆用参数式或判别式、抛物线联立 Δ=0。</p></router-link>
      <router-link class="topic-card" to="/inequalities/l4"><span class="tag">线4</span><h3>非线性目标</h3><p class="fx"><Katex tex="z=\frac{y-b}{x-a}" /></p><p>分式看定点斜率，平方和看距离：斜率最值在顶点切线处，距离型的最小值可落在边的内部垂足。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 一 平面向量的概念与线性运算</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/x1"><span class="tag">向1</span><h3>向量的概念与表示</h3><p class="fx"><Katex tex="\vec a=\overrightarrow{AB},\quad |\vec a|=|\overrightarrow{AB}|" /></p><p>有向线段只是表示，起点可平移：长度相等且方向相同即同一个向量；零向量规定与任何向量平行，模为 1 的是单位向量。</p></router-link>
      <router-link class="topic-card" to="/vectors/x2"><span class="tag">向2</span><h3>向量的加法与减法</h3><p class="fx"><Katex tex="\vec a-\vec b=\overrightarrow{BA}" /></p><p>三角形法则首尾相接，平行四边形法则同起点，两种画法给出同一条对角线；差向量由减数终点指向被减数终点。</p></router-link>
      <router-link class="topic-card" to="/vectors/x3"><span class="tag">向3</span><h3>数乘与共线向量</h3><p class="fx"><Katex tex="\vec b=\lambda\vec a\ (\vec a\ne\vec 0)\iff x_1y_2-x_2y_1=0" /></p><p><Katex tex="|\lambda|"/> 管长度、正负管方向；共线定理的倍率唯一要求 <Katex tex="\vec a\ne\vec 0"/>，坐标下交叉相乘相减为零即共线。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 二 平面向量基本定理与坐标运算</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/b1"><span class="tag">基1</span><h3>平面向量基本定理</h3><p class="fx"><Katex tex="\vec a=\lambda_1\vec e_1+\lambda_2\vec e_2" /></p><p>两支不共线的向量可作基底，平面内任一向量都能写成它们的倍数之和，且系数唯一；基向量共线则只撑开一条直线。</p></router-link>
      <router-link class="topic-card" to="/vectors/b2"><span class="tag">基2</span><h3>坐标表示与线性运算</h3><p class="fx"><Katex tex="\overrightarrow{AB}=(x_2-x_1,\ y_2-y_1),\quad |\overrightarrow{AB}|=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" /></p><p>终点减起点得坐标，与起点位置无关；加减与数乘逐分量进行，模由两分量的平方和开方得到。</p></router-link>
      <router-link class="topic-card" to="/vectors/b3"><span class="tag">基3</span><h3>共线与定比分点</h3><p class="fx"><Katex tex="x_1y_2-x_2y_1=0\iff\vec a\parallel\vec b,\quad P=\dfrac{A+\lambda B}{1+\lambda}" /></p><p>交叉相乘相减为零即共线，同向反向都算；<Katex tex="\overrightarrow{AP}=\lambda\overrightarrow{PB}"/> 解出分点，λ=1 是中点，λ&lt;0 是外分，λ=−1 无解。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 三 数量积与度量</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/i1"><span class="tag">积1</span><h3>数量积与投影</h3><p class="fx"><Katex tex="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta" /></p><p>结果是一个数：一个向量的长乘以另一个在它方向上的投影。夹角为锐角时为正、直角为零、钝角为负；零向量与任何向量的数量积为零。</p></router-link>
      <router-link class="topic-card" to="/vectors/i2"><span class="tag">积2</span><h3>坐标点积、夹角与垂直</h3><p class="fx"><Katex tex="x_1x_2+y_1y_2,\qquad \vec a\perp\vec b\iff x_1x_2+y_1y_2=0" /></p><p>逐分量相乘再相加；余弦等于点积除以两个模之积，垂直就是点积为零，平行仍看交叉差。</p></router-link>
      <router-link class="topic-card" to="/vectors/i3"><span class="tag">积3</span><h3>极化恒等式与模的运算</h3><p class="fx"><Katex tex="4\vec a\cdot\vec b=|\vec a+\vec b|^2-|\vec a-\vec b|^2" /></p><p>两条对角线分别是和向量与差向量：平方差给出四倍点积，平方和等于四边平方和；两支垂直时对角等长即矩形。</p></router-link>
      <router-link class="topic-card" to="/vectors/i4"><span class="tag">积4</span><h3>向量积与它的几何意义</h3><p class="fx"><Katex tex="|\vec a\times\vec b|=|\vec a||\vec b|\sin\theta,\quad x_1y_2-x_2y_1" /></p><p>结果是一个向量：垂直于两支向量，方向由右手定则给出，模等于平行四边形的面积。平面内只剩带符号的分量 x₁y₂−x₂y₁，绝对值是面积、符号是转向；空间里可直接充当法向量，混合积给平行六面体体积。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 四 向量的应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/y1"><span class="tag">应1</span><h3>平面几何中的向量方法</h3><p class="fx"><Katex tex="\overrightarrow{AM}=\dfrac12(\vec a+\vec b),\quad \overrightarrow{AG}=\dfrac13(\vec a+\vec b)" /></p><p>取两个不共线的向量作基底，把图中的线段都写成倍数之和；平行看数乘、垂直看点积为零、长度平方成数量积，三线共点与中点、重心比值一并得出。</p></router-link>
      <router-link class="topic-card" to="/vectors/y2"><span class="tag">应2</span><h3>向量在物理中的应用</h3><p class="fx"><Katex tex="F_x=|\vec F|\cos\theta,\quad F_y=|\vec F|\sin\theta,\quad W=\vec F\cdot\vec s" /></p><p>力的合成按平行四边形，正交分解沿两条互相垂直的轴；速度与位移按向量相加，各方向的分运动互不影响；功是力与位移的数量积，夹角决定正负。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 五 复数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/c1"><span class="tag">复1</span><h3>复数的概念与几何意义</h3><p class="fx"><Katex tex="z=a+b\mathrm{i},\quad \bar z=a-b\mathrm{i},\quad |z|=\sqrt{a^2+b^2}" /></p><p>实部、虚部分是复平面上点的横、纵坐标；共轭关于实轴对称，模是到原点的距离。纯虚数要求实部为零且虚部不为零，复数之间不比大小。</p></router-link>
      <router-link class="topic-card" to="/vectors/c2"><span class="tag">复2</span><h3>复数的四则运算</h3><p class="fx"><Katex tex="z_1z_2=(ac-bd)+(ad+bc)\mathrm{i},\quad \dfrac{z_1}{z_2}=\dfrac{z_1\bar z_2}{z_2\bar z_2}" /></p><p>加减逐分量，乘法按分配律再把 <Katex tex="\mathrm{i}^2"/> 换成 −1；除法同乘分母的共轭使分母实数化。乘法即模相乘、辐角相加。</p></router-link>
      <router-link class="topic-card" to="/vectors/c3"><span class="tag">复3</span><h3>复数的模与共轭</h3><p class="fx"><Katex tex="|z_1z_2|=|z_1||z_2|,\quad z\bar z=|z|^2" /></p><p>模对乘除保持运算、对加减满足三角不等式；共轭与加减乘除都可交换顺序。模的式子可翻成距离，轨迹题由此直接读出圆与垂直平分线。</p></router-link>
    </div>

    <h3 class="sec">向量与复数 · 六 三角形式与欧拉公式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/vectors/e1"><span class="tag">欧1</span><h3>三角形式与乘除的几何意义</h3><p class="fx"><Katex tex="z=r(\cos\theta+\mathrm{i}\sin\theta),\quad z_1z_2=r_1r_2\big[\cos(\theta_1+\theta_2)+\mathrm{i}\sin(\theta_1+\theta_2)\big]" /></p><p>模是到原点的距离，辐角从实轴正方向逆时针量起，主值取 [0,2π)；乘法模相乘、辐角相加，除法反过来，图上即先伸缩再旋转，反复相乘得棣莫弗定理。</p></router-link>
      <router-link class="topic-card" to="/vectors/e2"><span class="tag">欧2</span><h3>欧拉公式与单位根</h3><p class="fx"><Katex tex="\mathrm{e}^{\mathrm{i}\theta}=\cos\theta+\mathrm{i}\sin\theta,\quad z_k=\mathrm{e}^{2\pi k\mathrm{i}/n}" /></p><p>单位圆上的点写成指数后，乘除变成指数加减；<Katex tex="z^n=1"/> 的 n 个根均匀排在圆周上连成正 n 边形，全部相加为零，并把 <Katex tex="z^n-1"/> 完整分解。</p></router-link>
    </div>

    <h3 class="sec">数列 · 一 数列的概念与表示</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/s1"><span class="tag">数1</span><h3>数列是定义在正整数集上的函数</h3><p class="fx"><Katex tex="a_n=f(n),\quad n\in\mathbb{N}^*" /></p><p>定义域只取正整数，图象是一串孤立点；顺序不同即两个数列，递增看 <Katex tex="a_{n+1}-a_n"/> 的符号。</p></router-link>
      <router-link class="topic-card" to="/sequences/s2"><span class="tag">数2</span><h3>递推公式</h3><p class="fx"><Katex tex="a_1=a,\quad a_{n+1}=f(a_n)" /></p><p>初始项与递推式合起来唯一确定整列数；阶数几阶就要给几项初始条件。</p></router-link>
      <router-link class="topic-card" to="/sequences/s3"><span class="tag">数3</span><h3><Katex tex="S_n"/> 与 <Katex tex="a_n"/> 的换算</h3><p class="fx"><Katex tex="a_n=S_n-S_{n-1}\ (n\ge2),\quad a_1=S_1" /></p><p>作差消去前 n−1 项，只在 <Katex tex="n\ge2"/> 成立；与 <Katex tex="S_1"/> 核对决定两段能否合并。</p></router-link>
    </div>

    <h3 class="sec">数列 · 二 等差数列</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/d1"><span class="tag">等1</span><h3>定义、通项与等差中项</h3><p class="fx"><Katex tex="a_n=a_1+(n-1)d,\quad 2A=a+b" /></p><p>差恒定的数列，通项是序号的一次式，项落在斜率 d 的直线上；中项是两端项的算术平均。</p></router-link>
      <router-link class="topic-card" to="/sequences/d2"><span class="tag">等2</span><h3>下标和的性质与判定</h3><p class="fx"><Katex tex="m+n=p+q\Rightarrow a_m+a_n=a_p+a_q" /></p><p>项关于中心项对称；判定三法：定义作差、中项式、通项为一次式，都要求对一切 n 成立。</p></router-link>
      <router-link class="topic-card" to="/sequences/d3"><span class="tag">等3</span><h3>前 n 项和（两块画板）</h3><p class="fx"><Katex tex="S_n=\frac{n(a_1+a_n)}{2}" /></p><p>倒序相加把两列数成对拼成等高条，台阶削平把一列数拼成矩形；<Katex tex="S_n"/> 是缺常数项的二次式。</p></router-link>
    </div>

    <h3 class="sec">数列 · 三 等比数列</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/g1"><span class="tag">比1</span><h3>定义、通项与等比中项</h3><p class="fx"><Katex tex="a_n=a_1q^{\,n-1},\quad G^2=ab" /></p><p>比恒定的数列，通项是常数乘指数幂，图象落在指数曲线上；中项有 <Katex tex="\pm\sqrt{ab}"/> 两个，要求 <Katex tex="ab>0"/>。</p></router-link>
      <router-link class="topic-card" to="/sequences/g2"><span class="tag">比2</span><h3>下标和与项积</h3><p class="fx"><Katex tex="m+n=p+q\Rightarrow a_ma_n=a_pa_q" /></p><p>以 <Katex tex="a_n"/> 为轴的两侧项积相等 <Katex tex="a_{n-k}a_{n+k}=a_n^2"/>；判定看比值、中项式或通项是否为指数式。</p></router-link>
      <router-link class="topic-card" to="/sequences/g3"><span class="tag">比3</span><h3>前 n 项和（两块画板）</h3><p class="fx"><Katex tex="S_n=\frac{a_1(1-q^n)}{1-q}\ (q\ne1)" /></p><p>错位相减把 <Katex tex="qS_n"/> 右移一列相消；线段填充把每项画成缩短的段，余下空档是 <Katex tex="Lq^n"/>；<Katex tex="q=1"/> 时 <Katex tex="S_n=na_1"/>。</p></router-link>
    </div>

    <h3 class="sec">数列 · 四 数列求和的方法</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/h1"><span class="tag">和1</span><h3>分组求和与裂项相消（两块画板）</h3><p class="fx"><Katex tex="\frac{1}{k(k+1)}=\frac1k-\frac{1}{k+1}" /></p><p>通项拆成几列已知数列分别求和；拆成相邻两项之差后累加，中间抵消，只剩首末两端。</p></router-link>
      <router-link class="topic-card" to="/sequences/h2"><span class="tag">和2</span><h3>错位相减：等差乘等比</h3><p class="fx"><Katex tex="S_n-qS_n=(1+q+\dots+q^{n-1})-nq^n" /></p><p>乘公比后错位相减，每列剩下 <Katex tex="q^{k-1}"/>，拼成一段等比数列，末项另外减去。</p></router-link>
      <router-link class="topic-card" to="/sequences/h3"><span class="tag">和3</span><h3>倒序相加与并项</h3><p class="fx"><Katex tex="a_k+a_{n+1-k}=C\Rightarrow S_n=\frac{nC}{2}" /></p><p>首末配对和为常数时两式相加；正负交替的数列相邻两项并成一对，再按 <Katex tex="n"/> 的奇偶收尾。</p></router-link>
    </div>

    <h3 class="sec">数列 · 五 递推与构造</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/r1"><span class="tag">递1</span><h3>累加法与累乘法</h3><p class="fx"><Katex tex="a_{n+1}-a_n=f(n)\ \text{或}\ \frac{a_{n+1}}{a_n}=g(n)" /></p><p>逐式写出后全部相加（相乘），中间项两两相消，只剩首末两端；求和后下标要减一。</p></router-link>
      <router-link class="topic-card" to="/sequences/r2"><span class="tag">递2</span><h3>构造法</h3><p class="fx"><Katex tex="a_n=x+(a_1-x)p^{\,n-1},\quad x=\frac{q}{1-p}" /></p><p>平移不动点把 <Katex tex="pa_n+q"/> 化成等比；<Katex tex="|p|<1"/> 收敛到不动点，<Katex tex="p=1"/> 退化为等差。</p></router-link>
      <router-link class="topic-card" to="/sequences/r3"><span class="tag">递3</span><h3>蛛网图与不动点</h3><p class="fx"><Katex tex="a_{n+1}=f(a_n),\quad x=f(x)" /></p><p>竖到曲线、横到 <Katex tex="y=x"/> 的折线画出整列数；折线卷向曲线与直线的交点即收敛。</p></router-link>
      <router-link class="topic-card" to="/sequences/r4"><span class="tag">递4</span><h3>特征根法</h3><p class="fx"><Katex tex="a_n=C_1r_1^n+C_2r_2^n" /></p><p>设 <Katex tex="a_n=r^n"/> 得特征方程 <Katex tex="r^2-pr-q=0"/>；两个等比分量叠加，重根改用 <Katex tex="(C_1+C_2n)r^n"/>。</p></router-link>
    </div>

    <h3 class="sec">数列 · 六 数学归纳法</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/i1"><span class="tag">归1</span><h3>数学归纳法的原理</h3><p class="fx"><Katex tex="P(1)\ \text{且}\ P(k)\Rightarrow P(k+1)" /></p><p>奠基加递推两步，缺一不可；依据是自然数的顺序结构，起点可以不是 1。</p></router-link>
      <router-link class="topic-card" to="/sequences/i2"><span class="tag">归2</span><h3>归纳—猜想</h3><p class="fx"><Katex tex="a_n=f(n)\Rightarrow a_{k+1}=f(k+1)" /></p><p>先算几项猜通项，再假设 <Katex tex="a_k=f(k)"/> 代入递推式，化简到 <Katex tex="f(k+1)"/> 的样子。</p></router-link>
    </div>

    <h3 class="sec">数列 · 七 数列的应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/sequences/u1"><span class="tag">用1</span><h3>增长、折损与分期</h3><p class="fx"><Katex tex="B_k=P(1+r)^k,\quad B_k=P(1+kr)" /></p><p>复利是等比、单利是等差、折损是公比 <Katex tex="1-r"/> 的等比；等额分期 <Katex tex="B_k=B_{k-1}(1+r)-x"/> 用构造法解。</p></router-link>
      <router-link class="topic-card" to="/sequences/u2"><span class="tag">用2</span><h3>数列与函数、不等式</h3><p class="fx"><Katex tex="\frac{a_{n+1}}{a_n}>1\Rightarrow a_{n+1}>a_n" /></p><p>作差或作比判单调，比值的穿越处给最大项；<Katex tex="S_n"/> 的最值看各项何时由正变负。</p></router-link>
    </div>

    <h3 class="sec">直线与圆 · 一 直线的方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linecircle/l1"><span class="tag">直1</span><h3>倾斜角与斜率</h3><p class="fx"><Katex tex="k=\tan\alpha,\quad \alpha\in[0^\circ,180^\circ)" /></p><p>倾斜角定方向，斜率是它的正切；两点式 <Katex tex="k=(y_2-y_1)/(x_2-x_1)"/> 与取点无关。竖直直线 <Katex tex="\alpha=90^\circ"/>，斜率不存在。</p></router-link>
      <router-link class="topic-card" to="/linecircle/l2"><span class="tag">直2</span><h3>直线方程的五种形式</h3><p class="fx"><Katex tex="y-y_0=k(x-x_0),\quad \frac{x}{a}+\frac{y}{b}=1" /></p><p>点斜、斜截、两点、截距、一般式；截距式要求两个截距都存在且非零，竖直、水平与过原点的直线各自退化。</p></router-link>
      <router-link class="topic-card" to="/linecircle/l3"><span class="tag">直3</span><h3>两条直线的位置关系</h3><p class="fx"><Katex tex="k_1=k_2,\quad k_1k_2=-1,\quad d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}" /></p><p>斜率相等判平行或重合，乘积为 <Katex tex="-1"/> 判垂直；相交联立求交点，平行线距离先统一系数再用公式。</p></router-link>
      <router-link class="topic-card" to="/linecircle/l4"><span class="tag">直4</span><h3>直线系与同解变形</h3><p class="fx"><Katex tex="f_1+\lambda f_2=0,\quad y-y_0=k(x-x_0)" /></p><p>过交点的束取不到 <Katex tex="l_2"/>，点斜式漏竖直直线；同乘、同除含零因式与两边平方会增根或失根，解完回代核验。</p></router-link>
    </div>

    <h3 class="sec">直线与圆 · 二 圆的方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linecircle/c1"><span class="tag">圆1</span><h3>标准方程与一般方程</h3><p class="fx"><Katex tex="(x-a)^2+(y-b)^2=r^2\iff x^2+y^2+Dx+Ey+F=0" /></p><p><Katex tex="D=-2a"/>、<Katex tex="E=-2b"/>、<Katex tex="F=a^2+b^2-r^2"/>；配方读回圆心 <Katex tex="(-D/2,-E/2)"/> 与半径，<Katex tex="D^2+E^2-4F>0"/> 才是圆，等于零是一个点。</p></router-link>
      <router-link class="topic-card" to="/linecircle/c2"><span class="tag">圆2</span><h3>直线与圆的位置关系</h3><p class="fx"><Katex tex="d<r,\ d=r,\ d>r\iff \Delta>0,\ =0,\ <0" /></p><p>距离判据不必解二次方程；相交弦长 <Katex tex="2\sqrt{r^2-d^2}"/>，切线垂直过切点的半径，过圆外一点的两条切线别漏竖直那条。</p></router-link>
      <router-link class="topic-card" to="/linecircle/c3"><span class="tag">圆3</span><h3>圆与圆的位置关系</h3><p class="fx"><Katex tex="d>r_1+r_2,\ d=r_1+r_2,\ |r_1-r_2|<d<r_1+r_2" /></p><p>五个区间五态，外切与内切各占一个等号；相交时两式相减得公共弦所在直线（二次项系数须先统一）。</p></router-link>
    </div>

    <h3 class="sec">直线与圆 · 三 圆的性质与定理</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linecircle/t1"><span class="tag">弦1</span><h3>垂径定理与圆周角</h3><p class="fx"><Katex tex="OM\perp AB\Rightarrow AM=MB,\quad \angle APB=\tfrac12\angle AOB" /></p><p>过圆心的垂线平分弦与弦所对的弧；同弧所对的圆周角是圆心角的一半，直径所对的圆周角为直角。</p></router-link>
      <router-link class="topic-card" to="/linecircle/t2"><span class="tag">弦2</span><h3>切线的判定与弦切角</h3><p class="fx"><Katex tex="OT\perp l\iff d(O,l)=r" /></p><p>过半径外端且垂直半径的直线是切线；切线垂直于过切点的半径，弦切角等于它所夹弧对的圆周角。</p></router-link>
      <router-link class="topic-card" to="/linecircle/t3"><span class="tag">弦3</span><h3>切线长定理与圆幂定理</h3><p class="fx"><Katex tex="PA\cdot PB=PC\cdot PD=PT^2=|OP^2-r^2|" /></p><p>圆外一点的两条切线长相等，<Katex tex="OP"/> 平分夹角；相交弦、割线与切割线三个乘积式统一为圆幂，圆内取 <Katex tex="r^2-OP^2"/>。</p></router-link>
      <router-link class="topic-card" to="/linecircle/t4"><span class="tag">弦4</span><h3>四点共圆与圆内接四边形</h3><p class="fx"><Katex tex="\angle A+\angle C=\angle B+\angle D=180^\circ" /></p><p>圆内接四边形对角互补，外角等于内对角；反过来两组对角之和为 <Katex tex="180^\circ"/> 即四点共圆，同侧张角相等也判共圆。</p></router-link>
    </div>

    <h3 class="sec">直线与圆 · 四 综合应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linecircle/z1"><span class="tag">综1</span><h3>对称与最值</h3><p class="fx"><Katex tex="|PA|+|PB|\ge |A'B|" /></p><p>点关于直线对称要同时满足垂直与中点两个条件；折线最短把一侧的定点翻到另一侧再拉直，圆上点到定点、定直线的距离界于两个极值之间。</p></router-link>
      <router-link class="topic-card" to="/linecircle/z2"><span class="tag">综2</span><h3>轨迹与综合问题</h3><p class="fx"><Katex tex="|AB|=2\sqrt{r^2-d^2},\quad \angle OPA=90^\circ" /></p><p>直接法、定义法、相关点法求轨迹，写完方程还要写范围；过定点的弦中点落在以该点与圆心连线为直径的圆上，弦最短当且仅当弦垂直于连线。</p></router-link>
    </div>

    <h3 class="sec">极坐标与参数方程 · 一 极坐标系与互化</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/polar/j1"><span class="tag">极1</span><h3>极坐标系与点的极坐标</h3><p class="fx"><Katex tex="P(\rho,\theta),\quad \rho=|OP|" /></p><p>极点定位置、极轴定方向；<Katex tex="(\rho,\theta)"/> 与 <Katex tex="(\rho,\theta+360^\circ k)"/> 同一点，负径约定下与 <Katex tex="(-\rho,\theta+180^\circ)"/> 同一点。</p></router-link>
      <router-link class="topic-card" to="/polar/j2"><span class="tag">极2</span><h3>极坐标与直角坐标互化</h3><p class="fx"><Katex tex="x=\rho\cos\theta,\quad y=\rho\sin\theta" /></p><p>反求时 <Katex tex="\rho=\sqrt{x^2+y^2}"/>，<Katex tex="\tan\theta=y/x"/> 只给参考角，象限定最终值；<Katex tex="x=0"/> 与原点单独处理。</p></router-link>
    </div>

    <h3 class="sec">极坐标与参数方程 · 二 曲线的极坐标方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/polar/q1"><span class="tag">曲1</span><h3>圆的极坐标方程</h3><p class="fx"><Katex tex="\rho=a,\quad \rho=2a\cos\theta,\quad \rho=2a\sin\theta" /></p><p>圆心在极点写 <Katex tex="\rho=a"/>；在极轴上且过极点写 <Katex tex="\rho=2a\cos\theta"/>；在过极点垂直极轴的直线上写 <Katex tex="\rho=2a\sin\theta"/>。约去 <Katex tex="\rho"/> 时别丢极点。</p></router-link>
      <router-link class="topic-card" to="/polar/q2"><span class="tag">曲2</span><h3>直线与射线的极坐标方程</h3><p class="fx"><Katex tex="\theta=\alpha,\quad \rho\cos\theta=a,\quad \rho\sin\theta=b" /></p><p>过极点写 <Katex tex="\theta=\alpha"/>（<Katex tex="\rho\in\mathbb{R}"/> 才是整条直线）；垂直极轴写 <Katex tex="\rho\cos\theta=a"/>，平行极轴写 <Katex tex="\rho\sin\theta=b"/>。距离取 <Katex tex="|a|"/>、<Katex tex="|b|"/>。</p></router-link>
    </div>

    <h3 class="sec">极坐标与参数方程 · 三 参数方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/polar/s1"><span class="tag">参1</span><h3>参数方程与消参</h3><p class="fx"><Katex tex="x=f(t),\quad y=g(t)" /></p><p>参数每取一值给出一枚点；消参用代入、平方相加、借恒等式。消参后的普通方程要补回参数范围，否则曲线会多出一段。</p></router-link>
      <router-link class="topic-card" to="/polar/s2"><span class="tag">参2</span><h3>直线与圆的参数方程</h3><p class="fx"><Katex tex="x=x_0+t\cos\alpha,\quad y=y_0+t\sin\alpha" /></p><p>方向向量取单位向量时 <Katex tex="|t|=|P_0P|"/>，符号分两侧；圆写 <Katex tex="x=x_0+r\cos\theta"/>、<Katex tex="y=y_0+r\sin\theta"/>，<Katex tex="\theta"/> 是圆心角不是极角。</p></router-link>
      <router-link class="topic-card" to="/polar/s3"><span class="tag">参3</span><h3>圆锥曲线的参数方程</h3><p class="fx"><Katex tex="x=a\cos\theta,\quad x=a\sec\theta,\quad x=2pt^2" /></p><p>椭圆用离心角，双曲线用 <Katex tex="\sec\theta"/> 与 <Katex tex="\tan\theta"/>（<Katex tex="\theta\ne90^\circ,270^\circ"/>），抛物线用 <Katex tex="x=2pt^2"/>、<Katex tex="y=2pt"/>。</p></router-link>
    </div>

    <h3 class="sec">极坐标与参数方程 · 四 参数方程的应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/polar/g1"><span class="tag">轨1</span><h3>参数方程求最值</h3><p class="fx"><Katex tex="|PQ|^2=3\cos^2\theta-12\cos\theta+10" /></p><p>曲线上的点代成参数式，目标式化成一元二次；令 <Katex tex="u=\cos\theta\in[-1,1]"/>，对称轴在区间外时最值落在端点，在区间内时顶点给一头。</p></router-link>
      <router-link class="topic-card" to="/polar/g2"><span class="tag">轨2</span><h3>参数方程与轨迹</h3><p class="fx"><Katex tex="x=2+\cos\theta,\quad y=\sin\theta" /></p><p>求轨迹三条路：直接法、相关点法、参数法。<Katex tex="M"/> 是 <Katex tex="AP"/> 的中点时轨迹是 <Katex tex="(x-2)^2+y^2=1"/>；消参后要补回参数范围。</p></router-link>
    </div>

    <h3 class="sec">立体几何 · 一 认识空间几何体</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/solid/r1"><span class="tag">体1</span><h3>多面体与欧拉公式</h3><p class="fx"><Katex tex="V-E+F=2" /></p><p>面、棱、顶点三件套；棱柱侧棱平行且相等，正棱锥的斜高、高与边心距勾连，棱台侧棱延长交于一点。数完三个数代进公式自查。</p></router-link>
      <router-link class="topic-card" to="/solid/r2"><span class="tag">体2</span><h3>旋转体与母线</h3><p class="fx"><Katex tex="l^2=r^2+h^2,\quad l^2=h^2+(r-r')^2" /></p><p>轴、底面、母线三件套；矩形转出圆柱、直角三角形转出圆锥、直角梯形转出圆台、半圆转出球。上底半径缩到零成圆锥，与下底相等成圆柱。</p></router-link>
    </div>

    <h3 class="sec">立体几何 · 二 体积与表面积</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/solid/m1"><span class="tag">积1</span><h3>柱、锥、台的体积与表面积</h3><p class="fx"><Katex tex="V=\frac{h}{3}\left(S+S'+\sqrt{SS'}\right)" /></p><p><Katex tex="S'=S"/> 得柱体 <Katex tex="Sh"/>，<Katex tex="S'=0"/> 得锥体 <Katex tex="\frac{Sh}{3}"/>；侧面积靠展开图：圆柱 <Katex tex="2\pi rh"/>、圆锥 <Katex tex="\pi rl"/>、圆台 <Katex tex="\pi(r+r')l"/>。</p></router-link>
      <router-link class="topic-card" to="/solid/m2"><span class="tag">积2</span><h3>球的体积、表面积与截面</h3><p class="fx"><Katex tex="S=4\pi R^2,\quad V=\frac{4}{3}\pi R^3,\quad r^2=R^2-d^2" /></p><p>球没有展开图，两个公式来自分割求和的极限；截面恒为圆，<Katex tex="d=0"/> 时是大圆。正方体外接球 <Katex tex="\frac{\sqrt3a}{2}"/>、内切球 <Katex tex="\frac a2"/>。</p></router-link>
      <router-link class="topic-card" to="/solid/m3"><span class="tag">积3</span><h3>组合体、外接球与内切球</h3><p class="fx"><Katex tex="R=\frac12\sqrt{a^2+b^2+c^2},\quad R=\frac{\sqrt6}{4}a,\quad r=\frac{\sqrt6}{12}a" /></p><p>组合体体积按加减、表面积数外露面（挖空的内表面也算）；长方体外接球直径即体对角线，正四面体两球同心且 <Katex tex="R=3r"/>，正方体三球半径比 <Katex tex="1:\sqrt2:\sqrt3"/>。</p></router-link>
    </div>

    <h3 class="sec">立体几何 · 三 空间中的位置关系</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/solid/w1"><span class="tag">位1</span><h3>平行与垂直</h3><p class="fx"><Katex tex="l\perp m,\ l\perp n,\ m\cap n=P\ \Rightarrow\ l\perp\alpha" /></p><p>判定由低维推高维、性质反过来：线面平行要 <Katex tex="b\subset\alpha"/> 且 <Katex tex="a\not\subset\alpha"/>，线面垂直要平面内两条相交直线，面面垂直要一个面过另一个面的垂线。二面角的平面角取棱上一点作两条垂线。</p></router-link>
      <router-link class="topic-card" to="/solid/w2"><span class="tag">位2</span><h3>异面直线与角</h3><p class="fx"><Katex tex="\cos\theta=\frac{|\vec u\cdot\vec v|}{|\vec u||\vec v|},\quad \sin\theta=\frac{|\vec u\cdot\vec n|}{|\vec u||\vec n|}" /></p><p>异面直线所成角靠平移法，取锐角或直角；线面角取斜线在平面内射影，用正弦公式；点到平面距离可用垂线段、等体积或 <Katex tex="d=\frac{|(\vec p-\vec a)\cdot\vec n|}{|\vec n|}"/>。</p></router-link>
    </div>

    <h3 class="sec">立体几何 · 四 空间直角坐标系</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/solid/c1"><span class="tag">标1</span><h3>空间直角坐标系与坐标平面</h3><p class="fx"><Katex tex="|P_1P_2|=\sqrt{(\Delta x)^2+(\Delta y)^2+(\Delta z)^2}" /></p><p>三轴三平面把空间分成八个卦限，平面方程即 <Katex tex="z=0"/>、<Katex tex="x=0"/>、<Katex tex="y=0"/>；三个坐标是到三张坐标平面的有向距离，关于平面、轴、原点对称分别改一、二、三个符号。</p></router-link>
      <router-link class="topic-card" to="/solid/c2"><span class="tag">标2</span><h3>平面的方程与法向量</h3><p class="fx"><Katex tex="A(x-x_0)+B(y-y_0)+C(z-z_0)=0,\quad \vec n=(A,B,C)" /></p><p>一般式 <Katex tex="Ax+By+Cz+D=0"/> 的系数就是法向量；三点定平面取两个差向量叉乘，截距式 <Katex tex="\frac xa+\frac yb+\frac zc=1"/> 要求三个截距都不为零。法向量平行则面面平行或重合，法向量垂直则面面垂直。</p></router-link>
      <router-link class="topic-card" to="/solid/c3"><span class="tag">标3</span><h3>距离与夹角的坐标算法</h3><p class="fx"><Katex tex="d=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}},\quad \sin\theta=\frac{|\vec u\cdot\vec n|}{|\vec u||\vec n|}" /></p><p>线线角与二面角用余弦（线线角取绝对值），线面角用正弦；二面角先算余弦再看图形定锐钝。垂足 <Katex tex="H=P-\frac{\overrightarrow{AP}\cdot\vec n}{|\vec n|^2}\vec n"/>。</p></router-link>
    </div>

    <h3 class="sec">组合与二项式 · 一 计数原理</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/combinatorics/c1"><span class="tag">计1</span><h3>分类加法与分步乘法</h3><p class="fx"><Katex tex="N=m_1+m_2+\cdots+m_k,\qquad N=m_1m_2\cdots m_k" /></p><p>判据是能否单独完成：各类互不重叠、任选其一即可的相加；几步依次进行、缺一步就完不成的相乘。<Katex tex="5" /> 人里选 <Katex tex="3" /> 人排队属于后者。</p></router-link>
      <router-link class="topic-card" to="/combinatorics/c2"><span class="tag">计2</span><h3>排列数与排列</h3><p class="fx"><Katex tex="\mathrm{A}_n^m=n(n-1)\cdots(n-m+1)=\frac{n!}{(n-m)!}" /></p><p>逐位可选数从 <Katex tex="n" /> 减到 <Katex tex="n-m+1" />，共 <Katex tex="m" /> 个因子；<Katex tex="m=n" /> 时是全排列 <Katex tex="n!" />，约定 <Katex tex="0!=1" />。</p></router-link>
    </div>

    <h3 class="sec">组合与二项式 · 二 排列与组合</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/combinatorics/p1"><span class="tag">排1</span><h3>组合数与组合数公式</h3><p class="fx"><Katex tex="\mathrm{C}_n^m=\frac{\mathrm{A}_n^m}{m!}=\frac{n!}{m!\,(n-m)!},\quad \mathrm{C}_n^m=\mathrm{C}_n^{\,n-m}" /></p><p>同一批元素内部有 <Katex tex="m!" /> 种顺序，排列数除以它就得到组合数；取出 <Katex tex="m" /> 个与留下 <Katex tex="n-m" /> 个一一对应，故可互换。</p></router-link>
      <router-link class="topic-card" to="/combinatorics/p2"><span class="tag">排2</span><h3>捆绑、插空与分组</h3><p class="fx"><Katex tex="(n-1)!\,2!,\quad (n-2)!\,\mathrm{A}_{n-1}^{2},\quad \frac{\mathrm{C}_{2k}^{k}}{2!}" /></p><p>相邻就捆成一块再乘块内顺序；不相邻就先排其余人、把两人放进不同空档；平均分组的组序要除掉，不等量分组不除。</p></router-link>
    </div>

    <h3 class="sec">组合与二项式 · 三 二项式定理</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/combinatorics/b1"><span class="tag">项1</span><h3>二项式定理与通项</h3><p class="fx"><Katex tex="(a+b)^n=\sum_{k=0}^{n}\mathrm{C}_n^ka^{n-k}b^k,\quad T_{k+1}=\mathrm{C}_n^ka^{n-k}b^k" /></p><p>取到 <Katex tex="k" /> 个 <Katex tex="b" /> 的方式有 <Katex tex="\mathrm{C}_n^k" /> 种，这也是二项式系数；项的系数还要乘上括号里的倍数，求指定项先解指数再回代。</p></router-link>
      <router-link class="topic-card" to="/combinatorics/b2"><span class="tag">项2</span><h3>杨辉三角与系数性质</h3><p class="fx"><Katex tex="\mathrm{C}_n^k=\mathrm{C}_{n-1}^{k-1}+\mathrm{C}_{n-1}^k,\qquad \sum_{k=0}^{n}\mathrm{C}_n^k=2^n" /></p><p>两端为 1，中间由肩上两数相加；同行对称、向中间先增后减，<Katex tex="n" /> 偶时正中间一项最大，<Katex tex="n" /> 奇时中间两项并列最大。</p></router-link>
      <router-link class="topic-card" to="/combinatorics/b3"><span class="tag">项3</span><h3>赋值法与系数和</h3><p class="fx"><Katex tex="f(1)=2^n,\quad f(-1)=0,\quad \frac{f(1)\pm f(-1)}{2}=2^{n-1}" /></p><p>给 <Katex tex="x=1" /> 得全部系数和，给 <Katex tex="x=-1" /> 得奇偶项之差；两式相加除以 2 取偶次项和，相减取奇次项和。</p></router-link>
    </div>

    <h3 class="sec">组合与二项式 · 四 组合恒等式与应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/combinatorics/i1"><span class="tag">恒1</span><h3>帕斯卡恒等式与网格路径</h3><p class="fx"><Katex tex="\mathrm{C}_{m+n}^{\,m}=\mathrm{C}_{m+n-1}^{\,m-1}+\mathrm{C}_{m+n-1}^{\,m}" /></p><p>只能向右或向上走到 <Katex tex="(m,n)" />，路径数是组合数；每个格点等于左边加下边，网格上的加法就把帕斯卡恒等式摆出来了。</p></router-link>
      <router-link class="topic-card" to="/combinatorics/i2"><span class="tag">恒2</span><h3>近似计算与整除性</h3><p class="fx"><Katex tex="(1+a)^n=1+na+a^2M" /></p><p><Katex tex="a" /> 小时舍去 <Katex tex="a^2" /> 及以后得近似值；<Katex tex="a" /> 是整数时余项是 <Katex tex="a^2" /> 的整数倍，用来求大数除以小数的余数。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 一 随机事件与概率</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/g1"><span class="tag">概1</span><h3>事件的关系与运算</h3><p class="fx"><Katex tex="P(A\cup B)=P(A)+P(B)-P(A\cap B)" /></p><p>事件就是样本点的集合，并、交、对立各对应一种运算；互斥时末项为零，对立时两项之和为 1。容斥公式对任意两事件都成立。</p></router-link>
      <router-link class="topic-card" to="/probability/g2"><span class="tag">概2</span><h3>频率与几何概型</h3><p class="fx"><Katex tex="P(A)=\frac{\mu(A)}{\mu(\Omega)}" /></p><p>频率随试验次数增大而稳定到概率；古典概型数样本点，几何概型取长度、面积或体积之比，关键在于「等可能」落在哪种测度上。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 二 条件概率与独立性</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/c1"><span class="tag">独1</span><h3>条件概率与乘法公式</h3><p class="fx"><Katex tex="P(B\mid A)=\frac{P(AB)}{P(A)},\qquad P(AB)=P(A)P(B\mid A)" /></p><p>已知 <Katex tex="A"/> 发生后样本空间缩到 <Katex tex="A"/> 内；把同时发生拆成两步相乘，多步时逐次乘下去。</p></router-link>
      <router-link class="topic-card" to="/probability/c2"><span class="tag">独2</span><h3>全概率与贝叶斯公式</h3><p class="fx"><Katex tex="P(B)=\sum_i P(A_i)P(B\mid A_i),\qquad P(A_1\mid B)=\frac{P(A_1)P(B\mid A_1)}{P(B)}" /></p><p>先按完备事件组分类再各自相乘求和；把全概率放进分母，就由先验改写出后验。条件概率的方向不能倒置。</p></router-link>
      <router-link class="topic-card" to="/probability/c3"><span class="tag">独3</span><h3>相互独立与独立重复试验</h3><p class="fx"><Katex tex="P(AB)=P(A)P(B),\qquad 1-(1-p)^n" /></p><p>独立时乘法化简为直接相乘，多个事件还需两两独立之外的整体独立；至少发生一次取对立事件算。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 三 随机变量与分布</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/r1"><span class="tag">分1</span><h3>随机变量与分布列</h3><p class="fx"><Katex tex="p_i\ge 0,\qquad \sum_{i}p_i=1" /></p><p>把试验结果映射成数，分布列列出每个取值与对应概率；两条性质既是检验也是求未知概率的方程。</p></router-link>
      <router-link class="topic-card" to="/probability/r2"><span class="tag">分2</span><h3>二项分布与超几何分布</h3><p class="fx"><Katex tex="P(X=k)=\mathrm{C}_n^kp^k(1-p)^{n-k},\qquad P(X=k)=\frac{\mathrm{C}_M^k\mathrm{C}_{N-M}^{n-k}}{\mathrm{C}_N^n}" /></p><p>独立重复试验的成功次数服从 <Katex tex="B(n,p)"/>；不放回抽取服从超几何分布，分界就在放回与否。</p></router-link>
      <router-link class="topic-card" to="/probability/r3"><span class="tag">分3</span><h3>连续型随机变量与正态分布</h3><p class="fx"><Katex tex="P(a\lt X\lt b)=\int_a^b f(x)\,dx,\qquad \mu\pm\sigma\to 68.27\%" /></p><p>密度曲线下的面积就是概率，单点取值的概率为零；正态分布由 <Katex tex="\mu"/> 与 <Katex tex="\sigma"/> 决定，三档面积为 68.27%、95.45%、99.73%。</p></router-link>
      <router-link class="topic-card" to="/probability/r4"><span class="tag">分4</span><h3>卡方分布与其他分布</h3><p class="fx"><Katex tex="\chi^2=\sum_{i=1}^{k}Z_i^2\sim\chi^2(k)" /></p><p>标准正态的平方和服从 <Katex tex="\chi^2(k)"/>，均值等于自由度、峰值在 <Katex tex="k-2"/>；上侧面积就是检验里的 p 值。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 四 数字特征</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/n1"><span class="tag">数1</span><h3>数学期望</h3><p class="fx"><Katex tex="E(X)=\sum_i x_ip_i,\qquad E(aX+b)=aE(X)+b" /></p><p>以概率为权重的平均，是分布的重心；期望未必等于某个可能取值，二项分布 <Katex tex="E(X)=np"/>。</p></router-link>
      <router-link class="topic-card" to="/probability/n2"><span class="tag">数2</span><h3>方差与标准差</h3><p class="fx"><Katex tex="D(X)=E(X^2)-E(X)^2,\qquad D(aX+b)=a^2D(X)" /></p><p>偏离期望的平方按概率平均，标准差与原始数据同量纲；加减常数不改变波动，乘以常数按平方放大。</p></router-link>
      <router-link class="topic-card" to="/probability/n3"><span class="tag">数3</span><h3>协方差与相关系数</h3><p class="fx"><Katex tex="\operatorname{cov}(X,Y)=E(XY)-E(X)E(Y),\qquad \rho\in[-1,1]" /></p><p>同向变化时协方差为正、反向为负；除以两个标准差归一得相关系数，它只度量线性关系，不相关不等于独立。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 五 统计</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/t1"><span class="tag">统1</span><h3>抽样方法与频率分布直方图</h3><p class="fx"><Katex tex="\text{高}=\frac{\text{频率}}{\text{组距}},\qquad \sum\text{面积}=1" /></p><p>简单随机逐个等可能地抽，分层抽样按各层人数比例分配样本量；直方图的纵轴是频率除以组距，只有面积才是频率。</p></router-link>
      <router-link class="topic-card" to="/probability/t2"><span class="tag">统2</span><h3>样本的数字特征</h3><p class="fx"><Katex tex="s^2=\frac1n\sum(x_i-\bar x)^2,\qquad s=\sqrt{s^2}" /></p><p>平均数用上每一个数、对极端值敏感，中位数只看位置；方差与标准差描述波动，变换规律是 <Katex tex="a^2s^2"/>、<Katex tex="|a|s"/>。</p></router-link>
      <router-link class="topic-card" to="/probability/t3"><span class="tag">统3</span><h3>一元线性回归</h3><p class="fx"><Katex tex="\hat b=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2},\qquad \hat a=\bar y-\hat b\bar x" /></p><p>最小二乘取残差平方和最小的直线，它必然过样本中心点；回归只作预测，不能外推，也不说明因果。</p></router-link>
    </div>

    <h3 class="sec">概率与统计 · 六 统计推断与检验</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/probability/j1"><span class="tag">检1</span><h3>假设检验与两类错误</h3><p class="fx"><Katex tex="\alpha=P(\text{弃真}),\qquad \beta=P(\text{取伪})" /></p><p>先设 <Katex tex="H_0"/> 成立、再看结果有多难出现；样本量固定时 <Katex tex="\alpha"/> 与 <Katex tex="\beta"/> 此消彼长。p 值不是 <Katex tex="H_0"/> 为真的概率。</p></router-link>
      <router-link class="topic-card" to="/probability/j2"><span class="tag">检2</span><h3>独立性检验</h3><p class="fx"><Katex tex="\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}" /></p><p>与 3.841 比较得 95% 把握、与 6.635 比较得 99% 把握；小于临界值只说证据不足，不能断言两者无关。</p></router-link>
      <router-link class="topic-card" to="/probability/j3"><span class="tag">检3</span><h3>正态分布下的均值检验</h3><p class="fx"><Katex tex="z=\frac{\bar x-\mu_0}{\sigma/\sqrt n}\sim N(0,1)" /></p><p>标准误随 <Katex tex="\sqrt n"/> 缩小；双侧临界值 1.96、单侧 1.645，单侧必须在看数据之前定方向。p 值小于 <Katex tex="\alpha"/> 就拒绝 <Katex tex="H_0"/>。</p></router-link>
    </div>

    <h3 class="sec">数值计算 · 一 误差</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numeric/e1"><span class="tag">误1</span><h3>误差与有效数字</h3><p class="fx"><Katex tex="|x-x^*|\le\tfrac12\times10^{-k}\ \Longleftrightarrow\ k \text{ 位有效}" /></p><p>绝对误差带量纲，相对误差是比值；误差不超过半个末位单位时，写出的每一位都算有效数字，直接截断则不保证。</p></router-link>
      <router-link class="topic-card" to="/numeric/e2"><span class="tag">误2</span><h3>误差的传播与条件数</h3><p class="fx"><Katex tex="|\Delta y|\approx|f'(x_0)|\,\Delta x,\qquad C=\left|\frac{xf'}{f}\right|" /></p><p>斜率放大绝对误差；加减看绝对误差相加，乘除看相对误差相加。条件数大的问题，输入的微小扰动会被放大成输出的巨大偏差。</p></router-link>
    </div>

    <h3 class="sec">数值计算 · 二 方程求根</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numeric/i1"><span class="tag">迭1</span><h3>二分法</h3><p class="fx"><Katex tex="|x_n-x^*|\le\frac{b-a}{2^{n+1}}" /></p><p>连续且两端异号就必有根；每折一次区间减半，误差界只由初始区间与步数决定，与函数形状无关，稳但慢。</p></router-link>
      <router-link class="topic-card" to="/numeric/i2"><span class="tag">迭2</span><h3>牛顿迭代与弦截法</h3><p class="fx"><Katex tex="x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)},\qquad e_{n+1}\approx\frac{f''}{2f'}e_n^2" /></p><p>用切线代替曲线，根附近误差平方下降；初值太远会跑飞，导数为零处无定义。弦截法以割线斜率代替导数，收敛阶约 1.618。</p></router-link>
      <router-link class="topic-card" to="/numeric/i3"><span class="tag">迭3</span><h3>不动点迭代与压缩映射</h3><p class="fx"><Katex tex="x_{n+1}=\varphi(x_n),\qquad |\varphi'|\le L\lt 1" /></p><p>斜率绝对值小于 1 时收敛到唯一不动点，误差按 <Katex tex="L^n"/> 缩小；蛛网图在斜率为负时会摆动着收拢，大于 1 则向外散开。</p></router-link>
    </div>

    <h3 class="sec">数值计算 · 三 数据拟合</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numeric/f1"><span class="tag">拟1</span><h3>最小二乘与线性拟合</h3><p class="fx"><Katex tex="\hat a=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2},\qquad \hat b=\bar y-\hat a\bar x" /></p><p>残差平方和是二次函数，最小值点唯一，直线必过样本中心；残差之和为零、与 <Katex tex="x"/> 不相关，<Katex tex="R^2=1-S/S_0"/> 衡量解释力。</p></router-link>
      <router-link class="topic-card" to="/numeric/f2"><span class="tag">拟2</span><h3>非线性拟合与线性化</h3><p class="fx"><Katex tex="y=Ae^{bx}\Rightarrow\ln y=bx+\ln A,\qquad y=Ax^b\Rightarrow\ln y=b\ln x+\ln A" /></p><p>指数型纵轴取对数、幂函数型双对数，都化为直线；斜率给指数，截距取指数还原系数。变换后的残差不再是原坐标的残差。</p></router-link>
    </div>

    <h3 class="sec">数值计算 · 四 函数逼近</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numeric/a1"><span class="tag">逼1</span><h3>泰勒多项式与余项界</h3><p class="fx"><Katex tex="P_n=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k,\qquad |R_n|\le\frac{M}{(n+1)!}|x-x_0|^{n+1}" /></p><p>逐阶对齐导数就得到泰勒多项式；余项界随阶数迅速变小，但只在展开点附近可靠，向外按幂次放大。</p></router-link>
      <router-link class="topic-card" to="/numeric/a2"><span class="tag">逼2</span><h3>插值多项式与龙格现象</h3><p class="fx"><Katex tex="P_n(x)=\sum_i y_i\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}" /></p><p>插值多项式穿过全部节点且唯一；等距节点加密时两端振荡发散（龙格现象），改取端点较密的切比雪夫节点即可压住。</p></router-link>
      <router-link class="topic-card" to="/numeric/a3"><span class="tag">逼3</span><h3>数值积分：梯形与辛普森</h3><p class="fx"><Katex tex="T_n\sim h^2,\qquad S_n\sim h^4" /></p><p>梯形把每段换成直线，误差与 <Katex tex="f''"/> 成正比；辛普森每两段配一条抛物线，低于三次的多项式精确成立。段数翻倍，误差分别降到 1/4 与 1/16。</p></router-link>
    </div>

    <h3 class="sec">线性代数初步 · 一 行列式</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linalg/d1"><span class="tag">行1</span><h3>二阶行列式与面积</h3><p class="fx"><Katex tex="D=\begin{vmatrix}a_1&amp;b_1\\a_2&amp;b_2\end{vmatrix}=a_1b_2-a_2b_1" /></p><p>两列张成的平行四边形有向面积；符号记录转向，<Katex tex="D=0"/> 时两列共线、图形压成线段。它就是二维向量积的坐标式。</p></router-link>
      <router-link class="topic-card" to="/linalg/d2"><span class="tag">行2</span><h3>三阶行列式、体积与性质</h3><p class="fx"><Katex tex="|D|=S_{\text{底}}\cdot h,\qquad |A|=|A^{T}|" /></p><p>三列张成的平行六面体体积，按底面积乘高算；转置不变、换两行变号、某行拆成两行之和可拆开相加，三条性质各有几何解释。</p></router-link>
    </div>

    <h3 class="sec">线性代数初步 · 二 矩阵</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linalg/m1"><span class="tag">矩1</span><h3>矩阵的概念与线性运算</h3><p class="fx"><Katex tex="(A+B)_{ij}=a_{ij}+b_{ij},\qquad (\lambda A)_{ij}=\lambda a_{ij}" /></p><p>同型矩阵对应元素相加，数乘是每个元素乘同一个数；转置把行写成列，<Katex tex="(A^T)^T=A"/>。</p></router-link>
      <router-link class="topic-card" to="/linalg/m2"><span class="tag">矩2</span><h3>矩阵乘法与转置</h3><p class="fx"><Katex tex="c_{ij}=\sum_{k=1}^{s}a_{ik}b_{kj},\qquad (AB)^{T}=B^{T}A^{T}" /></p><p>左矩阵一行乘右矩阵一列再求和；结合律成立，交换律、消去律、无零因子三条都不成立。</p></router-link>
      <router-link class="topic-card" to="/linalg/m3"><span class="tag">矩3</span><h3>逆矩阵、初等变换与秩</h3><p class="fx"><Katex tex="A^{-1}=\frac{1}{|A|}A^{*},\qquad r(A)<r(A|b)\Rightarrow\text{无解}" /></p><p><Katex tex="|A|\ne0"/> 时可逆；初等行变换不改变解集，化成阶梯形后主元个数即秩，两个秩决定唯一解、无穷多解或无解。</p></router-link>
    </div>

    <h3 class="sec">线性代数初步 · 三 矩阵与空间</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linalg/s1"><span class="tag">空1</span><h3>矩阵与二维线性变换</h3><p class="fx"><Katex tex="A=[T(e_1)\ T(e_2)],\qquad S_{\text{像}}=|\det A|\,S" /></p><p>两列就是基向量的像，整张格网被拉成平行四边形格网；面积乘 <Katex tex="|\det A|"/>，行列式为零则平面被压成一条直线。</p></router-link>
      <router-link class="topic-card" to="/linalg/s2"><span class="tag">空2</span><h3>矩阵与三维线性变换</h3><p class="fx"><Katex tex="V_{\text{像}}=|\det A|\cdot 1=\left|p_1\cdot(p_2\times p_3)\right|" /></p><p>单位立方体映成以三列为棱的平行六面体，体积倍数即 <Katex tex="|\det A|"/>；符号记录是否翻手。</p></router-link>
      <router-link class="topic-card" to="/linalg/s3"><span class="tag">空3</span><h3>秩、平面与方程组</h3><p class="fx"><Katex tex="ax+by+cz=d\ \longleftrightarrow\ r(A),\ r(A|b)" /></p><p>三元一次方程是一块平面，三块平面的公共部分只有点、直线、空三种；比较两个秩即知属于哪种。</p></router-link>
    </div>

    <h3 class="sec">线性代数初步 · 四 特征值</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linalg/e1"><span class="tag">特1</span><h3>特征值与特征向量</h3><p class="fx"><Katex tex="A\vec v=\lambda\vec v,\qquad \lambda^2-\mathrm{tr}A\cdot\lambda+\det A=0" /></p><p>特征方向只伸缩不转向；两根之和为迹、之积为行列式，判别式小于零则没有实特征方向。</p></router-link>
      <router-link class="topic-card" to="/linalg/e2"><span class="tag">特2</span><h3>对角化与矩阵的幂</h3><p class="fx"><Katex tex="A=PDP^{-1}\ \Rightarrow\ A^{n}=PD^{n}P^{-1}" /></p><p>特征向量按列拼成 <Katex tex="P"/>，换到特征基后变换只是两个坐标各乘一个系数；高次幂化作两个数的幂。</p></router-link>
      <router-link class="topic-card" to="/linalg/e3"><span class="tag">特3</span><h3>反复作用与主特征方向</h3><p class="fx"><Katex tex="\vec x_k=A^k\vec x_0=c_1\lambda_1^k\vec v_1+c_2\lambda_2^k\vec v_2" /></p><p><Katex tex="|\lambda_1|>|\lambda_2|"/> 时方向趋于主特征方向，长度比值趋于 <Katex tex="|\lambda_1|"/>；比值越小靠拢越快。</p></router-link>
    </div>

    <h3 class="sec">线性代数初步 · 五 二次型</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/linalg/q1"><span class="tag">型1</span><h3>二次型与它的曲线</h3><p class="fx"><Katex tex="ax^2+bxy+cy^2=\vec x^{T}A\vec x,\quad A=\begin{bmatrix}a&amp;b/2\\b/2&amp;c\end{bmatrix}" /></p><p>交叉项系数一半进矩阵；等值线是圆锥曲线，形状由两个特征值的符号决定——同正椭圆、异号双曲线、同负空集。</p></router-link>
      <router-link class="topic-card" to="/linalg/q2"><span class="tag">型2</span><h3>转轴化标准形</h3><p class="fx"><Katex tex="\tan2\theta=\frac{b}{a-c},\qquad \lambda_1x'^2+\lambda_2y'^2=1" /></p><p>转过 <Katex tex="\theta"/> 消掉交叉项，新轴即两条特征方向；半轴 <Katex tex="1/\sqrt{\lambda}"/>，与特征值成反比。</p></router-link>
      <router-link class="topic-card" to="/linalg/q3"><span class="tag">型3</span><h3>用特征值给曲线分类</h3><p class="fx"><Katex tex="\lambda_1\lambda_2=\det A,\qquad \lambda_1+\lambda_2=\mathrm{tr}A" /></p><p>先看乘积：负为双曲线、零为退化；再看和：正为椭圆、负为空集。与判别式 <Katex tex="B^2-4AC"/> 的符号判据一致。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 一 极限与连续</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/l1"><span class="tag">极1</span><h3>数列极限的 ε-N 定义</h3><p class="fx"><Katex tex="\forall\varepsilon>0\ \exists N,\ n>N\Rightarrow|a_n-L|<\varepsilon" /></p><p>先给误差再找起点，<Katex tex="N"/> 依赖 <Katex tex="\varepsilon"/>；收敛必唯一、必有界，有界不必收敛。</p></router-link>
      <router-link class="topic-card" to="/calc1/l2"><span class="tag">极2</span><h3>左右极限与双侧极限</h3><p class="fx"><Katex tex="\lim_{x\to x_0}f=A\iff f(x_0^-)=f(x_0^+)=A" /></p><p>去心邻域里的趋势，与 <Katex tex="f(x_0)"/> 的取值无关；两侧不等则双侧极限不存在。</p></router-link>
      <router-link class="topic-card" to="/calc1/l3"><span class="tag">极3</span><h3>无穷小的阶与等价替换</h3><p class="fx"><Katex tex="\lim\frac{\beta}{\alpha}=1\iff\beta\sim\alpha;\quad \sin x\sim x,\ 1-\cos x\sim\frac{x^2}{2}" /></p><p>无穷小是极限为零的变量；等价替换只在乘除因子上做，加减中相消会丢掉主项。</p></router-link>
      <router-link class="topic-card" to="/calc1/l4"><span class="tag">极4</span><h3>连续与间断的分类</h3><p class="fx"><Katex tex="\lim_{x\to x_0}f(x)=f(x_0)" /></p><p>左右极限都存在看第一类（可去、跳跃），否则第二类（无穷、振荡）；闭区间连续给出有界、最值、介值、零点四条性质。</p></router-link>
      <router-link class="topic-card" to="/calc1/l5"><span class="tag">极5</span><h3>两个重要极限</h3><p class="fx"><Katex tex="\lim_{x\to0}\frac{\sin x}{x}=1,\qquad \lim_{n\to\infty}\left(1+\frac1n\right)^n=e" /></p><p>前一个由单位圆里的面积夹逼，后一个由单调有界；<Katex tex="\sin x<x<\tan x"/> 只在弧度制下成立。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 二 导数与微分</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/d1"><span class="tag">微1</span><h3>导数是差商的极限</h3><p class="fx"><Katex tex="f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}" /></p><p>割线绕定点转到切线，斜率由差商收向导数；可导必连续，连续不必可导（<Katex tex="|x|"/> 在原点）。</p></router-link>
      <router-link class="topic-card" to="/calc1/d2"><span class="tag">微2</span><h3>四则与复合求导</h3><p class="fx"><Katex tex="(uv)'=u'v+uv',\qquad \frac{dy}{dx}=\frac{dy}{du}\cdot\frac{du}{dx}" /></p><p>乘积法则由矩形面积的三块增量拼出，角上那块按 <Katex tex="t^2"/> 先退；复合函数的速率逐层相乘。</p></router-link>
      <router-link class="topic-card" to="/calc1/d3"><span class="tag">微3</span><h3>微分是增量的线性主部</h3><p class="fx"><Katex tex="dy=f'(x)\,dx,\qquad \Delta y-dy=o(dx)" /></p><p>沿切线量出的增量与实际增量之差是 <Katex tex="dx"/> 的高阶无穷小，系数是 <Katex tex="\tfrac12 f''(\xi)"/>。</p></router-link>
      <router-link class="topic-card" to="/calc1/d4"><span class="tag">微4</span><h3>三个中值定理</h3><p class="fx"><Katex tex="f(b)-f(a)=f'(\xi)(b-a)" /></p><p>闭区间连续、开区间可导即可；把 <Katex tex="b-a"/> 换成 <Katex tex="g(b)-g(a)"/>、<Katex tex="f'"/> 换成两率之比就是柯西定理，罗尔定理则是弦水平的特例。</p></router-link>
      <router-link class="topic-card" to="/calc1/d5"><span class="tag">微5</span><h3>洛必达法则</h3><p class="fx"><Katex tex="\lim\frac{f(x)}{g(x)}=\lim\frac{f'(x)}{g'(x)}" /></p><p>只对 <Katex tex="0/0"/> 与 <Katex tex="\infty/\infty"/> 两种型式直接可用，先认型式再动手；导数之比的极限不存在时法则失效，原极限未必不存在。</p></router-link>
      <router-link class="topic-card" to="/calc1/d6"><span class="tag">微6</span><h3>泰勒公式与余项</h3><p class="fx"><Katex tex="f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k+R_n" /></p><p>多项式逐阶对齐导数，系数由各阶导数值定出；拉格朗日余项 <Katex tex="R_n"/> 是 <Katex tex="(x-x_0)^{n+1}"/> 量级，用来估计误差。</p></router-link>
      <router-link class="topic-card" to="/calc1/d7"><span class="tag">微7</span><h3>单调、极值与凹凸</h3><p class="fx"><Katex tex="f'>0\Rightarrow\uparrow,\quad f'=0\ \text{且变号}\Rightarrow\text{极值}" /></p><p>一阶导数切分单调区间；二阶导数的符号定凹凸，<Katex tex="f''"/> 变号处是拐点。列表即得整条曲线的形状。</p></router-link>
      <router-link class="topic-card" to="/calc1/d8"><span class="tag">微8</span><h3>渐近线与作图</h3><p class="fx"><Katex tex="y=kx+b,\quad k=\lim_{x\to\infty}\frac{f(x)}{x}" /></p><p>先做一次除法拆成整式加真分式，商给出水平或斜渐近线；分母的零点只是竖直渐近线的候选，要看单侧是否趋于无穷。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 三 不定积分</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/i1"><span class="tag">积1</span><h3>原函数与不定积分</h3><p class="fx"><Katex tex="\int f(x)\,dx=F(x)+C,\qquad F'=f" /></p><p>同一区间上的原函数只差一个常数，所以结果是一个函数族；求完求导验算一遍，是这一章最快的把关。</p></router-link>
      <router-link class="topic-card" to="/calc1/i2"><span class="tag">积2</span><h3>换元积分法</h3><p class="fx"><Katex tex="\int f(\varphi(x))\varphi'(x)\,dx=\int f(u)\,du" /></p><p>凑微分把 <Katex tex="\varphi'(x)dx"/> 整块换成 <Katex tex="du"/>；根式用三角代换，<Katex tex="\sqrt{a^2-x^2}"/> 配 <Katex tex="x=a\sin t"/>。</p></router-link>
      <router-link class="topic-card" to="/calc1/i3"><span class="tag">积3</span><h3>分部积分法</h3><p class="fx"><Katex tex="\int u\,dv=uv-\int v\,du" /></p><p>按〈反、对、幂、三、指〉的次序选 <Katex tex="u"/>，多项式求导降次、指数与三角积分不变形；循环型移项解出。</p></router-link>
      <router-link class="topic-card" to="/calc1/i4"><span class="tag">积4</span><h3>有理函数的积分</h3><p class="fx"><Katex tex="\frac{P(x)}{Q(x)}=\sum\frac{A}{(x-a)^k}+\sum\frac{Bx+C}{(x^2+px+q)^k}" /></p><p>假分式先做除法，真分式拆成四类最简分式；二次因式配方后出对数与反正切。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 四 定积分</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/f1"><span class="tag">定1</span><h3>定积分是和的极限</h3><p class="fx"><Katex tex="\int_a^b f(x)\,dx=\lim_{\lambda\to0}\sum_{i=1}^{n}f(\xi_i)\Delta x_i" /></p><p>分割、近似、求和、取极限；只要可积，和数与取点方式无关，但取端点与取中点收敛的快慢不同。</p></router-link>
      <router-link class="topic-card" to="/calc1/f2"><span class="tag">定2</span><h3>变上限积分与基本定理</h3><p class="fx"><Katex tex="\Phi(x)=\int_a^x f(t)\,dt,\qquad \Phi'(x)=f(x)" /></p><p>变上限积分对上限求导还原被积函数，于是求导与积分互为逆运算；牛顿-莱布尼茨公式把定积分化成原函数的差。</p></router-link>
      <router-link class="topic-card" to="/calc1/f3"><span class="tag">定3</span><h3>对称区间的奇偶性</h3><p class="fx"><Katex tex="\int_{-a}^{a}f=0\ (\text{奇}),\qquad \int_{-a}^{a}f=2\int_0^a f\ (\text{偶})" /></p><p>先看奇偶再动手：奇函数两块有向面积一正一负相消，偶函数只算一半再乘二，省掉一半的计算。</p></router-link>
      <router-link class="topic-card" to="/calc1/f4"><span class="tag">定4</span><h3>反常积分与 p 积分</h3><p class="fx"><Katex tex="\int_1^{\infty}\frac{dx}{x^p}\ \text{收敛}\iff p\gt1,\qquad \int_0^1\frac{dx}{x^p}\ \text{收敛}\iff p\lt1" /></p><p>无穷限与被积函数无界都按极限定义；两头的临界指数相反，截断值随上限增长的方向正好颠倒。</p></router-link>
      <router-link class="topic-card" to="/calc1/f5"><span class="tag">定5</span><h3>面积与旋转体体积</h3><p class="fx"><Katex tex="S=\int_a^b|f-g|\,dx,\qquad V=\pi\int_a^b f^2\,dx" /></p><p>面积取上减下并加绝对值，交叉处要分段；旋转体按切片积分，每片是半径 <Katex tex="|f(x)|"/> 的圆盘。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 五 常微分方程</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/o1"><span class="tag">方1</span><h3>方向场与通解</h3><p class="fx"><Katex tex="y'=f(x,y),\qquad y(x_0)=y_0" /></p><p>方程在每点给出一段斜率，积分曲线处处与之相切；通解是一族曲线，初值挑出其中一条。</p></router-link>
      <router-link class="topic-card" to="/calc1/o2"><span class="tag">方2</span><h3>可分离变量方程</h3><p class="fx"><Katex tex="\frac{dy}{g(y)}=f(x)\,dx\ \Rightarrow\ \int\frac{dy}{g(y)}=\int f(x)\,dx" /></p><p>把两个变量分到两边再各自积分；除以 <Katex tex="g(y)"/> 时若 <Katex tex="g(y_0)=0"/>，那条常数解要单独补回。</p></router-link>
      <router-link class="topic-card" to="/calc1/o3"><span class="tag">方3</span><h3>一阶线性方程</h3><p class="fx"><Katex tex="y'+P(x)y=Q(x),\quad y=e^{-\int P}\left(\int Q e^{\int P}dx+C\right)" /></p><p>通解 = 齐次通解 + 一个特解；乘上积分因子把左边凑成 <Katex tex="(ye^{\int P})'"/>。</p></router-link>
      <router-link class="topic-card" to="/calc1/o4"><span class="tag">方4</span><h3>可降阶的高阶方程</h3><p class="fx"><Katex tex="y''=f(x,y')\ \Rightarrow\ p=y',\ p'=f(x,p)" /></p><p>缺 <Katex tex="y"/> 时令 <Katex tex="p=y'"/> 降一阶，缺 <Katex tex="x"/> 时令 <Katex tex="p(y)"/> 并把 <Katex tex="y''"/> 换成 <Katex tex="p\,dp/dy"/>。</p></router-link>
      <router-link class="topic-card" to="/calc1/o5"><span class="tag">方5</span><h3>二阶常系数线性方程</h3><p class="fx"><Katex tex="y''+py'+qy=0,\qquad \lambda^2+p\lambda+q=0" /></p><p>特征根决定解的形状：两不等实根给两条指数、重根补一个 <Katex tex="xe^{\lambda x}"/>、共轭复根给衰减振荡。</p></router-link>
      <router-link class="topic-card" to="/calc1/o6"><span class="tag">方6</span><h3>微分方程的建模</h3><p class="fx"><Katex tex="N'=kN,\qquad x''=-\omega^2x,\qquad L\,i'+Ri=E" /></p><p>先设变量、写出变化率之间的关系，再连同初始条件一起求解；增长与衰减的差别只在 <Katex tex="k"/> 的符号。</p></router-link>
    </div>

    <h3 class="sec">一元函数微积分 · 六 无穷级数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc1/s1"><span class="tag">级1</span><h3>级数收敛与部分和</h3><p class="fx"><Katex tex="\sum_{n=1}^{\infty}a_n\ \text{收敛}\iff S_n=\sum_{k=1}^{n}a_k\ \text{有极限}" /></p><p>级数的和就是部分和数列的极限；通项趋于零只是必要条件，调和级数就是反例。</p></router-link>
      <router-link class="topic-card" to="/calc1/s2"><span class="tag">级2</span><h3>比值判别法</h3><p class="fx"><Katex tex="\rho=\lim\frac{a_{n+1}}{a_n}:\ \rho\lt1\ \text{收敛},\ \rho\gt1\ \text{发散}" /></p><p>后项比前项一致地小于 1 就收敛；<Katex tex="\rho=1"/> 时判别法失效，要换比较或积分判别。</p></router-link>
      <router-link class="topic-card" to="/calc1/s3"><span class="tag">级3</span><h3>交错级数与莱布尼茨判别</h3><p class="fx"><Katex tex="a_n\downarrow0\ \Rightarrow\ \sum(-1)^{n-1}a_n\ \text{收敛},\quad |S-S_n|\le a_{n+1}" /></p><p>两支部分和从两侧互相靠拢；误差不超过第一个被舍掉的项。通项不趋于零时不可能收敛。</p></router-link>
      <router-link class="topic-card" to="/calc1/s4"><span class="tag">级4</span><h3>幂级数、收敛半径与泰勒展开</h3><p class="fx"><Katex tex="R=\lim\left|\frac{a_n}{a_{n+1}}\right|,\qquad f(x)=\sum_{k\ge0}\frac{f^{(k)}(0)}{k!}x^k" /></p><p>半径内绝对收敛、半径外发散，端点要单独判；泰勒级数在收敛半径内才等于原函数，截断误差随项数下降。</p></router-link>
      <router-link class="topic-card" to="/calc1/s5"><span class="tag">级5</span><h3>傅里叶级数初步</h3><p class="fx"><Katex tex="\frac{4}{\pi}\sum_{k=1,3,5,\dots}\frac{\sin kx}{k}=\text{方波}" /></p><p>用谐波叠加拼出周期函数，项数越多轮廓越方；跳变处的超调不会随项数消失，只是被压窄。</p></router-link>
    </div>

    <h3 class="sec">空间解析几何 · 一 空间向量</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/spacegeom/v1"><span class="tag">向1</span><h3>空间直角坐标与向量</h3><p class="fx"><Katex tex="\vec a=(x,y,z),\qquad |\vec a|=\sqrt{x^2+y^2+z^2}" /></p><p>三条坐标轴把空间分成八个卦限；加减与数乘按分量进行，方向余弦是各分量与模之比。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/v2"><span class="tag">向2</span><h3>数量积</h3><p class="fx"><Katex tex="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta=x_1x_2+y_1y_2+z_1z_2" /></p><p>夹角与投影都从数量积读出；垂直当且仅当点积为零，投影为零即两向量正交。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/v3"><span class="tag">向3</span><h3>向量积</h3><p class="fx"><Katex tex="|\vec a\times\vec b|=|\vec a||\vec b|\sin\theta" /></p><p>方向由右手法则定，同时垂直于两者；模等于两条向量张成的平行四边形面积，共线时为零向量。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/v4"><span class="tag">向4</span><h3>混合积</h3><p class="fx"><Katex tex="[\vec a\,\vec b\,\vec c]=\vec a\cdot(\vec b\times\vec c)" /></p><p>等于平行六面体的有向体积，底面积是叉积的模、高是第三个向量的投影；三向量共面当且仅当混合积为零。</p></router-link>
    </div>

    <h3 class="sec">空间解析几何 · 二 平面与直线</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/spacegeom/p1"><span class="tag">面1</span><h3>平面方程与法向量</h3><p class="fx"><Katex tex="A(x-x_0)+B(y-y_0)+C(z-z_0)=0" /></p><p>法向量是平面唯一的方向；一般式的三个系数就是法向量，截距式看三个坐标轴上的落点，原点到平面的距离是常数项除以法向量的模。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/p2"><span class="tag">面2</span><h3>空间直线的方程</h3><p class="fx"><Katex tex="\frac{x-x_0}{m}=\frac{y-y_0}{n}=\frac{z-z_0}{p}" /></p><p>定点加方向向量写成对称式，拆开就是参数式；两张平面的交线仍是一条直线，方向为两法向量的叉积。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/p3"><span class="tag">面3</span><h3>平行、垂直与夹角</h3><p class="fx"><Katex tex="\cos\theta=\frac{|\vec n_1\cdot\vec n_2|}{|\vec n_1||\vec n_2|}" /></p><p>两平面的夹角取法向量夹角的锐角；线面角的正弦等于方向向量与法向量夹角的余弦；两条直线共面与否由叉积与连线判断，否则为异面。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/p4"><span class="tag">面4</span><h3>空间的三类距离</h3><p class="fx"><Katex tex="d=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}" /></p><p>点到平面用点法式代入，点到直线用叉积的模除以方向向量的模，异面直线用混合积除以公垂线方向的模。</p></router-link>
    </div>

    <h3 class="sec">空间解析几何 · 三 曲面与曲线</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/spacegeom/s1"><span class="tag">曲1</span><h3>柱面与锥面</h3><p class="fx"><Katex tex="F(x,y)=0;\qquad \frac{x^2}{a^2}+\frac{y^2}{b^2}=\frac{z^2}{h^2}" /></p><p>方程缺一个变量就是柱面，母线沿缺失的变量方向平移；方程是齐次二次式就是锥面，沿射线伸缩后仍成立。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/s2"><span class="tag">曲2</span><h3>旋转曲面</h3><p class="fx"><Katex tex="x^2\ \to\ x^2+y^2" /></p><p>母线绕 <Katex tex="z"/> 轴旋转时，把 <Katex tex="x^2"/> 换成 <Katex tex="x^2+y^2"/>；方程里出现这一整块就说明曲面绕 <Katex tex="z"/> 轴而生。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/s3"><span class="tag">曲3</span><h3>二次曲面的分类与截痕</h3><p class="fx"><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}\pm\frac{z^2}{c^2}=\pm1" /></p><p>平方项的符号定类型：三个同号是椭球，一负一正是单叶、右边取负是双叶；出现一次项是抛物面。截痕法用一族平行平面逐层截开读形状。</p></router-link>
      <router-link class="topic-card" to="/spacegeom/s4"><span class="tag">曲4</span><h3>空间曲线</h3><p class="fx"><Katex tex="\begin{cases}x=x(t)\\ y=y(t)\\ z=z(t)\end{cases}" /></p><p>参数方程让点随参数动，一般方程是两张曲面的联立；消去参数得投影柱面，再与坐标平面联立才是投影曲线。</p></router-link>
    </div>

    <h3 class="sec">多元函数微积分 · 一 多元函数微分学</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc2/m1"><span class="tag">微1</span><h3>二重极限与连续</h3><p class="fx"><Katex tex="\lim_{(x,y)\to(x_0,y_0)}f(x,y)=A" /></p><p>沿任意路径趋于同一点时函数值都趋于同一个数，二重极限才存在；沿 <Katex tex="y=kx"/> 与沿 <Katex tex="y=x^2"/> 是两类常见反例。</p></router-link>
      <router-link class="topic-card" to="/calc2/m2"><span class="tag">微2</span><h3>偏导数与全微分</h3><p class="fx"><Katex tex="dz=f_x\,dx+f_y\,dy,\qquad \Delta z-dz=o(\rho)" /></p><p>偏导固定另一个变量、沿坐标轴量变化率；全微分要求增量被同一张切平面一致地逼近，可微比偏导存在更强。</p></router-link>
      <router-link class="topic-card" to="/calc2/m3"><span class="tag">微3</span><h3>复合函数与隐函数求导</h3><p class="fx"><Katex tex="\frac{dz}{dt}=f_u\,u'+f_v\,v',\qquad \frac{dy}{dx}=-\frac{F_x}{F_y}" /></p><p>链式法则沿树上的每条路相乘再相加；隐函数斜率要求 <Katex tex="F_y\ne0"/>，条件破坏处切线竖直。</p></router-link>
      <router-link class="topic-card" to="/calc2/m4"><span class="tag">微4</span><h3>方向导数与梯度</h3><p class="fx"><Katex tex="\frac{\partial f}{\partial l}=\nabla f\cdot e_l=|\nabla f|\cos\theta" /></p><p>方向导数是梯度在单位方向上的投影：沿梯度方向最大、沿等值线方向为零，梯度垂直于等值线。</p></router-link>
      <router-link class="topic-card" to="/calc2/m5"><span class="tag">微5</span><h3>多元函数的极值</h3><p class="fx"><Katex tex="AC-B^2\gt0\ \Rightarrow\ \text{极值},\qquad AC-B^2\lt0\ \Rightarrow\ \text{鞍点}" /></p><p>先解 <Katex tex="f_x=f_y=0"/> 得驻点，再看二阶判别式：正的且 <Katex tex="A\gt0"/> 为极小、<Katex tex="A\lt0"/> 为极大，负的是鞍点，等于零需另作考察。</p></router-link>
      <router-link class="topic-card" to="/calc2/m6"><span class="tag">微6</span><h3>拉格朗日乘数法</h3><p class="fx"><Katex tex="\nabla f=\lambda\nabla\varphi,\qquad \varphi(x,y)=0" /></p><p>约束曲线的切向不许有梯度分量，于是两支梯度共线、等值线与约束曲线相切；解出的 <Katex tex="\lambda"/> 读作约束放松一单位带来的增益。</p></router-link>
    </div>

    <h3 class="sec">多元函数微积分 · 二 重积分</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc2/r1"><span class="tag">重1</span><h3>二重积分的定义与性质</h3><p class="fx"><Katex tex="\iint_D f\,d\sigma=\lim_{\lambda\to0}\sum_{i}f(\xi_i,\eta_i)\Delta\sigma_i" /></p><p>分割、近似、求和、取极限；只要可积，分法与取点都不影响结果，连续函数一定可积。</p></router-link>
      <router-link class="topic-card" to="/calc2/r2"><span class="tag">重2</span><h3>二重积分的计算</h3><p class="fx"><Katex tex="\iint_D f\,d\sigma=\int_a^b dx\int_{y_1(x)}^{y_2(x)}f\,dy" /></p><p>先一后另一，竖条与横条两种扫法；内层限含外层变量，一种扫法走不通就换向或把区域拆成几块。</p></router-link>
      <router-link class="topic-card" to="/calc2/r3"><span class="tag">重3</span><h3>极坐标下的二重积分</h3><p class="fx"><Katex tex="\iint_D f\,d\sigma=\int_\alpha^\beta d\theta\int_{r_1(\theta)}^{r_2(\theta)}f(r\cos\theta,r\sin\theta)\,r\,dr" /></p><p>面积元是 <Katex tex="r\,dr\,d\theta"/>，多出来的 <Katex tex="r"/> 来自弧长 <Katex tex="r\Delta\theta"/>；区域带圆、被积函数含 <Katex tex="x^2+y^2"/> 时优先换。</p></router-link>
      <router-link class="topic-card" to="/calc2/r4"><span class="tag">重4</span><h3>三重积分</h3><p class="fx"><Katex tex="\iiint_\Omega f\,dV=\int_a^b dx\int_{y_1}^{y_2}dy\int_{z_1}^{z_2}f\,dz" /></p><p>穿线先对 <Katex tex="z"/> 积、切片先对 <Katex tex="x,y"/> 积，两种顺序都是三次一元积分；挑内层最好积的那个。</p></router-link>
      <router-link class="topic-card" to="/calc2/r5"><span class="tag">重5</span><h3>柱面坐标与球面坐标</h3><p class="fx"><Katex tex="dV=r\,dr\,d\theta\,dz,\qquad dV=\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta" /></p><p>两个因子都是坐标变换的雅可比；球面坐标的 <Katex tex="\varphi"/> 从 <Katex tex="z"/> 轴量起，<Katex tex="\rho^2\sin\varphi"/> 在两极处为零。</p></router-link>
      <router-link class="topic-card" to="/calc2/r6"><span class="tag">重6</span><h3>重积分的应用</h3><p class="fx"><Katex tex="M=\iint_D\rho\,d\sigma,\quad \bar x=\frac{1}{M}\iint_D x\rho\,d\sigma,\quad I_O=\iint_D(x^2+y^2)\rho\,d\sigma" /></p><p>质量、质心与转动惯量都是密度加权的积分；密度不均匀时质心离开形心，转动惯量按到轴的距离平方计。</p></router-link>
    </div>

    <h3 class="sec">多元函数微积分 · 三 曲线与曲面积分</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/calc2/c1"><span class="tag">线1</span><h3>第一类曲线积分</h3><p class="fx"><Katex tex="\int_C f\,ds=\int_\alpha^\beta f(x(t),y(t))\sqrt{x'^2+y'^2}\,dt" /></p><p>对弧长加权：被积函数当线密度，结果读作质量；与走向无关，换方向读数不变。</p></router-link>
      <router-link class="topic-card" to="/calc2/c2"><span class="tag">线2</span><h3>第二类曲线积分</h3><p class="fx"><Katex tex="\int_C P\,dx+Q\,dy=\int_\alpha^\beta\big(Px'+Qy'\big)\,dt" /></p><p>对坐标加权，读作力沿路径做的功；同一起点终点换一条路结果就变，走向反了结果变号。</p></router-link>
      <router-link class="topic-card" to="/calc2/c3"><span class="tag">线3</span><h3>格林公式</h3><p class="fx"><Katex tex="\oint_L P\,dx+Q\,dy=\iint_D\big(Q_x-P_y\big)\,d\sigma" /></p><p>边界取正向（区域在走向左侧）；单连通区域上「<Katex tex="Q_x=P_y"/>、存在原函数、闭路积分为零、与路径无关」四者等价。</p></router-link>
      <router-link class="topic-card" to="/calc2/c4"><span class="tag">线4</span><h3>第一类曲面积分</h3><p class="fx"><Katex tex="\iint_S f\,dS=\iint_D f(x,y,z(x,y))\sqrt{1+z_x^2+z_y^2}\,dx\,dy" /></p><p>投影面积要乘放大因子，因子等于法向量竖分量的倒数；球面上直接用 <Katex tex="R^2\sin\varphi\,d\varphi\,d\theta"/>。</p></router-link>
      <router-link class="topic-card" to="/calc2/c5"><span class="tag">线5</span><h3>第二类曲面积分</h3><p class="fx"><Katex tex="\iint_S F\cdot n\,dS=\iint_S P\,dydz+Q\,dzdx+R\,dxdy" /></p><p>通量取定一侧才有意义，换侧变号；分面投影时每一项投到各自的坐标面，双值曲面上下两片要分别取号。</p></router-link>
      <router-link class="topic-card" to="/calc2/c6"><span class="tag">线6</span><h3>高斯公式与斯托克斯公式</h3><p class="fx"><Katex tex="\iint_S F\cdot n\,dS=\iiint_\Omega\nabla\cdot F\,dV,\qquad \oint_\Gamma F\cdot dr=\iint_\Sigma(\nabla\times F)\cdot n\,dS" /></p><p>散度把闭曲面的通量换成三重积分，旋度把环流换成曲面上的通量；边界方向与法向成右手关系，开曲面先补面。</p></router-link>
    </div>

    <h3 class="sec">复变函数 · 一 复数与复变函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/complexvar/c1"><span class="tag">复1</span><h3>复数的几何表示</h3><p class="fx"><Katex tex="z=x+iy=re^{i\theta},\quad r=|z|,\ \theta=\arg z" /></p><p>点、模、辐角三件套；共轭关于实轴镜像，乘 <Katex tex="i"/> 即旋转 <Katex tex="90^\circ"/>，乘 <Katex tex="e^{i\theta}"/> 即转 <Katex tex="\theta"/>。</p></router-link>
      <router-link class="topic-card" to="/complexvar/c2"><span class="tag">复2</span><h3>映射的三种搬法</h3><p class="fx"><Katex tex="w=iz+1,\quad w=z^2,\quad w=\tfrac1z" /></p><p>平移复合旋转与伸缩保形状；平方把辐角加倍、半平面折成整平面；倒数把内部翻到外部，原点与无穷远互换。</p></router-link>
      <router-link class="topic-card" to="/complexvar/c3"><span class="tag">复3</span><h3>初等复变函数</h3><p class="fx"><Katex tex="e^{z+2\pi i}=e^z,\quad \operatorname{Log}z=\ln|z|+i(\theta+2k\pi)" /></p><p>指数函数的周期是 <Katex tex="2\pi i"/>，因此对数多值；取定一条分支才有单值的对数，幂函数的值的个数由指数定。</p></router-link>
    </div>

    <h3 class="sec">复变函数 · 二 解析函数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/complexvar/a1"><span class="tag">解1</span><h3>可导与解析</h3><p class="fx"><Katex tex="f'(z_0)=\lim_{\Delta z\to0}\frac{f(z_0+\Delta z)-f(z_0)}{\Delta z}" /></p><p>差商极限须与趋近方向无关；一点可导只是可导，邻域内处处可导才叫解析，<Katex tex="|z|^2"/> 在原点可导而不解析。</p></router-link>
      <router-link class="topic-card" to="/complexvar/a2"><span class="tag">解2</span><h3>柯西-黎曼方程</h3><p class="fx"><Katex tex="u_x=v_y,\qquad u_y=-v_x,\qquad f'=u_x+iv_x" /></p><p>可导的充要条件（配合可微）；两族等值线正交，实部与虚部都是调和函数，<Katex tex="f=\bar z"/> 处处不满足。</p></router-link>
      <router-link class="topic-card" to="/complexvar/a3"><span class="tag">解3</span><h3>柯西定理与路径变形</h3><p class="fx"><Katex tex="\oint_C f\,dz=0,\qquad \oint_{|z|=R}\frac{dz}{z}=2\pi i" /></p><p>单连通区域内处处解析，闭路积分为零；路径只要不扫过奇点就可以随意变形，<Katex tex="1/z"/> 绕原点一圈的积分与半径无关。</p></router-link>
      <router-link class="topic-card" to="/complexvar/a4"><span class="tag">解4</span><h3>柯西积分公式</h3><p class="fx"><Katex tex="f(z_0)=\frac{1}{2\pi i}\oint_C\frac{f(z)}{z-z_0}\,dz,\quad f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z-z_0)^{n+1}}\,dz" /></p><p>边界上的值定住内部每一点，因此一阶可导就自动无穷次可导；<Katex tex="z_0"/> 在圈外时积分为零，与 <Katex tex="f(z_0)"/> 无关。</p></router-link>
    </div>

    <h3 class="sec">复变函数 · 三 级数与留数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/complexvar/s1"><span class="tag">级1</span><h3>泰勒级数与收敛半径</h3><p class="fx"><Katex tex="f(z)=\sum_{n=0}^{\infty}\frac{f^{(n)}(z_0)}{n!}(z-z_0)^n,\quad R=|z_0-\zeta|_{\min}" /></p><p>圆盘内解析即能展开，收敛半径等于到最近奇点的距离 —— <Katex tex="\frac1{1+x^2}"/> 在实轴上光滑，半径仍是 <Katex tex="1"/>，奇点在 <Katex tex="\pm i"/>。</p></router-link>
      <router-link class="topic-card" to="/complexvar/s2"><span class="tag">级2</span><h3>洛朗级数与三类奇点</h3><p class="fx"><Katex tex="f(z)=\sum_{n=-\infty}^{\infty}a_n(z-z_0)^n" /></p><p>环域上允许负幂，主部有几项分三类：零项可去、有限项是极点（最低次幂即阶）、无穷多项是本性奇点。</p></router-link>
      <router-link class="topic-card" to="/complexvar/s3"><span class="tag">级3</span><h3>留数定理</h3><p class="fx"><Katex tex="\oint_C f\,dz=2\pi i\sum_{j}\operatorname{Res}[f,z_j],\qquad \operatorname{Res}[f,z_0]=\lim_{z\to z_0}(z-z_0)f(z)" /></p><p>只算圈内奇点、取逆时针；<Katex tex="f=g/h"/> 且 <Katex tex="h'"/> 不为零时留数是 <Katex tex="g(z_0)/h'(z_0)"/>，实积分靠补弧化成闭路来算。</p></router-link>
      <router-link class="topic-card" to="/complexvar/s4"><span class="tag">级4</span><h3>保角映射与分式线性变换</h3><p class="fx"><Katex tex="f'(z_0)\ne0\ \Rightarrow\ \text{保角},\qquad w=\frac{az+b}{cz+d},\ ad-bc\ne0" /></p><p>导数是一个旋转加一个伸缩，方向无关所以夹角不变；导数为零处角度被放大，分式线性变换把圆映成圆、三对点定一个。</p></router-link>
      <router-link class="topic-card" to="/complexvar/s5"><span class="tag">级5</span><h3>用留数计算实积分</h3><p class="fx"><Katex tex="\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}\,dx=2\pi i\sum_{\operatorname{Im}z\gt0}\operatorname{Res}[f,z]" /></p><p>补一段上半平面的大圆弧凑成闭路，分母比分子高两阶以上时弧上积分退零；带 <Katex tex="e^{ix}"/> 的因子取虚部，三角有理式先把 <Katex tex="z=e^{i\theta}"/> 代进去。</p></router-link>
    </div>

    <h3 class="sec">初等数论 · 一 整除与同余</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numtheory/z1"><span class="tag">整1</span><h3>带余除法</h3><p class="fx"><Katex tex="a=qm+r,\qquad 0\le r<m" /></p><p>商与余数由 <Katex tex="a"/>、<Katex tex="m"/> 唯一确定；余数把整数分成 <Katex tex="m"/> 个剩余类，同余的一切结论都从这条除法算式来。</p></router-link>
      <router-link class="topic-card" to="/numtheory/z2"><span class="tag">整2</span><h3>欧几里得算法与裴蜀等式</h3><p class="fx"><Katex tex="\gcd(a,b)=\gcd(b,a\bmod b),\qquad ax+by=\gcd(a,b)" /></p><p>辗转相除的最后一个非零余数就是最大公约数，步数对数级；把每步的余数倒推回去，两系数即为裴蜀系数。</p></router-link>
      <router-link class="topic-card" to="/numtheory/z3"><span class="tag">整3</span><h3>同余</h3><p class="fx"><Katex tex="a\equiv b\pmod m\iff m\mid(a-b)" /></p><p>同余可加可乘，也能与取模交换次序；两边同除须与模互素，模 <Katex tex="m"/> 的剩余类恰有 <Katex tex="m"/> 个。</p></router-link>
      <router-link class="topic-card" to="/numtheory/z4"><span class="tag">整4</span><h3>一次同余方程</h3><p class="fx"><Katex tex="ax\equiv b\pmod m,\quad d=\gcd(a,m)" /></p><p>有解当且仅当 <Katex tex="d\mid b"/>；有解时恰有 <Katex tex="d"/> 个解，约去 <Katex tex="d"/> 后模 <Katex tex="m/d"/> 唯一。</p></router-link>
    </div>

    <h3 class="sec">初等数论 · 二 数论定理</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numtheory/d1"><span class="tag">定1</span><h3>算术基本定理</h3><p class="fx"><Katex tex="n=p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k},\quad \tau(n)=\prod(a_i+1)" /></p><p>分解存在且不计顺序时唯一；约数个数与约数和都由指数读出，素数的个数无穷但分布越来越稀。</p></router-link>
      <router-link class="topic-card" to="/numtheory/d2"><span class="tag">定2</span><h3>欧拉函数</h3><p class="fx"><Katex tex="\varphi(n)=n\prod_{p\mid n}\left(1-\frac1p\right),\qquad \sum_{d\mid n}\varphi(d)=n" /></p><p>按素因子逐个打折；只在互素的两个数之间可乘，求和恒等式数的是约分的分母。</p></router-link>
      <router-link class="topic-card" to="/numtheory/d3"><span class="tag">定3</span><h3>费马小定理与欧拉定理</h3><p class="fx"><Katex tex="a^{\varphi(m)}\equiv1\pmod m\ (a\perp m),\qquad a^p\equiv a\pmod p" /></p><p>阶整除 <Katex tex="\varphi(m)"/>，大指数可按 <Katex tex="\varphi(m)"/> 降幂；逆元是 <Katex tex="a^{\varphi(m)-1}"/>。</p></router-link>
      <router-link class="topic-card" to="/numtheory/d4"><span class="tag">定4</span><h3>中国剩余定理</h3><p class="fx"><Katex tex="x\equiv a_i\pmod{m_i},\qquad x=\sum_i a_iM_iy_i" /></p><p>模两两互素时在模 <Katex tex="M=\prod m_i"/> 内唯一有解，<Katex tex="M_iy_i\equiv1"/>；不互素则先验 <Katex tex="a_i\equiv a_j"/> 在公共因子下的相容性。</p></router-link>
      <router-link class="topic-card" to="/numtheory/d5"><span class="tag">定5</span><h3>数论函数与莫比乌斯反演</h3><p class="fx"><Katex tex="g(n)=\sum_{d\mid n}f(d)\iff f(n)=\sum_{d\mid n}\mu(d)\,g\!\left(\frac nd\right)" /></p><p>整除和把 <Katex tex="f"/> 变成 <Katex tex="g"/>，反演公式沿同一组约数把它变回来；<Katex tex="\mu"/> 在无平方因子的数上取 <Katex tex="\pm1"/>、含平方因子处为零。</p></router-link>
    </div>

    <h3 class="sec">初等数论 · 三 二次剩余与应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/numtheory/s1"><span class="tag">剩1</span><h3>二次剩余与欧拉判别式</h3><p class="fx"><Katex tex="a^{\frac{p-1}{2}}\equiv\left(\frac ap\right)\pmod p" /></p><p>取 <Katex tex="1"/> 就有平方根、取 <Katex tex="-1"/> 就没有；剩余恰 <Katex tex="\frac{p-1}{2}"/> 个，两根为 <Katex tex="x"/> 与 <Katex tex="p-x"/>，判别靠互反律接力。</p></router-link>
      <router-link class="topic-card" to="/numtheory/s2"><span class="tag">剩2</span><h3>原根与指数</h3><p class="fx"><Katex tex="g^k\ (k=1,\dots,p-1),\qquad \operatorname{ind}_g(ab)=\operatorname{ind}_g a+\operatorname{ind}_g b" /></p><p>原根有 <Katex tex="\varphi(p-1)"/> 个，指数把乘法变成模 <Katex tex="p-1"/> 的加法；由幂反求指数是离散对数。</p></router-link>
      <router-link class="topic-card" to="/numtheory/s3"><span class="tag">剩3</span><h3>不定方程</h3><p class="fx"><Katex tex="ax+by=c\iff \gcd(a,b)\mid c" /></p><p>有解时先求一组特解，再加步长 <Katex tex="\left(\frac bd,-\frac ad\right)"/> 的整数倍；<Katex tex="x^2+y^2=z^2"/> 的全部正整数解由参数式给出。</p></router-link>
      <router-link class="topic-card" to="/numtheory/s4"><span class="tag">剩4</span><h3>RSA 与模运算</h3><p class="fx"><Katex tex="c\equiv m^e\pmod n,\qquad m\equiv c^d\pmod n,\qquad ed\equiv1\pmod{\varphi(n)}" /></p><p>两次模幂互逆，靠的是欧拉定理与 <Katex tex="n=pq"/> 分解的唯一性；只知道 <Katex tex="(n,e)"/> 时求 <Katex tex="d"/> 相当于分解 <Katex tex="n"/>。</p></router-link>
    </div>

    <h3 class="sec">拓扑学基础 · 一 拓扑空间</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/topology/s1"><span class="tag">拓1</span><h3>开集三公理</h3><p class="fx"><Katex tex="\varnothing,\ X\in\mathcal{T},\qquad \bigcup_{\alpha}U_\alpha\in\mathcal{T}" /></p><p>任意并、有限交封闭即成一族拓扑；度量空间的开球是最初原型，开集决定谁挨得近。</p></router-link>
      <router-link class="topic-card" to="/topology/s2"><span class="tag">拓2</span><h3>基与子空间</h3><p class="fx"><Katex tex="x\in B\subseteq U,\qquad \mathcal{T}_Y=\{U\cap Y:U\in\mathcal{T}\}" /></p><p>基球自由地并生成整族开集；子集继承相对开集，说开必须带参照空间。</p></router-link>
      <router-link class="topic-card" to="/topology/s3"><span class="tag">拓3</span><h3>内部、闭包与边界</h3><p class="fx"><Katex tex="\partial A=\overline{A}\setminus\operatorname{int}A,\qquad X\setminus\overline{A}=\operatorname{int}(X\setminus A)" /></p><p>内部往里收、闭包往外撑，夹缝是边界；孤立点属于集合，也属于边界。</p></router-link>
      <router-link class="topic-card" to="/topology/s4"><span class="tag">拓4</span><h3>连续与同胚</h3><p class="fx"><Katex tex="V\in\mathcal{T}_Y\ \Rightarrow\ f^{-1}(V)\in\mathcal{T}_X" /></p><p>连续只看原像，与 ε-δ 同义；双向连续的双射叫同胚，同胚保拓扑性质。</p></router-link>
      <router-link class="topic-card" to="/topology/s5"><span class="tag">拓5</span><h3>度量空间与序列收敛</h3><p class="fx"><Katex tex="x_n\to x\iff d(x_n,x)\to0,\qquad \mathcal{B}(x,r)=\{y:d(x,y)\lt r\}" /></p><p>距离的三条性质让开球生成一族拓扑，收敛回到 ε-N 那一句；收敛列必是柯西列，完备空间里反过来也成立。</p></router-link>
    </div>

    <h3 class="sec">拓扑学基础 · 二 连通与紧致</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/topology/c1"><span class="tag">连1</span><h3>连通性</h3><p class="fx"><Katex tex="X=U\cup V,\ U\cap V=\varnothing" /></p><p>拆不成两块不交非空开集即连通；连续像与闭包都保连通，分支个数是拓扑不变量。</p></router-link>
      <router-link class="topic-card" to="/topology/c2"><span class="tag">连2</span><h3>道路连通</h3><p class="fx"><Katex tex="\gamma:[0,1]\to X,\quad \gamma(0)=x,\ \gamma(1)=y" /></p><p>任意两点有连续道路相连，强于连通；正弦曲线连通却无路可走。</p></router-link>
      <router-link class="topic-card" to="/topology/c3"><span class="tag">连3</span><h3>紧致性</h3><p class="fx"><Katex tex="X=\bigcup_{i\in I}U_i\ \Rightarrow\ X=\bigcup_{k=1}^{n}U_{i_k}" /></p><p>任给开覆盖都能抽出有限子覆盖；闭区间紧致，连续像是紧的，极值定理由此而来。</p></router-link>
      <router-link class="topic-card" to="/topology/c4"><span class="tag">连4</span><h3>商空间与曲面</h3><p class="fx"><Katex tex="q:X\to X/{\sim},\quad U\in\mathcal{T}_{X/{\sim}}\iff q^{-1}(U)\in\mathcal{T}_X" /></p><p>认点得到商空间；正方形按箭头粘边，两对同向得环面、一对反向得克莱因瓶与莫比乌斯带。</p></router-link>
    </div>

    <h3 class="sec">拓扑学基础 · 三 不变量初步</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/topology/v1"><span class="tag">不1</span><h3>欧拉示性数</h3><p class="fx"><Katex tex="\chi=V-E+F=2-2g" /></p><p>与剖分无关，只认曲面；每接一个环柄减二，可定向闭曲面由亏格定值。</p></router-link>
      <router-link class="topic-card" to="/topology/v2"><span class="tag">不2</span><h3>基本群</h3><p class="fx"><Katex tex="\pi_1(S^1)\cong\mathbb{Z},\qquad \pi_1(S^2)=0" /></p><p>闭环路按同伦分类、拼接成群；圆周的绕数就是整数，球面没有洞可绕。</p></router-link>
      <router-link class="topic-card" to="/topology/v3"><span class="tag">不3</span><h3>覆叠空间</h3><p class="fx"><Katex tex="p:\tilde X\to X,\quad p^{-1}(U)\cong U\times F" /></p><p>局部均匀摊开的多层空间；直线覆叠圆周，覆叠度等于基本群中某子群的指数。</p></router-link>
    </div>

    <h3 class="sec">分形几何 · 一 自相似与维数</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/fractal/d1"><span class="tag">维1</span><h3>自相似集</h3><p class="fx"><Katex tex="S=\bigcup_{i=1}^{N}f_i(S),\qquad N r^D=1" /></p><p>整体由若干缩小的副本拼成；比例相等时份数与比例之比定出维数，副本严重重叠时这条式子不再适用。</p></router-link>
      <router-link class="topic-card" to="/fractal/d2"><span class="tag">维2</span><h3>相似维数</h3><p class="fx"><Katex tex="D=\frac{\ln N}{\ln(1/r)}" /></p><p>康托集 <Katex tex="0.631"/>、科赫曲线 <Katex tex="1.262"/>、谢尔宾斯基三角 <Katex tex="1.585"/>；维数落在整数之间，说明它比线粗、比面稀。</p></router-link>
      <router-link class="topic-card" to="/fractal/d3"><span class="tag">维3</span><h3>盒维数</h3><p class="fx"><Katex tex="\dim_B S=\lim_{\varepsilon\to0}\frac{\ln N(\varepsilon)}{\ln(1/\varepsilon)}" /></p><p>用边长 <Katex tex="\varepsilon"/> 的方格去盖，数相交的格数，取双对数斜率的极限；它不要求自相似，对任意有界集都能定义。</p></router-link>
      <router-link class="topic-card" to="/fractal/d4"><span class="tag">维4</span><h3>豪斯多夫维数</h3><p class="fx"><Katex tex="\mathcal{H}^s(E)=\lim_{\delta\to0}\inf\sum_i(\operatorname{diam}U_i)^s,\qquad \dim_H E=\inf\{s:\mathcal{H}^s(E)=0\}" /></p><p>覆盖的直径每降一档，测度按 <Katex tex="\delta^s"/> 重新称一次；小于维数时测度发散、大于维数时为零，只有临界那一档才有意义。</p></router-link>
    </div>

    <h3 class="sec">分形几何 · 二 典型分形</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/fractal/s1"><span class="tag">形1</span><h3>康托集</h3><p class="fx"><Katex tex="C=\bigcap_{n=0}^{\infty}C_n,\quad m(C)=0,\quad D=\frac{\ln2}{\ln3}" /></p><p>逐层挖去中间三分之一，总长度为零，剩下的点却与整个区间一一对应；维数 <Katex tex="0.631"/>。</p></router-link>
      <router-link class="topic-card" to="/fractal/s2"><span class="tag">形2</span><h3>科赫曲线</h3><p class="fx"><Katex tex="D=\frac{\ln4}{\ln3},\qquad P_n=\left(\frac43\right)^nP_0" /></p><p>每段折成四段，周长按 <Katex tex="4/3"/> 逐层放大而发散，围出的面积按 <Katex tex="8/5"/> 收敛；维数 <Katex tex="1.262"/>。</p></router-link>
      <router-link class="topic-card" to="/fractal/s3"><span class="tag">形3</span><h3>谢尔宾斯基三角形与地毯</h3><p class="fx"><Katex tex="D_{\triangle}=\frac{\ln3}{\ln2}=1.585,\quad D_{\square}=\frac{\ln8}{\ln3}=1.893" /></p><p>挖掉中心、留下骨架，面积为零而周长不收；三角形与地毯的差别只在每层保留几份。</p></router-link>
      <router-link class="topic-card" to="/fractal/s4"><span class="tag">形4</span><h3>朱利亚集与曼德博集</h3><p class="fx"><Katex tex="z\mapsto z^2+c,\qquad |z_k|\to\infty" /></p><p>迭代有界与逃逸的分界就是朱利亚集；参数 <Katex tex="c"/> 走遍平面，曼德博集记录哪些参数让朱利亚集连通。</p></router-link>
    </div>

    <h3 class="sec">分形几何 · 三 生成与应用</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/fractal/g1"><span class="tag">生1</span><h3>迭代函数系统</h3><p class="fx"><Katex tex="A=\bigcup_{i=1}^{n}f_i(A)" /></p><p>一组压缩映射的并集有唯一吸引子；随机挑映射反复施加，混沌游戏落出的点自己拼成那个分形。</p></router-link>
      <router-link class="topic-card" to="/fractal/g2"><span class="tag">生2</span><h3>L 系统与分枝</h3><p class="fx"><Katex tex="F\mapsto F[+F]F[-F]F" /></p><p>字符串按规则并行替换，方括号记分叉；龟行解释把每个字母读成前进与转向，规则长成植物。</p></router-link>
      <router-link class="topic-card" to="/fractal/g3"><span class="tag">生3</span><h3>分形与自然</h3><p class="fx"><Katex tex="L(\varepsilon)\propto\varepsilon^{1-D}" /></p><p>海岸线长度随尺子变短而增长，双对数图上的斜率给出 <Katex tex="1-D"/>；粗糙程度由指数读出。</p></router-link>
    </div>

    <h3 class="sec">高等几何（射影几何） · 一 射影平面</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/projgeom/p1"><span class="tag">射1</span><h3>齐次坐标</h3><p class="fx"><Katex tex="(x,y,z)\sim(\lambda x,\lambda y,\lambda z),\qquad z=0" /></p><p>三元组只定到相差一个倍数，<Katex tex="z\ne0"/> 对应仿射点、<Katex tex="z=0"/> 收下全部无穷远点，它们组成无穷远线。</p></router-link>
      <router-link class="topic-card" to="/projgeom/p2"><span class="tag">射2</span><h3>射影变换</h3><p class="fx"><Katex tex="x'=\frac{a_1x+b_1y+c_1}{a_3x+b_3y+c_3}" /></p><p>由可逆三阶矩阵给出、保持共线；矩阵与它的倍数表示同一个变换，平行线映成交于灭点的线。</p></router-link>
      <router-link class="topic-card" to="/projgeom/p3"><span class="tag">射3</span><h3>交比</h3><p class="fx"><Katex tex="(A,B;C,D)=\frac{AC\cdot BD}{AD\cdot BC}" /></p><p>四点坐标之比，在射影变换下不变；长度与角度都失效之后，交比接手「量」的角色。</p></router-link>
      <router-link class="topic-card" to="/projgeom/p4"><span class="tag">射4</span><h3>对偶原理</h3><p class="fx"><Katex tex="P\leftrightarrow l,\qquad \text{collinear}\leftrightarrow\text{concurrent}" /></p><p>点与线整体互换，一条定理自动带出它的对偶；对偶命题的证明一字不改地翻译过去即可。</p></router-link>
      <router-link class="topic-card" to="/projgeom/p5"><span class="tag">射5</span><h3>德萨格定理与帕普斯定理</h3><p class="fx"><Katex tex="AA',BB',CC'\ \text{concurrent}\iff AB\cap A'B',\ BC\cap B'C',\ CA\cap C'A'\ \text{collinear}" /></p><p>两个三角形的对应顶点连线共点，则对应边的三个交点共线，逆命题同样成立；帕普斯把六个顶点拆到两条直线上，两者都由齐次坐标一次算出。</p></router-link>
    </div>

    <h3 class="sec">高等几何（射影几何） · 二 二次曲线</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/projgeom/c1"><span class="tag">曲1</span><h3>配极与极点极线</h3><p class="fx"><Katex tex="x^{\mathsf T}Ap=0,\qquad x^{\mathsf T}Ax=0" /></p><p>二次曲线给每点一条极线、给每线一个极点，关联对称；点在曲线上时极线就是切线，点进入曲线内部极线跑到外部。</p></router-link>
      <router-link class="topic-card" to="/projgeom/c2"><span class="tag">曲2</span><h3>二次曲线的射影分类</h3><p class="fx"><Katex tex="\operatorname{rank}A=3\ \text{vs}\ \operatorname{rank}A\lt3,\qquad \#(C\cap l_\infty)" /></p><p>先按秩分退化和非退化，再按无穷远交点数分椭圆、抛物线、双曲线；离心率随无穷远线的位置连续变化。</p></router-link>
      <router-link class="topic-card" to="/projgeom/c3"><span class="tag">曲3</span><h3>帕斯卡定理与布里安雄定理</h3><p class="fx"><Katex tex="P_1=A_1B_2\cap A_2B_1,\quad P_2=A_2B_3\cap B_2A_3,\quad P_3=A_3B_1\cap B_3A_1" /></p><p>内接六边形的三组对边交点共线；对偶过去是外切六边形的三条连线共点。</p></router-link>
    </div>

    <h3 class="sec">高等几何（射影几何） · 三 变换群与几何</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/projgeom/g1"><span class="tag">换1</span><h3>变换群</h3><p class="fx"><Katex tex="G\le\operatorname{PGL}(3),\qquad g\circ g^{-1}=\mathrm{id}" /></p><p>可逆变换对复合封闭、有幺元与逆元；几何研究群作用下的不变量与轨道，不变量就是这门几何能说的话。</p></router-link>
      <router-link class="topic-card" to="/projgeom/g2"><span class="tag">换2</span><h3>爱尔兰根纲领</h3><p class="fx"><Katex tex="\mathrm{PGL}(3)\supset\mathrm{AGL}(3)\supset\mathrm{Sim}(2)\supset\mathrm{E}(2)" /></p><p>一门几何对应一个变换群，群越大能说的话越少；平行性在仿射层保留、长度与角度要到欧氏层才有意义。</p></router-link>
      <router-link class="topic-card" to="/projgeom/g3"><span class="tag">换3</span><h3>从射影到欧氏</h3><p class="fx"><Katex tex="\#(C\cap l_\infty)=0,\ 1,\ 2" /></p><p>指定一条无穷远线就得到仿射层级，它的位置决定圆锥曲线的仿射类型；再补上圆点与度量，才落到欧氏几何。</p></router-link>
    </div>

    <h3 class="sec">抽象代数 · 一 代数结构</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/algebra/s1"><span class="tag">结1</span><h3>二元运算与半群</h3><p class="fx"><Katex tex="(a*b)*c=a*(b*c)" /></p><p>封闭加结合就是半群，再加幺元成幺半群、加逆元成群；整数减法满足封闭却破坏结合律。</p></router-link>
      <router-link class="topic-card" to="/algebra/s2"><span class="tag">结2</span><h3>群、环、域</h3><p class="fx"><Katex tex="(G,*),\qquad (R,+,\cdot),\qquad \mathbb{F}\setminus\{0\}" /></p><p>群只留一种运算，环有两种且加法成群、乘法对加法分配，域再要求非零元可除；<Katex tex="\mathbb{Z}_n"/> 是域当且仅当 <Katex tex="n"/> 为素数。</p></router-link>
      <router-link class="topic-card" to="/algebra/s3"><span class="tag">结3</span><h3>同态与同构</h3><p class="fx"><Katex tex="\varphi(ab)=\varphi(a)\varphi(b),\qquad \ker\varphi=\{a:\varphi(a)=e'\}" /></p><p>保运算的映射把结构对齐；核衡量丢失的信息，像给出保留下来的部分，双射的同态就是同构。</p></router-link>
      <router-link class="topic-card" to="/algebra/s4"><span class="tag">结4</span><h3>多项式环</h3><p class="fx"><Katex tex="f(x)=(x-a)q(x)+f(a)" /></p><p>带余除法按次数作欧几里得，余式定理把除法与求值接上；<Katex tex="x-a"/> 整除 <Katex tex="f"/> 当且仅当 <Katex tex="a"/> 是根。</p></router-link>
    </div>

    <h3 class="sec">抽象代数 · 二 群论</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/algebra/g1"><span class="tag">群1</span><h3>群的定义与例子</h3><p class="fx"><Katex tex="e\in G,\quad a^{-1}\in G,\quad (ab)^{-1}=b^{-1}a^{-1}" /></p><p>四条公理导出幺元唯一、逆元唯一；<Katex tex="\mathbb{Z}_n"/> 循环、<Katex tex="V_4"/> 交换、<Katex tex="S_3"/> 不交换，三个样本各差一条。</p></router-link>
      <router-link class="topic-card" to="/algebra/g2"><span class="tag">群2</span><h3>子群与陪集</h3><p class="fx"><Katex tex="|G|=|H|\,[G:H]" /></p><p>拉格朗日定理：子群的阶整除群的阶；陪集把群切成等大的几块，元素个数恰是 <Katex tex="|H|"/>。</p></router-link>
      <router-link class="topic-card" to="/algebra/g3"><span class="tag">群3</span><h3>正规子群与商群</h3><p class="fx"><Katex tex="gHg^{-1}=H,\qquad (gH)(kH)=(gk)H" /></p><p>左陪集与右陪集重合才叫正规；商集的乘法良定义正卡在这一条上，交换群的子群自动正规。</p></router-link>
      <router-link class="topic-card" to="/algebra/g4"><span class="tag">群4</span><h3>群同态基本定理</h3><p class="fx"><Katex tex="G/\ker\varphi\cong\operatorname{Im}\varphi" /></p><p>核是正规子群，商群与像同构；所有同态都化成一道自然投影，亏掉的那部分正是核。</p></router-link>
      <router-link class="topic-card" to="/algebra/g5"><span class="tag">群5</span><h3>置换群与凯莱定理</h3><p class="fx"><Katex tex="|S_n|=n!,\qquad G\hookrightarrow S_{|G|}" /></p><p>置换按复合成群，阶是各轮换长度的最小公倍数；凯莱定理把任何有限群嵌进对称群。</p></router-link>
      <router-link class="topic-card" to="/algebra/g6"><span class="tag">群6</span><h3>群与对称</h3><p class="fx"><Katex tex="|D_n|=2n,\qquad r^n=e,\quad s^2=e,\quad sr=r^{-1}s" /></p><p>正 <Katex tex="n"/> 边形的旋转与翻转构成二面体群；群阶量化对称程度，<Katex tex="D_3\cong S_3"/> 是小阶特例。</p></router-link>
      <router-link class="topic-card" to="/algebra/g7"><span class="tag">群7</span><h3>群作用与轨道-稳定子</h3><p class="fx"><Katex tex="|G|=|\operatorname{Orb}(x)|\cdot|\operatorname{Stab}(x)|,\qquad |X/G|=\frac{1}{|G|}\sum_{g\in G}|\operatorname{Fix}(g)|" /></p><p>轨道把集合切成互不相交的块，稳定子是把点留在原地的子群，两者大小相乘恰等于群的阶；伯恩赛德引理按不动点数轨道个数，正方形两色染色得 <Katex tex="6"/>。</p></router-link>
    </div>

    <h3 class="sec">抽象代数 · 三 图论</h3>
    <div class="topic-grid">
      <router-link class="topic-card" to="/algebra/n1"><span class="tag">网1</span><h3>图的基本概念</h3><p class="fx"><Katex tex="\sum_{v\in V}\deg v=2|E|" /></p><p>握手定理把局部读数与整体参数绑在一起，由此奇度顶点的个数必为偶数；完全图 <Katex tex="K_n"/> 有 <Katex tex="n(n-1)/2"/> 条边。</p></router-link>
      <router-link class="topic-card" to="/algebra/n2"><span class="tag">网2</span><h3>路径与连通性</h3><p class="fx"><Katex tex="d(v_0,v)=\min|P|" /></p><p>「能走到」是等价关系，等价类就是连通分量；广度优先搜索按层展开，第一次到达时的层数即最短距离。</p></router-link>
      <router-link class="topic-card" to="/algebra/n3"><span class="tag">网3</span><h3>树</h3><p class="fx"><Katex tex="|E|=|V|-1,\qquad \text{unique path}" /></p><p>三个说法等价：是树、连通且边数为 <Katex tex="n-1"/>、任意两点之间路径唯一；删一条边断开，加一条边成圈。</p></router-link>
      <router-link class="topic-card" to="/algebra/n4"><span class="tag">网4</span><h3>欧拉回路与哈密顿回路</h3><p class="fx"><Katex tex="\#\{\deg v\ \text{odd}\}=0,\ 2" /></p><p>一笔画只看奇点；哈密顿回路要求经过每个顶点恰好一次，没有简单判据，删点后的连通块数是常用必要条件。</p></router-link>
      <router-link class="topic-card" to="/algebra/n5"><span class="tag">网5</span><h3>平面图与欧拉公式</h3><p class="fx"><Katex tex="V-E+F=2,\qquad E\le3V-6" /></p><p>外部无界区域也算一个面；边数上限判定 <Katex tex="K_5"/> 与 <Katex tex="K_{3,3}"/> 都不是平面图，完整判据由库拉托夫斯基定理给出。</p></router-link>
      <router-link class="topic-card" to="/algebra/n6"><span class="tag">网6</span><h3>图的着色与匹配</h3><p class="fx"><Katex tex="\omega\le\chi\le\Delta+1" /></p><p>团给下界、贪心给上界，五边形说明两者可以不相等；二分图色数为 2，最大匹配在二分图里等于最小顶点覆盖。</p></router-link>
    </div>

    <div class="cap">速查页只收「一句话能说清的结论」：先在这里定位，再点进章节看推导、易错点与画板 —— 蓝色标签即章节编号（如 性1、次1、基1）。</div>  </div>
</template>
<script setup>
import Katex from '../components/Katex.vue';
</script>
