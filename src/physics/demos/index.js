/* 章页演示的登记表：标题、提示、滑块与加载器都在这里，
   讲义页只写 demoOf('motion') 一句，不重复抄参数。 */

/* 振1 的四块板共用一张参数表，各自只换 mode（vib1.js 按档分画）。 */
const VIB1 = {
  title: '简谐运动：弹簧振子、参考圆与 x–t 曲线',
  hint: '物块在平衡位置两侧往复运动，位移随时间按 x = A cos(ωt + φ) 变化。绿箭头是速度 v，橙箭头是回复力 F，两者方向总随位置翻换。左下角是参考圆：半径 A 以角速度 ω 匀速转动，它的水平投影正落在物块的位移上。右边画出 x–t 曲线，橙色虚线标出 ±A，曲线每隔一个周期重复一次。',
  params: [
    { k: 'A', label: '振幅 A', min: 0.2, max: 0.8, step: 0.05, value: 0.4, unit: 'm' },
    { k: 'k', label: '劲度系数 k', min: 5, max: 30, step: 1, value: 20, unit: 'N/m' },
    { k: 'm', label: '物块质量 m', min: 0.4, max: 2, step: 0.1, value: 1, unit: 'kg' },
    { k: 'phi', label: '初相 φ₀', min: 0, max: 360, step: 15, value: 0, unit: '°' },
  ],
  load: () => import('./vib1.js'),
};

/* 振2 的两块板同样共用一张参数表，各自只换 mode（vib2.js 按档分画）。 */
const VIB2 = {
  title: '单摆：重力的分解与 θ–t 曲线',
  hint: '摆球在竖直位置两侧来回摆。橙箭头是重力 mg，蓝箭头是绳的拉力，紫箭头是重力沿切线的分力——它就是回复力，永远指向平衡位置；重力的两侧虚线把它分解成沿绳的 mg cosθ 与沿切线的 mg sinθ。右栏是摆角随时间的曲线，橙色虚线标出 ±θ₀。',
  params: [
    { k: 'L', label: '摆长 L', min: 0.3, max: 2, step: 0.05, value: 1, unit: 'm' },
    { k: 'm', label: '摆球质量 m', min: 0.1, max: 1, step: 0.05, value: 0.2, unit: 'kg' },
    { k: 'th0', label: '摆角振幅 θ₀', min: 4, max: 30, step: 1, value: 12, unit: '°' },
    { k: 'g', label: '重力加速度 g', min: 4, max: 15, step: 0.1, value: 9.8, unit: 'm/s²' },
  ],
  load: () => import('./vib2.js'),
};

/* 波2 的三块板共用一张参数表，各自只换 mode（wave2.js 按档分画）：
   图像档两张图上下摞、要加高；叠加档与驻波档都是单幅大图，不加高。 */
const WAVE2 = {
  title: '波形图、振动图与两列波叠加',
  hint: '图像档把两张图上下摞在一起：上图是某一时刻的波形图（y–x），下图是点 P 的振动图（y–t），同一个纵坐标就是同一个位移。叠加档里两列脉冲相向而行，绿色是合位移，重叠时等于两条淡色曲线之和。',
  modes: [
    { k: 'graph', label: '波形图与振动图' },
    { k: 'add', label: '波的叠加' },
    { k: 'stand', label: '驻波' },
  ],
  tall: true,
  params: [
    { k: 'A', label: '振幅 A', min: 0.04, max: 0.12, step: 0.01, value: 0.08, unit: 'm' },
    { k: 'f', label: '频率 f', min: 0.6, max: 1.6, step: 0.05, value: 0.8, unit: 'Hz', modes: ['graph', 'stand'] },
    { k: 'v', label: '波速 v', min: 0.8, max: 2.4, step: 0.1, value: 1.4, unit: 'm/s' },
    { k: 'xp', label: '查看点 P', min: 0.5, max: 5.5, step: 0.5, value: 3, unit: 'm', modes: ['graph'] },
  ],
  load: () => import('./wave2.js'),
};

/* 波3 的三块板同样共用一张参数表，各自只换 mode（wave3.js 按档分画）。
   干涉档与衍射档共用波长滑块，多普勒档只用声源速度，每档都是单幅大图。 */
const WAVE3 = {
  title: '干涉、衍射与多普勒效应',
  hint: '干涉档里两个同步振动的波源发出圆波，绿色曲线是路程差为整数倍波长处的加强线。衍射档把缝宽拖动，缝越窄，绕过缝的波纹越接近半圆，衍射越明显。多普勒档让声源一边发声一边向右运动，前方的波面被压密、后方的被拉疏。',
  modes: [
    { k: 'interf', label: '干涉' },
    { k: 'diff', label: '衍射' },
    { k: 'doppler', label: '多普勒效应' },
  ],
  params: [
    { k: 'lam', label: '波长 λ', min: 0.3, max: 0.9, step: 0.05, value: 0.5, unit: 'm', modes: ['interf', 'diff'] },
    { k: 'd', label: '两波源间距 d', min: 0.8, max: 2.4, step: 0.1, value: 1.4, unit: 'm', modes: ['interf'] },
    { k: 'aw', label: '缝宽 a', min: 0.1, max: 0.9, step: 0.05, value: 0.4, unit: 'm', modes: ['diff'] },
    { k: 'vs', label: '声源速度 v', min: 0, max: 1.2, step: 0.1, value: 0.6, unit: 'm/s', modes: ['doppler'] },
  ],
  load: () => import('./wave3.js'),
};

/* 振3 的四块板同样共用一张参数表，各自只换 mode（vib3.js 按档分画）。
   三种阻尼那块板的三条曲线按 b_c 现算，阻尼系数那根滑块在那里收起。 */
const VIB3 = {
  title: '阻尼振动与受迫振动：振幅的衰减与共振曲线',
  hint: '阻尼档里左端固定在墙上，物块从 0.5 m 处放开，橙色虚线是振幅的指数包络，摆幅一圈比一圈小；受迫档里紫色驱动端来回拉动弹簧的左端，物块先经过一段过渡，随后按驱动力的频率稳定摆动。',
  params: [
    { k: 'k', label: '劲度系数 k', min: 5, max: 100, step: 5, value: 20, unit: 'N/m' },
    { k: 'b', label: '阻尼系数 b', min: 0.8, max: 8, step: 0.1, value: 1.6, unit: 'N·s/m', modes: ['damp', 'drive', 'reson'] },
    { k: 'Ad', label: '驱动端振幅 A', min: 0.02, max: 0.12, step: 0.005, value: 0.05, unit: 'm', modes: ['drive'] },
    { k: 'fd', label: '驱动力频率 f', min: 0.1, max: 2.5, step: 0.05, value: 0.5, unit: 'Hz', modes: ['drive', 'reson'] },
  ],
  load: () => import('./vib3.js'),
};

