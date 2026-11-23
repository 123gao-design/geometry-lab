/* 物理实验清单。元数据（标题、分组、简介、参数）都在这里集中维护，
   实验本体按 id 动态 import——首页列卡片时不会把 Rapier 与 three.js 一起拉下来。 */

export const GROUPS = [
  { name: '经典力学', desc: '受力、摩擦与碰撞，全交给刚体求解。' },
  { name: '运动学', desc: '抛体的轨迹、射程与落地弹跳。' },
  { name: '电磁学', desc: '带电粒子在匀强电磁场中的运动。' },
  { name: '机械振动', desc: '弹簧振子的周期、阻尼与能量。' },
];

export const EXPERIMENTS = [
  {
    id: 'incline',
    title: '斜面与摩擦',
    group: '经典力学',
    dim: '2d',
    blurb: '木块放在倾角 θ 的斜面上，tanθ 超过摩擦因数 μ 才滑得动。改倾角、改 μ、加一点初速度，看加速度怎么变。',
    method: {
      model: '木块是受重力作用的动态刚体，坡与地面是固定的矩形碰撞体；法向力与摩擦力都来自 Rapier 的接触求解，没有手写的约束。',
      flow: [
        '每帧把一个时间步交给 world.step()，位置来自刚体的速度积分；画面不另算轨迹，只读 body.translation() 画方块。',
        '坡上的运动理论上就是匀加速直线，加速度 a = g(sinθ − μcosθ)；滑到坡底后地面接住它，减速度 a′ = −μg。',
        '读数里的「速度」「已滑」每帧从刚体读，「摩擦力」「重力分量」按公式算，两者可以对照着看接触求解准不准。',
      ],
      formulas: [
        'N = mg\\cos\\theta',
        'f = \\mu N = \\mu m g\\cos\\theta',
        'a = g(\\sin\\theta - \\mu\\cos\\theta)',
        '\\tan\\theta > \\mu \\;\\Rightarrow\\; \\text{能下滑}',
        's = \\tfrac{1}{2}at^2 \\quad (v_0 = 0)',
        'a_{\\text{地}} = -\\mu g \\quad \\text{（滑上地面之后）}',
      ],
    },
    params: [
      { k: 'angle', label: '倾角 θ', min: 5, max: 45, step: 1, value: 25, unit: '°' },
      { k: 'mu', label: '摩擦因数 μ', min: 0, max: 1, step: 0.02, value: 0.2 },
      { k: 'mass', label: '质量 m', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
      { k: 'v0', label: '初速度', min: 0, max: 4, step: 0.1, value: 0, unit: 'm/s' },
    ],
    load: () => import('./incline.js'),
  },
  {
    id: 'collide',
    title: '一维碰撞',
    group: '经典力学',
    dim: '2d',
    blurb: '两辆小车在光滑轨道上相撞。把弹性系数从 1 调到 0：动量总是不变，动能却可以损失殆尽。',
    method: {
      model: '两辆小车是矩形刚体，轨道无摩擦，接触时按碰撞恢复系数 e 交换冲量；碰前速度在接触事件触发的那一步从刚体上读出来。',
      flow: [
        '每帧走一个时间步，再用 EventQueue 的 drainCollisionEvents 抓「刚碰上」那一帧，把碰前速度存下来。',
        '轨迹是两条水平直线：碰撞前各按 v₁、v₂ 匀速走，碰撞后换成理论碰后速度继续匀速——所以画面上只有速度的突变，没有曲线。',
        '总动量与总动能每帧按当前速度现算，和「理论碰后」并排给你对照。',
      ],
      formulas: [
        'm_1v_1 + m_2v_2 = m_1v_1\' + m_2v_2\'',
        'v_2\' - v_1\' = e\\,(v_1 - v_2)',
        'v_1\' = \\frac{(m_1 - e m_2)v_1 + (1+e)m_2v_2}{m_1 + m_2}',
        'v_2\' = \\frac{(m_2 - e m_1)v_2 + (1+e)m_1v_1}{m_1 + m_2}',
        'K = \\tfrac{1}{2}m_1v_1^2 + \\tfrac{1}{2}m_2v_2^2',
      ],
    },
    params: [
      { k: 'm1', label: '左车质量 m₁', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'kg' },
      { k: 'm2', label: '右车质量 m₂', min: 0.5, max: 5, step: 0.1, value: 1, unit: 'kg' },
      { k: 'v1', label: '左车初速 v₁', min: 0.5, max: 6, step: 0.1, value: 3, unit: 'm/s' },
      { k: 'v2', label: '右车初速 v₂', min: -6, max: 0, step: 0.1, value: -0.5, unit: 'm/s' },
      { k: 'e', label: '弹性系数 e', min: 0, max: 1, step: 0.05, value: 1 },
    ],
    load: () => import('./collide.js'),
  },
  {
    id: 'projectile',
    title: '抛体运动',
    group: '运动学',
    dim: '2d',
    blurb: '调初速度与仰角，抛物线随之改形状；射程在 45° 取最大，空气阻力让它整体收缩，落地后还能弹几下。',
    method: {
      model: '小球是球形刚体，重力取滑块上的 g，空气阻力用 Rapier 的线性阻尼近似（加速度 −k𝐯），地面有恢复系数 e。',
      flow: [
        '实线是数值轨迹：每步把 ball.translation() 记进 trail 数组（最多留 900 点），再逐点连成折线。',
        '虚线是不计阻力时的理论抛物线：按参数方程取 120 个点画出来，和实际轨迹并排比较，阻力越大两条线分得越开。',
        '落地判定看竖直速度由负转正、且高度回到球半径附近，取那一刻的横坐标作第一次落点。',
      ],
      formulas: [
        'x = x_0 + v_0\\cos\\theta\\,t',
        'y = y_0 + v_0\\sin\\theta\\,t - \\tfrac{1}{2}gt^2',
        'R = \\frac{v_0^2\\sin 2\\theta}{g}',
        'H = \\frac{v_0^2\\sin^2\\theta}{2g}',
        '\\dot{\\mathbf v} = -k\\mathbf v - g\\hat{\\mathbf y}',
        'v_y\' = -e\\,v_y \\quad \\text{（落地弹跳）}',
      ],
    },
    params: [
      { k: 'v0', label: '初速度 v₀', min: 4, max: 18, step: 0.2, value: 12, unit: 'm/s' },
      { k: 'ang', label: '仰角 θ', min: 5, max: 85, step: 1, value: 45, unit: '°' },
      { k: 'g', label: '重力加速度 g', min: 1, max: 20, step: 0.1, value: 9.8, unit: 'm/s²' },
      { k: 'drag', label: '空气阻力', min: 0, max: 0.6, step: 0.02, value: 0 },
      { k: 'e', label: '地面弹性 e', min: 0.1, max: 0.95, step: 0.05, value: 0.6 },
    ],
    load: () => import('./projectile.js'),
  },
  {
    id: 'lorentz',
    title: '带电粒子在磁场中',
    group: '电磁学',
    dim: '2d',
    blurb: '粒子垂直射入匀强磁场做圆周运动；加上竖直电场，圆就变成一路漂移的摆线。改电荷正负看绕向翻转。',
    method: {
      model: '粒子在垂直纸面的匀强磁场 B 与竖直匀强电场 E 中运动，质量取 1 kg；积分走解析解，刚体只当容器，不交给 Rapier 推进。',
      flow: [
        '每个时间步取当前速度，把 u = v − v_d 旋转 ωh 得到新速度，位置增量用同一组解直接写回刚体，不做 x += v·h 的欧拉推进。',
        '轨迹是每步记下的位置点连成的折线；E = 0 时另画一条虚线理想圆，圆心 (x + v_y/ω, y − v_x/ω)、半径 |v|/|ω|，与轨迹重合。',
        '粒子跑出画面两个单位就重置——加上电场后会沿漂移方向一直往画外走。',
      ],
      formulas: [
        'm\\dot{\\mathbf v} = q(\\mathbf E + \\mathbf v\\times\\mathbf B)',
        '\\omega = \\frac{qB}{m}, \\qquad \\mathbf v_d = \\frac{\\mathbf E\\times\\mathbf B}{B^2} = \\frac{E}{B}\\hat{\\mathbf x}',
        '\\mathbf u = \\mathbf v - \\mathbf v_d, \\qquad \\mathbf u(t) = R(\\omega t)\\,\\mathbf u_0',
        '\\Delta\\mathbf r = \\int_0^{h}\\mathbf u\\,dt = \\left(\\frac{u_y - u_y\'}{\\omega},\\;\\frac{u_x\' - u_x}{\\omega}\\right)',
        'r = \\frac{|\\mathbf u|}{|\\omega|}',
      ],
    },
    params: [
      { k: 'B', label: '磁感应强度 B', min: 0.2, max: 3, step: 0.05, value: 1, unit: 'T' },
      { k: 'E', label: '电场强度 E', min: 0, max: 8, step: 0.1, value: 0, unit: 'V/m' },
      { k: 'q', label: '电荷量 q', min: -2, max: 2, step: 1, value: 1, unit: 'C' },
      { k: 'v0', label: '入射速度 v₀', min: 1, max: 8, step: 0.1, value: 3, unit: 'm/s' },
    ],
    load: () => import('./lorentz.js'),
  },
  {
    id: 'spring',
    title: '弹簧振子',
    group: '机械振动',
    dim: '2d',
    blurb: '滑块挂在弹簧上往复运动。调劲度系数改周期，加阻尼看振幅衰减，阻尼比越过 1 就不再振荡。',
    method: {
      model: '滑块挂在弹簧上，弹簧力与阻尼力逐帧加到刚体上，Rapier 只负责积分；没有重力、没有摩擦。',
      flow: [
        '每步先清掉上一帧的力，加上 F = −kx − cv，再走一个时间步；滑块位置与速度随后从刚体读回。',
        '右下小图把每步的 (t, x) 记进 trace，只保留最近 8 秒，再连成位移—时间折线；曲线直接显示周期与衰减，不需要另算。',
      ],
      formulas: [
        'm\\ddot x + c\\dot x + kx = 0',
        '\\omega_0 = \\sqrt{\\frac{k}{m}}, \\qquad \\zeta = \\frac{c}{2\\sqrt{km}}',
        'T = \\frac{2\\pi}{\\omega_0\\sqrt{1-\\zeta^2}} \\quad (\\zeta < 1)',
        'E = \\tfrac{1}{2}m\\dot x^2 + \\tfrac{1}{2}kx^2',
      ],
    },
    params: [
      { k: 'k', label: '劲度系数 k', min: 1, max: 40, step: 0.5, value: 8, unit: 'N/m' },
      { k: 'm', label: '质量 m', min: 0.2, max: 3, step: 0.1, value: 1, unit: 'kg' },
      { k: 'c', label: '阻尼系数 c', min: 0, max: 3, step: 0.05, value: 0.2, unit: 'N·s/m' },
      { k: 'x0', label: '初始位移', min: -1.5, max: 1.5, step: 0.05, value: 1.2, unit: 'm' },
    ],
    load: () => import('./spring.js'),
  },
  {
    id: 'balance',
    title: '托盘天平',
    group: '经典力学',
    dim: '2d',
    blurb: '原生 anatomy 等轴测的托盘天平：左右两盘质量可调，横梁按差值倾斜，吊盘保持水平，指针在标尺上指出偏转。',
    params: [
      { k: 'm1', label: '左盘质量 m₁', min: 0, max: 200, step: 10, value: 100, unit: 'g' },
      { k: 'm2', label: '右盘质量 m₂', min: 0, max: 200, step: 10, value: 100, unit: 'g' },
      { k: 'az', label: '视角', min: 10, max: 70, step: 5, value: 38, unit: '°' },
    ],
    load: () => import('./balance.js'),
  },
  {
    id: 'pendulum',
    title: '摆钟与单摆周期',
    group: '机械振动',
    dim: '2d',
    blurb: '原生 anatomy 等轴测的单摆：摆球按余弦往复摆动，读数给出周期 T = 2π√(L/g) 与当前摆角。',
    params: [
      { k: 'L', label: '摆长 L', min: 0.3, max: 1.2, step: 0.05, value: 0.8, unit: 'm' },
      { k: 'th0', label: '初始摆角 θ₀', min: 5, max: 30, step: 1, value: 20, unit: '°' },
      { k: 'az', label: '视角', min: 10, max: 70, step: 5, value: 40, unit: '°' },
    ],
    load: () => import('./pendulum.js'),
  },
  {
    id: 'bounce3d',
    title: '三维弹跳小球',
    group: '经典力学',
    dim: '3d',
    blurb: '盒子里几颗小球乱撞。改重力与弹性看它们越跳越低还是一直弹，拖动画面可以绕着看。',
    method: {
      model: '盒壁是固定的三维碰撞体，小球是受重力的动态刚体；three.js 按刚体位姿画球，相机可以拖着绕。',
      flow: [
        '每帧把一个时间步交给 Rapier，读回每颗球的位置与半径重画。',
        '这里不保留轨迹：球多、线会糊成一片，画面只给当下位置与速度。',
      ],
      formulas: [
        '\\dot{\\mathbf v} = -g\\hat{\\mathbf y}',
        'v_\\perp\' = -e\\,v_\\perp \\quad \\text{（撞壁）}',
        '\\Delta\\mathbf v_\\parallel = -\\mu(1+e)|v_\\perp|\\,\\frac{\\mathbf v_\\parallel}{|\\mathbf v_\\parallel|}',
      ],
    },
    params: [
      { k: 'n', label: '小球数', min: 1, max: 8, step: 1, value: 4 },
      { k: 'g', label: '重力加速度 g', min: 1, max: 25, step: 0.5, value: 9.8, unit: 'm/s²' },
      { k: 'e', label: '弹性系数 e', min: 0.4, max: 1, step: 0.02, value: 0.86 },
      { k: 'fric', label: '摩擦因数', min: 0, max: 1, step: 0.02, value: 0.15 },
    ],
    load: () => import('./bounce3d.js'),
  },
];

export const findExp = id => EXPERIMENTS.find(e => e.id === id) || null;
export const expOfGroup = name => EXPERIMENTS.filter(e => e.group === name);
