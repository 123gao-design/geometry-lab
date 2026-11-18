/* 高中物理课程目录：部分（模块）→ 子专题（章组）→ 章。
   目录只放标题与路由信息，讲义与演示由各章自己的 .vue 负责；
   「演示实验」一组收现有的六个交互实验（路由仍走 /physics/<id>），
   新写的章走 /physics/ch/<id>。首页、章页左栏、面包屑都读这一份。 */

export const PARTS = [
  {
    id: 'demo',
    t: '演示实验',
    intro: '已经做成交互实验的六个场景。场景里的参数都能拖，读数跟着物体走；后面的章讲到这里时会把它们接进去。',
    groups: [
      {
        t: '已上线',
        chapters: [
          { id: 'incline', t: '斜面与摩擦', lab: 'incline', on: true },
          { id: 'collide', t: '一维碰撞', lab: 'collide', on: true },
          { id: 'bounce3d', t: '三维弹跳小球', lab: 'bounce3d', on: true },
          { id: 'projectile', t: '抛体运动', lab: 'projectile', on: true },
          { id: 'lorentz', t: '带电粒子在磁场中', lab: 'lorentz', on: true },
          { id: 'spring', t: '弹簧振子', lab: 'spring', on: true },
        ],
      },
    ],
  },
  {
    id: 'mech',
    t: '一　力学',
    intro: '从描述运动开始，到牛顿定律、曲线运动、万有引力，再到功与能、动量。高中物理的主干都在这里。',
    groups: [
      {
        t: '一、运动的描述与匀变速直线运动',
        chapters: [
          { id: 'motion1', t: '质点、参考系与位移', on: true, d: '先选定参考系，再把物体简化成质点；位置的变化用位移刻画。' },
          { id: 'motion2', t: '速度、加速度与 v-t 图像', on: true, d: '平均速度与瞬时速度，加速度的定义，v-t 图的斜率与面积。' },
          { id: 'motion3', t: '匀变速直线运动的规律', on: true, d: '由 v-t 图推出三个基本式，再补上刹车问题的处理。' },
          { id: 'motion4', t: '自由落体与竖直上抛', on: true, d: '取 a = g 后的两个特例，上升与下降的对称性。' },
          { id: 'motion5', t: '运动图像与追及相遇', on: true, d: 'x-t 与 v-t 两类图的读法，追及问题里速度相等的临界点。' },
        ],
      },
      {
        t: '二、相互作用',
        chapters: [
          { id: 'gravity', t: '重力与弹力', on: true, d: 'G = mg 与 F = kx 两条定量规律，形变量不是弹簧的长度。' },
          { id: 'friction', t: '摩擦力', on: true, d: '静摩擦由平衡条件定，滑动摩擦由 f = μN 定，两者在最大静摩擦处接上。' },
          { id: 'forcecomb', t: '力的合成、分解与共点力平衡', on: true, d: '平行四边形定则与合力范围，正交分解，平衡时合力为零。' },
        ],
      },
      {
        t: '三、牛顿运动定律',
        chapters: [
          { id: 'newton1', t: '牛顿第一定律与惯性', on: true, d: '伽利略斜面理想实验：力不是维持运动的原因；惯性与质量。' },
          { id: 'newton2', t: '牛顿第二定律', on: true, d: 'F = ma 的由来与四性，力的单位，解题五步。' },
          { id: 'newton3', t: '牛顿第三定律与受力分析', on: true, d: '作用力与反作用力、与平衡力的区别，受力分析的顺序。' },
          { id: 'newton4', t: '超重、失重与连接体', on: true, d: '视重与实重、完全失重，整体法与隔离法。' },
        ],
      },
      {
        t: '四、抛体运动',
        chapters: [
          { id: 'proj1', t: '运动的合成与分解' },
          { id: 'proj2', t: '平抛运动' },
          { id: 'proj3', t: '斜抛运动' },
        ],
      },
      {
        t: '五、圆周运动',
        chapters: [
          { id: 'circ1', t: '圆周运动的描述与向心力' },
          { id: 'circ2', t: '竖直平面内的圆周运动' },
          { id: 'circ3', t: '离心现象' },
        ],
      },
      {
        t: '六、万有引力与航天',
        chapters: [
          { id: 'grav1', t: '开普勒三定律' },
          { id: 'grav2', t: '万有引力定律' },
          { id: 'grav3', t: '人造卫星与宇宙速度' },
        ],
      },
      {
        t: '七、机械能',
        chapters: [
          { id: 'energy1', t: '功与功率' },
          { id: 'energy2', t: '动能定理' },
          { id: 'energy3', t: '机械能守恒' },
          { id: 'energy4', t: '功能关系与能量守恒' },
        ],
      },
      {
        t: '八、动量',
        chapters: [
          { id: 'momentum1', t: '冲量与动量定理' },
          { id: 'momentum2', t: '动量守恒与碰撞' },
        ],
      },
    ],
  },
  {
    id: 'vib',
    t: '二　机械振动与机械波',
    intro: '振动是运动在平衡位置附近的往返，波是振动在介质里的传播。两章都围绕周期、振幅与相位展开。',
    groups: [
      {
        t: '一、机械振动',
        chapters: [
          { id: 'vib1', t: '简谐运动' },
          { id: 'vib2', t: '单摆' },
          { id: 'vib3', t: '阻尼振动与受迫振动' },
        ],
      },
      {
        t: '二、机械波',
        chapters: [
          { id: 'wave1', t: '波的形成与描述' },
          { id: 'wave2', t: '波的图像与叠加' },
          { id: 'wave3', t: '干涉、衍射与多普勒效应' },
        ],
      },
    ],
  },
  {
    id: 'heat',
    t: '三　热学',
    intro: '从分子动理论出发，用气体实验定律与理想气体状态方程描述气体的状态，再用热力学定律处理能量。',
    groups: [
      {
        t: '一、分子动理论与气体',
        chapters: [
          { id: 'heat1', t: '分子动理论' },
          { id: 'heat2', t: '气体实验定律' },
          { id: 'heat3', t: '理想气体状态方程' },
        ],
      },
      {
        t: '二、热力学定律',
        chapters: [
          { id: 'heat4', t: '内能与热力学第一定律' },
          { id: 'heat5', t: '热力学第二定律与能量守恒' },
        ],
      },
    ],
  },
  {
    id: 'em',
    t: '四　电磁学',
    intro: '静电场、恒定电流、磁场、电磁感应、交变电流五组。电与磁的规律在这里合成一个整体。',
    groups: [
      {
        t: '一、静电场',
        chapters: [
          { id: 'efield1', t: '电荷与库仑定律' },
          { id: 'efield2', t: '电场强度与电场线' },
          { id: 'efield3', t: '电势与电势能' },
          { id: 'efield4', t: '电容器与带电粒子的偏转' },
        ],
      },
      {
        t: '二、恒定电流',
        chapters: [
          { id: 'circuit1', t: '欧姆定律与串并联' },
          { id: 'circuit2', t: '闭合电路欧姆定律' },
          { id: 'circuit3', t: '电功、电功率与焦耳定律' },
        ],
      },
      {
        t: '三、磁场',
        chapters: [
          { id: 'mag1', t: '磁场与磁感应强度' },
          { id: 'mag2', t: '安培力' },
          { id: 'mag3', t: '洛伦兹力与带电粒子的圆周运动' },
        ],
      },
      {
        t: '四、电磁感应',
        chapters: [
          { id: 'ind1', t: '楞次定律' },
          { id: 'ind2', t: '法拉第电磁感应定律' },
          { id: 'ind3', t: '自感与涡流' },
          { id: 'ind4', t: '导体棒与导轨模型' },
        ],
      },
      {
        t: '五、交变电流',
        chapters: [
          { id: 'ac1', t: '交流电的产生与有效值' },
          { id: 'ac2', t: '变压器' },
          { id: 'ac3', t: '远距离输电' },
        ],
      },
    ],
  },
  {
    id: 'opt',
    t: '五　光学',
    intro: '几何光学处理光线的传播与成像，波动光学处理干涉、衍射与偏振。两套描述各有各的适用场合。',
    groups: [
      {
        t: '一、几何光学',
        chapters: [
          { id: 'opt1', t: '折射定律与全反射' },
          { id: 'opt2', t: '棱镜与色散' },
          { id: 'opt3', t: '透镜成像' },
        ],
      },
      {
        t: '二、波动光学',
        chapters: [
          { id: 'opt4', t: '光的干涉' },
          { id: 'opt5', t: '光的衍射与偏振' },
        ],
      },
    ],
  },
  {
    id: 'mod',
    t: '六　近代物理',
    intro: '光电效应把光的粒子性摆上台面，原子与原子核的规律随后展开。这里开始离开连续与确定的经典图像。',
    groups: [
      {
        t: '一、波粒二象性',
        chapters: [
          { id: 'mod1', t: '光电效应' },
          { id: 'mod2', t: '德布罗意波' },
        ],
      },
      {
        t: '二、原子与原子核',
        chapters: [
          { id: 'mod3', t: '原子结构与能级' },
          { id: 'mod4', t: '放射性衰变' },
          { id: 'mod5', t: '核反应与核能' },
        ],
      },
    ],
  },
  {
    id: 'exps',
    t: '七　实验与测量',
    intro: '高考实验集中在力学与电学两块。每章按「目的—原理—器材—步骤—数据处理—误差」组织，公式与操作分开写清。',
    groups: [
      {
        t: '一、力学实验',
        chapters: [
          { id: 'exp1', t: '测速度与加速度' },
          { id: 'exp2', t: '验证牛顿第二定律' },
          { id: 'exp3', t: '验证机械能守恒' },
          { id: 'exp4', t: '研究平抛运动' },
          { id: 'exp5', t: '验证动量守恒' },
          { id: 'exp6', t: '用单摆测重力加速度' },
        ],
      },
      {
        t: '二、电学实验',
        chapters: [
          { id: 'exp7', t: '伏安法测电阻' },
          { id: 'exp8', t: '测电源电动势与内阻' },
          { id: 'exp9', t: '多用电表与传感器' },
        ],
      },
      {
        t: '三、其他与数据处理',
        chapters: [
          { id: 'exp10', t: '测玻璃的折射率' },
          { id: 'exp11', t: '用双缝干涉测波长' },
          { id: 'exp12', t: '误差与有效数字' },
        ],
      },
    ],
  },
];