export const DEMOS = {
  motion: {
    title: '位移与路程：来回走一趟',
    hint: '物体向右走 T 秒，再原路返回。位移只看起点与终点（绿色箭头），路程一直累加；把 T 调小，折返来得更早。',
    params: [
      { k: 'v', label: '速率 v', min: 0.5, max: 3, step: 0.1, value: 1.5, unit: 'm/s' },
      { k: 'T', label: '折返时刻 T', min: 1, max: 4, step: 0.1, value: 3, unit: 's' },
    ],
    load: () => import('./motion.js'),
  },

  vgraph: {
    title: 'x-t 图与 v-t 图：切线斜率、图线斜率与面积',
    hint: '两张图共用同一条时间轴：上图 x-t 曲线的切线斜率是瞬时速度，下图 v-t 直线的斜率是加速度，直线到时间轴围出的面积是位移。把「加速度 a」拖成负值，上图抛物线翻向、下图直线向下倾斜，阴影越过时间轴后转为负值。',
    tall: true,
    params: [
      { k: 'v0', label: '初速度 v0', min: 0, max: 8, step: 0.1, value: 2, unit: 'm/s' },
      { k: 'a', label: '加速度 a', min: -3, max: 3, step: 0.1, value: 1, unit: 'm/s²' },
    ],
    load: () => import('./vgraph.js'),
  },

  accel: {
    title: '加速度的方向：与速度同号才加速',
    hint: '绿色箭头是速度，橙色箭头是加速度。两支指向同一边时速率增大，指向相反时速率减小；右图直线的斜率只说明 a 的符号，与 v 的正负各管一件事。',
    params: [
      { k: 'v0', label: '初速度 v0', min: -4, max: 8, step: 0.5, value: 6, unit: 'm/s' },
      { k: 'a', label: '加速度 a', min: -4, max: 4, step: 0.5, value: -2, unit: 'm/s²' },
    ],
    load: () => import('./accel.js'),
  },

  uniform: {
    title: 'x-t 图与三个基本式',
    hint: '橙色虚线是当前时刻的切线，斜率就是速度。读数栏里 v² − v0² 与 2ax 始终相等，这就是由 v-t 图推出的第三个式子。',
    params: [
      { k: 'v0', label: '初速度 v0', min: 0, max: 10, step: 0.1, value: 2, unit: 'm/s' },
      { k: 'a', label: '加速度 a', min: -2, max: 4, step: 0.1, value: 1.5, unit: 'm/s²' },
    ],
    load: () => import('./uniform.js'),
  },

  tape: {
    title: '纸带与逐差公式',
    hint: '上排是纸带上每隔 T 打出的计时点，相邻两点之间的距离就是那一段的位移；下排把这些位移画成等高距的竖条，顶端连成直线，相邻两段的差处处是 aT²。',
    params: [
      { k: 'v0', label: '初速度 v0', min: 0, max: 2, step: 0.05, value: 0.5, unit: 'm/s' },
      { k: 'a', label: '加速度 a', min: 0.5, max: 4, step: 0.1, value: 1.2, unit: 'm/s²' },
    ],
    load: () => import('./tape.js'),
  },

  freefall: {
    title: '自由落体与竖直上抛',
    hint: '上面三枚按钮切换查看对象：自由落体只放一只蓝球，竖直上抛只放一只橙球，一起看则两球同高度同时出发。右栏高度—时间图在上、速度—时间图在下，共用同一条时间轴，一条竖虚线贯穿两图，同一时刻的读数上下对得起来。',
    modes: [
      { k: 'free', label: '自由落体' },
      { k: 'up', label: '竖直上抛' },
      { k: 'both', label: '一起看' },
    ],
    params: [
      { k: 'H', label: '初始高度 H', min: 0, max: 30, step: 1, value: 5, unit: 'm' },
      { k: 'v0', label: '初速度 v0', min: 0, max: 15, step: 0.5, value: 8, unit: 'm/s', modes: ['up', 'both'] },
      { k: 'g', label: '重力加速度 g', min: 4, max: 15, step: 0.1, value: 9.8, unit: 'm/s²' },
    ],
    load: () => import('./freefall.js'),
  },

  chase: {
    title: '追及与相遇：速度相等时距离最大',
    hint: '后车在前车后方起步加速，前车匀速前进。紫点是两车速度相等的时刻，此刻间距最大；两条图线的交点就是相遇。把 a 调小，相遇推后。',
    params: [
      { k: 'v1', label: '前车速度 v1', min: 3, max: 9, step: 0.5, value: 6, unit: 'm/s' },
      { k: 'v2', label: '后车初速 v2', min: 0, max: 8, step: 0.5, value: 0, unit: 'm/s' },
      { k: 'a', label: '后车加速度 a', min: 1, max: 5, step: 0.1, value: 2, unit: 'm/s²' },
      { k: 'd0', label: '初始间距 d0', min: 5, max: 25, step: 1, value: 12, unit: 'm' },
    ],
    load: () => import('./chase.js'),
  },

  hooke: {
    title: '挂在弹簧下的物块：弹力与重力',
    hint: '物块从原长位置放下，弹力随伸长量一起增大；右图的动点沿 F = kx 爬升，与重力虚线相交时物块停住。把 k 调大，交点左移、弹簧更硬。',
    params: [
      { k: 'k', label: '劲度系数 k', min: 20, max: 160, step: 5, value: 60, unit: 'N/m' },
      { k: 'm', label: '物块质量 m', min: 0.2, max: 2, step: 0.1, value: 0.8, unit: 'kg' },
    ],
    load: () => import('./hooke.js'),
  },

  friction: {
    title: '静摩擦、滑动摩擦与最大静摩擦',
    hint: '四支力都从木块中心画出：F 向右、f 向左、N 向上、mg 向下。把 F 调到 μN 以下木块不动，静摩擦与拉力等大；拉过 μN 之后木块起步加速。',
    params: [
      { k: 'F', label: '水平拉力 F', min: 0, max: 20, step: 0.5, value: 8, unit: 'N' },
      { k: 'mu', label: '动摩擦因数 μ', min: 0.05, max: 0.6, step: 0.01, value: 0.3 },
      { k: 'm', label: '物块质量 m', min: 1, max: 5, step: 0.5, value: 2, unit: 'kg' },
    ],
    load: () => import('./friction.js'),
  },

  forceadd: {
    title: '两个共点力的合成与平衡',
    hint: '平行四边形的对角线就是合力。夹角从 0° 拖到 180°，对角线先短后长：同向时最大、反向时最小。紫色那根是让物体平衡所需的第三个力。',
    params: [
      { k: 'F1', label: '分力 F1', min: 1, max: 10, step: 0.5, value: 6, unit: 'N' },
      { k: 'F2', label: '分力 F2', min: 1, max: 10, step: 0.5, value: 4, unit: 'N' },
      { k: 'th', label: '两力夹角 θ', min: 0, max: 180, step: 1, value: 60, unit: '°' },
    ],
    load: () => import('./forceadd.js'),
  },

  splitforce: {
    title: '斜面上重力按效果分解',
    hint: '重力竖直向下，沿斜面下滑的一支是 mg sinθ，压紧斜面的一支是 mg cosθ，两支互相垂直，虚线围出的矩形以重力为对角线。右图看两支随倾角怎么变：一个含 sinθ 上升，一个含 cosθ 下降。',
    params: [
      { k: 'm', label: '物块质量 m', min: 0.5, max: 5, step: 0.5, value: 2, unit: 'kg' },
      { k: 'th', label: '倾角 θ', min: 10, max: 80, step: 1, value: 30, unit: '°' },
    ],
    load: () => import('./splitforce.js'),
  },

  newton1: {
    title: '伽利略斜面：维持运动不需要力',
    hint: '小球从左侧斜面某一高度由静止释放，滚下、经过一小段无摩擦水平面，再沿右侧斜面上升。斜面越平缓，小球走得越远，升到的高度不变；把右侧放平，它以恒定速率一直走下去。轨道上每 0.12 秒落一枚小点，点距就是那一段的快慢，绿色箭头是速率。',
    modes: [
      { k: 'steep', label: '陡坡 45°' },
      { k: 'gentle', label: '缓坡 20°' },
      { k: 'flat', label: '水平面 0°' },
    ],
    params: [
      { k: 'H', label: '释放高度 H', min: 0.6, max: 3, step: 0.1, value: 1.5, unit: 'm' },
    ],
    load: () => import('./newton1.js'),
  },

  newton2: {
    title: '牛顿第二定律：拉力、质量与加速度',
    hint: '小车在光滑水平面上由静止被恒力拉动。左边的橙色箭头是拉力 F、绿色箭头是加速度 a，右边 v-t 图过原点的直线，斜率就是 a。把 F 加倍，斜率加倍；把 m 加倍，斜率减半。读数栏里 F/m、ma 与 2x/t² 三路算出的加速度一致。',
    params: [
      { k: 'F', label: '拉力 F', min: 1, max: 10, step: 0.5, value: 4, unit: 'N' },
      { k: 'm', label: '质量 m', min: 0.5, max: 5, step: 0.5, value: 2, unit: 'kg' },
    ],
    load: () => import('./newton2.js'),
  },

  newton3: {
    title: '牛顿第三定律：一对作用力与反作用力',
    hint: '推力 F 把 A、B 两块一起推着向右加速。上半个画面是一对接触力：A 对 B 与 B 对 A 等大反向，分别落在两块上；下半是两张受力图，A 的合力是 F 减去 B 对 A 的力，B 的合力就是 A 对 B 的力。拖动质量比，两个接触力一起变，但始终相等。',
    params: [
      { k: 'F', label: '推力 F', min: 2, max: 20, step: 0.5, value: 8, unit: 'N' },
      { k: 'mA', label: 'A 的质量', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'kg' },
      { k: 'mB', label: 'B 的质量', min: 0.5, max: 4, step: 0.1, value: 1, unit: 'kg' },
    ],
    load: () => import('./newton3.js'),
  },

  newton4: {
    title: '超重与失重：视重 N = m(g+a)',
    hint: '电梯跑一趟：静止 → 匀加速 → 匀速 → 匀减速 → 到站。人站在轿厢里的体重计上，取向上为正，N − mg = ma，所以视重 N = m(g+a)。加速度向上时视重大于实重，超重；向下时小于实重，失重；加速度向下且等于 g 时读数归零，完全失重。',
    modes: [
      { k: 'up', label: '电梯上行' },
      { k: 'down', label: '电梯下行' },
    ],
    params: [
      { k: 'm', label: '质量 m', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'kg' },
      { k: 'a', label: '加速度大小 a', min: 0, max: 9.8, step: 0.2, value: 2, unit: 'm/s²' },
    ],
    load: () => import('./newton4.js'),
  },

  proj1: {
    title: '小船渡河：两个分运动各管一边',
    hint: '船头与河岸成 θ 角，实际航线是船速（橙）与水速（蓝）的合成（绿）。蓝色虚线是不计水流时的航线：它与橙线在同一时刻停在同一条横线上，渡河时间只由垂直河岸的那个分速度决定。把水速拖到 0，两条航线重合；拖到最大，船被冲得更远，但到对岸的时刻不变。',
    params: [
      { k: 'vb', label: '船速 v船', min: 1, max: 4, step: 0.5, value: 3, unit: 'm/s' },
      { k: 'vw', label: '水速 v水', min: 0, max: 3, step: 0.5, value: 1.5, unit: 'm/s' },
      { k: 'th', label: '船头偏角 θ', min: 30, max: 90, step: 5, value: 60, unit: '°' },
    ],
    load: () => import('./proj1.js'),
  },

  proj2: {
    title: '平抛运动：水平匀速与竖直自由落体的合成',
    hint: '小球以水平初速抛出，轨迹上的小点是等时间间隔的位置：水平方向间隔相等，竖直方向越往下越密。蓝箭头是水平分速度，长度始终不变；橙箭头是竖直分速度，由零开始变大；绿箭头末端与轨迹相切。右图三条线分别对应这两个分速度与它们的合成，橙线的斜率就是 g。',
    params: [
      { k: 'v0', label: '水平初速 v0', min: 2, max: 15, step: 1, value: 8, unit: 'm/s' },
      { k: 'h', label: '抛出高度 h', min: 1, max: 30, step: 1, value: 20, unit: 'm' },
    ],
    load: () => import('./proj2.js'),
  },

  proj3: {
    title: '斜抛运动：射程随抛射角的变化',
    hint: '同一初速下改变抛射角：轨迹的对称轴固定在射程中点，最高点的竖虚线把轨迹分成两半。右图画出射程随抛射角的变化，橙点是当前角，紫圈是互补角 90°−θ，两点等高说明互补的两个抛射角射程相同；最高处落在 45°。竖直分速由正变负，而合速度大小始终等于 v0。',
    params: [
      { k: 'v0', label: '初速度 v0', min: 5, max: 30, step: 1, value: 15, unit: 'm/s' },
      { k: 'th', label: '抛射角 θ', min: 5, max: 85, step: 1, value: 45, unit: '°' },
    ],
    load: () => import('./proj3.js'),
  },

  circ1: {
    title: '圆周运动：速度在变，向心加速度指向圆心',
    hint: '质点沿圆周匀速转动，速率不变，但速度方向一刻不停地改。右栏把两个时刻的速度平移到同一起点，绿色弦就是速度增量 Δv：它沿半径指向圆心，大小约等于 v·Δθ，除以 Δt 即得 a = v²/r = ω²r。',
    params: [
      { k: 'r', label: '半径 r', min: 0.4, max: 2.2, step: 0.1, value: 1.2, unit: 'm' },
      { k: 'om', label: '角速度 ω', min: 0.3, max: 5, step: 0.1, value: 1.5, unit: 'rad/s' },
      { k: 'm', label: '质量 m', min: 0.1, max: 3, step: 0.1, value: 0.5, unit: 'kg' },
    ],
    load: () => import('./circ1.js'),
  },

  cone: {
    title: '圆锥摆：重力与拉力的合力提供向心力',
    hint: '小球被绳吊着在水平面内匀速转圈，绳与竖直方向成 θ 角。把张力沿绳画出的箭头拆开：竖直分量 T cosθ 与 mg 等长反向，水平分量 T sinθ 正好是合力 mω²r。按住画面拖动可以换个视角看这个锥面。偏角越大转速越慢、张力越大，而竖直方向始终平衡。',
    params: [
      { k: 'L', label: '摆长 L', min: 0.4, max: 2, step: 0.05, value: 1, unit: 'm' },
      { k: 'th', label: '偏角 θ', min: 10, max: 75, step: 1, value: 36, unit: '°' },
      { k: 'm', label: '质量 m', min: 0.1, max: 3, step: 0.1, value: 0.5, unit: 'kg' },
    ],
    load: () => import('./cone.js'),
  },

  circ2: {
    title: '竖直平面内的圆周运动：轻绳与轻杆的分界',
    hint: '小球从最低点以 v₀ 出发，越往上越慢。绿箭头是速度，橙箭头是重力，蓝箭头是沿半径的拉力。轻绳只能拉不能推，张力随时可能变成负数——一旦该变负，小球就脱离圆轨道按抛体飞出去；轻杆可以推，留在圆上继续转。右图画张力随角度的曲线，穿过零点的那一段就是两种模型的分界。',
    modes: [
      { k: 'rope', label: '轻绳' },
      { k: 'rod', label: '轻杆' },
    ],
    params: [
      { k: 'r', label: '半径 r', min: 0.3, max: 1.8, step: 0.1, value: 0.8, unit: 'm' },
      { k: 'v0', label: '最低点速度 v₀', min: 1, max: 14, step: 0.5, value: 8, unit: 'm/s' },
      { k: 'm', label: '质量 m', min: 0.1, max: 3, step: 0.1, value: 0.5, unit: 'kg' },
    ],
    load: () => import('./circ2.js'),
  },

  circ3: {
    title: '离心现象：需要的向心力超过最大静摩擦',
    hint: '俯视一只转动的圆盘，物块靠静摩擦跟着转。物块在圆周上要 mω²r，最多只能拿到 μmg；两者相等时角速度到达临界值 ωc = √(μg/r)。把 ω 拖过 ωc，橙色箭头已顶到上限，红色虚线标出还差多少，物块随后沿一条向外弯的路线滑出圆盘。右图两条线的交点就是 ωc。',
    params: [
      { k: 'r', label: '物块半径 r', min: 0.2, max: 1.2, step: 0.05, value: 0.6, unit: 'm' },
      { k: 'om', label: '角速度 ω', min: 0.5, max: 10, step: 0.1, value: 2, unit: 'rad/s' },
      { k: 'mu', label: '动摩擦因数 μ', min: 0.05, max: 0.9, step: 0.05, value: 0.3 },
      { k: 'm', label: '质量 m', min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'kg' },
    ],
    load: () => import('./circ3.js'),
  },

  grav1: {
    title: '开普勒三定律：椭圆轨道、等面积与 T²∝a³',
    hint: '行星沿椭圆绕日运行，太阳在一个焦点上。轨道被等时间切成八块，形状各异而面积相同——面积定律；身后那截绿色拖尾按固定时长取，近日点附近明显更长。右图把 T² 与 a³ 画在一起，四颗内行星都落在 y = x 上。',
    params: [
      { k: 'a', label: '半长轴 a', min: 0.5, max: 2, step: 0.05, value: 1, unit: 'AU' },
      { k: 'e', label: '离心率 e', min: 0, max: 0.7, step: 0.02, value: 0.35 },
    ],
    load: () => import('./grav1.js'),
  },

  grav1b: {
    title: '三维开普勒行星仪：等面积、近快远慢与轨道倾角',
    hint: '浅色圆盘上托着一圈倾斜的轨道环，太阳亮球立在盘心焦点上，蓝色行星沿线速度方向滚动。轨道环上铺十二块从太阳扫出的等时间扇形——形状各异而面积相等，当前那块着色更重；绿色箭头是此刻速率，绿色赭色小弧标出轨道平面相对盘面的倾角 i。按住画面拖动转视角、双击复原。拖「离心率 e」看轨道变扁、F′ 与近日点/远日点分开；拖「半长轴 a」轨道放大、周期变长，读数栏 T²/a³ 始终是 1。',
    params: [
      { k: 'a', label: '半长轴 a', min: 0.6, max: 1.5, step: 0.05, value: 1, unit: 'AU' },
      { k: 'e', label: '离心率 e', min: 0, max: 0.6, step: 0.01, value: 0.35 },
      { k: 'inc', label: '轨道倾角 i', min: 0, max: 40, step: 1, value: 18, unit: '°' },
    ],
    load: () => import('./grav1b.js'),
  },

  grav2: {
    title: '万有引力定律：F = Gm₁m₂/r²',
    hint: '两球相互吸引，两支箭头沿连线指向对方、永远等长反向。右图是引力随距离的曲线：把「球心距 r」拖到原来的一倍，绿点落在纵坐标的四分之一处。质量一改，整条曲线随之升降，而读数栏的 F·r² 始终不变。',
    params: [
      { k: 'm1', label: '质量 m₁', min: 10, max: 100, step: 5, value: 60, unit: 'kg' },
      { k: 'm2', label: '质量 m₂', min: 10, max: 100, step: 5, value: 40, unit: 'kg' },
      { k: 'r', label: '球心距 r', min: 1, max: 4, step: 0.05, value: 2, unit: 'm' },
    ],
    load: () => import('./grav2.js'),
  },

  grav3: {
    title: '人造卫星：轨道半径决定速度与周期',
    hint: '橙色卫星沿虚线圆轨道运行，青色虚线是轨道半径 r，绿箭头是线速度。把「轨道半径 r」拖大，卫星立刻慢下来；右图绿色横线是同步卫星的 24 小时，交点落在 r ≈ 6.6 个地球半径处。',
    params: [
      { k: 'r', label: '轨道半径 r', min: 1.05, max: 8, step: 0.05, value: 2, unit: 'R' },
    ],
    load: () => import('./grav3.js'),
  },

  satellite3d: {
    title: '三维卫星轨道：轨道平面与赤道面成倾角',
    hint: '卫星的轨道平面过地心，与赤道面的夹角就是倾角 i，交线叫节线。青色虚线圆是赤道，淡青色椭圆是轨道在赤道面上的投影——卫星转一圈，投影点在南纬 i 与北纬 i 之间来回一趟。按住画面拖动可以转视角，i = 0 时轨道正好压进赤道面。把半径拖大，卫星明显慢下来，读数栏的周期一路升到几十小时。',
    params: [
      { k: 'r', label: '轨道半径 r', min: 1.15, max: 8, step: 0.05, value: 2.5, unit: 'R' },
      { k: 'inc', label: '轨道倾角 i', min: 0, max: 90, step: 1, value: 45, unit: '°' },
    ],
    load: () => import('./satellite3d.js'),
  },

  energy1: {
    title: '功与功率：W = Fs cosθ，只看沿位移的分力',
    hint: '把拉力与位移的夹角 θ 从 0 拖到 180：锐角做正功、直角不做功、钝角做负功。绿箭头是 F cosθ，只有它参与做功；竖直的 F sinθ 一文不值。右栏那条余弦曲线的正负与左栏一一对应。',
    params: [
      { k: 'F', label: '拉力 F', min: 2, max: 20, step: 0.5, value: 8, unit: 'N' },
      { k: 'th', label: '与位移的夹角 θ', min: 0, max: 180, step: 5, value: 30, unit: '°' },
      { k: 's', label: '位移 s', min: 1, max: 6, step: 0.5, value: 3, unit: 'm' },
      { k: 'v', label: '速率 v', min: 0.5, max: 4, step: 0.5, value: 2, unit: 'm/s' },
    ],
    load: () => import('./energy1.js'),
  },

  carstart: {
    title: '机车起动：恒定功率与恒定加速度两种起动方式',
    hint: '同一辆车、同一条路面，右栏两条 v–t 曲线放在一起比：恒定功率档的线开头陡、越走越平，恒定加速度档先是一条直线、涨到额定功率后弯下去。两条线最后都汇到 vmax = P/f 那条青色虚线上，读数栏的「功率 F·v」在恒定功率档始终停在额定值。',
    modes: [
      { k: 'p', label: '恒定功率' },
      { k: 'a', label: '恒定加速度' },
    ],
    params: [
      { k: 'P', label: '额定功率 P', min: 10, max: 80, step: 1, value: 40, unit: 'kW' },
      { k: 'f', label: '阻力 f', min: 300, max: 3000, step: 100, value: 1000, unit: 'N' },
      { k: 'm', label: '质量 m', min: 800, max: 2500, step: 100, value: 1500, unit: 'kg' },
      { k: 'a0', label: '加速度 a₀', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm/s²', modes: ['a'] },
    ],
    load: () => import('./carstart.js'),
  },

  energy2: {
    title: '动能定理：所有力做的总功等于动能的变化',
    hint: '物块被恒力 F 拉着前进，同时受反向的摩擦力 f。右栏三条线各画一项功随位移的累积：拉力那条斜率为正、摩擦力那条向下、两者相加是绿色的总功线。末端青色圈标出的动能变化，正落在这条总功线上。',
    params: [
      { k: 'F', label: '拉力 F', min: 2, max: 20, step: 0.5, value: 10, unit: 'N' },
      { k: 'f', label: '摩擦力 f', min: 0, max: 8, step: 0.5, value: 3, unit: 'N' },
      { k: 'm', label: '物块质量 m', min: 0.5, max: 5, step: 0.5, value: 2, unit: 'kg' },
      { k: 's', label: '位移 s', min: 1, max: 6, step: 0.5, value: 4, unit: 'm' },
    ],
    load: () => import('./energy2.js'),
  },

  energy3: {
    title: '机械能守恒：动能与势能此消彼长，总和不变',
    hint: '单摆从初角 θ₀ 由静止放开，摆球沿圆弧来回摆。越高处越慢、越低处越快：右栏两根竖条分别是动能与重力势能，一根长起来另一根就短下去，而青色横线标出的总和纹丝不动。把初角拖大，摆得更快更高，总和随之变大，但整段摆动中它不再改变。',
    params: [
      { k: 'm', label: '摆球质量 m', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'kg' },
      { k: 'L', label: '摆长 L', min: 0.4, max: 1.6, step: 0.05, value: 1, unit: 'm' },
      { k: 't0', label: '初角 θ₀', min: 10, max: 80, step: 1, value: 50, unit: '°' },
    ],
    load: () => import('./energy3.js'),
  },

  energy4: {
    title: '功能关系与能量守恒：机械能减少多少，内能就增加多少',
    hint: '物块以初速 v₀ 在粗糙水平面上滑行，只有摩擦力的水平分量做功。右栏是一根堆叠条：绿色是动能、粉色是摩擦生成的内能，两者加起来正好顶到那条青色横线。物块停下时绿色归零，粉色升到满格。',
    params: [
      { k: 'm', label: '物块质量 m', min: 0.5, max: 3, step: 0.1, value: 2, unit: 'kg' },
      { k: 'v0', label: '初速度 v₀', min: 2, max: 10, step: 0.5, value: 8, unit: 'm/s' },
      { k: 'mu', label: '动摩擦因数 μ', min: 0.05, max: 0.6, step: 0.01, value: 0.3 },
    ],
    load: () => import('./energy4.js'),
  },

  momentum1: {
    title: '冲量与动量定理：力在时间上的累积等于动量的变化',
    hint: '小球被恒力 F 推了 T 秒。上图 F–t 曲线的下方是一块矩形，面积就是冲量 I = F·T；下图 p–t 是一条斜率为 F 的直线，竖着量出的抬升是 Δp。两图的时刻游标同步移动，读数栏的最后一行「I − Δp」始终是 0。',
    params: [
      { k: 'm', label: '小球质量 m', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'kg' },
      { k: 'v0', label: '初速度 v₀', min: 0, max: 4, step: 0.5, value: 0, unit: 'm/s' },
      { k: 'F', label: '推力 F', min: 2, max: 20, step: 1, value: 8, unit: 'N' },
      { k: 'T', label: '作用时间 T', min: 0.5, max: 3, step: 0.1, value: 1.2, unit: 's' },
    ],
    load: () => import('./momentum1.js'),
  },

  buffering: {
    title: '缓冲与平均作用力：时间拉长，力就降下来',
    hint: '小球以速率 v 撞墙后原速弹回，动量变化 Δp = 2mv 只由质量与速率决定。右栏是接触期间的 F–t 曲线，橙色面积随过程一点点填成整块冲量，青色虚线是等高的平均作用力 F̄ = Δp/Δt。把接触时间从 10 ms 拖到 200 ms：Δp 一行不动，F̄ 一路降下来，垫子也随之变厚。',
    params: [
      { k: 'm', label: '球的质量 m', min: 0.1, max: 2, step: 0.1, value: 0.2, unit: 'kg' },
      { k: 'v', label: '碰前速率 v', min: 2, max: 15, step: 0.5, value: 10, unit: 'm/s' },
      { k: 'tc', label: '接触时间 Δt', min: 0.01, max: 0.2, step: 0.01, value: 0.02, unit: 's' },
    ],
    load: () => import('./buffering.js'),
  },

  momentum2: {
    title: '动量守恒与碰撞：两个物体各走各的，总动量钉在原地',
    hint: 'A、B 两块小车在光滑轨道上相碰，碰后按恢复系数 e 分开。下方动量轴分「碰前」「碰后」两行：蓝点是 A、橙点是 B，绿色虚线钉住总动量 P——两个点怎么动，这条线都不移。最下两根条对比碰前与碰后的动能。',
    modes: [
      { k: 'elastic', label: '弹性碰撞' },
      { k: 'inelastic', label: '完全非弹性碰撞' },
      { k: 'partial', label: '一般碰撞' },
    ],
    params: [
      { k: 'm1', label: 'A 的质量', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'kg' },
      { k: 'm2', label: 'B 的质量', min: 0.5, max: 3, step: 0.1, value: 2, unit: 'kg' },
      { k: 'v1', label: 'A 的初速度', min: 2, max: 6, step: 0.5, value: 4, unit: 'm/s' },
      { k: 'v2', label: 'B 的初速度', min: -1, max: 1, step: 0.5, value: 0, unit: 'm/s' },
      { k: 'e', label: '恢复系数 e', min: 0, max: 1, step: 0.05, value: 0.5, modes: ['partial'] },
    ],
    load: () => import('./momentum2.js'),
  },

  vib1: VIB1,

  vib1Spring: {
    ...VIB1,
    title: '简谐运动：弹簧振子与平衡位置',
    hint: '物块在平衡位置 O 两侧往复运动，橙色虚线标出两侧的振幅位置 ±A，轨道下方量出此刻的位移 x。物块经过 O 时速度最快、位移为零；到达 ±A 时停下换向，位移最大。拖振幅滑块两侧虚线一起张开，拖 k 或 m 只改往返快慢。',
    modes: [{ k: 'spring', label: '弹簧振子' }],
  },

  vib1Force: {
    ...VIB1,
    title: '简谐运动：回复力与 F–x 直线',
    hint: '绿箭头是速度 v，橙箭头是回复力 F，橙箭头总指向平衡位置 O，绿箭头随运动方向翻换。右栏是 F–x 图，一条过原点、斜率为 −k 的直线，橙点标出此刻的 (x, F)；拖 k 直线变陡，拖 A 只让橙点沿直线滑远。',
    modes: [{ k: 'force', label: '回复力' }],
  },

  vib1Xt: {
    ...VIB1,
    title: '简谐运动：位移—时间曲线',
    hint: '横轴是时间、纵轴是位移，曲线是 x = A cos(ωt + φ)。橙色虚线标出 ±A，蓝色是已经走过的一段。拖 A 只改曲线高度，拖 k 或 m 只改疏密——周期与振幅无关；拖初相整条曲线左右平移。',
    modes: [{ k: 'xt', label: 'x–t 曲线' }],
  },

  vib1Circ: {
    ...VIB1,
    title: '简谐运动：参考圆与周期',
    hint: '紫色半径绕圆心以角速度 ω 匀速转动，橙色小点是它在水平直径上的投影，投影到圆心的距离就是此刻的位移 x；右栏的 x–t 曲线画的正是这个投影。半径转一圈，投影来回一次，用的时间就是一个周期 T。',
    modes: [{ k: 'circ', label: '参考圆' }],
  },

  vib2: VIB2,

  vib2Force: {
    ...VIB2,
    title: '单摆：重力沿切线的分力与沿绳的分力',
    hint: '摆球上四支箭头：橙 mg 竖直向下，蓝 F拉 沿绳指向悬点，紫 F 是重力沿切线的分力（回复力），绿 v 沿切线。两侧虚线把 mg 分解成沿绳的 mg cosθ 与沿切线的 mg sinθ。读数栏的「回复力 F」与「mg sinθ」两行始终相等。',
    modes: [{ k: 'force', label: '摆球受力' }],
  },

  vib2Curve: {
    ...VIB2,
    title: '单摆：摆角—时间曲线与周期',
    hint: '左栏的摆球在竖直位置两侧来回摆，右栏是摆角随时间的余弦线：橙色虚线标出 ±θ₀，t = T 处的竖虚线标出一个周期。拖摆长 L 或重力加速度 g，曲线的疏密随之改变；拖摆球质量 m，整个画面纹丝不动。',
    modes: [{ k: 'curve', label: 'θ–t 曲线' }],
  },

  /* 振2c 单摆 + 匀速纸带。质量不参与，参数表因此整份覆盖掉 VIB2 的那一份。 */
  vib2Paper: {
    ...VIB2,
    title: '单摆：匀速纸带上的正弦轨迹',
    hint: '摆球下端接一支笔，笔尖贴着一条匀速向里平移的纸带。纸带走过多远就代表过了多少时间，笔尖在纸上留下一条正弦线。拖纸带速度 v，摆的周期不变、纸上的波长被拉长或压短；按住画面拖动可以转视角，双击复原。',
    tall: true,
    params: [
      { k: 'L', label: '摆长 L', min: 0.3, max: 2, step: 0.05, value: 1, unit: 'm' },
      { k: 'th0', label: '摆角振幅 θ₀', min: 4, max: 30, step: 1, value: 12, unit: '°' },
      { k: 'g', label: '重力加速度 g', min: 4, max: 15, step: 0.1, value: 9.8, unit: 'm/s²' },
      { k: 'vp', label: '纸带速度 v', min: 0.15, max: 0.9, step: 0.05, value: 0.4, unit: 'm/s' },
    ],
    load: () => import('./pendpaper.js'),
  },

  vib3: VIB3,

  vib3Damp: {
    ...VIB3,
    title: '阻尼振动：振幅的指数衰减',
    hint: '水平弹簧振子左端固定在墙上，物块从偏离 0.5 m 处由静止放开，阻力每时每刻做负功，振幅一圈比一圈小。橙色虚线是包络 A(t) = A₀e^{−βt}，蓝色曲线始终在两条包络之间穿行。拖阻尼系数 b，包络收得更快，读数栏的包络一行可以逐点核对。',
    modes: [{ k: 'damp', label: '阻尼振动' }],
  },

  vib3Kinds: {
    ...VIB3,
    title: '三种阻尼：欠阻尼、临界阻尼与过阻尼',
    hint: '三条曲线从同一个初始位移 0.5 m 由静止放开，只有阻尼不同：蓝色欠阻尼在轴两侧来回摆、幅度渐小，橙色临界阻尼与紫色过阻尼一次也不越过水平轴，直接从偏离处回到零，其中橙线回得最快。竖虚线是当前时刻，拖劲度系数 k，三种情形的阻尼系数与时间轴一起变。',
    modes: [{ k: 'kinds', label: '三种阻尼' }],
  },

  vib3Drive: {
    ...VIB3,
    title: '受迫振动：从过渡过程到稳态',
    hint: '紫色驱动端按设定的振幅与频率来回拉动弹簧的左端。下半部分纵轴取 x/A：紫色淡线是驱动端的位移（恒在 ±1 之间），蓝色是物块的位移。开头一小段蓝线还混着自己的固有节奏，之后与紫线同频；橙色虚线是稳态振幅 ±X/A。把 f 拖到 f₀ 附近，稳态振幅抬高。',
    modes: [{ k: 'drive', label: '受迫振动' }],
  },

  vib3Res: {
    ...VIB3,
    title: '共振曲线：稳态振幅随驱动频率的变化',
    hint: '横轴是驱动频率 f，纵轴是稳态振幅与驱动端振幅之比 X/A。f 很小时 X/A 接近 1，物块几乎跟着驱动端一起动；f 很大时趋于 0。峰在固有频率附近，绿虚线标出 f₀，紫点是峰顶，橙点是当前频率。拖阻尼系数 b，峰顶升降；拖 k，峰沿横轴移动。',
    modes: [{ k: 'reson', label: '共振曲线' }],
  },

  wave1: {
    title: '波的形成：绳上一点带动下一点',
    hint: '左端的波源上下振动，振动沿绳依次传给右边的质点，波前不断向右推进。绳上每一枚小点只在原地上下振动，不随波迁移；绿色那枚被单独标出来，它只在自己的竖直虚线上往复。紫色双箭头量出相邻两个波峰的距离，就是波长 λ。把频率 f 拖大，波长变短；把波速 v 拖大，波长变长——波速、波长、频率三者的关系在读数栏里可以直接核对。',
    params: [
      { k: 'A', label: '振幅 A', min: 0.04, max: 0.14, step: 0.01, value: 0.08, unit: 'm' },
      { k: 'f', label: '频率 f', min: 0.6, max: 2, step: 0.1, value: 0.8, unit: 'Hz' },
      { k: 'v', label: '波速 v', min: 0.8, max: 2.5, step: 0.1, value: 1.6, unit: 'm/s' },
    ],
    load: () => import('./wave1.js'),
  },

  wave1Kinds: {
    title: '横波与纵波：振动方向与传播方向的关系',
    hint: '上排是绳上的横波，质点在原地上下振动；下排把同一列波画成一列竖直短线，每根短线代表介质中的一小段，沿传播方向前后振动，挤在一起处是密部、拉开处是疏部。两排共用同一个波长、频率、波速与波前：拖 f 或 v，上排的起伏与下排的疏密同时改变；绿色那一点与绿色那一小段各自在自己的虚线附近往复，都不随波迁移。',
    params: [
      { k: 'A', label: '振幅 A', min: 0.04, max: 0.14, step: 0.01, value: 0.08, unit: 'm' },
      { k: 'f', label: '频率 f', min: 0.6, max: 2, step: 0.1, value: 0.8, unit: 'Hz' },
      { k: 'v', label: '波速 v', min: 0.8, max: 2.5, step: 0.1, value: 1.6, unit: 'm/s' },
    ],
    load: () => import('./wave1kinds.js'),
  },

  wave2: WAVE2,

  wave2Graph: {
    ...WAVE2,
    title: '波形图与振动图：同一时刻与同一点',
    hint: '上下两张图共用同一个纵轴尺度：上图是这一时刻的波形图（横轴位置），下图是绿点 P 的振动图（横轴时间）。紫色双箭头量出波长 λ，绿色竖虚线标出 P 的位置，上图绿点与下图绿点的纵坐标始终相等。拖「查看点 P」，下图换成另一点的历史；把 P 挪到相邻波峰，两条曲线完全重合。',
    modes: [{ k: 'graph', label: '波形图与振动图' }],
    tall: true,
  },

  wave2Add: {
    ...WAVE2,
    title: '波的叠加：两列脉冲的相遇与穿过',
    hint: '一根长绳上两个脉冲相向而行：淡蓝向右、淡橙向左，绿色曲线是二者的合位移。重叠时绿线在每一点等于两条淡色曲线纵坐标之和，反相的部分互相抵消；穿过之后两个脉冲恢复原样继续走。竖虚线处三枚小点分别标出两列波各自的位移与合位移。',
    modes: [{ k: 'add', label: '波的叠加' }],
    tall: false,
  },

  wave2Stand: {
    ...WAVE2,
    title: '驻波：两列反向传播的波叠加',
    hint: '两列振幅相同、频率相同而传播方向相反的波叠加：淡蓝向右、淡橙向左，绿色是合位移。绿色小点标出的位置始终不动，是波节；相邻波节之间振幅最大处是波腹，合振幅为 2A。拖频率 f 或波速 v，波长改变，波节随之疏密。',
    modes: [{ k: 'stand', label: '驻波' }],
    tall: false,
  },

  wave3: WAVE3,

  wave3Interf: {
    ...WAVE3,
    title: '干涉：两列圆波相遇形成的加强线',
    hint: '两个同相点波源各自发出圆波（蓝、橙），绿色曲线是路程差为整数倍波长处的加强线，竖直那条是零级。把波长拖小或把波源间距拖大，加强线之间的间隔变窄、条数变多；拖到波长不小于间距时，只剩零级一条。',
    modes: [{ k: 'interf', label: '干涉' }],
    tall: false,
  },

  wave3Diff: {
    ...WAVE3,
    title: '衍射：缝越窄，波绕过缝后散得越开',
    hint: '左侧蓝色竖线是入射的平面波，中间的挡板上开一条缝，橙色圆弧是从缝发出的子波，缝宽 a 用左侧的短竖线标出。把缝宽拖小，橙色圆弧从一条窄束逐渐张开成半圆；读数栏的 λ/a 越大，衍射越明显。',
    modes: [{ k: 'diff', label: '衍射' }],
    tall: false,
  },

  wave3Doppler: {
    ...WAVE3,
    title: '多普勒效应：波源运动时波面的疏密',
    hint: '橙色小球是边发声边向右运动的波源，蓝色圆圈是它依次发出的波峰。前方相邻两圈挨得很紧、后方拉得很开，波源频率与波速都没变，变的是观察者单位时间里数到的波峰数。把声源速度拖到 0，两边恢复成同样疏密。',
    modes: [{ k: 'doppler', label: '多普勒效应' }],
    tall: false,
  },

  waveeq: {
    title: '波的方程：相位滞后、相位差与质点速度',
    hint: '左栏是绳在某一时刻的波形，波源（橙）在 x = 0，查看点 P（绿）在 x₀ 处，绿箭头是 P 此刻的振动速度。右上把波源与 P 的振动曲线叠在一起：两条形状相同，横向错开 Δt = x₀/v，这就是相位滞后。右下是相位差随距离的直线，绿点是同相点（nλ），紫点是反相点（n + ½）λ。读数栏同时给出 kx₀ 与 2πx₀/λ、P 的位移与波源在 t − Δt 的位移、v_y 与 −v·(∂y/∂x)，三对读数拖滑块时始终相等。',
    tall: true,
    params: [
      { k: 'A', label: '振幅 A', min: 0.04, max: 0.14, step: 0.01, value: 0.08, unit: 'm' },
      { k: 'f', label: '频率 f', min: 0.6, max: 1.6, step: 0.05, value: 0.8, unit: 'Hz' },
      { k: 'v', label: '波速 v', min: 0.8, max: 2.4, step: 0.1, value: 1.6, unit: 'm/s' },
      { k: 'x0', label: '查看点 P 的位置', min: 0.4, max: 3, step: 0.1, value: 1.5, unit: 'm' },
    ],
    load: () => import('./waveeq.js'),
  },

  waveeqDir: {
    title: '传播方向藏在符号里：三种写法的对照',
    hint: '同一根绳、同一个振幅与频率，三种写法各画一遍，绿色小点跟住一个波峰。拖时间看波峰往哪一边走：「ωt − kx」与「kx − ωt」都向右，只有「ωt + kx」向左。切到第三档，背后叠一条淡色的标准形曲线——两条曲线上下对翻，却朝同一个方向走，差别只在整体的负号。',
    modes: [
      { k: 'minus', label: 'ωt − kx' },
      { k: 'plus', label: 'ωt + kx' },
      { k: 'neg', label: 'kx − ωt' },
    ],
    params: [
      { k: 'A', label: '振幅 A', min: 0.04, max: 0.14, step: 0.01, value: 0.08, unit: 'm' },
      { k: 'f', label: '频率 f', min: 0.6, max: 1.6, step: 0.05, value: 0.8, unit: 'Hz' },
      { k: 'v', label: '波速 v', min: 0.8, max: 2.4, step: 0.1, value: 1.6, unit: 'm/s' },
    ],
    load: () => import('./waveeqdir.js'),
  },

  heat1: {
    title: '分子动理论：无规则运动、速率分布与布朗运动',
    hint: '左栏是一只装着分子的盒子：每个分子做匀速直线运动，撞到器壁就弹回，快的画成橙色、慢的画成蓝色。分子热运动档里右栏的橙色曲线是麦克斯韦速率分布，蓝色柱是这一群分子此刻实际的速率统计——分子越多、跑得越久，柱子越贴近曲线；拖动温度，柱子与曲线一起变宽、峰位右移。布朗运动档里中心的绿色颗粒被四周分子不停撞击，走出一条不规则的折线，右栏换成它横、纵两个方向的位移—时间图，两条线都在零线附近来回摆动。',
    modes: [
      { k: 'thermal', label: '分子热运动' },
      { k: 'brown', label: '布朗运动' },
    ],
    params: [{ k: 'T', label: '温度 T', min: 100, max: 800, step: 10, value: 300, unit: 'K' }],
    load: () => import('./heat1.js'),
  },

  molforce: {
    title: '分子间的作用力与分子势能：F–r 与 Ep–r 曲线',
    hint: '左栏两只分子一近一远地振动：靠近时斥力（橙箭头）把它们推开，离开时引力（蓝箭头）把它们拉回，经过平衡距离 r₀ 时两力相抵、合力为零。右栏上图是分子力 F 随间距的曲线，下图是分子势能 Ep 随间距的曲线，绿色竖线跟着当前间距走：r = r₀ 处 F 穿过零点，同时 Ep 落到最低。把振幅拖大，分子跑得离 r₀ 更远，两条曲线的过零点与谷底看得更清楚。',
    tall: true,
    params: [{ k: 'amp', label: '振动幅度 A', min: 0.05, max: 0.45, step: 0.05, value: 0.35, unit: 'r₀' }],
    load: () => import('./molforce.js'),
  },

  gaslaws: {
    title: '气体实验定律：等温、等压与等容',
    hint: '活塞来回走一遍，缸里的气体被压缩、放开。三枚按钮切换固定的那个量：等温档里 p 与 V 的乘积不变，图上是一条双曲线；等压档里 V 与 T 成正比；等容档里 p 与 T 成正比。两条正比关系的直线都从原点出发。读数栏最后一行 pV/T 在三档里始终是同一个数。',
    modes: [
      { k: 'boyle', label: '等温（玻意耳）' },
      { k: 'isobar', label: '等压（盖-吕萨克）' },
      { k: 'isochor', label: '等容（查理）' },
    ],
    params: [
      { k: 'T', label: '温度 T', min: 200, max: 450, step: 10, value: 300, unit: 'K', modes: ['boyle'] },
      { k: 'p', label: '压强 p', min: 1, max: 2, step: 0.05, value: 1.2, unit: 'atm', modes: ['isobar'] },
      { k: 'V', label: '体积 V', min: 14, max: 42, step: 1, value: 20, unit: 'L', modes: ['isochor'] },
    ],
    load: () => import('./gaslaws.js'),
  },

  idealgas: {
    title: '理想气体状态方程：pV = nRT',
    hint: '一定质量档里活塞来回走，右栏 p–V 图上的点沿同一条双曲线滑动，改一改 n 或 T 就换成另一条曲线；读数栏最后一行的 pV/(nT) 始终是 0.0821。打气档换成固定体积的储气罐，打气筒每压一下多打进 0.1 mol 气体，压强随打气次数沿一条直线上升。',
    modes: [
      { k: 'state', label: '一定质量' },
      { k: 'pump', label: '打气' },
    ],
    params: [
      { k: 'n', label: '物质的量 n', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'mol', modes: ['state'] },
      { k: 'T', label: '温度 T', min: 200, max: 450, step: 10, value: 300, unit: 'K' },
    ],
    load: () => import('./idealgas.js'),
  },

  firstlaw: {
    title: '内能与热力学第一定律：ΔU = Q + W',
    hint: '等压加热档里气缸底部加热，气体吸热、活塞缓慢升起，右栏 p–V 图上横线下面的矩形就是气体对外做的功 pΔV；切到绝热压缩档，缸壁加上保温层、Q = 0，外界压活塞做的功全部变成内能，曲线下面的面积就是它。读数栏最后一行 ΔU − (Q + W) 始终是 0。',
    modes: [
      { k: 'iso', label: '等压加热' },
      { k: 'adi', label: '绝热压缩' },
    ],
    params: [
      { k: 'Q', label: '吸收的热量 Q', min: 100, max: 400, step: 10, value: 300, unit: 'J', modes: ['iso'] },
      { k: 'k', label: '压缩比 k', min: 1.3, max: 2.5, step: 0.05, value: 2, modes: ['adi'] },
    ],
    load: () => import('./firstlaw.js'),
  },

  secondlaw: {
    title: '热力学第二定律：热机的效率上限与自发的扩散',
    hint: '热机档里高温热源供热 Q₁，热机对外做功 W、把余下的 Q₂ 排给低温热源；右栏橙线是卡诺上限 1 − T₂/T₁，绿虚线是实际效率，永远压在橙线下方。拖高温热源的温度，两条线一起抬；两端温差越大，效率越高，但永远小于 1。扩散档里抽走隔板，分子自发铺满两半，读数栏「全部回到左半的概率」随分子数陡降到几乎为零——反向过程不是被禁止，而是几乎等不到。',
    modes: [
      { k: 'eng', label: '热机与效率' },
      { k: 'mix', label: '自发扩散' },
    ],
    params: [
      { k: 'T1', label: '高温热源 T₁', min: 500, max: 900, step: 10, value: 600, unit: 'K', modes: ['eng'] },
      { k: 'T2', label: '低温热源 T₂', min: 250, max: 420, step: 5, value: 300, unit: 'K', modes: ['eng'] },
      { k: 'N', label: '分子数 N', min: 12, max: 48, step: 2, value: 24, modes: ['mix'] },
    ],
    load: () => import('./heat5.js'),
  },

  coulomb: {
    title: '库仑定律：两个点电荷之间的力',
    hint: '两个电荷从静止松手，同号相互推开、异号相互拉近，紫色箭头是它们之间的库仑力、绿色箭头是速度；距离一变，力与加速度跟着变，右栏橙点沿 F = k|q₁q₂|/r² 的曲线滑动。读数栏「间距变化率 v」与「加速度 a = F/m」逐帧给出运动的快慢，最后一行 F·r² 滑到哪儿都不变。',
    params: [
      { k: 'q1', label: '电荷量 q₁', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
      { k: 'q2', label: '电荷量 q₂', min: -5, max: 5, step: 0.5, value: -2, unit: 'μC' },
      { k: 'r', label: '间距 r', min: 0.05, max: 0.5, step: 0.01, value: 0.2, unit: 'm' },
    ],
    load: () => import('./coulomb.js'),
  },

  efield: {
    title: '电场强度与电场线：E = kQ/r²',
    hint: '青色光点沿场线流动，正电荷向外、负电荷向内，越靠近电荷走得越快——这正是场线疏密对应场强大小的动态读法。点电荷档里紫色箭头是 P 点的场强，读数栏的 E·r² 拖距离时不变；等量异种电荷档里光点从正电荷出发流向负电荷，中点场强按 8kQ/d² 算；匀强电场档里场线等间距、光点处处同速，拖板距 d，场强按 E = U/d 反比变化，读数栏的 E·d 始终等于板间电压。',
    modes: [
      { k: 'single', label: '点电荷' },
      { k: 'dipole', label: '等量异种电荷' },
      { k: 'uniform', label: '匀强电场' },
    ],
    params: [
      { k: 'Q', label: '电荷量 Q', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC', modes: ['single', 'dipole'] },
      { k: 'r', label: '距离 r', min: 0.1, max: 0.6, step: 0.02, value: 0.2, unit: 'm', modes: ['single'] },
      { k: 'd', label: '间距 d', min: 0.2, max: 0.6, step: 0.02, value: 0.3, unit: 'm', modes: ['dipole'] },
      { k: 'Uu', label: '板间电压 U', min: 20, max: 400, step: 10, value: 200, unit: 'V', modes: ['uniform'] },
      { k: 'du', label: '板间距 d', min: 0.02, max: 0.2, step: 0.01, value: 0.1, unit: 'm', modes: ['uniform'] },
    ],
    load: () => import('./efield.js'),
  },

  superforce: {
    title: '多个电荷的叠加：库仑力按平行四边形合成',
    hint: '两个场源电荷固定在一水平线上，试探电荷 q₀ 放在中垂线上的 P 点；橙、青两支是它受到的库仑力，紫色箭头是合力。拖「P 的高度」把 P 挪低，两力夹角张开、合力按余弦定理变小；把 q₀ 拖过零，两支力与合力一起反向。右栏把三支矢量平移到同一起点补成平行四边形，读数栏最后一行「两种算法之差」滑到哪儿都是 0。',
    modes: [
      { k: 'force', label: '库仑力的合成' },
      { k: 'field', label: '场强的合成' },
    ],
    params: [
      { k: 'q1', label: '场源电荷 q₁', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
      { k: 'q2', label: '场源电荷 q₂', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
      { k: 'd', label: '两电荷间距 d', min: 0.2, max: 0.6, step: 0.02, value: 0.3, unit: 'm' },
      { k: 'hp', label: 'P 到连线高度 h', min: 0.1, max: 0.4, step: 0.02, value: 0.2, unit: 'm' },
      { k: 'q0', label: '试探电荷 q₀', min: -5, max: 5, step: 0.5, value: 1, unit: 'μC', modes: ['force'] },
    ],
    load: () => import('./superpose.js'),
  },

  superpose: {
    title: '电场强度的叠加：E = E₁ + E₂',
    hint: '两个场源电荷固定在一水平线上，考察点 P 在中垂线上；橙、青两支箭头是两个电荷各自在 P 点产生的场强 E₁、E₂，紫色箭头是合场强。拖 P 的高度，两支场强的夹角随之变化，合场强按余弦定理变；把 q₁ 或 q₂ 拖成负数，对应的那支场强调头。读数栏里「余弦定理合成」与合场强相等，「两种算法之差」恒为 0。',
    modes: [
      { k: 'field', label: '场强的合成' },
      { k: 'force', label: '库仑力的合成' },
    ],
    params: [
      { k: 'q1', label: '场源电荷 q₁', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
      { k: 'q2', label: '场源电荷 q₂', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC' },
      { k: 'd', label: '两电荷间距 d', min: 0.2, max: 0.6, step: 0.02, value: 0.3, unit: 'm' },
      { k: 'hp', label: 'P 到连线高度 h', min: 0.1, max: 0.4, step: 0.02, value: 0.2, unit: 'm' },
      { k: 'q0', label: '试探电荷 q₀', min: -5, max: 5, step: 0.5, value: 1, unit: 'μC', modes: ['force'] },
    ],
    load: () => import('./superpose.js'),
  },

  potential: {
    title: '电势与电势能：V = kQ/r 与 U = Ed',
    hint: '点电荷档里试探电荷从 P 点由静止释放，同号被推开、异号被吸过去，电势能一路转成动能；读数栏的 Ep 与 Ek 此消彼长，而「Ep + Ek」一行滑到哪儿都不变。匀强电场档里电荷从 A（或 B）出发沿场线加速，U(s) = Es、W = q₀U(s)，右栏绿点随电荷滑动。',
    modes: [
      { k: 'point', label: '点电荷的电势' },
      { k: 'uniform', label: '匀强电场' },
    ],
    params: [
      { k: 'Q', label: '场源电荷 Q', min: -5, max: 5, step: 0.5, value: 3, unit: 'μC', modes: ['point'] },
      { k: 'r', label: '距离 r', min: 0.1, max: 0.6, step: 0.02, value: 0.2, unit: 'm', modes: ['point'] },
      { k: 'q0', label: '试探电荷 q₀', min: -5, max: 5, step: 0.5, value: 2, unit: 'μC' },
      { k: 'E', label: '场强 E', min: 500, max: 5000, step: 100, value: 2000, unit: 'V/m', modes: ['uniform'] },
      { k: 'd', label: '沿场线距离 d', min: 0.02, max: 0.2, step: 0.01, value: 0.1, unit: 'm', modes: ['uniform'] },
    ],
    load: () => import('./potential.js'),
  },

  capacitor: {
    title: '电容器与带电粒子的偏转：C = Q/U，y = qUL²/(2mdv₀²)',
    hint: '电容器档演示充电过程：板上的正负号与板间场线随着电量 q(t) = CU(1 − e^{−t/τ}) 一颗颗亮起，充满后停一拍再放电归零；读数栏给出 q(t) 与 q/Q，间距 d 拉大时电容 C 按反比降下去，最后一行 C·d 拖间距时不变。偏转档里电子以 v0 水平射入，轨迹是类平抛，读数栏把 a、t、y 分行列出。',
    modes: [
      { k: 'cap', label: '平行板电容器' },
      { k: 'deflect', label: '带电粒子的偏转' },
    ],
    params: [
      { k: 'Uc', label: '电压 U', min: 20, max: 400, step: 10, value: 200, unit: 'V', modes: ['cap'] },
      { k: 'd', label: '板间距 d', min: 1, max: 10, step: 0.5, value: 5, unit: 'mm', modes: ['cap'] },
      { k: 'er', label: '相对介电常数 εr', min: 1, max: 5, step: 0.5, value: 2, modes: ['cap'] },
      { k: 'S', label: '正对面积 S', min: 100, max: 400, step: 20, value: 200, unit: 'cm²', modes: ['cap'] },
      { k: 'Ud', label: '偏转电压 U', min: 50, max: 400, step: 10, value: 200, unit: 'V', modes: ['deflect'] },
      { k: 'L', label: '板长 L', min: 2, max: 8, step: 0.5, value: 5, unit: 'cm', modes: ['deflect'] },
      { k: 'v0', label: '入射速度 v0', min: 1, max: 5, step: 0.2, value: 3, unit: '×10⁷ m/s', modes: ['deflect'] },
    ],
    load: () => import('./capacitor.js'),
  },

  ohm: {
    title: '欧姆定律与串并联：I = U/R，R = R₁ + R₂',
    hint: '导线上的小圆点是定向移动的电荷，流得快慢跟着电流走。欧姆定律档里一只电阻接在电源上，右栏画 I–U 直线，拖电阻 R 直线整体变陡或变平，读数栏的 U/I 拖任何滑块都等于 R。串联档里两只电阻首尾相接，两段导线上的点一样快，右栏上下两条的分界线对齐，说明电压按电阻正比分配。并联档里两条支路电压相同，电阻小的那条点流得快、电流大，总电阻比两条支路都小。',
    modes: [
      { k: 'ohm', label: '欧姆定律' },
      { k: 'series', label: '串联' },
      { k: 'par', label: '并联' },
    ],
    params: [
      { k: 'U', label: '电源电压 U', min: 1, max: 12, step: 0.5, value: 6, unit: 'V' },
      { k: 'R', label: '电阻 R', min: 1, max: 10, step: 0.5, value: 3, unit: 'Ω', modes: ['ohm'] },
      { k: 'R1', label: '电阻 R₁', min: 1, max: 10, step: 0.5, value: 2, unit: 'Ω', modes: ['series', 'par'] },
      { k: 'R2', label: '电阻 R₂', min: 1, max: 10, step: 0.5, value: 4, unit: 'Ω', modes: ['series', 'par'] },
    ],
    load: () => import('./circuit.js'),
  },

  micro: {
    title: '电流的微观表达式：I = q/t = nqSv',
    hint: '导体里的小圆点是自由电荷，橙色一条竖带是横截面 S，绿色一层是 t 时间内将要穿过 S 的电荷，层长就是 v·t。拖「定向移动速率 v」，小点流得快、绿层变长，电流按正比增大；拖「载流子数密度 n」，小点变密；拖「横截面积 S」，导体变粗、截面变宽。右栏是 I 随 v 的直线，过原点、斜率正是 nqS，n 或 S 一变斜率跟着变。读数栏最后两行把 10 ms 内通过的电荷量与「电流 × 时间」并排，两数逐位相同——q = nqSv·t 与 I = q/t 本来就是同一个式子。',
    params: [
      { k: 'n', label: '载流子数密度 n', min: 4, max: 12, step: 0.5, value: 8.5, unit: '×10²⁸ m⁻³' },
      { k: 'S', label: '横截面积 S', min: 0.2, max: 2, step: 0.1, value: 1, unit: 'mm²' },
      { k: 'v', label: '定向移动速率 v', min: 0.01, max: 1, step: 0.01, value: 0.1, unit: 'mm/s' },
    ],
    load: () => import('./micro.js'),
  },

  closed: {
    title: '闭合电路欧姆定律：I = ε/(R+r)，U = ε − Ir',
    hint: '电源外面套着一圈虚线框，标的「内阻 r」就是它自己消耗的那部分。左栏导线上的点按电流快慢流动，外电阻 R 拖大，点流得慢、电流变小、路端电压上升。路端电压档右栏是 U–I 直线：纵截距就是电动势 ε，斜率是 −r，拖 R 只看工作点在直线上滑动，直线本身不动。功率档右栏上下分开——上面一根总功率条按输出与内耗分段，下面是效率 η = R/(R+r) 随外电阻的变化，R 越大效率越接近 100%；外电阻等于内阻时输出功率最大，把 r 拖大一些再扫一遍 R，就能在读数栏里找到这个位置。',
    modes: [
      { k: 'vi', label: '路端电压' },
      { k: 'eff', label: '功率与效率' },
    ],
    params: [
      { k: 'E', label: '电动势 ε', min: 1.5, max: 12, step: 0.5, value: 6, unit: 'V' },
      { k: 'r', label: '内阻 r', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'Ω' },
      { k: 'R', label: '外电阻 R', min: 1, max: 20, step: 0.5, value: 5, unit: 'Ω' },
    ],
    load: () => import('./closed.js'),
  },

  power: {
    title: '电功、电功率与焦耳定律：P = UI，Q/t = I²R',
    hint: '纯电阻档里电阻丝通电发热，上方三条热气流随着飘，电流大小由 U 与 R 现算，读数栏的 P − I²R 拖任何滑块都等于零——电功与电热是同一个数。切到电动机档，转子转起来、旁边一支绿箭头是提升速度，右栏功率条左绿右粉：绿色是机械功率，粉色是线圈发热，拖线圈电阻 R，粉段变宽、绿段变窄、效率跟着降。把 U 拖小、R 拖大，绿段会缩到没有，那意味着电流已经带不动电机了。',
    modes: [
      { k: 'pure', label: '纯电阻' },
      { k: 'motor', label: '电动机' },
    ],
    params: [
      { k: 'U', label: '电压 U', min: 6, max: 24, step: 1, value: 12, unit: 'V' },
      { k: 'I', label: '电流 I', min: 0.5, max: 3, step: 0.1, value: 2, unit: 'A', modes: ['motor'] },
      { k: 'R', label: '电阻 R', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'Ω' },
      { k: 'm', label: '提升质量 m', min: 0.5, max: 5, step: 0.5, value: 2, unit: 'kg', modes: ['motor'] },
    ],
    load: () => import('./power.js'),
  },

  magnet: {
    title: '磁场与磁感应强度：磁感线，F = BIL',
    hint: '磁感线档里条形磁铁右端是 N 极、左端是 S 极，曲线按两极的磁场叠加积出来：磁铁外部从 N 极出发回到 S 极，内部由 S 回 N。拖动滑块把小磁针挪到不同位置，针身始终沿该点的切线，红端指 N；线密的地方读数栏的相对强弱跟着变大。磁感应强度档是一台测量装置：叉号表示磁场垂直纸面向里，导线垂直放进场中，下栏摆三行试验，I 与 L 各不相同、F 也跟着变，可最后一栏 F/(IL) 三行都是同一个 B——这就是磁感应强度的定义。',
    modes: [
      { k: 'lines', label: '磁感线' },
      { k: 'define', label: '磁感应强度' },
    ],
    params: [
      { k: 'px', label: '小磁针位置', min: -1, max: 1, step: 0.05, value: 0.5, modes: ['lines'] },
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 1.5, step: 0.1, value: 0.5, unit: 'T', modes: ['define'] },
      { k: 'I', label: '电流 I', min: 1, max: 10, step: 0.5, value: 4, unit: 'A', modes: ['define'] },
      { k: 'L', label: '导线长度 L', min: 0.2, max: 1.2, step: 0.05, value: 0.6, unit: 'm', modes: ['define'] },
    ],
    load: () => import('./magnet.js'),
  },

  flux: {
    title: '磁通量：Φ = BS cosθ',
    hint: '俯视图里匀强磁场由左向右，线圈绕竖直轴转过 θ，绿色箭头是穿过线圈的那几条磁感线。θ 拖到 0° 线圈正对磁场，穿过的线最多、Φ 取最大；拖到 90° 线圈与磁场平行，一条也穿不过去，Φ 降到零；越过 90° 法线翻面，Φ 变负。读数栏的 Φ/(BS) 始终等于 cosθ，右栏橙点贴着余弦曲线走。',
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 1.5, step: 0.1, value: 0.5, unit: 'T' },
      { k: 'S', label: '线圈面积 S', min: 0.01, max: 0.05, step: 0.005, value: 0.02, unit: 'm²' },
      { k: 'th', label: '法线与磁场夹角 θ', min: 0, max: 180, step: 5, value: 60, unit: '°' },
    ],
    load: () => import('./flux.js'),
  },

  ampere: {
    title: '安培力：F = BIL sinθ，左手定则定方向',
    hint: '四档把磁场方向换一遍看：磁场在纸面内时安培力垂直于纸面，θ 转过 180° 后方向从 ⊗ 翻成 ⊙；磁场垂直纸面时力落在纸面内、大小恒为 BIL；三维视角里 B、I、F 三支向量同框，看得清 F 垂直于另两者张成的平面，按住画面拖动可以转视角，双击复原。',
    modes: [
      { k: 'plane', label: '磁场在纸面内' },
      { k: 'in', label: '磁场 ⊗ 向里' },
      { k: 'out', label: '磁场 ⊙ 向外' },
      { k: 'space', label: '三维视角' },
    ],
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 1.5, step: 0.1, value: 0.5, unit: 'T' },
      { k: 'I', label: '电流 I', min: 1, max: 10, step: 0.5, value: 4, unit: 'A' },
      { k: 'L', label: '导线长度 L', min: 0.2, max: 1.2, step: 0.05, value: 0.6, unit: 'm' },
      { k: 'th', label: '与磁场的夹角 θ', min: 0, max: 360, step: 5, value: 90, unit: '°', modes: ['plane', 'space'] },
      { k: 'ph', label: '导线方向角 φ', min: 0, max: 180, step: 5, value: 0, unit: '°', modes: ['in', 'out'] },
    ],
    load: () => import('./ampere.js'),
  },

  lorentz2: {
    title: '洛伦兹力与带电粒子的圆周运动：r = mv/(qB)',
    hint: '匀强磁场垂直纸面向里，质子垂直射入，洛伦兹力始终指向圆心，轨迹是一个圆。绿箭头是速度、紫箭头是洛伦兹力，两者始终垂直，所以力只改方向、不做功。正电荷档沿逆时针转，负电荷档反过来——换号只翻转向，半径与周期不变。右栏画 r 随 B 的双曲线：B 越大轨道越紧。读数栏最后两行 r·B 与 mv/q 始终相等，拖 B 都推不动它。',
    modes: [
      { k: 'pos', label: '正电荷' },
      { k: 'neg', label: '负电荷' },
    ],
    params: [
      { k: 'v', label: '速度 v', min: 1, max: 10, step: 0.5, value: 3, unit: '×10⁵ m/s' },
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'T' },
    ],
    load: () => import('./lorentz2.js'),
  },

  helix: {
    title: '速度与磁场不垂直：螺旋线的半径与螺距',
    hint: '质子斜着射入磁场：沿磁场方向的 v∥ 不受力、保持匀速，垂直方向的 v⊥ 做圆周运动，两者合成一条螺旋线。橙箭头是 v∥、青箭头是 v⊥、绿箭头是合速度。画面只画一圈，所以螺距与半径的比只由夹角 α 决定——改 B 与 v 只改读数里的真值与快慢。按住画面拖动可以转视角。',
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 2.5, step: 0.1, value: 1, unit: 'T' },
      { k: 'v', label: '速度 v', min: 1, max: 12, step: 0.5, value: 6, unit: '×10⁵ m/s' },
      { k: 'al', label: '与 B 的夹角 α', min: 25, max: 82, step: 1, value: 55, unit: '°' },
    ],
    load: () => import('./helix.js'),
  },

  lorentzwork: {
    title: '洛伦兹力不做功，安培力却做功',
    hint: '导体棒在匀强磁场里匀速上移，安培力沿导轨向上、对棒做正功。棒里的载流子一边沿棒漂移、一边被棒带着上移，合速度斜向右上；洛伦兹力垂直于这个合速度，沿导线的那一支逆着电流做负功、垂直导线的那一支正是安培力做正功，两支的功率逐项相等、合计为零。读数栏里「电源多供的功率」与「安培力做功的功率」两行始终相等，拖任何滑块都推不动。',
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.1, max: 1.5, step: 0.1, value: 0.5, unit: 'T' },
      { k: 'I', label: '电流 I', min: 0.5, max: 6, step: 0.5, value: 2, unit: 'A' },
      { k: 'L', label: '棒长 L', min: 0.2, max: 1.0, step: 0.05, value: 0.5, unit: 'm' },
      { k: 'v', label: '棒的速率 v杆', min: 0.1, max: 1.5, step: 0.05, value: 0.6, unit: 'm/s' },
    ],
    load: () => import('./lorentzwork.js'),
  },

  lenz: {
    title: '楞次定律：感应电流的磁场阻碍磁通量的变化',
    hint: '条形磁铁沿轴线往复移动，靠近时穿过线圈的磁通量增加、远离时减少，线圈上的绿色箭头是感应电流的方向。靠近时箭头逆时针、远离时顺时针（都从磁铁这一侧看），磁铁旁的紫色箭头是线圈对它的作用力：靠近时排斥、远离时吸引，始终与磁铁的运动方向相反。右栏的 Φ–t 曲线在磁铁离得最近的地方最陡，切线斜率给出 ΔΦ/Δt；磁铁停在两端时斜率为零，感应电流也归零。把匝数 N 拖大，读数栏的电动势与电流一起按比例变大，方向不变。',
    modes: [
      { k: 'N', label: 'N 极朝向线圈' },
      { k: 'S', label: 'S 极朝向线圈' },
    ],
    params: [
      { k: 'N', label: '线圈匝数 N', min: 1, max: 40, step: 1, value: 10 },
    ],
    load: () => import('./lenz.js'),
  },

  faraday: {
    title: '法拉第电磁感应定律：E = nΔΦ/Δt',
    hint: '匀强磁场垂直纸面向里穿过 n 匝线圈，磁感应强度按三角波匀速升降。磁场增强时段，线圈里的感应电流逆时针，减弱时段翻成顺时针；磁场到顶回头的那一刻变化率为零，绿色箭头与电流计指针同时归零。右栏的两段折线是总磁通量 nΦ 随时间的变化，橙段斜率为正、青段为负，斜率的绝对值就是感应电动势 E = nΔΦ/Δt。把变化率滑块拖大，折线变陡、读数栏的电动势与电流一起按正比增大；把匝数或电阻拖大，电动势按匝数正比增大、电流按电阻反比减小。',
    params: [
      { k: 'kap', label: '磁场变化率 ΔB/Δt', min: 0.15, max: 1.2, step: 0.05, value: 0.4, unit: 'T/s' },
      { k: 'n', label: '线圈匝数 n', min: 10, max: 200, step: 10, value: 100 },
      { k: 'R', label: '回路电阻 R', min: 0.5, max: 20, step: 0.5, value: 2, unit: 'Ω' },
    ],
    load: () => import('./faraday.js'),
  },

  selfind: {
    title: '自感与涡流：电流变化引起的感应',
    hint: '第一档画的是并联的电感与电阻。合上开关时 L 中的电流按指数缓慢上升，读数栏的自感电动势与电流变化率同步减小；断开开关后 L 与 R 自成回路，L 中的电流方向不变、指数衰减，R 中电流反向，绿色小点跟着走一遍。时间常数 τ = L/R 决定快慢：把 L 拖大或把 R 拖小，τ 变大、曲线变缓，右栏的 63% 参考线也跟着右移。第二档是铜摆在磁极前摆动：摆片进入磁场那一段出现涡流，涡流受安培力反过来阻碍摆动，振幅迅速衰减，而紫色虚线画的是同初始角、不带阻尼的理想摆，两者对照即见电磁阻尼。',
    modes: [
      { k: 'rl', label: '自感现象' },
      { k: 'eddy', label: '涡流阻尼' },
    ],
    params: [
      { k: 'L', label: '自感系数 L', min: 0.5, max: 6, step: 0.1, value: 2, unit: 'H', modes: ['rl'] },
      { k: 'R', label: '回路电阻 R', min: 1, max: 20, step: 0.5, value: 6, unit: 'Ω', modes: ['rl'] },
      { k: 'b', label: '阻尼系数 b', min: 0, max: 1.5, step: 0.05, value: 0.4, unit: 's⁻¹', modes: ['eddy'] },
    ],
    load: () => import('./selfind.js'),
  },

  railrod: {
    title: '导体棒与导轨：一条完整的感应链',
    hint: '导体棒横放在两条平行导轨上，磁场垂直穿过导轨平面，左端接一只电阻。第一档给初速度：棒一开跑，切割磁感线产生电动势 BLv，回路里的电流又在磁场中受力，安培力始终与速度反向，速度按指数衰减、最终停下，走过的总位移有限。第二档恒力拉动：棒从静止起步，速度越大电流越大、安培力越大，加速度逐渐减小，最后安培力与外力求平，右栏的紫色虚线就是收尾速度 FR/(B²L²)。读数栏里电动势、电流、安培力、加速度逐项随速度变化，右栏下方的点沿 v–t 曲线滑动。',
    modes: [
      { k: 'given', label: '给初速度' },
      { k: 'force', label: '恒力拉动' },
    ],
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.2, max: 2, step: 0.1, value: 1, unit: 'T' },
      { k: 'L', label: '导轨间距 L', min: 0.5, max: 2, step: 0.1, value: 1, unit: 'm' },
      { k: 'm', label: '棒的质量 m', min: 0.1, max: 1, step: 0.05, value: 0.2, unit: 'kg' },
      { k: 'R', label: '回路电阻 R', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'Ω' },
      { k: 'v0', label: '初速度 v₀', min: 0.5, max: 5, step: 0.1, value: 3, unit: 'm/s', modes: ['given'] },
      { k: 'F', label: '拉力 F', min: 0.2, max: 5, step: 0.1, value: 1.5, unit: 'N', modes: ['force'] },
    ],
    load: () => import('./railrod.js'),
  },

  acgen: {
    title: '交流电的产生：线圈转动与正弦电动势',
    hint: '俯视看，一线圈在水平向右的匀强磁场里绕中心匀速转动。线圈转到与磁场垂直（磁通量最大）时，磁通量变化率为零，电动势取到零；转到与磁场平行（磁通量为零）时，变化率最大，电动势也最大。右栏画两个周期的 e–t 曲线，橙点是此刻的电动势，紫色虚线标峰值 ±E₀，青色虚线标有效值 ±E₀/√2。把转速拖大，曲线变密、峰值也一起变大；把匝数、磁场或面积拖大，峰值按正比升高。',
    params: [
      { k: 'N', label: '线圈匝数 N', min: 10, max: 200, step: 10, value: 100 },
      { k: 'B', label: '磁感应强度 B', min: 0.2, max: 2, step: 0.1, value: 1, unit: 'T' },
      { k: 'S', label: '线圈面积 S', min: 0.01, max: 0.2, step: 0.01, value: 0.05, unit: 'm²' },
      { k: 'f', label: '转速 f', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'Hz' },
      { k: 'R', label: '负载电阻 R', min: 2, max: 50, step: 1, value: 10, unit: 'Ω' },
    ],
    load: () => import('./acgen.js'),
  },

  transformer: {
    title: '变压器：电压、电流与匝数',
    hint: '原、副线圈绕在同一个闭合铁芯上，橙色小点沿铁芯流动表示交变的磁通量。理想变压器每匝分担的电压相同，所以 U₁/U₂ = n₁/n₂；副线圈接上负载后，功率从原边传到副边，P₁ = P₂ 又给出 I₁/I₂ = n₂/n₁。右栏上下两张图共用一条时间轴，两条曲线同频同相，峰值之比恰是匝数比。把 n₂ 拖大，副边电压按正比升高、副边电流同时变小，读数栏的每匝电压两行始终相等。',
    params: [
      { k: 'n1', label: '原线圈匝数 n₁', min: 200, max: 2000, step: 100, value: 800 },
      { k: 'n2', label: '副线圈匝数 n₂', min: 200, max: 2000, step: 100, value: 200 },
      { k: 'U1', label: '输入电压 U₁', min: 12, max: 220, step: 4, value: 220, unit: 'V' },
      { k: 'R', label: '负载电阻 R', min: 10, max: 500, step: 10, value: 100, unit: 'Ω' },
    ],
    load: () => import('./transformer.js'),
  },

  transmit: {
    title: '远距离输电：损失为什么按电压平方下降',
    hint: '发电厂送出功率 P、输送电压 U，输电线电阻 R，线上的电流 I = P/U，两笔损失都出自这个电流：电压损失 ΔU = IR，功率损失 ΔP = I²R = P²R/U²。左上是发电机、升压变压器、输电线、降压变压器与用户的示意，绿色小点表示电能流向；左下两根条按比例画输送功率与线上损失。右栏是损耗比例随输送电压变化的曲线，橙点即当前取值。把输送电压拖高，电流按反比下降、损耗按平方下降；把输送功率拖大，损耗按平方上升。',
    params: [
      { k: 'P', label: '输送功率 P', min: 20, max: 600, step: 10, value: 200, unit: 'kW' },
      { k: 'U', label: '输送电压 U', min: 10, max: 500, step: 10, value: 110, unit: 'kV' },
      { k: 'R', label: '线路总电阻 R', min: 2, max: 80, step: 2, value: 20, unit: 'Ω' },
    ],
    load: () => import('./transmit.js'),
  },

  refract: {
    title: '折射定律与全反射：一条界面的两种结局',
    hint: '两介质以一条水平界面分开，竖直虚线是法线。光线从上方射到界面，入射角 θ₁ 与折射角 θ₂ 都从法线量起，满足 n₁sinθ₁ = n₂sinθ₂：进入光密介质时折射光向法线偏折，进入光疏介质时偏离法线。把 n₁ 拖到大于 n₂，再把入射角推过临界角 arcsin(n₂/n₁)，折射光消失、只剩反射光——全反射。右栏画 θ₂ 随 θ₁ 变化的曲线，橙点是当前取值，紫色虚线标临界角，越过它曲线就断掉了。',
    params: [
      { k: 'n1', label: '介质 1 折射率 n₁', min: 1, max: 2.5, step: 0.05, value: 1, unit: '' },
      { k: 'n2', label: '介质 2 折射率 n₂', min: 1, max: 2.5, step: 0.05, value: 1.5, unit: '' },
      { k: 'th1', label: '入射角 θ₁', min: 0, max: 89, step: 1, value: 40, unit: '°' },
    ],
    load: () => import('./refract.js'),
  },

  prism: {
    title: '棱镜与色散：一束白光走成一条色带',
    hint: '三棱镜的顶角可调，一束白光从左侧面射入，在两个面上各折射一次后射出。折射率随波长变化（柯西式），紫光最大、红光最小，出射方向因此分开：紫光偏得最多、落得最低，红光偏得最少。把折射率或顶角拖大，色散角变宽；把入射角推到某个位置，第二个面会全反射、色带消失。右栏画偏向角 δ 随入射角 i₁ 变化的紫 / 黄绿 / 红三条曲线，橙点标当前取值。',
    params: [
      { k: 'A', label: '棱镜顶角 A', min: 30, max: 80, step: 1, value: 60, unit: '°' },
      { k: 'n', label: '折射率 n（589 nm）', min: 1.35, max: 1.85, step: 0.01, value: 1.62, unit: '' },
      { k: 'i1', label: '入射角 i₁', min: 15, max: 75, step: 1, value: 45, unit: '°' },
    ],
    load: () => import('./prism.js'),
  },
  lens: {
    title: '透镜成像：一支箭头怎样变成一支箭头',
    hint: '光轴上一支竖直的物箭头，经薄透镜折出三条特殊光线：平行于光轴的那条过后焦点、过光心的那条不改方向、过焦点的出来后平行于光轴，三条线的交点就是像。凸透镜把远处的物在另一侧成倒立实像，物靠近焦点时实像迅速变大变远，进到焦距以内就变成同侧放大的正立虚像；换成凹透镜，像总在同一侧、总是正立的虚像。右栏画像距 v 随物距 u 的变化，凸透镜在 u = f 处断开。',
    modes: [
      { k: 'convex', label: '凸透镜' },
      { k: 'concave', label: '凹透镜' },
    ],
    params: [
      { k: 'f', label: '焦距 f', min: 5, max: 30, step: 1, value: 15, unit: 'cm' },
      { k: 'u', label: '物距 u', min: 4, max: 90, step: 1, value: 30, unit: 'cm' },
      { k: 'h', label: '物高 h', min: 1, max: 6, step: 0.1, value: 3, unit: 'cm' },
    ],
    load: () => import('./lens.js'),
  },
  double: {
    title: '双缝干涉：一条亮一条暗从哪里来',
    hint: '同一束光穿过两条相距 d 的狭缝，屏上每一点都收到来自两缝的两束光。路程差 Δr ≈ dy/L 是波长的整数倍就加强成亮纹，是半波长的奇数倍就相消成暗纹，条纹间距 Δx = Lλ/d。波长越长、缝距越小、屏越远，条纹越宽。左图两条光线到观察点 P，右栏是屏上的光强曲线与彩色条纹。',
    params: [
      { k: 'lam', label: '波长 λ', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { k: 'd', label: '双缝间距 d', min: 0.1, max: 1, step: 0.02, value: 0.5, unit: 'mm' },
      { k: 'L', label: '屏距 L', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'm' },
      { k: 'y', label: '观察点位置 y', min: -6, max: 6, step: 0.05, value: 1.1, unit: 'mm' },
    ],
    load: () => import('./double.js'),
  },
  diffract: {
    title: '光的衍射：缝一窄，光就散开',
    hint: '一束平行单色光落在一条窄缝上，缝后的光不再沿直线前进，而是向两侧铺开，屏上出现中央最宽最亮的亮纹和两侧较窄较暗的亮纹。缝宽越接近波长，散得越开；缝宽远大于波长时，衍射几乎看不出来，光近似沿直线传播。偏振档里自然光过第一块偏振片后强度减半、成为线偏振光，再过转角的检偏器，透射强度按 cos²θ 变化。',
    modes: [
      { k: 'slit', label: '单缝衍射' },
      { k: 'pol', label: '偏振' },
    ],
    params: [
      { k: 'lam', label: '波长 λ', min: 400, max: 700, step: 5, value: 550, unit: 'nm' },
      { k: 'a', label: '缝宽 a', min: 20, max: 200, step: 2, value: 60, unit: 'μm', modes: ['slit'] },
      { k: 'L', label: '屏距 L', min: 0.5, max: 3, step: 0.1, value: 1, unit: 'm', modes: ['slit'] },
      { k: 'th', label: '检偏器转角 θ', min: 0, max: 180, step: 1, value: 45, unit: '°', modes: ['pol'] },
    ],
    load: () => import('./diffract.js'),
  },
  photo: {
    title: '光电效应：光一照，电子就跑出来',
    hint: '一定频率的光照到金属阴极上，电子吸收一个光子后逸出，最大初动能等于光子能量减去逸出功。光强只改单位时间逸出的电子数（饱和电流），光子能量不足时再怎么加强光也不会有电子出来。反向加压到遏止电压 U_c，电流归零；换一种逸出功更大的金属，遏止电压随之降低。右上是光电流随电压的曲线，右下把光子能量拆成逸出功与最大初动能两段。',
    params: [
      { k: 'lam', label: '波长 λ', min: 200, max: 700, step: 5, value: 400, unit: 'nm' },
      { k: 'W', label: '逸出功 W', min: 1.5, max: 5, step: 0.05, value: 2.2, unit: 'eV' },
      { k: 'I0', label: '光强（相对）', min: 0.2, max: 2, step: 0.05, value: 1, unit: '' },
      { k: 'U', label: '外加电压 U', min: -3, max: 3, step: 0.05, value: 0, unit: 'V' },
    ],
    load: () => import('./photo.js'),
  },
  debroglie: {
    title: '德布罗意波：电子越加速，它的波越短',
    hint: '运动的实物粒子伴随一列物质波，波长 λ = h/p。电子在加速电场里获得动能 eU，动量 p = √(2meU)，波长 λ ≈ 1.226/√U nm。电压取几百伏时波长在十分之一纳米量级，与晶体中的原子间距相当，所以电子穿过晶体能产生可观察的衍射。电压升到四倍，波长减半。左栏的波纹按真实波长比例放大绘制，右栏是 λ 随电压变化的曲线。',
    params: [
      { k: 'U', label: '加速电压 U', min: 50, max: 5000, step: 50, value: 1000, unit: 'V' },
    ],
    load: () => import('./debroglie.js'),
  },
  atom: {
    title: '能级跃迁：一次跳下去，发出一份光',
    hint: '氢原子的能量只能取 E_n = −13.6/n² eV 这些分立值，电子在两个定态之间跃迁时吸收或放出一份光子，能量正好等于两能级的差 hν = E_m − E_n。n₂ 落到 n₁ 放出的光子波长 λ = 1240/ΔE nm，末态同为 n = 2 的一组跃迁构成巴尔末系，其中四条落在可见光区。左栏是能级阶梯与跃迁箭头，右栏把谱线标在波长条上。',
    modes: [
      { k: 'jump', label: '一次跃迁' },
      { k: 'series', label: '一组谱线' },
    ],
    params: [
      { k: 'n1', label: '低能级 n₁', min: 1, max: 4, step: 1, value: 2, unit: '' },
      { k: 'n2', label: '高能级 n₂', min: 2, max: 6, step: 1, value: 3, unit: '', modes: ['jump'] },
    ],
    load: () => import('./atom.js'),
  },
  decay: {
    title: '放射性衰变：哪一刻衰变，只能按概率说',
    hint: '放射性元素的原子核会自发衰变，单个核什么时候衰变无法预测，大量核的数目按 N = N₀(1/2)^(t/T) 减少，T 是半衰期。每过一个半衰期，剩下的核减半，蓝点转成橙点的过程带着明显的随机涨落。三种射线档里 α 被纸片挡住、β 需要几毫米铝板、γ 只能由铅板减弱。',
    modes: [
      { k: 'decay', label: '半衰期' },
      { k: 'rays', label: '三种射线' },
    ],
    params: [
      { k: 'Th', label: '半衰期 T', min: 2, max: 20, step: 0.5, value: 6, unit: 's', modes: ['decay'] },
    ],
    load: () => import('./decay.js'),
  },
  nuclear: {
    title: '核反应与核能：裂变与聚变都朝铁峰爬升',
    hint: '比结合能 E/A 随质量数 A 先陡升、在铁峰附近达到约 8.8 MeV，再缓慢下降。轻核聚成较重的核、重核裂成中等的核，都往峰顶方向走，于是放出能量。E = Δmc²：质量亏损每 1 u 对应 931.5 MeV。链式反应档按增殖系数 k 逐代增殖，k > 1 才能自持。',
    modes: [
      { k: 'curve', label: '比结合能曲线' },
      { k: 'chain', label: '链式反应' },
    ],
    params: [
      { k: 'A', label: '质量数 A', min: 2, max: 240, step: 1, value: 56, unit: '', modes: ['curve'] },
      { k: 'k', label: '增殖系数 k', min: 0.6, max: 3, step: 0.1, value: 2.5, unit: '', modes: ['chain'] },
    ],
    load: () => import('./nuclear.js'),
  },

  /* —— 实验与测量（实1–实6）—— */
  tapeexp: {
    title: '打点计时器：位移差恒为 aT₀²，逐差法求加速度',
    hint: '纸带每 0.02 s 打一个点，每五个点取一个计数点，间隔 T₀ = 0.10 s。相邻两段的位移差恒等于 aT₀²，把六段分成前后两半相减就用上了全部数据。右栏 v-t 图过原点、斜率即 a，与逐差法算出的值对上，就说明这套数据自洽。',
    params: [
      { k: 'a', label: '加速度 a', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'm/s²' },
      { k: 'v0', label: '初速度 v₀', min: 0.1, max: 1, step: 0.05, value: 0.3, unit: 'm/s' },
    ],
    load: () => import('./tape.js'),
  },
  newton2exp: {
    title: '验证牛顿第二定律：a 正比于 F、反比于 m',
    hint: '砂桶的重力当作小车受到的拉力，前提是砂桶质量远小于小车。右栏画 a–F 图，是一条过原点的直线，斜率就是 1/m：把 m 拖大，直线变平；把 F 拖大，工作点沿直线往右上走。读数栏的 a 与 F/m 两行始终相等。',
    params: [
      { k: 'F', label: '拉力 F', min: 0.1, max: 1, step: 0.05, value: 0.4, unit: 'N' },
      { k: 'm', label: '小车质量 m', min: 0.2, max: 1, step: 0.05, value: 0.5, unit: 'kg' },
    ],
    load: () => import('./newton2exp.js'),
  },
  mechenergy: {
    title: '验证机械能守恒：½v² 与 gh 两条线重合',
    hint: '重物自由下落，纸带上的点距越来越疏。取重物为研究对象，忽略阻力时有 v² = 2gh，即 ½v² 与 gh 处处相等。右栏橙点是实测的 ½v²、绿虚线是理论上的 gh，两者贴在一起就说明重力势能转化成了动能。',
    params: [
      { k: 'h', label: '下落高度 h', min: 0.1, max: 1.2, step: 0.05, value: 0.6, unit: 'm' },
    ],
    load: () => import('./mechenergy.js'),
  },
  projectileexp: {
    title: '研究平抛运动：y 与 x² 成正比',
    hint: '钢球从斜槽末端水平飞出，水平方向匀速、竖直方向自由落体，消去 t 得 y = gx²/(2v₀²)。以 x² 为横轴作图，散点落在一条过原点的直线上，斜率是 g/(2v₀²)。把 v₀ 拖大，轨迹更平、图线斜率变小，由斜率能反过来算出 v₀。',
    params: [
      { k: 'H', label: '抛出高度 H', min: 0.2, max: 1.2, step: 0.05, value: 0.8, unit: 'm' },
      { k: 'v0', label: '初速度 v₀', min: 0.5, max: 3, step: 0.1, value: 1.5, unit: 'm/s' },
    ],
    load: () => import('./projectileexp.js'),
  },
  momentumexp: {
    title: '验证动量守恒：碰前碰后总动量对齐',
    hint: '气垫导轨上两滑块相碰，光电门测出碰前碰后的速度。弹性碰撞时动能也不损失，完全非弹性碰撞时两滑块粘在一起同速前进、动能的一部分转成内能。右栏四根动量条用同一把尺子画，碰前与碰后的总动量落在同一条竖直位置上。',
    modes: [
      { k: 'elastic', label: '弹性碰撞' },
      { k: 'inelastic', label: '完全非弹性' },
    ],
    params: [
      { k: 'm1', label: 'A 的质量 m₁', min: 0.1, max: 0.6, step: 0.05, value: 0.2, unit: 'kg' },
      { k: 'm2', label: 'B 的质量 m₂', min: 0.1, max: 0.6, step: 0.05, value: 0.3, unit: 'kg' },
      { k: 'v1', label: '碰前 A 的速度', min: 0.2, max: 1.2, step: 0.05, value: 0.6, unit: 'm/s' },
    ],
    load: () => import('./momentumexp.js'),
  },
  pendulumexp: {
    title: '用单摆测重力加速度：T² 与摆长成正比',
    hint: '摆长用米尺量、周期用 30 次全振动计时求平均，这样能压住起停表带来的误差。由 T = 2π√(L/g) 得 T² = (4π²/g)·L，右栏以 T² 为纵轴、L 为横轴，散点落在过原点的直线上，斜率是 4π²/g，反推就得到 g。',
    params: [
      { k: 'L', label: '摆长 L', min: 0.3, max: 2, step: 0.05, value: 1, unit: 'm' },
    ],
    load: () => import('./pendulumexp.js'),
  },

  /* —— 实验与测量（实7–实12）—— */
  ohmexp: {
    title: '伏安法测电阻：内接与外接的系统误差',
    hint: '内接时电压表跨在电流表与 Rₓ 上，测得的电阻多了电流表内阻；外接时电压表只跨在 Rₓ 上，电流表多读了一路表分流。右栏两条相对误差曲线一升一降，交点就是临界电阻 √(R_A·R_V)：Rₓ 比它大用内接，比它小用外接。',
    modes: [
      { k: 'inner', label: '电流表内接' },
      { k: 'outer', label: '电流表外接' },
    ],
    params: [
      { k: 'Rx', label: '待测电阻 Rₓ', min: 5, max: 500, step: 5, value: 50, unit: 'Ω' },
      { k: 'RA', label: '电流表内阻 R_A', min: 0.2, max: 5, step: 0.1, value: 1, unit: 'Ω' },
      { k: 'RV', label: '电压表内阻 R_V', min: 1, max: 20, step: 0.5, value: 5, unit: 'kΩ' },
    ],
    load: () => import('./ohmexp.js'),
  },
  emfexp: {
    title: '测电源电动势与内阻：U–I 直线的截距与斜率',
    hint: '电压表跨在电源两端读路端电压，电流表读干路电流。改变外电阻取若干组 U 与 I，右栏的点落在一条直线上：纵截距是电动势 ε，斜率的绝对值是内阻 r，横截距是短路电流 ε/r。',
    params: [
      { k: 'emf', label: '电动势 ε', min: 1.5, max: 12, step: 0.5, value: 3, unit: 'V' },
      { k: 'r', label: '内阻 r', min: 0.5, max: 5, step: 0.1, value: 1.5, unit: 'Ω' },
      { k: 'R', label: '外电阻 R', min: 1, max: 20, step: 0.5, value: 4, unit: 'Ω' },
    ],
    load: () => import('./emfexp.js'),
  },
  multimeter: {
    title: '多用电表：欧姆挡的刻度与热敏电阻',
    hint: '欧姆挡靠表内电池供电，指针的偏转由 I/I_max = R中/(R中+Rₓ) 决定，所以刻度左密右疏、0 在右端，读数 = 指针示数 × 倍率，指针落在中值附近最准。热敏电阻是 NTC，温度一升阻值就掉，串进电路后电流随之上升。',
    modes: [
      { k: 'ohm', label: '欧姆挡测电阻' },
      { k: 'sensor', label: '热敏电阻' },
    ],
    params: [
      { k: 'Rx', label: '待测电阻 Rₓ', min: 5, max: 5000, step: 5, value: 1500, unit: 'Ω', modes: ['ohm'] },
      { k: 'mul', label: '倍率指数 n（×10ⁿ）', min: 0, max: 3, step: 1, value: 2, modes: ['ohm'] },
      { k: 'T', label: '温度 t', min: 0, max: 100, step: 1, value: 25, unit: '℃', modes: ['sensor'] },
      { k: 'B', label: '材料常数 B', min: 1500, max: 5000, step: 100, value: 3500, unit: 'K', modes: ['sensor'] },
    ],
    load: () => import('./multimeter.js'),
  },
  refraction: {
    title: '测玻璃的折射率：插针法与 sin i–sin r 直线',
    hint: '两根大头针定出入射光线，另两根定出射光线，进出玻璃砖的两点连起来就是玻璃里的光路。玻璃砖两面平行，出射光线与入射光线平行、只错开一段距离；sin i 与 sin r 之比恒等于 n，右栏各点落在一条过原点的直线上，斜率就是折射率。',
    params: [
      { k: 'i', label: '入射角 i', min: 5, max: 80, step: 1, value: 45, unit: '°' },
      { k: 'n', label: '玻璃的折射率 n', min: 1.2, max: 1.9, step: 0.01, value: 1.5 },
    ],
    load: () => import('./refraction.js'),
  },
  doubleslit: {
    title: '用双缝干涉测波长：条纹间距 Δx = λL/d',
    hint: '单色光经两条缝分成两束相干光，在屏上叠出一排等间距的明暗条纹。左栏是俯视的光路与屏上的条纹，右栏是屏上光强随位置的变化：亮纹等间距，间距正比于波长与屏距、反比于双缝间距。量出 Δx、d、L 三个量就能反求波长。',
    params: [
      { k: 'lam', label: '光的波长 λ', min: 400, max: 700, step: 10, value: 550, unit: 'nm' },
      { k: 'd', label: '双缝间距 d', min: 0.1, max: 0.6, step: 0.01, value: 0.2, unit: 'mm' },
      { k: 'L', label: '屏到双缝的距离 L', min: 0.5, max: 2, step: 0.1, value: 1, unit: 'm' },
    ],
    load: () => import('./doubleslit.js'),
  },
  sigfig: {
    title: '误差与有效数字：读数末位是估读出来的',
    hint: '左栏一把最小分度为 1 mm 的刻度尺，铅笔两端各读一个数，估读到分度值的下一位，末位因此是估出来的。右栏把同一根铅笔反复量若干次，各次读数围着真值散开：平均值逐次稳定下来，平均值的标准不确定度按 σ/√n 收窄，结果该留几位就由它定。',
    params: [
      { k: 'len', label: '铅笔的长度 L', min: 1.5, max: 3, step: 0.01, value: 2.55, unit: 'cm' },
      { k: 'pos', label: '铅笔左端的位置', min: 0.4, max: 1.4, step: 0.01, value: 0.87, unit: 'cm' },
      { k: 'n', label: '测量次数 n', min: 5, max: 40, step: 1, value: 20 },
    ],
    load: () => import('./sigfig.js'),
  },

  /* —— 测量工具的使用（实13–实15）—— */
  vernier: {
    title: '游标卡尺：主尺整毫米 + 游标对齐格数 × 精度',
    hint: '主尺的零线与固定量爪对齐，游标随活动量爪滑动。读数分两步：先看游标零线左边的整毫米，再在游标上找与主尺刻线重合的那一格，格数乘以精度（10 分度 0.1 mm、20 分度 0.05 mm、50 分度 0.02 mm）就是小数部分。右栏把重合处放大，游标卡尺不估读。',
    modes: [
      { k: 'd10', label: '10 分度' },
      { k: 'd20', label: '20 分度' },
      { k: 'd50', label: '50 分度' },
    ],
    params: [
      { k: 'L', label: '被测长度 L', min: 1, max: 45, step: 0.01, value: 12.46, unit: 'mm' },
    ],
    load: () => import('./vernier.js'),
  },
  micrometer: {
    title: '螺旋测微器：固定刻度读到半毫米，微分筒每格 0.01 mm',
    hint: '螺距 0.5 mm，微分筒转一圈、测微螺杆前进 0.5 mm；一周分 50 格，所以每格 0.01 mm。读数先看固定刻度露出几个半毫米，再看微分筒上与基准线对齐的格数，两者相加，末位再估读一位，结果写成三位小数。',
    params: [
      { k: 'L', label: '被测长度 L', min: 0, max: 5, step: 0.001, value: 2.473, unit: 'mm' },
    ],
    load: () => import('./micrometer.js'),
  },
  gauges: {
    title: '刻度尺、天平与电表：先认清分度值，再读到它的下一位',
    hint: '刻度尺的分度是 1 mm，读数估读到 0.1 mm；天平的游码每小格 0.2 g，砝码与游码相加就是被测质量；电流表 0.6 A 档分度 0.02 A，读数写到 0.01 A。三种量具的规矩是同一条：分度值决定读到哪一位，再往后那位靠估读。',
    modes: [
      { k: 'ruler', label: '刻度尺' },
      { k: 'balance', label: '托盘天平' },
      { k: 'meter', label: '电流表' },
    ],
    params: [
      { k: 'x', label: '被测物端点位置', min: 0.2, max: 9.6, step: 0.001, value: 4.87, unit: 'cm', modes: ['ruler'] },
      { k: 'm', label: '被测质量 m', min: 0, max: 200, step: 0.2, value: 63.4, unit: 'g', modes: ['balance'] },
      { k: 'I', label: '指针所指电流 I', min: 0, max: 0.6, step: 0.001, value: 0.372, unit: 'A', modes: ['meter'] },
    ],
    load: () => import('./gauges.js'),
  },
};

