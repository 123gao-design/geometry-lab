// 背景混沌场景：数学步进与归一化在这里，画布渲染在 components/BgMotion.vue。
// 归一化约定：每个场景把状态写进 {u, v, w}，三者大致落在 [-1,1]；u/v 张成水平面、w 向上。
// 二维映射（clifford）只写 u/v，w 恒为 0，组件按 flat 标记跳过环绕相机。
// 组件每帧对每个粒子步进 scene.steps 次，再投到屏幕；数值跑飞（出界或非有限）时由组件重播种。
// step 的第二个参数是这一帧的时间（秒），时间无关的场景可以直接忽略；norm 之后的再判定由组件负责。

export const SCENE_LIST = [
  { id: 'glow', name: '呼吸光影', blurb: '三团主题色柔光缓慢漂移，由 CSS 渐变绘制，不开画布。' },
  { id: 'lorenz', name: '洛伦兹', blurb: 'σ=10、ρ=28、β=8/3 的双翼蝴蝶，两条轨道缠成连续的光带。' },
  { id: 'rossler', name: '罗斯勒', blurb: 'a=b=0.2、c=5.7 的单翼螺旋，绕一圈后甩出去再被拉回。' },
  { id: 'aizawa', name: '艾泽瓦', blurb: '球内的丝带与穿过中轴的细流，转动时像一颗悬空的星云。' },
  { id: 'thomas', name: '托马斯', blurb: '三方对称的环形流，b=0.19，轨迹在环面上来回穿插。' },
  { id: 'clifford', name: '克利福德', blurb: '离散映射叠出的尘带，一点点把整张平面填出花纹。' },
  { id: 'ns', name: 'NS 方程', blurb: '两个维度的不可压流：三个缓慢游走的涡把雾气卷成丝缕，再平流出去。' },
];

export const CHAOS_IDS = SCENE_LIST.filter(s => s.id !== 'glow').map(s => s.id);

