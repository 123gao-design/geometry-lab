/* 模块大纲：讲解页左栏「章节导航」列本模块的全部章节（按子专题分组，用户 2026-11-12 要求）。
   章名与路由前缀一律取自各子专题的 xxxnav.js（唯一来源，勿在别处另抄一份）；
   这里只登记「模块 → 子专题顺序 → 组名」。conics 的极点极线一组没有 nav 文件，用 nav-defaults 的默认表。 */
import { DEFAULT_CHAPTERS, DEFAULT_BASE } from '../components/nav-defaults.js';

const NAVS = import.meta.glob('../views/**/*nav.js', { eager: true });

const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

const SPEC = {
  sets: { t: '集合与常用逻辑', groups: [['lang', '集合的语言'], ['rel', '集合间的关系'], ['ops', '集合的运算'], ['logic', '常用逻辑']] },
  functions: { t: '函数与微积分初步', groups: [['concept', '从映射到函数'], ['properties', '函数的基本性质'], ['zeros', '零点与存在性定理'], ['elementary', '基本初等函数'], ['transforms', '图象变换'], ['calculus', '变化率与导数']] },
  inequalities: { t: '不等式', groups: [['prop', '性质与比较'], ['quad', '一元二次不等式'], ['basic', '基本不等式'], ['scale', '放缩与常用不等式'], ['plan', '简单线性规划与非线性规划初步']] },
  trig: { t: '三角函数与三角形', groups: [['angle', '任意角与弧度制'], ['unit', '任意角的三角函数'], ['induce', '诱导公式'], ['graph', '图象与性质'], ['trans', '图象变换'], ['sumdiff', '和差公式'], ['double', '倍角与升降幂'], ['prodsum', '积化和差与辅助角'], ['inverse', '反三角函数'], ['solve', '解三角形'], ['synth', '综合应用']] },
  vectors: { t: '向量与复数', groups: [['linear', '平面向量的概念与线性运算'], ['basis', '平面向量基本定理与坐标运算'], ['inner', '数量积与度量'], ['apply', '向量的应用'], ['complex', '复数'], ['euler', '三角形式与欧拉公式']] },
  sequences: { t: '数列', groups: [['concept', '数列的概念与表示'], ['diff', '等差数列'], ['geo', '等比数列'], ['sum', '数列求和的方法'], ['recur', '递推与构造'], ['induct', '数学归纳法'], ['apply', '数列的应用']] },
  linecircle: { t: '直线与圆', groups: [['line', '直线的方程'], ['circle', '圆的方程'], ['theorem', '圆的性质与定理'], ['apply', '综合应用']] },
  polar: { t: '极坐标与参数方程', groups: [['coords', '极坐标系与互化'], ['curves', '曲线的极坐标方程'], ['param', '参数方程'], ['apply', '参数方程的应用']] },
  conics: { t: '圆锥曲线', groups: [['definitions', '定义与标准方程'], ['optics', '光学性质与切线'], ['affine', '仿射变换看圆锥曲线'], ['locus', '参数方程与轨迹'], ['lines', '直线与圆锥曲线'], [null, '极点极线与配极理论']] },
  solid: { t: '立体几何', groups: [['recog', '认识空间几何体'], ['measure', '体积与表面积'], ['relation', '空间中的位置关系'], ['coords', '空间直角坐标系与向量']] },
  combinatorics: { t: '组合学与二项式定理', groups: [['counting', '计数原理'], ['permcomb', '排列与组合'], ['binomial', '二项式定理'], ['identity', '组合恒等式与应用']] },
  probability: { t: '概率与统计', groups: [['sample', '随机事件与概率'], ['cond', '条件概率与独立性'], ['rv', '随机变量与分布'], ['num', '数字特征'], ['stat', '统计'], ['test', '统计推断与检验']] },
  numeric: { t: '数值计算', groups: [['error', '误差'], ['root', '方程求根'], ['fit', '数据拟合'], ['approx', '函数逼近']] },
  linalg: { t: '线性代数初步', groups: [['det', '行列式'], ['matrix', '矩阵'], ['space', '矩阵与空间'], ['eigen', '特征值'], ['quad', '二次型']] },
  calc1: { t: '一元函数微积分', groups: [['limit', '极限与连续'], ['deriv', '导数与微分'], ['integral', '不定积分'], ['definite', '定积分'], ['ode', '常微分方程'], ['series', '无穷级数']] },
  spacegeom: { t: '空间解析几何', groups: [['vector', '空间向量'], ['plane', '平面与直线'], ['surface', '曲面与曲线']] },
  calc2: { t: '多元函数微积分', groups: [['mul', '多元函数微分学'], ['riemann', '重积分'], ['curve', '曲线与曲面积分']] },
  complexvar: { t: '复变函数', groups: [['cplx', '复数与复变函数'], ['analytic', '解析函数'], ['series', '级数与留数']] },
  numtheory: { t: '初等数论', groups: [['basic', '整除与同余'], ['theorem', '数论定理'], ['residue', '二次剩余与应用']] },
  topology: { t: '拓扑学基础', groups: [['space', '拓扑空间'], ['compact', '连通与紧致'], ['invariant', '不变量初步']] },
  fractal: { t: '分形几何', groups: [['dim', '自相似与维数'], ['shape', '典型分形'], ['gen', '生成与应用']] },
  projgeom: { t: '高等几何（射影几何）', groups: [['plane', '射影平面'], ['conic', '二次曲线'], ['group', '变换群与几何']] },
  algebra: { t: '抽象代数', groups: [['struct', '代数结构'], ['groupt', '群论'], ['graph', '图论']] },
};

// 每个 nav 文件导出 XXX_CHAPTERS（章名数组）与 XXX_BASE（路由前缀），按值类型取
function navOf(mod, dir) {
  const key = Object.keys(NAVS).find(k => k.includes(`/views/${mod}/${dir}/`));
  if (!key) return null;
  const ex = NAVS[key];
  const base = Object.values(ex).find(v => typeof v === 'string');
  const chapters = Object.values(ex).find(v => Array.isArray(v));
  return base && chapters && chapters.length ? { base, chapters } : null;
}

export const MODULES = {};
Object.entries(SPEC).forEach(([mod, spec]) => {
  const groups = spec.groups.map(([dir, name], gi) => {
    const g = dir === null ? { base: DEFAULT_BASE, chapters: DEFAULT_CHAPTERS } : navOf(mod, dir);
    if (!g) return null;
    return {
      t: CN[gi] + '　' + name,
      items: g.chapters.map((t, i) => ({ t, path: g.base + (i + 1) })),
    };
  }).filter(Boolean);
  MODULES[mod] = { t: spec.t, groups, all: groups.flatMap(g => g.items) };
});

// 由路由路径取模块大纲（'/polar/q2' → polar）
export function moduleOf(path) {
  return MODULES[path.split('/')[1]] || null;
}