/* 同一台演示在两处各要先开一档：按倒序翻一份副本，参数表与画法完全共用，
   只是章页打开时停的那一档不同（电3 的匀强电场、电4 的偏转）。 */
DEMOS.potentialU = {
  ...DEMOS.potential,
  modes: [DEMOS.potential.modes[1], DEMOS.potential.modes[0]],
  title: '匀强电场中的电势差与做功',
  hint: '两块极板之间是匀强电场，电荷从 A（q₀ > 0）或 B（q₀ < 0）由静止出发沿场线加速，走出距离 s 时 U(s) = Es、W = q₀U(s)，右栏绿点随电荷滑过那条过原点的直线。读数栏的 U/d 一行恒等于场强 E；把 q₀ 拖成负值，电荷从另一头出发、功的符号随之翻转。',
};

DEMOS.capacitorD = {
  ...DEMOS.capacitor,
  modes: [DEMOS.capacitor.modes[1], DEMOS.capacitor.modes[0]],
  title: '带电粒子在平行板间的偏转：类平抛',
  hint: '电子从左侧以 v0 水平射入两块平行板之间，青色轨迹是类平抛，出射后转成虚线沿切线走。把偏转电压或板长拖大，轨迹明显向上弯得更多；读数栏按 a、t、y 的顺序分行给出，y 一行正好等于 ½at²。偏转调大到撞上极板时，粒子停在那里并标「电子打到板上」。',
};

