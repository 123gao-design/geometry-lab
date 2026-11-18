/* 章页演示的登记表：标题、提示、滑块与加载器都在这里，
   讲义页只写 demoOf('motion') 一句，不重复抄参数。 */

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

  uniform: {
    title: 'x-t 图与三个基本式',
    hint: '橙色虚线是当前时刻的切线，斜率就是速度。读数栏里 v² − v0² 与 2ax 始终相等，这就是由 v-t 图推出的第三个式子。',
    params: [
      { k: 'v0', label: '初速度 v0', min: 0, max: 10, step: 0.1, value: 2, unit: 'm/s' },
      { k: 'a', label: '加速度 a', min: -2, max: 4, step: 0.1, value: 1.5, unit: 'm/s²' },
    ],
    load: () => import('./uniform.js'),
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
    hint: '拉力从零慢慢加大：静摩擦始终与拉力等大，图线沿 45° 上升；拉过 μN 之后摩擦不再变大，木块起步加速。把 μ 调大，拐点右移。',
    params: [
      { k: 'F', label: '水平拉力 F', min: 0, max: 20, step: 0.5, value: 4, unit: 'N' },
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
    hint: '物块站在电梯里的体重计上。取向上为正，N − mg = ma，所以视重 N = m(g+a)。加速度向上时视重大于实重，超重；向下时小于实重，失重；把加速度拖到 −9.8 m/s²，秤的读数归零，完全失重。',
    params: [
      { k: 'm', label: '质量 m', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'kg' },
      { k: 'a', label: '加速度 a', min: -9.8, max: 4, step: 0.2, value: 2, unit: 'm/s²' },
    ],
    load: () => import('./newton4.js'),
  },
};

/* 带回 id：外壳按它认「这台演示的标签位置」（gl-plbl 的键），标题日后改了也不会串档 */
export const demoOf = id => (DEMOS[id] ? { ...DEMOS[id], id } : undefined);