export const SCENES = {
  // 洛伦兹：经典双翼。x±19、y∈[-24,27]、z∈[2,45]
  lorenz: {
    steps: 3,
    spawn: r => [(r() - 0.5) * 2, (r() - 0.5) * 2, 6 + r() * 30],
    step(s) {
      const dt = 0.004, x = s[0], y = s[1], z = s[2];
      s[0] = x + dt * 10 * (y - x);
      s[1] = y + dt * (x * (28 - z) - y);
      s[2] = z + dt * (x * y - (8 / 3) * z);
    },
    norm(s, o) { o.u = s[0] / 21; o.v = s[1] / 25; o.w = (s[2] - 23) / 23; },
  },

  // 罗斯勒：单翼螺旋，z 缓慢爬升后被甩回底部（尺度按 x≈13 的峰值取，免得甩出去的弧线出框）
  rossler: {
    steps: 3,
    spawn: r => [(r() - 0.5) * 4, (r() - 0.5) * 4, 2 + r() * 12],
    step(s) {
      const dt = 0.02, x = s[0], y = s[1], z = s[2];
      s[0] = x + dt * (-y - z);
      s[1] = y + dt * (x + 0.2 * y);
      s[2] = z + dt * (0.2 + z * (x - 5.7));
    },
    norm(s, o) { o.u = s[0] / 13; o.v = s[1] / 13; o.w = (s[2] - 11) / 13; },
  },

  // 艾泽瓦：球内丝带，外场把轨迹拉成中轴上的细流
  aizawa: {
    steps: 3,
    spawn: r => [(r() - 0.5) * 1.6, (r() - 0.5) * 1.6, 0.2 + r() * 1.2],
    step(s) {
      const dt = 0.01, x = s[0], y = s[1], z = s[2];
      const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
      s[0] = x + dt * ((z - b) * x - d * y);
      s[1] = y + dt * (d * x + (z - b) * y);
      s[2] = z + dt * (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x);
    },
    norm(s, o) { o.u = s[0] / 1.6; o.v = s[1] / 1.6; o.w = (s[2] - 0.8) / 1.4; },
  },

  // 托马斯：三正弦耦合的环形流，对称性最好看
  thomas: {
    steps: 2,
    spawn: r => [(r() - 0.5) * 6, (r() - 0.5) * 6, (r() - 0.5) * 6],
    step(s) {
      const dt = 0.045, x = s[0], y = s[1], z = s[2];
      s[0] = x + dt * (Math.sin(y) - 0.19 * x);
      s[1] = y + dt * (Math.sin(z) - 0.19 * y);
      s[2] = z + dt * (Math.sin(x) - 0.19 * z);
    },
    norm(s, o) { o.u = s[0] / 4; o.v = s[1] / 4; o.w = s[2] / 4; },
  },

  // 克利福德：二维离散映射，点云自己铺满一条条彩带。
  // 离散映射相邻两步在屏上常隔着大半个画面，直接连线会被「位移过大断笔」丢掉、只剩中间一小撮；
  // 于是改走滑行档（glide）：每到一个落点再走一步映射，抽下一弦，途中按定速一点点挪过去，
  // 组件只连相邻两帧（几像素）——看上去是光点沿直线流过去（用户 2026-11-16「不能按光线那种移动吗」）。
  // 取景用 autofit：先量种子粒子的 u/v 包络再拉到视口四边，吸引子占多大就铺多大。
  clifford: {
    steps: 1,
    flat: true,
    wide: true,
    glide: true,
    autofit: true,
    weight: 1.4,
    spawn: r => [(r() - 0.5) * 2, (r() - 0.5) * 2],
    step(s) {
      const a = -1.4, b = 1.6, c = 1.0, d = 0.7, x = s[0], y = s[1];
      s[0] = Math.sin(a * y) + c * Math.cos(a * x);
      s[1] = Math.sin(b * x) + d * Math.cos(b * y);
    },
    norm(s, o) { o.u = s[0] / 2.0; o.v = s[1] / 2.0; o.w = 0; },
  },

  // NS 方程：二维不可压流动的雾气示踪。不是真去解方程，而是把几条环流拼成一个
  // 散度尽量为零的速度场，让上千个示踪粒子随流漂走——雾被涡卷成丝缕，再平流出去。
  // step 的第二个参数是帧时间，涡心随时间缓慢游走；出框的粒子绕到对边（周期边界）。
  ns: {
    steps: 2,
    flat: true,
    fog: true,       // 组件据此把线描粗、粒子加密
    wide: true,      // 铺满整幅宽度，别只占中间一个方块
    weight: 2.6,
    life: [2.5, 6],  // 每个示踪粒子活这么久（秒）就换一处重新出生：压住数值聚堆留下的空白
    spawn: r => [(r() - 0.5) * 2.1, (r() - 0.5) * 2.1],
    step(s, t) {
      const dt = 0.008;
      let vx = 0;
      let vy = 0;
      for (let i = 0; i < 3; i++) {
        const a = t * 0.11 + i * 2.1;
        const cx = 0.44 * Math.cos(a + i);
        const cy = 0.34 * Math.sin(a * 1.3 + i * 2);
        const st = i === 0 ? 0.17 : (i === 1 ? -0.12 : 0.08);
        const dx = s[0] - cx;
        const dy = s[1] - cy;
        const r2 = dx * dx + dy * dy + 0.04;
        vx += -st * dy / r2;
        vy += st * dx / r2;
      }
      // 整团缓慢右移，再叠一层弱剪切：没有它，雾气只围着涡打转，出不了丝缕
      vx += 0.06 * Math.sin(s[1] * 1.7 + t * 0.21) + 0.04;
      vy += 0.05 * Math.cos(s[0] * 1.9 - t * 0.17);
      s[0] += vx * dt;
      s[1] += vy * dt;
      if (s[0] > 1.35) s[0] -= 2.7;
      else if (s[0] < -1.35) s[0] += 2.7;
      if (s[1] > 1.35) s[1] -= 2.7;
      else if (s[1] < -1.35) s[1] += 2.7;
    },
    norm(s, o) { o.u = s[0]; o.v = s[1]; o.w = 0; },
  },
};