DEMOS.ohmSeries = {
  ...DEMOS.ohm,
  modes: [DEMOS.ohm.modes[1], DEMOS.ohm.modes[0], DEMOS.ohm.modes[2]],
  title: '串联电路：电流处处相等，电压按电阻正比分配',
  hint: '两只电阻首尾相接，只有一条通路，导线上的小点处处一样快，读数栏的电流只有一行。右栏上面的电压条与下面的电阻条用同一个分界点竖向对齐，拖 R₁ 或 R₂ 分界点跟着移，两段的电压比恒等于电阻比；读数栏的 U₁ + U₂ 一行始终等于电源电压。',
};

DEMOS.ohmPar = {
  ...DEMOS.ohm,
  modes: [DEMOS.ohm.modes[2], DEMOS.ohm.modes[0], DEMOS.ohm.modes[1]],
  title: '并联电路：电压相同，电流按电阻反比分配',
  hint: '两条竖直支路接在同一对节点上，电压相同；电阻小的那条支路上小点流得快、电流大。右栏总电流条按 R₂/(R₁+R₂) 的比例分成两段，下面三根电阻条里总电阻 R 最短，比两条支路都短。把 R₁ 拖到与 R₂ 相等，两条支路的电流也相等。',
};

DEMOS.closedEff = {
  ...DEMOS.closed,
  modes: [DEMOS.closed.modes[1], DEMOS.closed.modes[0]],
  title: '电源的功率与效率：P出 与 η = R/(R+r)',
  hint: '右栏上半是总功率条，绿色一段是输出、粉色一段是内耗，外电阻拖大时粉段越来越窄；下半是效率曲线，向右上方逼近 100%。把 R 拖到与内阻 r 相等，输出功率在读数栏里达到峰值，此时效率恰好 50%。读数栏的输出与内耗两栏相加始终等于总功率。',
};