/** 章的路由：实验走 /physics/<id>，讲义章走 /physics/ch/<id> */
export const pathOf = c => (c.lab ? '/physics/' + c.lab : '/physics/ch/' + c.id);

/** 部分（模块级）的路由：/physics/p/<部分 id>。
    与数学「模块主页」同一层，首页的卡片进这里、这里再列组与章。
    写成三段，与两段的 /physics/<实验 id> 不会撞。 */
export const partPath = p => '/physics/p/' + p.id;

/** 「演示实验」那一部分的路径：实验页顶上的返回钮指向它 */
export const DEMO_PART = partPath({ id: 'demo' });

/** 每个 part 补一份拍平的 chapters（左栏、计数都用它） */
for (const p of PARTS) {
  p.chapters = p.groups.flatMap(g => g.chapters.map(c => ({ ...c, group: g, part: p })));
}

/** 版面次序：课程各部分在前，「演示实验」收在最后。
    首页的分节、章页左栏的折叠组、←/→ 翻章都读这一份，别各自再排一遍。 */
export const ORDERED_PARTS = [...PARTS.filter(p => p.id !== 'demo'), ...PARTS.filter(p => p.id === 'demo')];

/** 已上线的章按版面次序排成一条线（翻章与「上一章 / 下一章」用） */
export const ON_CHAPS = ORDERED_PARTS.flatMap(p => p.chapters).filter(c => c.on);

