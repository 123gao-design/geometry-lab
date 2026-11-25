const TAU = Math.PI * 2;
const orbits = [
  { a: 1.03, b: .33, tilt: -.63, speed: .92 },
  { a: .96, b: .39, tilt: .65, speed: -.74 },
  { a: .80, b: .59, tilt: -.08, speed: .58 },
];

// 均匀铺开星点。用确定的种子，让换主题或改变窗口尺寸时图形接续原来的相位。
const stars = Array.from({ length: 96 }, (_, i) => [
  ((i + 1) * .618034) % 1, ((i + 1) * .754878) % 1, ((i + 1) * .569840) % 1,
]);

function trace(ctx, steps, point) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const [x, y] = point(i / steps);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function paint(ctx, width, height, time, colors, background, strength) {
  const [blue, cyan, purple, ink] = colors;
  const size = Math.min(width * (background ? .35 : .40), height * .40, background ? 360 : 218);
  const gain = background ? .14 + .33 * strength : 1;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.lineCap = 'round';

  const starCount = width < 540 ? 56 : stars.length;
  for (let i = 0; i < starCount; i++) {
    const [x, y, depth] = stars[i];
    ctx.fillStyle = depth > .62 ? cyan : blue;
    ctx.globalAlpha = gain * (.12 + depth * .37) * (.74 + .26 * Math.cos(time * 1.6 + depth * 24));
    const px = ((x + time * (.001 + depth * .0015)) % 1) * width;
    const py = y * height + Math.sin(time * .31 + x * 21) * 8;
    ctx.beginPath();
    ctx.arc(px, py, .45 + depth * .95, 0, TAU);
    ctx.fill();
  }

  ctx.translate(width / 2, height / 2);
  ctx.scale(size, size);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1.28);
  glow.addColorStop(0, blue);
  glow.addColorStop(1, 'transparent');
  ctx.globalAlpha = gain * .21;
  ctx.fillStyle = glow;
  ctx.fillRect(-1.28, -1.28, 2.56, 2.56);

  // 两列相向传播的正弦波叠成波面。向下远离主体，形成透视网格。
  ctx.strokeStyle = cyan;
  ctx.lineWidth = .78 / size;
  const wave = (x, row) => {
    const z = (Math.sin(7 * x - time * 2 + row * 2) + Math.sin(7 * x + time * 2)) * .065;
    return [x * (.74 + row * .43), .50 + row * .48 + z];
  };
  for (let line = 0; line <= 7; line++) {
    ctx.globalAlpha = gain * (.12 + line * .013);
    trace(ctx, 48, u => wave((u - .5) * 2.7, line / 7));
  }
  ctx.globalAlpha = gain * .135;
  for (let line = 0; line <= 18; line++) {
    trace(ctx, 10, u => wave((line / 18 - .5) * 2.7, u));
  }

  ctx.strokeStyle = blue;
  ctx.globalAlpha = gain * .26;
  ctx.lineWidth = 1 / size;
  ctx.setLineDash([2 / size, 5 / size]);
  ctx.beginPath();
  ctx.arc(0, 0, 1.09, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = gain * .43;
  for (let i = 0; i < 12; i++) {
    const angle = i * TAU / 12;
    trace(ctx, 1, u => [(1.08 + u * .048) * Math.cos(angle), (1.08 + u * .048) * Math.sin(angle)]);
  }

  // 三维利萨如曲线的平行投影。正交方向的频率为 2、3、1。
  const turn = time * .36;
  const cos = Math.cos(turn), sin = Math.sin(turn);
  ctx.strokeStyle = purple;
  ctx.globalAlpha = gain * .59;
  ctx.lineWidth = 1.25 / size;
  trace(ctx, 150, u => {
    const a = u * TAU;
    const x = Math.cos(2 * a), y = Math.sin(3 * a), z = Math.sin(a);
    return [.36 * (x * cos + z * sin), .29 * y + .10 * (z * cos - x * sin)];
  });

  orbits.forEach(({ a, b, tilt, speed }, lane) => {
    const angle = tilt + Math.sin(time * .37 + lane) * .15;
    const c = Math.cos(angle), s = Math.sin(angle);
    const point = t => {
      const x = a * Math.cos(t), y = b * Math.sin(t);
      return [x * c - y * s, x * s + y * c];
    };
    const color = colors[lane];
    ctx.strokeStyle = color;
    ctx.globalAlpha = gain * .49;
    ctx.lineWidth = 1.15 / size;
    trace(ctx, 100, u => point(TAU * u));
    for (let i = 0; i < 7; i++) {
      const head = time * speed + lane * 1.82 + i * TAU / 7 + Math.sin(i * 8.2) * .24;
      const [x, y] = point(head);
      const lead = i % 3 === 0;
      const tail = (lead ? .36 : .15) * Math.sign(speed);
      ctx.lineWidth = (lead ? 2.1 : 1.15) / size;
      for (let j = 0; j < 4; j++) {
        ctx.globalAlpha = gain * (.15 + j * .17);
        trace(ctx, 4, u => point(head + tail * ((j + u) / 4 - 1)));
      }
      ctx.globalAlpha = gain * .22;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, (lead ? 6 : 3.8) / size, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = gain * (lead ? .98 : .72);
      ctx.fillStyle = lead ? ink : color;
      ctx.beginPath();
      ctx.arc(x, y, (lead ? 2.35 : 1.25) / size, 0, TAU);
      ctx.fill();
    }
  });
  ctx.restore();
}

export function mountParticleField(canvas, { background = false, strength = () => 1 } = {}) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return null;
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, time = 0, last = null, raf = 0;
  let colors, visible = true;
  const stopped = () => !visible || document.hidden || motion.matches || (background && root.classList.contains('no-anim'));

  function draw() {
    if (width && height && colors) paint(ctx, width, height, time, colors, background, strength());
  }

  function tick(now) {
    raf = 0;
    if (stopped()) return;
    if (last === null || now - last >= (background ? 32 : 15)) {
      time += Math.min(64, now - (last ?? now)) * (background ? .00038 : .001);
      last = now;
      draw();
    }
    raf = requestAnimationFrame(tick);
  }

  function sync() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = null;
    if (visible && !document.hidden) draw();
    if (!stopped()) raf = requestAnimationFrame(tick);
  }

  function resize() {
    const nextWidth = canvas.clientWidth, nextHeight = canvas.clientHeight;
    if (!nextWidth || !nextHeight) return;
    const dpr = Math.min(window.devicePixelRatio || 1, background ? 1.4 : 2);
    if (width === nextWidth && height === nextHeight && canvas.width === Math.round(nextWidth * dpr)) return;
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function readTheme() {
    const style = getComputedStyle(canvas);
    colors = ['--blue', '--cyan', '--purple', '--ink'].map((key, i) =>
      style.getPropertyValue(key).trim() || ['#5cadff', '#67e8f9', '#c084fc', '#e8eef7'][i]);
    sync();
  }

  const themeObserver = new MutationObserver(readTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  const viewObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  viewObserver.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  readTheme();
  resize();
  return {
    draw,
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    },
  };
}