DEMOS.powerMotor = {
  ...DEMOS.power,
  modes: [DEMOS.power.modes[1], DEMOS.power.modes[0]],
  title: '电动机：电功率分成机械功率与热功率',
  hint: '转子按提升速度转动，绿箭头标出 v = P机/(mg)。功率条按电功率分成绿色机械段与粉色热段，拖大线圈电阻 R 粉段变宽、绿段变窄；把电流拖过 U/R，绿段消失、转子停转，反电动势变负。读数栏的 P电 = P机 + P热 一行始终相等。',
};

DEMOS.magnetDefine = {
  ...DEMOS.magnet,
  modes: [DEMOS.magnet.modes[1], DEMOS.magnet.modes[0]],
  title: '磁感应强度：B = F/(IL)，比值只由磁场决定',
  hint: '叉号铺满左栏表示匀强磁场垂直纸面向里，通电导线垂直放进场中，绿箭头是安培力。下栏摆着三行试验：I 与 L 各不相同，安培力也跟着变，可最后一栏 F/(IL) 三行读出来都是同一个数——这个数只由磁场本身决定，就是磁感应强度 B。右栏 F–I 直线过原点，斜率等于 BL。',
};


/* 三条气体定律各给一块板：每块只开自己那一档，活塞走一遍看的正是那条定律 */
DEMOS.gaslawsBoyle = {
  ...DEMOS.gaslaws,
  modes: [DEMOS.gaslaws.modes[0]],
  title: '等温变化：pV 的乘积不变',
  hint: '温度按住不动，活塞缓慢压下去，体积从 42 L 缩到 14 L，橙色压强箭头随之变长，右栏的橙色点沿同一条双曲线向左上方爬。读数栏最后一行 pV/T 停在 0.0821 不动；把温度滑块拖高，整条曲线向外移，同一个体积下压强变大。',
};

