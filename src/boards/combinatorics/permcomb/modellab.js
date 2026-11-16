/* 图 排2 · 捆绑、插空与分组
   ① 甲乙相邻：把两人捆成一块，与其余 n−2 人共 n−1 个对象排列，再乘两人内部顺序，共 (n−1)!×2。
   ② 甲乙不相邻：先排其余 n−2 人，留下 n−1 个空档，甲乙占其中两个不同空档，共 (n−2)!×(n−1)(n−2)。
   ③ 分成两组：选 k 人作第一组即 C(n,k) 种；两组人数相同时，选一组与选它的补集是同一分组，要除以 2。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, n: 5 };
  const NM = ['甲', '乙', '丙', '丁', '戊', '己'];
  const cN = B.chipM('计数结果'), cW = B.chipM('构造方法'), cJ = B.chipM('判读');

  const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
  const who = (x, y, s, on, r = 20) => {
    B.dyn.appendChild(mk('circle', {
      cx: x, cy: y, r,
      fill: on ? 'rgba(255,209,102,.55)' : 'rgba(92,173,255,.05)',
      stroke: on ? '#ffd166' : '#5cadff', 'stroke-width': on ? 1.8 : 1.2,
    }, B.dyn));
    B.text(V(x, y + 5), s, { fill: on ? '#ffd166' : '#aebdd2', 'font-size': 14 });
  };

  B.renderFn = () => {
    const { n } = st;
    if (st.mode === 0) {
      const k = n - 1, sp = 96, x0 = 410 - (k - 1) * sp / 2;
      // 捆绑块
      B.dyn.appendChild(mk('rect', {
        x: x0 - 52, y: 122, width: 104, height: 60, rx: 14,
        fill: 'rgba(255,209,102,.55)', 'fill-opacity': .16, stroke: '#ffd166', 'stroke-width': 1.6,
      }, B.dyn));
      who(x0 - 23, 152, '甲', true, 18);
      who(x0 + 23, 152, '乙', true, 18);
      B.text(V(x0, 200), '内部 2! 种', { fill: '#ffd166', 'font-size': 12 });
      for (let i = 0; i < n - 2; i++) who(x0 + (i + 1) * sp, 152, NM[i + 2], false);
      B.text(V(410, 250), `${k} 个对象排成一列，其中一块是两个人`, { fill: '#8fa3bd', 'font-size': 12.5 });

      cN(`$${k}!\\times2!=${fact(k) * 2}$`);
      cW('把甲乙捆成一块，先与其余人一起排，再乘块内两人的顺序');
      cJ(`先按 ${k} 个对象排 ${fact(k)} 种，块内两种顺序各成一种排法，共 ${fact(k) * 2} 种`);
    } else if (st.mode === 1) {
      const k = n - 2, sp = 112, x0 = 410 - k * sp / 2;
      const gx = g => x0 + g * sp;                       // 空档位置，共 k+1 个
      for (let g = 0; g <= k; g++) {
        B.dyn.appendChild(mk('line', {
          x1: gx(g), y1: 128, x2: gx(g), y2: 196, stroke: '#5c6a80', 'stroke-width': 1,
          'stroke-dasharray': '3 4',
        }, B.dyn));
      }
      for (let i = 0; i < k; i++) who(gx(i) + sp / 2, 162, NM[i + 2], false);
      who(gx(0), 162, '甲', true);
      who(gx(1), 162, '乙', true);
      B.text(V(410, 232), `其余 ${k} 人之间连两端共 ${k + 1} 个空档，甲乙占两个不同的`, { fill: '#8fa3bd', 'font-size': 12.5 });

      cN(`$${k}!\\times${k + 1}\\times${k}=${fact(k) * (k + 1) * k}$`);
      cW('先排其余人，再把甲乙放进两个不同的空档，谁进哪个空档也要分');
      cJ(`其余 ${k} 人先排 ${fact(k)} 种，${k + 1} 个空档里挑两个有序安放，共 ${fact(k) * (k + 1) * k} 种`);
    } else {
      const k = Math.ceil(n / 2), eq = n % 2 === 0;
      const grp = (x, list, lab) => {
        B.dyn.appendChild(mk('rect', {
          x: x - 120, y: 110, width: 240, height: 96, rx: 14,
          fill: 'rgba(92,173,255,.05)', stroke: '#5cadff', 'stroke-width': 1.2,
        }, B.dyn));
        const s = list.length, sp = Math.min(56, 190 / Math.max(1, s));
        list.forEach((id, i) => who(x - (s - 1) * sp / 2 + i * sp, 152, NM[id], true, 18));
        B.text(V(x, 196), lab, { fill: '#8fa3bd', 'font-size': 12 });
      };
      const left = Array.from({ length: k }, (_, i) => i);
      const right = Array.from({ length: n - k }, (_, i) => i + k);
      grp(220, left, `第一组 ${k} 个`);
      grp(600, right, `第二组 ${n - k} 个`);
      B.text(V(410, 240), eq ? '两组人数相同：交换两组得到同一种分组' : '两组人数不同：交换两组是不同的分法',
        { fill: eq ? '#ffd166' : '#8fa3bd', 'font-size': 12.5 });

      const c = CN(n, k);
      cN(eq ? `$\\dfrac{${c}}{2}=${c / 2}$ 种` : `$${c}$ 种`);
      cW(`选 ${k} 个作第一组，其余自动成第二组，共 C(${n},${k})=${c} 种选法`);
      cJ(eq ? `两组人数相同，选定第一组与选定第二组是同一分组，${c} 种选法两两重合，实为 ${c / 2} 种`
        : `两组人数不同，每种选法给出不同分组，不必再除`);
    }
  };

  B.slider('人数 n', 4, 6, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  const btns = [
    ['① 捆绑，甲乙相邻', 0], ['② 插空，甲乙不相邻', 1], ['③ 分组，平均分', 2],
  ].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('相邻就捆成一块、不相邻就插空、分组要看清两组是否等量');
  B.render();
  return B;
}