/** 由路由路径取部分（/physics/p/<id>）；不是部分页就给 null */
export function partByRoute(path) {
  const s = String(path || '').split('/').filter(Boolean);
  if (s[0] !== 'physics' || s[1] !== 'p' || !s[2]) return null;
  return PARTS.find(p => p.id === s[2]) || null;
}

/** 由路由路径取章（/physics/ch/<id> 或 /physics/<lab id>） */
export function chapterByRoute(path) {
  const s = String(path || '').split('/').filter(Boolean);
  if (s[0] !== 'physics') return null;
  if (s[1] === 'ch' && s[2]) {
    for (const p of PARTS) {
      const c = p.chapters.find(x => !x.lab && x.id === s[2]);
      if (c) return c;
    }
    return null;
  }
  if (s.length === 2) {
    for (const p of PARTS) {
      const c = p.chapters.find(x => x.lab === s[1]);
      if (c) return c;
    }
  }
  return null;
}

/** 目录里某个章的序号（两位，按所属部分的章序） */
export function noOf(c) {
  const i = c.part.chapters.indexOf(c);
  return String(i + 1).padStart(2, '0');
}

/** 部分字前缀：章号一律写成「部分字 + 组内序号」，与图注的「图 力6」同一套 */
export const PART_PRE = { demo: '', mech: '力', vib: '振', heat: '热', em: '电', opt: '光', mod: '原', exps: '实' };

/** 章的显示编号（力6、振2…）；左栏、横排胶囊、h1 与面包屑都读这一个 */
export function labelOf(c) {
  return (PART_PRE[c.part.id] || '') + (c.part.chapters.indexOf(c) + 1);
}