DEMOS.gaslawsIsobar = {
  ...DEMOS.gaslaws,
  modes: [DEMOS.gaslaws.modes[1]],
  title: '等压变化：V 与 T 成正比',
  hint: '活塞背着大气压自由上下，缸内压强由滑块给定。温度升高，体积沿右栏一条过原点的直线上升，橙点沿直线向右上方走；拖压强滑块，整条直线变陡或变缓，过原点这一点不动。读数栏最后一行 pV/T 仍是 0.0821。',
};

DEMOS.gaslawsIsochor = {
  ...DEMOS.gaslaws,
  modes: [DEMOS.gaslaws.modes[2]],
  title: '等容变化：p 与 T 成正比',
  hint: '活塞锁死，体积由滑块给定。加热时缸内分子跑得更快，压强沿右栏一条过原点的直线上升，橙色箭头变长，读数栏的 V 一行纹丝不动。拖体积滑块，直线随之变陡或变缓，始终从原点出发；读数栏最后一行 pV/T 仍是 0.0821。',
};

DEMOS.idealgasState = {
  ...DEMOS.idealgas,
  modes: [DEMOS.idealgas.modes[0]],
  title: '一定质量：点沿同一条双曲线走',
  hint: '活塞来回走一遍，体积在 14 L 与 42 L 之间往复，右栏的橙点沿同一条双曲线滑动，读数栏最后一行 pV/(nT) 停在 0.0821。拖 n，缸内分子变密、曲线上移；拖温度，整条曲线整体升降，而这一行都推不动。',
};

DEMOS.idealgasPump = {
  ...DEMOS.idealgas,
  modes: [DEMOS.idealgas.modes[1]],
  title: '打气：质量变化时把 n 写成显式的量',
  hint: '左上打气筒每压一下往储气罐里打进 0.1 mol，罐内气体从 0.5 mol 涨到 1.7 mol，蓝点越来越密，右栏橙点沿一条直线向右上走。读数栏的 n 与 p 一起增加，最后一行 pV/(nT) 仍是 0.0821。',
};

DEMOS.firstlawIso = {
  ...DEMOS.firstlaw,
  modes: [DEMOS.firstlaw.modes[0]],
  title: '等压加热：矩形面积就是气体对外做的功',
  hint: '缸底一块加热板送进热量 Q，活塞缓缓升起，右栏 p–V 图上一条水平线向右延伸，线下的矩形面积就是气体对外做的功 pΔV。拖 Q，矩形变大，读数栏的 Q、W、ΔU 按 3:2 分成两块，最后一行 ΔU − (Q + W) 恒为 0。',
};

DEMOS.firstlawAdi = {
  ...DEMOS.firstlaw,
  modes: [DEMOS.firstlaw.modes[1]],
  title: '绝热压缩：曲线下的面积全部进入内能',
  hint: '缸壁套上橙色的保温层、Q 归零，活塞杆旁一支向下的绿色箭头表示外界把活塞压下去。右栏曲线下的面积就是外界做的功，它全部变成内能，温度随之升高。拖压缩比 k，曲线更陡、面积更大，末温也更高。',
};

DEMOS.secondlawEngine = {
  ...DEMOS.secondlaw,
  modes: [DEMOS.secondlaw.modes[0]],
  title: '热机与效率：实际效率压在卡诺上限下方',
  hint: '高温热源供热 Q₁ = 400 J，热机对外做功 W、余下的 Q₂ 排给低温热源；右栏橙线是卡诺上限 1 − T₂/T₁，绿虚线标出当前的实际效率，两个点钉在同一列上比高低，绿点永远低一截。拖 T₁ 与 T₂，温差越大，两条线越高，但绿点始终在橙点下方。',
};

DEMOS.secondlawMix = {
  ...DEMOS.secondlaw,
  modes: [DEMOS.secondlaw.modes[1]],
  title: '自发扩散：反向过程不是被禁止，而是等不到',
  hint: '起初隔板挡在中间，分子全挤在左半；1.2 秒后隔板抽走，分子向右侧跑开，右栏曲线从 N 一路落向两半各占一半的虚线，此后在那里小幅波动、不再回头。读数栏「全部回到左半的概率」写着 2⁻ᴺ，N 每翻一倍它就平方一次。',
};

/* 带回 id：外壳按它认「这台演示的标签位置」（gl-plbl 的键），标题日后改了也不会串档 */
export const demoOf = id => (DEMOS[id] ? { ...DEMOS[id], id } : undefined);
